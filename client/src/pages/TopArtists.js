import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { getTopArtists } from '../spotify';
import { ArtistsGrid, SectionWrapper, TimeRangeButtons } from '../Components';

const TopArtists = () => {
    const [topArtists, setTopArtists] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            const userTopArtists = await getTopArtists();
            setTopArtists(userTopArtists.data);
        };

        catchErrors(fetchData());
    }, []);
    console.log(topArtists);


    return (
        <main>
      <SectionWrapper title="Top Artists" breadcrumb={true}>
        <TimeRangeButtons
          activeRange={activeRange}
          setActiveRange={setActiveRange}
        />

        {topArtists && topArtists.items && (
          <ArtistsGrid artists={topArtists.items} />
        )}
      </SectionWrapper>
    </main>
    );
};
export default TopArtists;