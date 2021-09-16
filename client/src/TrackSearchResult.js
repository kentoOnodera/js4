
import React from 'react';

export default function TrackSearchResult({track , chooseTrack}){
  function handlePlay(){
    chooseTrack(track)
  }
  return(
    <div 
      className="d-flex m-2 align-items-center" 
      style={{cursor:"pointer"}}
      onClick={handlePlay}>
      <img src={track.albumUrl} style={{height: "64px", width: "64px"}} />
      <div style={{paddingLeft: "8px"}}className="m1-3">
        <div style={{color: "#fff",  fontWeight:"bold"}}>{track.title}</div>
        <div style={{color: "#fff", fontSize: "8px"}}>{track.artist}</div>
      </div>
    </div>
  )
}
