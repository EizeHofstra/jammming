import React from 'react'
import './App.css';
import SearchBar from './../SearchBar/SearchBar';
import SearchResults from './../SearchResults/SearchResults';
import Playlist from './../Playlist/Playlist';
import Spotify from './../../util/Spotify';

Spotify.getAccessToken();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "My playlist",
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }


//After googling I found out about prevState but we never learned about prevState so I'm not sure if this is the preferred way to construct this method.
  addTrack(track) {
    if (!this.state.playlistTracks.find(playlistTrack => playlistTrack.id === track.id)) {
      this.setState(prevState => ({
        playlistTracks: [...prevState.playlistTracks, track]
      }));
    }
  }

//filter or find method with removeTrack?
  removeTrack(track) {
    this.setState ({playlistTracks: this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id)
    })
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    let UriArray = this.state.playlistTracks.map(playlistTrack => playlistTrack.uri);
    Spotify.savePlaylist(this.state.playlistName, UriArray);
    this.setState({searchResults: []});
    this.setState({playlistTracks: []});
    this.updatePlaylistName("My playlist");
    //This updates to My playlist if I add another playlist to Spotify but the screen still
    //shows the previous playlist name. Not sure how to fix this..
  }

  search(term) {
    Spotify.search(term)
      .then(searchResults => this.setState({
        searchResults: searchResults})
    );
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <div className="App">
            <SearchBar onSearch={this.search}/>
            <div className="App-playlist">
            <SearchResults onAdd={this.addTrack} searchResults={this.state.searchResults}/>
            <Playlist onSave={this.savePlaylist} onNameChange={this.updatePlaylistName} onRemove={this.removeTrack} playlistName={this.state.playlistName} tracks={this.state.playlistTracks}/>
            </div>
          </div>
      </div>
    );
  }
}

export default App;
