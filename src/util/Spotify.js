const clientID = 'e24b4824665b491ea47ec3143bbc1cbb';
const redirectURI = 'http://localhost:3000/';
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    const accessTokenUrl = window.location.href.match(/access_token=([^&]*)/);
    const expiresInUrl = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenUrl && expiresInUrl) {
      accessToken = accessTokenUrl[1];
      const expiresIn = Number (expiresInUrl[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    }
    else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {Authorization: `Bearer ${accessToken}`}
    })
    .then(response => response.json())
    .then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    });
  },

  savePlaylist(playlistName, UriArray) {
    const accessToken = Spotify.getAccessToken();
    if (!playlistName || !UriArray) {
      return;
    }
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };
    let userID;

    return fetch (`https://api.spotify.com/v1/me`, {
      headers: headers
    })
    .then(response => {
      return response.json();
    })
    .then(jsonResponse => userID = jsonResponse.id)
    .then(() => {
      let playlistID;
      fetch (`https://api.spotify.com/v1/users/${userID}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: playlistName})
      })
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => playlistID = jsonResponse.id)
      .then(() => {
        return fetch (`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({uris: UriArray})
        })
      })
    })
  }
};


export default Spotify;
