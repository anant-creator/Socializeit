import React, {useState, useEffect} from 'react';
import { AiOutlineLayout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { client } from '../client';
import { MasonryLayout } from './MasonryLayout';
import Spinner from './Spinner';

let url = 'https://source.unsplash.com/random/';

const activeBtnStyles = "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles = "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('saved');
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState();
  const {userId} = useParams();

  useEffect(() => {
     const query = userQuery(userId);

     client.fetch(query)
        .then((data) => {
          setUser(data[0])
      })
      url = 'https://source.unsplash.com/random/';
  }, [userId])

  useEffect(() => {
    if (text === "created") {
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery)
          .then((data) => {
            setPins(data);
          })
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery)
        .then((data) => {
          setPins(data);
      })
    }
  }, [text, userId])

  const logout = () => {
    localStorage.clear();
    
    navigate('/login')
  }

  if (!user) {
    return <Spinner message="Loading Profile..." />
  }
  
  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img src={url} style={{ height: "370px"}}
            className="w-full bg-left-top h-370 2xl:h-510 shadow-lg object-cover" alt="banner-img" />
            <img className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover" src={user.image} alt="user-pic" />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user.userName}
            </h1>
            <div className="absolute z-1 top-0 right-0 p-2">
              {userId === user._id && (
                <button type="button"
                className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                onClick={logout}>
                  Logout
                 </button>
                ) };
            </div>
            <div className="text-center mb-7">
              <button type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn('created');
              }}
              className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
              >
                created
              </button>
              <button type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn('saved');
              }}
              className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
              >
                saved
              </button>
            </div>

            {pins?.length ? (
            <div className="px-2">
            <MasonryLayout pins={pins} />
            </div>
            ) : (
              <div className="flex justify-center items-center font-bold w-full text-xl mt-2">
                No Pins Found
              </div>

            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile