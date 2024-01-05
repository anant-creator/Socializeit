import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
// import { FcGoogle } from "react-icons/fc";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import { client } from "../client";
import jwt_decode from 'jwt-decode';


export default function Login() {
  const navigate = useNavigate();
  const responseGoogle = (response) => {
    const { name, sub: googleId, picture } = response;
    localStorage.setItem('user', JSON.stringify({ name, googleId, picture }));
    
    const doc = {
      _id: googleId,
      _type: 'user',
      userName: name,
      image: picture,
    }

    client.createIfNotExists(doc).then(() => {
      navigate('/', { replace:true })
    })
   
  }
  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          autoPlay
          muted
          className="w-full h-full object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-[#00000080]">
          <div className="p-5">
            <img className="mb-3" src={logo} width="130px" alt="logo" />

            <div className="shadow-2xl">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    // const { name, sub: googleId, picture } = jwt_decode(credentialResponse.credential);
                    // console.log( name, googleId, picture);
                    responseGoogle(jwt_decode(credentialResponse.credential));
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                  useOneTap
                />;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
