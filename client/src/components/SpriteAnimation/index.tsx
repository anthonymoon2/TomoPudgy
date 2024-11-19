import React, { useState, useEffect, useRef } from "react";
import "./index.css";

interface AnimatedGifComponentProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

const AnimatedGifComponent: React.FC<AnimatedGifComponentProps> = ({ containerRef }) => {
  const gifRef = useRef<HTMLImageElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState({ x: "right", y: "down" });
  const [gifSource, setGifSource] = useState("spriteMoveRight.gif");
  const [isMoving, setIsMoving] = useState(true);
  const moveSpeed = 1;

  const pauseProbability = 0.0025; // Chance of pausing
  const minPauseTime = 2000; // Minimum pause time in milliseconds
  const maxPauseTime = 5000; // Maximum pause time in milliseconds

  // Function to generate a random direction (right/left for x, up/down for y)
  const getRandomDirection = () => {
    const x = Math.random() < 0.5 ? "left" : "right";
    const y = Math.random() < 0.5 ? "up" : "down";
    return { x, y };
  };

  const moveGif = () => {
    if (gifRef.current && containerRef.current && isMoving) {
      const gifWidth = gifRef.current.offsetWidth;
      const gifHeight = gifRef.current.offsetHeight;
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;

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

      // Set paused sprite based on current horizontal direction
      setGifSource(direction.x === "right" ? "spriteRight.gif" : "sprite.gif");

      // Calculate random pause duration
      const pauseTime = Math.floor(Math.random() * (maxPauseTime - minPauseTime + 1)) + minPauseTime;

      // Resume movement after pause
      setTimeout(() => {
        // Randomly change directions
        const newDirection = getRandomDirection();
        setDirection(newDirection);

        // Set the correct moving sprite based on the new horizontal direction
        setGifSource(newDirection.x === "right" ? "spriteMoveRight.gif" : "spriteMoveLeft.gif");

        setIsMoving(true); // Resume movement
      }, pauseTime);
    }
  };

  useEffect(() => {
    let animationFrameId: number;

    const updatePosition = () => {
      moveGif(); // Update position
      randomPause(); // Randomly pause and potentially change directions
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
