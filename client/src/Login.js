import React from 'react';
import { Container } from 'react-bootstrap';

// https://developer.spotify.com/documentation/general/guides/scopes/
const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=d87e6a4c2b124c468a59427a7bf504fe&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"

export default function Login(){
  return(
    <Container className="d-flex justify-content-center align-items-center" style={{minHeight: "100vh" }}>
      <a className="btn btn-success btn-lg" href={AUTH_URL}>
        Login With Spotify
      </a>
    </Container>
  )
}
