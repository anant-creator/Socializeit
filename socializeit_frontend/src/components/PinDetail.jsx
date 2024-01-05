import React, { useEffect, useState } from "react";
// import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

import { client, urlFor } from "../client";
import {MasonryLayout} from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";
import Pins from "../container/Pins";

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const { pinId } = useParams();

  const addComment = () => {
    setAddingComment(true);

    client
        .patch(pinId)
        .setIfMissing({comments: []})
        .insert('after', 'comments[-1]', [{
          comment,
          _key: uuidv4(),
          postedBy: {
            _type: "postedBy",
            _ref: user._id
          }
        }])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
        })
  }

  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(query).then((data) => {
        setPinDetail(data[0]);

        if (data[0]) {
          query = pinDetailMorePinQuery(data[0]);

          client.fetch(query).then((res) => setPins(res));
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  if (!pinDetail) return <Spinner message="Loading Pin..." />;

  return (
    <div
      className="flex flex-col m-auto bg-white"
      style={{ maxWidth: "1500px", borderRadius: "32px" }}
    >
      <div className="flex justify-center align-center md:items-start flex-initial">
        <img
          src={pinDetail?.image && urlFor(pinDetail.image).url()}
          className="rounded-t-3xl rounded-b-lg"
          alt="user-post"
        />
      </div>
      <div className="w-full p-3 flex-1 xl:min-w-620">
        <div className="flex flex-col justify-center items-between">
          <div className="flex gap-2 items-center">
            <a
              href={`${pinDetail.image?.asset?.url}?dl=`}
              download
              onClick={(e) => e.stopPropagation()}
              className="bg-red-500 opacity-75 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none"
            >
              Download
            </a>
            <a
              className="flex bg-black opacity-75 hover:opacity-100 text-white font-bold px-3 py-1 text-base rounded-3xl hover:shadow-md outlined-none"
              href={pinDetail.destination}
              target="_blank"
              rel="noreferrer"
            >
              {" "}
              <BsFillArrowUpRightCircleFill className="mr-2 mt-1" /> Go To
              Destination Url
            </a>
          </div>
          <div>
            <h1 className="text-4xl font-bold break-words mt-3">
              {pinDetail.title}
            </h1>
            <p className="mt-3 text-lg">{pinDetail.about}</p>
          </div>
          <Link
            to={`user-profile/${pinDetail.postedBy?._id}`}
            className="flex gap-2 mt-5 items-center bg-white rounded-lg"
          >
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={pinDetail.postedBy?.image}
              alt="user-profile"
            />
            <p className="font-semibold capitalize">
              {pinDetail.postedBy?.userName}
            </p>
          </Link>
          <h2 className="mt-5 text-2xl">Comments</h2>
          <div className="max-h-370 overflow-y-auto">
            {pinDetail?.comments?.map((comment, i) => (
              <div
                className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                key={i}
              >
                <img
                  src={comment.postedBy.image}
                  alt="user-profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
                <div className="flex flex-col">
                  <p className="font-bold">{comment.postedBy.userName}</p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center flex-wrap gap-3 mt-6">
            <Link
            to={`user-profile/${pinDetail.postedBy?._id}`}
            className="flex gap-2 mt-1 items-center bg-white rounded-lg"
          >
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={pinDetail.postedBy?.image}
              alt="user-profile"
            />
          </Link> 
          <input className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300" type="text"
          placeholder="add a comment" value={comment}
          onChange={(e) => setComment(e.target.value)} />
          <button type="button"
          className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
          onClick={addComment}>
            {addingComment ? "posting the comment..." : "post"}
          </button>
          </div>
        </div>
      </div>
      { pins?.length > 0 ? (
      <> 
      <h2 className="text-center font-bold text-2xl mt-8 mb-4"> More like this </h2>
      </> ) :
       ( <Spinner message="Loading more pins..." /> )}
       <MasonryLayout pins={pins} />
    </div>
   
  )};

export default PinDetail;
