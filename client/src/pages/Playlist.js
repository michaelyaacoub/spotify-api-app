import { useState, useEffect, useMemo } from 'react';
import { catchErrors } from '../utils';
import axios from 'axios';
import { getPlaylistById, getAudioFeaturesForTracks } from '../spotify';
import { TrackList, SectionWrapper } from '../components';
import { StyledHeader } from '../styles';


const Playlist = () => {
    const { id } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [sortValue, setSortValue] = useState('');
    const [tracksData, setTracksData] = useState(null);
    const [tracks, setTracks] = useState(null);
    const [audioFeatures, setAudioFeatures] = useState(null)


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