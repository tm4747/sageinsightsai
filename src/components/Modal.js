import React, { useState, useEffect } from 'react';
import AILogo from './AILogo';
import FlashingText from './FlashingText';


// Add your spinner GIF URL
const spinnerGifUrl = 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/0.16.1/images/loader-large.gif';  // Replace with your spinner GIF URL

const Modal = ({ isLoading }) => {
  return (
    // Overlay background that covers the full screen
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',  // Black background with 20% opacity
        display: isLoading ? 'flex' : 'none',  // Show only when loading
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,  // Ensure overlay is on top
        opacity: isLoading ? 1 : 0,  // Fade in/out
        transition: 'opacity 1s ease-in-out',  // Smooth transition for fade
      }}
    >
      <div style={{ textAlign: 'center', color: '#fff', fontSize: '18px' }}>
        <AILogo size={"4em"} transparency={true}/>
        {/* <img src={spinnerGifUrl} alt="Loading..." style={{ width: '50px', height: '50px', marginBottom: '20px' }} /> */}
        <h3>Please be patient as Lambda fetches results...</h3>
      </div>
    </div>
  );
};

export default Modal;