import React, { useState, useEffect, useCallback } from 'react';

const TypingEffectWithMarkup = ({ content, setIndex }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!content) return;  // No content to display

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
        setDisplayedText((prev) => prev + content[currentIndex]);
        currentIndex += 1;
        updateIndex(currentIndex);

      // If we've added all characters, stop the typing effect
      if (currentIndex === content.length) {
        clearInterval(typingInterval);
        setIsDone(true);
      }
    }, 1); // Adjust speed here (50ms per character)

    return () => clearInterval(typingInterval); // Cleanup the interval
  }, [content]);

  const updateIndex = useCallback((index) => {
    setIndex(index);
  }, [])

  return (
    <div>
      {/* Render the progressively revealed text with markup */}
      <p dangerouslySetInnerHTML={{ __html: displayedText }} />
      {isDone && <p>Done typing!</p>}
    </div>
  );
};

export default TypingEffectWithMarkup;
