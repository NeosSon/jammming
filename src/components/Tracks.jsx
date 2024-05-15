import React, { useEffect, useState } from "react";

export function Tracks() {
  const [tracks, setTracks] = useState([]);
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState("");
  const [addedTracks, setAddedTracks] = useState([]);
  const [trackUris, setTrackUris] = useState([]);
  const hash = window.location.hash;
  const token = hash.substring(1).split("&")[0].split("=")[1];
  
  const getTracks = async () => {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${search}&type=track`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    if (search !== "") {
      setTracks(data.tracks.items);
    } else {
      setTracks([]);
    }
  };
  const addTrack = async (track) => {
    setAddedTracks([...addedTracks, track]);

    setTrackUris([...trackUris, track.uri]);
  };
  const createPlaylist = async (userId) => {
    try {
      const playlistName = window.prompt("Playlist Name", "My Playlist");
      if (playlistName === null) {
        return;
      }
      const response = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: `${playlistName}` }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      addItemsToPlaylist(data.id);
      console.log(data);
    } catch (error) {
      console.error("Failed to create playlist:", error);
    }
  };
  const addItemsToPlaylist = async (playlistId) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uris: trackUris.toString().split(",") }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Failed to add items to playlist:", error);
    }
  };
  const removeTrack = async (id) => {
    const updatedTracks = addedTracks.filter((track) => track.id !== id);
    setAddedTracks(updatedTracks);
  };

  useEffect(() => {
    const returnId = async () => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setUserId(data.id);
        return data.id;
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
      }
    };

    if (token) {
      returnId();
    }
  }, [token]);

  useEffect(() => {
    if (search) {
      getTracks();
    }
  }, [search]);

  return (
    <div>
      <div className="flex justify-evenly">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          name="search"
          placeholder="Search for tracks"
          className="p-2 bg-slate-500 text-slate-100 border-2 border-slate-100 rounded-full ring-2 ring-slate-100"
        />
        <button
          className="p-2 border-slate-100 rounded-full bg-slate-500 hover:bg-gray-200 hover:text-slate-800 text-slate-200"
          onClick={() => createPlaylist(userId)}
        >
          Create Playlist
        </button>
      </div>
      <div className="flex justify-evenly">
        <div className="w-1/3 ">
          <h2 className="text-center text-4xl leading-10 ">Results</h2>
          {search != "" ? (
            <ul className="flex flex-col">
              {tracks.map((track) => (
                <li key={track.id} className="border-b-4 border-cyan-950 mb-4">
                  <div className="flex">
                    <span className="flex">
                      {track.artists.map((artist) => (
                        <p className="mr-4" key={artist.id}>
                          {artist.name}
                        </p>
                      ))}
                    </span>
                    <button
                      onClick={() => addTrack(track)}
                      className=" bg-green-500 border-2 ring-2 rounded-full"
                    >
                      +
                    </button>
                  </div>
                  <img
                    src={track.album.images[0].url}
                    alt={track.name}
                    width={100}
                  />
                  <a href={track.external_urls.spotify} target="_blank">
                    {track.name}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            ""
          )}
        </div>
        <div className="w-1/3 ml-3">
          <h2 className="text-center text-4xl leading-10">Added Tracks</h2>
          <ul>
            {addedTracks.map((track) => (
              <li key={track.id} className="border-b-4 border-cyan-950 mb-4">
                <div className="flex">
                  <span className="flex">
                    {track.artists.map((artist) => (
                      <p className="mr-4" key={artist.id}>
                        {artist.name}
                      </p>
                    ))}
                  </span>
                  <button
                    onClick={() => removeTrack(track.id)}
                    className=" bg-red-500 border-2 ring-2 rounded-full"
                  >
                    -
                  </button>
                </div>
                <img
                  src={track.album.images[0].url}
                  alt={track.name}
                  width={100}
                />
                <a href={track.external_urls.spotify} target="_blank">
                  {track.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
