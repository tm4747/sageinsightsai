import React from 'react';
import AILogo from './AILogo';

const LoadingModal = ({ isLoading }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: isLoading ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        opacity: isLoading ? 1 : 0,
        transition: 'opacity 1s ease-in-out',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '1.5rem',
          color: '#fff',
          fontSize: '18px',
          textAlign: 'center',
        }}
      >
        <AILogo size="3em" transparency={true} />
        <h3 style={{ margin: 0 }}>Please be patient as Lambda</h3> 
        <img
          src="/Lambda.svg"
          alt="AWS Lambda Logo"
          style={{ 
            width: '36px', 
            height: '36px',
            maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 85%, rgba(0,0,0,0.75) 90%, rgba(0,0,0,0.5) 95%, rgba(0,0,0,0.25) 100%)',
            WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 85%, rgba(0,0,0,0.75) 90%, rgba(0,0,0,0.5) 95%, rgba(0,0,0,0.25) 100%)'
          }}
        />
        <h3  style={{ margin: 0 }}>fetches results...</h3>
      </div>
    </div>
  );
};

export default LoadingModal;
