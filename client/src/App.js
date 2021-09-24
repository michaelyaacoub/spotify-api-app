
import { useState, useEffect } from 'react';
import { accessToken, logout, getCurrentUserProfile } from './spotify';
import { catchErrors } from './utils';
import './App.css';

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
          <a className="App-link" href="http://localhost:8888/login">
            Log in to Spotify
          </a>
        ) : (
          <>
            <h1>Logged in!</h1>
            <button onClick={logout}>Log Out</button>
            {profile && (
              <div>
                <h1>{profile.display_name}</h1>
                <p>{profile.followers.total}Followers</p>
                {profile.images.length && profile.images[0].url && (
                  <img src={profile.images[0].url} alt="Avatar" />
                )}
              </div>
            )}
          </>
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