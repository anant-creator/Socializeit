import React, {useState, useEffect} from 'react';
import { client } from '../client';
import { searchQuery, feedQuery } from '../utils/data';

import { MasonryLayout } from './MasonryLayout';
import Spinner from './Spinner';
import { useParams } from 'react-router-dom';

const Feed = () => {
  const [loading, setLoading] = useState(true);
  const [pins, setPins] = useState(null);
  const {categoryId} = useParams();

  
  // console.log(categoryId);

  useEffect(() => {
    setLoading(true);
    if(categoryId) {
      const query = searchQuery(categoryId);

      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      })
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      })
    }
  }, [categoryId])

  if(loading) return <Spinner message="We are adding new ideas to your feed" />;

  if (!pins?.length) {return <h2>No Pins Available</h2>}

  
  return (
    <div>
      {pins && <MasonryLayout pins={pins} />}
      </div>
  )
}

export default Feed