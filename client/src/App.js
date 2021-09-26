import { BrowserRouter as Router, Switch, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import { accessToken, logout, getCurrentUserProfile } from './spotify';
import { catchErrors } from './utils';
import styled from 'styled-components/macro';


const StyledLoginButton = styled.a`
  background-color: green;
  color: white;
  padding: 10px 20px;
  margin: 20px auto;
  border-radius: 30px;
  display: inline-block;
  text-decoration: none;
`;



// Scroll to top of page when changing routes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    setToken(accessToken);

    const fetchData = async () => {
      const { data } = await getCurrentUserProfile();
      setProfile(data);
      console.log(data)
    };

    catchErrors(fetchData());
  }, []);

  return (
    <div className="App">
      <header className="App-header">
      {!token ? (
          <StyledLoginButton href="http://localhost:8888/login">
            Log in to Spotify
          </StyledLoginButton>
        ) : (
          <Router>
            <ScrollToTop />
            <Switch>
              <Route path="/top-artists">
                <h1>Top Artists</h1>
              </Route>
              <Route path="/top-tracks">
                <h1>Top Tracks</h1>
              </Route>
              <Route path="/playlists/:id">
                <h1>Playlist</h1>
              </Route>
              <Route path="/playlists">
                <h1>Playlists</h1>
              </Route>
              <Route path="/">
                <>
                  <button onClick={logout}>Log Out</button>

                  {profile && (
                    <div>
                      <h1>{profile.display_name}</h1>
                      <p>{profile.followers.total} Followers</p>
                      {profile.images.length && profile.images[0].url && (
                        <img src={profile.images[0].url} alt="Avatar"/>
                      )}
                    </div>
                  )}
                </>
              </Route>
            </Switch>
          </Router>
        )}
      </header>
    </div>
  );
}

export default App;



// sessionStorage stores data for duration of the page session
// localStorage keeps data stored even after the broswer is closed

// -------------- gameplan -------------- //

// 1- Upon first visit. log in, then store tokens from query params in localStorage
// 2- Store timestamp in localStorage
// 3- With next API call, first check for stored tokens
// 4- check if the use stored timestamp to make sire tokens are not expired
//     * if accessToken is valid, use that in our API request
//     * if accessToken is expired, use refresh token to hit /refresh_token
//     + When we reveice a new token, store it in localStorage and update timestamp