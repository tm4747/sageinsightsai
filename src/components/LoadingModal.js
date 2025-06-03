import React from 'react';
import AILogo from './AILogo';

const LoadingModal = ({ isLoading }) => {
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
        <h3>Please be patient as Lambda fetches results...</h3>
      </div>
    </div>
  );
};

export default LoadingModal;