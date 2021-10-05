import { useState, useEffect, useMemo } from 'react';
import { catchErrors } from '../utils';
import axios from 'axios';
import { getPlaylistById } from '../spotify';
import { TrackList, SectionWrapper} from '../components';
import { StyledHeader } from '../styles';


const Playlist = () => {
    const { id } = useParams();
    const [playlist, setPlaylist] = useState(null);

    const [sortValue, setSortValue] = useState('');
    const sortOptions = ['danceability', 'tempo', 'energy'];

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await getPlaylistById(id);
            setPlaylist(data);
            setTracksData(data.tracks);
        };

        catchErrors(fetchData());
    }, [id]);

    // When tracksData updates, compile arrays of tracks and audioFeatures
    useEffect(() => {
        if (!tracksData) {
            return;
        }

        // When tracksData updates, check if there are more tracks to fetch
        // then update the state variable
        const fetchMoreData = async () => {
            if (tracksData.next) {
                const { data } = await axios.get(tracksData.next);
                setTracksData(data);
            }
        };
        setTracks(tracks => ([
            ...tracks ? tracks : [],
            ...tracksData.items
        ]));
        catchErrors(fetchMoreData());

        // Also update the audioFeatures state variable using the track IDs
        const fetchAudioFeatures = async () => {
            const ids = tracksData.items.map(({ track }) => track.id).join(',');
            const { data } = await getAudioFeaturesForTracks(ids);
            setAudioFeatures(audioFeatures => ([
                ...audioFeatures ? audioFeatures : [],
                ...data['audio_features']
            ]));
        };
        catchErrors(fetchAudioFeatures());

    }, [tracksData]);

    const tracksForTracklist = useMemo(() => {
        if (!tracks) {
            return;
        }
        return tracks.map(({ track }) => track);
    }, [tracks]);

    // Sort tracks by audio feature to be used in template
    const sortedTracks = useMemo(() => {
        if (!tracksWithAudioFeatures) {
            return null;
        }

        return [...tracksWithAudioFeatures].sort((a, b) => {
            const aFeatures = a['audio_features'];
            const bFeatures = b['audio_features'];

            if (!aFeatures || !bFeatures) {
                return false;
            }

            return bFeatures[sortValue] - aFeatures[sortValue];
        });
    }, [sortValue, tracksWithAudioFeatures]);


    return (
        <StyledDropdown active={!!sortValue}>
            <label className="sr-only" htmlFor="order-select">Sort tracks</label>
            <select
                name="track-order"
                id="order-select"
                onChange={e => setSortValue(e.target.value)}
            >
                <option value="">Sort tracks</option>
                {sortOptions.map((option, i) => (
                    <option value={option} key={i}>
                        {`${option.charAt(0).toUpperCase()}${option.slice(1)}`}
                    </option>
                ))}
            </select>
        </StyledDropdown>
    )
}
export default Playlist;