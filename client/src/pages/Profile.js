import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { getCurrentUserProfile, getCurrentUserPlaylists, getTopArtists } from '../spotify';
import { SectionWrapper, ArtistsGrid } from '../Components';
import { StyledHeader } from '../styles';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylist] = useState(null)
  const [topArtists, setTopArtists] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const userProfile = await getCurrentUserProfile();
      setProfile(userProfile.data);
      console.log(userProfile.data);

      const userPlaylists = await getCurrentUserPlaylists();
      setPlaylist(userPlaylists.data);
      console.log(userPlaylists.data);

      const userTopArtist = await getTopArtists();
      setTopArtists(userTopArtist.data);
    };

    catchErrors(fetchData());
  }, []);
  console.log(topArtists);

  return (
    <>
      {profile && (
        <>
          <StyledHeader type="user">
            <div className="header__inner">
              {profile.images.length && profile.images[0].url && (
                <img className="header__img" src={profile.images[0].url} alt="Avatar" />
              )}
              <div>
                <div className="header__overline">Profile</div>
                <h1 className="header__name">{profile.display_name}</h1>
                <p className="header__meta">
                  {playlists && (
                    <span>{playlists.total} Playlist{playlists.total !== 1 ? 's' : ''}</span>
                  )}
                  <span>
                    {profile.followers.total} Follower{profile.followers.total !== 1 ? 's' : ''}
                  </span>
                </p>
              </div>
            </div>
          </StyledHeader>
          {topArtists && (
            <main>
              <SectionWrapper title="Top artists this month" seeAllLink="/top-artists">
                <ArtistsGrid artists={topArtists.items.slice(0, 10)} />
              </SectionWrapper>
            </main>
          )}
        </>
      )}

    </>
  )
};

export default Profile;