import {useEffect, useState} from 'react'
import { accessToken, getCurrentUserProfile, logout,getPlaylistById } from './spotify';
import { catchErrors } from './utils';
import styled from 'styled-components'
import {GlobalStyle} from './styles'
import { Login, Profile,TopArtists,TopTracks,Playlists,Playlist} from './pages';
import {
  BrowserRouter as Router,Link,
  Switch,
  Route,
  BrowserRouter,
  Routes,
  useLocation
} from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
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


function App() {

 
  
  return (
    <div className="App">
          <GlobalStyle />
          <div className="App-header">

      
        {!accessToken ? (
          <Login/>
        ) : (
          <>
          <StyledLogoutButton onClick={logout}>Log Out</StyledLogoutButton>
          
          <BrowserRouter>
          <ScrollToTop />
            <Routes>
            <Route path="/top-artists"  element={<TopArtists/>} />
            
            <Route path="/top-tracks" element={ <TopTracks/>} />
            
            <Route path="/playlists/:id" element={<Playlist/>} />
            
            <Route path="/playlists"  element={ <Playlists/>}   />
           
            <Route path="/" element={<Profile />} />
            
            </Routes>
          </BrowserRouter>
          </>

        )}
        </div>
    </div>
  );
}

export default App;
