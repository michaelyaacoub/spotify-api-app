import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, useLocation, } from 'react-router-dom';
import { accessToken, logout } from './spotify';
import { Login, Profile, TopArtists, TopTracks, Playlists } from './pages';
import { GlobalStyle } from './styles';
import styled from 'styled-components/macro';

const StyledLogoutButton = styled.button`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0,0,0,.7);
  color: var(--white);
  font-size: var(--fz-sm);
  font-weight: 700;
  border-radius: var(--border-radius-pill);
  z-index: 10;
  @media (min-width: 768px) {
    right: var(--spacing-lg);
  }
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

  useEffect(() => {
    setToken(accessToken);
  }, []);

  return (
    <div className="app">
      <GlobalStyle />

      {!token ? (
        <Login />
      ) : (
        <>
          <StyledLogoutButton onClick={logout}>Log Out</StyledLogoutButton>

          <Router>
            <ScrollToTop />

            <Switch>
              <Route path="/top-artists">
                <TopArtists />
              </Route>
              <Route path="/top-tracks">
                <TopTracks />
              </Route>
              <Route path="/playlists/:id">
                <h1>Playlist</h1>
              </Route>
              <Route path="/playlists">
                <Playlists />
              </Route>
              <Route path="/">
                <Profile />
              </Route>
            </Switch>
          </Router>
        </>
      )}
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
