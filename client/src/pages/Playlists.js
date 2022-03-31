import { useState, useEffect } from 'react';
import axios from 'axios';
import { getCurrentUserPlaylists } from '../spotify';
import { catchErrors } from '../utils';
import { SectionWrapper, PlaylistsGrid } from '../components';

const Playlists = () => {
  const [playlistsData, setPlaylistsData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getCurrentUserPlaylists();
      setPlaylistsData(data);
    };

    catchErrors(fetchData());
  }, []);


  return (
    <main>
      <SectionWrapper title="Public Playlists" breadcrumb={true}>
        {playlistsData && (
          <PlaylistsGrid playlists={playlistsData.items} />
        )}
      </SectionWrapper>
    </main>
  );
};

export default Playlists;