import { useState, useEffect } from 'react';
import FlashingText from './FlashingText';

const TypingText = ({ baseText = "", text, flashingText = "", speed = 100, headerSize = "" }) => {
    const initialReady = baseText ? false : true;
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);
    const [isReady, setIsReady] = useState(initialReady);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 2000);
      return () => clearTimeout(timer);
    }, []); 
  
    useEffect(() => {
      if (isReady && index < text.length) {
        const timeoutId = setTimeout(() => {
          setDisplayedText(prevText => prevText + text[index]);
          setIndex(prevIndex => prevIndex + 1);
        }, speed);
  
        return () => clearTimeout(timeoutId);
      }
    }, [index, text, speed, isReady]);
  
    return <span>{isReady ? "" : baseText} {displayedText} <FlashingText text={flashingText}/></span>;
  };

export default TypingText