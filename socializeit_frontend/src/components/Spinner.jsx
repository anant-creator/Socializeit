import React from 'react';
import Loader from '../assets/loading-loading-forever.gif';

const Spinner = ({ message }) => {
  return (
    <div style={{width: "30%", margin: "0 auto"}}>
      <div style={{width: "50%", margin: "0 auto"}}>
        <img src={Loader} className="w-28 rounded-full" alt="loader" />
      </div>
        <h4 className="text-lg px-2">{message}</h4>
    </div>
  )
}

export default Spinner