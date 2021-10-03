import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { SectionWrapper, PlaylistsGrid } from '../components';
import { getCurrentUserPlaylists } from '../spotify';
const Playlists = () => {

    const [playLists, setPlayLists] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            const userPlaylists = await getCurrentUserPlaylists();
            setPlaylists(userPlaylists.data);
        };

        catchErrors(fetchData());
    }, []);


    return (
        <main>
        <SectionWrapper title="Playlists" seeAllLink="/playlists">
            {playLists && playLists.items && (
                <PlaylistsGrid playlists={playlists.items} />
            )}
        </SectionWrapper>
        </main>
    )

};

export default Playlists;