import { useState, useEffect } from 'react';
import FlashingText from './FlashingText';

const TypingText = ({ text, flashingText = "", speed = 100 }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);
  
    useEffect(() => {
      if (index < text.length) {
        const timeoutId = setTimeout(() => {
          setDisplayedText(prevText => prevText + text[index]);
          setIndex(prevIndex => prevIndex + 1);
        }, speed);
  
        return () => clearTimeout(timeoutId);
      }
    }, [index, text, speed]);
  
    return <span>Hello@User:~$ {displayedText} <FlashingText text={flashingText}/></span>;
  };

export default TypingText