import { useState } from 'react'

import './App.css'
import { Tracks } from './components/Tracks';

function App() {
  const [count, setCount] = useState(0)


  // constants
  const client_id = "a1c008a11f5b4dd4b37d3a9fd04fee17";
  const client_secret = "f8c1dc89ed1f444aa142deab3694fc4f";
  const baseUrl = "https://api.spotify.com";
  const redirect_uri = "http://localhost:5173/callback";

  // To get access token 
function login() {
  const responseType = "token&show_dialog=true";

  const endpoint = "https://accounts.spotify.com/authorize";
  const scope = [
    "user-read-email",
    "streaming",
    "user-read-private",
    "user-read-playback-state",
    "playlist-modify-public",
    "playlist-modify-private",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-position",
    "user-top-read",
  ];

  window.location.href = `${endpoint}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope.join(" ")}&response_type=${responseType}`;
  }

  //After function call 
  const hash = window.location.hash;
  const token = hash.substring(1).split("&")[0].split("=")[1];


  return (
    <div>
      <h1 className='text-center text-3xl'>Jammming</h1>
      <button onClick={login } className='p-5 bg-slate-700 text-slate-100'>Login</button>
      <Tracks />
    </div>
  )
}

export default App
