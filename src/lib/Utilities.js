import { useState, useEffect } from 'react';

export const useViewportWidth = () => {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);

    // Listen for both window resize and orientation change
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return viewportWidth;
}

/*** 1. trim whitespace 2. remove all non alphanumeric, non space 3. replace any single or multi-spaces with -  ***/
export const makeId = (input) => {
  let id = input.trim();
  return id
    .replace(/[^a-zA-Z0-9 ]/g, '') 
    .replace(/\s+/g, '-');    
}
