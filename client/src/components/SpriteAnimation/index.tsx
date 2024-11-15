import React, { useState, useEffect, useRef } from 'react';
import './index.css';

const AnimatedGifComponent: React.FC = () => {
  const gifRef = useRef<HTMLImageElement>(null);
  const [position, setPosition] = useState(0); // Track the current position of the GIF
  const [direction, setDirection] = useState<'left' | 'right'>('right'); // Direction the GIF is moving
  const [gifSource, setGifSource] = useState('spriteMoveRight.gif'); // Track the GIF source (direction)
  const [isMoving, setIsMoving] = useState(true); // State to control if the GIF is moving or paused
  const moveSpeed = 1; 
  const pauseProbability = 0.0025; // Lower probability for less frequent pauses
  const minPauseTime = 2000; // Minimum pause time in ms
  const maxPauseTime = 5000; // Maximum pause time in ms
  const changeDirectionProbability = 0.1; // Probability of changing direction during pause (adjust as needed)

  // Function to move the GIF
  const moveGif = () => {
    if (gifRef.current && isMoving) {
      const gifWidth = gifRef.current.offsetWidth;
      const screenWidth = window.innerWidth;

      // Move right or left based on the current direction
      if (direction === 'right') {
        setPosition((prevPosition) => {
          const newPosition = prevPosition + moveSpeed;
          // Reverse direction when the GIF reaches the right side
          if (newPosition >= screenWidth - gifWidth) {
            setDirection('left');
            setGifSource('spriteMoveLeft.gif'); // Change GIF to left-moving sprite
            return screenWidth - gifWidth; // Prevent overshooting the right edge
          }
          return newPosition;
        });
      } else {
        setPosition((prevPosition) => {
          const newPosition = prevPosition - moveSpeed;
          // Reverse direction when the GIF reaches the left side
          if (newPosition <= 0) {
            setDirection('right');
            setGifSource('spriteMoveRight.gif'); // Change GIF to right-moving sprite
            return 0; // Prevent overshooting the left edge
          }
          return newPosition;
        });
      }
    }
  };

  // Function to randomly pause, resume and potentially change direction
  const randomPause = () => {
    if (Math.random() < pauseProbability) {
      setIsMoving(false); // Stop moving

      // Switch to the paused image based on the current direction
      if (direction === 'right') {
        setGifSource('spriteRight.gif'); // Switch to sprite.gif when pausing right
      } else {
        setGifSource('sprite.gif'); // Switch to spriteLeft.gif when pausing left
      }

      // After a random amount of time, resume movement
      const pauseTime = Math.floor(Math.random() * (maxPauseTime - minPauseTime + 1)) + minPauseTime;
      setTimeout(() => {
        // There is a chance the GIF will change direction when it resumes
        if (Math.random() < changeDirectionProbability) {
          setDirection((prevDirection) => (prevDirection === 'right' ? 'left' : 'right'));
        }

        setIsMoving(true); // Resume moving

        // After resuming, switch back to the movement gif for the current direction
        if (direction === 'right') {
          setGifSource('spriteMoveRight.gif'); // Switch back to right-moving sprite
        } else {
          setGifSource('spriteMoveLeft.gif'); // Switch back to left-moving sprite
        }
      }, pauseTime);
    }
  };

  useEffect(() => {
    // Store the requestAnimationFrame ID to cancel it later
    let animationFrameId: number;

    // Use requestAnimationFrame for smooth updates
    const updatePosition = () => {
      moveGif();
      randomPause(); // Randomly pause the GIF
      animationFrameId = requestAnimationFrame(updatePosition); // Store the frame ID
    };
    updatePosition(); // Start the animation loop

    return () => cancelAnimationFrame(animationFrameId); // Cancel the animation frame on unmount
  }, [direction, isMoving]); // Update position whenever direction or isMoving changes

  return (
    <div>
      <img
        ref={gifRef}
        src={gifSource} // Dynamically change the GIF source based on direction or pause state
        alt="Animated GIF"
        className="animated-gif"
        style={{ transform: `translateX(${position}px)` }} // Use the current position for translation
      />
    </div>
  );
};

export default AnimatedGifComponent;
