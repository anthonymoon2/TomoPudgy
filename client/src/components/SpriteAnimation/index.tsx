import React, { useState, useEffect, useRef } from "react";
import "./index.css";

interface AnimatedGifComponentProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

const AnimatedGifComponent: React.FC<AnimatedGifComponentProps> = ({ containerRef }) => {
  const gifRef = useRef<HTMLImageElement>(null); // Ref for the GIF
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Current position
  const [direction, setDirection] = useState({ x: "right", y: "down" }); // Current direction
  const [gifSource, setGifSource] = useState("spriteMoveRight.gif"); // Current GIF source
  const [isMoving, setIsMoving] = useState(true); // Movement state
  const moveSpeed = 1; // Speed of movement

  const pauseProbability = 0.0025; // Chance of pausing
  const minPauseTime = 2000; // Minimum pause duration (ms)
  const maxPauseTime = 5000; // Maximum pause duration (ms)

  // Function to generate random direction
  const getRandomDirection = () => ({
    x: Math.random() < 0.5 ? "left" : "right",
    y: Math.random() < 0.5 ? "up" : "down",
  });

  const moveGif = () => {
    if (gifRef.current && containerRef.current && isMoving) {
      const gifWidth = gifRef.current.offsetWidth; // Dynamically get GIF width
      const gifHeight = gifRef.current.offsetHeight; // Dynamically get GIF height
      const containerWidth = containerRef.current.offsetWidth; // Container width
      const containerHeight = containerRef.current.offsetHeight; // Container height

      setPosition((prevPosition) => {
        let { x, y } = prevPosition;

        // Horizontal movement logic
        if (direction.x === "right") {
          x += moveSpeed;
          if (x >= containerWidth - gifWidth) {
            setDirection((prev) => ({ ...prev, x: "left" }));
            setGifSource("spriteMoveLeft.gif");
            x = containerWidth - gifWidth;
          }
        } else {
          x -= moveSpeed;
          if (x <= 0) {
            setDirection((prev) => ({ ...prev, x: "right" }));
            setGifSource("spriteMoveRight.gif");
            x = 0;
          }
        }

        // Vertical movement logic
        if (direction.y === "down") {
          y += moveSpeed;
          if (y >= containerHeight - gifHeight) {
            setDirection((prev) => ({ ...prev, y: "up" }));
            y = containerHeight - gifHeight;
          }
        } else {
          y -= moveSpeed;
          if (y <= 0) {
            setDirection((prev) => ({ ...prev, y: "down" }));
            y = 0;
          }
        }

        return { x, y };
      });
    }
  };

  const randomPause = () => {
    if (Math.random() < pauseProbability) {
      setIsMoving(false); // Pause movement

      // Set paused sprite based on current direction
      setGifSource(direction.x === "right" ? "spriteRight.gif" : "sprite.gif");

      const pauseTime = Math.floor(Math.random() * (maxPauseTime - minPauseTime + 1)) + minPauseTime;

      setTimeout(() => {
        const newDirection = getRandomDirection();
        setDirection(newDirection); // Set new random direction

        // Set the movement sprite based on new direction
        setGifSource(newDirection.x === "right" ? "spriteMoveRight.gif" : "spriteMoveLeft.gif");

        setIsMoving(true); // Resume movement
      }, pauseTime);
    }
  };

  useEffect(() => {
    let animationFrameId: number;

    const updatePosition = () => {
      moveGif();
      randomPause();
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    updatePosition();

    return () => cancelAnimationFrame(animationFrameId); // Cleanup on unmount
  }, [direction, isMoving]);

  return (
    <img
      ref={gifRef}
      src={gifSource}
      alt="Animated GIF"
      className="animated-gif"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    />
  );
};

export default AnimatedGifComponent;
