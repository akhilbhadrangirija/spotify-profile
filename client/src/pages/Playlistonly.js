import { useState, useEffect } from 'react';
import { getTopTracks,getPlaylistById } from '../spotify';
import { catchErrors } from '../utils';
import { useParams } from 'react-router-dom';
import { SectionWrapper, TrackList, } from '../components';

const TopTracks = () => {
  const [topTracks, setTopTracks] = useState(null);

  const { id } = useParams();
  console.log(id);
  useEffect(() => {
    const fetchData = async () => {
      
      const {data} = await getPlaylistById(id);
      setTopTracks(data);  
      console.log(data.tracks);
    };

    catchErrors(fetchData());
  }, [id]);


  return (
    <main>
      <SectionWrapper title="Top Tracks" breadcrumb={true}>
      

      {topTracks && topTracks.tracks.items && (
          <TrackList tracks={topTracks.tracks.items} />
        )}
      </SectionWrapper>
    </main>
  );
};

export default TopTracks;