import {useState, useEffect} from 'react'
import useAuth from './useAuth'
import TrackSearchResult from './TrackSearchResult'
import { Container, Form } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node'
import Player from './Player'
import axios from "axios"

const spotifyApi = new SpotifyWebApi({
  clientId: 'd87e6a4c2b124c468a59427a7bf504fe',
})
export default function Dashboard({code}){
  const accessToken = useAuth(code)
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [playingTrack, setPlayingTrack] = useState()
  const [lyrics, setLyrics] = useState("")
  console.log(searchResults)

  function chooseTrack(track){
    setPlayingTrack(track)
    setSearch("")
    setLyrics("")
  }

  useEffect(() => {
    if (!playingTrack) return
    axios
      .get("http://localhost:3001/lyrics", {
        params: {
          track: playingTrack.title,
          artist: playingTrack.artist,
        },
      })
      .then(res => {
        setLyrics(res.data.lyrics)
      })
  }, [playingTrack])

  useEffect(()=>{
    if(!accessToken) return
    spotifyApi.setAccessToken(accessToken)
    //アクセストークンが変わるたびに
  },[accessToken])

  useEffect(()=>{
    if(!search) return setSearchResults(searchResults)
    if(!accessToken) return

    let cancel = false
    //検索クエリに入力された値をspotifyAPIから取得
    spotifyApi.searchTracks(search).then(res =>{
      if(cancel) return
      setSearchResults( res.body.tracks.items.map(track => {
        const smallestAlbumImage = track.album.images.reduce(
        (smallest, image) => {
          if(image.height < smallest.height) return image
          return smallest
        },track.album.images[0])

        return{
          artist: track.artists[0].name,
          title: track.name,
          uri: track.uri,
          albumUrl: smallestAlbumImage.url
        }
      }))
    })
    return () => cancel = true
    //検索クエリが変更されるかアクセストークンが変わるたびに
  },[search,accessToken])


  return(
    <Container className="d-flex flex-column py-2 align-items-center" style={{height:"100vh",maxWidth:"600px", background:"#454545" , padding:"0"}}>
      <Form.Control 
        type="search" 
        placeholder="Search Songs/Artists" 
        value={search} 
        onChange={e => setSearch(e.target.value)}
        style={{width:"98%"}}
      />
      <div className="flex-grow-1 my-2" style={{overflowY:"auto",width:"100%"}}>
        {searchResults.map(track =>(
          <TrackSearchResult 
            track ={track} 
            key={track.uri} 
            chooseTrack={chooseTrack}/>
        ))}
        {searchResults.length === 0 && (
          <div className="text-center" style={{ whiteSpace: "pre" }}>
            {lyrics}
          </div>
        )}
      </div>
      <div style={{width:"100%"}}>
        <Player  accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </Container>
  )  
}
