import React, { useState, useEffect } from 'react';

const TypingEffectWithMarkup = ({ content, setTypingContent }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!content) return;  // No content to display

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      const updatedContent = (prev) => prev + content[currentIndex];
        setDisplayedText(updatedContent);
        setTypingContent(updatedContent)
        currentIndex += 1;

      // If we've added all characters, stop the typing effect
      if (currentIndex === content.length) {
        clearInterval(typingInterval);
        setIsDone(true);
      }
    }, 1); // Adjust speed here (50ms per character)

    return () => clearInterval(typingInterval); // Cleanup the interval
  }, [content]);

  return (
    <div>
      {/* Render the progressively revealed text with markup */}
      <p dangerouslySetInnerHTML={{ __html: displayedText }} />
      {isDone && <p>Done typing!</p>}
    </div>
  );
};

export default TypingEffectWithMarkup;
