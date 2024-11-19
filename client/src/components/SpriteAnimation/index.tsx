import React, { useState, useEffect, useRef } from "react";
import { useLazyQuery } from "@apollo/client";
import { QUERY_ME } from "../../utils/queries"; // Adjusted import path for QUERY_ME
import "./index.css";

interface AnimatedGifComponentProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

const AnimatedGifComponent: React.FC<AnimatedGifComponentProps> = ({ containerRef }) => {
  const gifRef = useRef<HTMLImageElement>(null); // Ref for the GIF
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Current position
  const [direction, setDirection] = useState({ x: "right", y: "down" }); // Current direction
  const [gifSource, setGifSource] = useState("spriteMoveRight.gif"); // Default GIF source
  const [isMoving, setIsMoving] = useState(true); // Movement state
  const [displayedCaloriesStatus, setDisplayedCaloriesStatus] = useState<null | boolean>(null); // Display state for the calorie status
  const [queryTimestamp, setQueryTimestamp] = useState<number | null>(null); // Forces re-render on query

  const pauseProbability = 0.0025; // Chance of pausing
  const minPauseTime = 5000; // Minimum pause duration (ms)
  const maxPauseTime = 7000; // Maximum pause duration (ms)

  // Lazy query to fetch the latest data
  const [fetchData, { data, loading, error }] = useLazyQuery(QUERY_ME);

  // Function to handle the button click and update the calorie state
  const handleFetchCalories = () => {
    fetchData();
    setQueryTimestamp(Date.now()); // Update timestamp to force state re-evaluation
  };

  // Function to reset the displayed status without overriding query data
  const handleResetCalories = () => {
    setDisplayedCaloriesStatus(null); // Reset visible state to default
    setQueryTimestamp(null); // Clear timestamp to reset visuals
  };

  // Update displayed state based on query result
  useEffect(() => {
    if (data?.me?.isOverRecommendedCalories !== undefined) {
      setDisplayedCaloriesStatus(data.me.isOverRecommendedCalories); // Sync query result to display state
    }
  }, [data, queryTimestamp]);

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

      const moveSpeed = displayedCaloriesStatus === true
        ? 0.5 // Fat movement speed
        : displayedCaloriesStatus === false
        ? 1.5 // Skinny movement speed
        : 1; // Default movement speed

      setPosition((prevPosition) => {
        let { x, y } = prevPosition;

        // Horizontal movement logic
        if (direction.x === "right") {
          x += moveSpeed;
          if (x >= containerWidth - gifWidth) {
            setDirection((prev) => ({ ...prev, x: "left" }));
            setGifSource(
              displayedCaloriesStatus === true
                ? "fatSpriteLeftMovement.gif"
                : displayedCaloriesStatus === false
                ? "skinnySpriteLeftMovement.gif"
                : "spriteMoveLeft.gif"
            );
            x = containerWidth - gifWidth;
          }
        } else {
          x -= moveSpeed;
          if (x <= 0) {
            setDirection((prev) => ({ ...prev, x: "right" }));
            setGifSource(
              displayedCaloriesStatus === true
                ? "fatSpriteRightMovement.gif"
                : displayedCaloriesStatus === false
                ? "skinnySpriteRightMovement.gif"
                : "spriteMoveRight.gif"
            );
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

      // Set paused sprite based on current direction and calorie state
      setGifSource(
        direction.x === "right"
          ? displayedCaloriesStatus === true
            ? "spriteRightFat.gif"
            : displayedCaloriesStatus === false
            ? "spriteSkinnyRight.gif" 
            : "spriteRight.gif"
          : displayedCaloriesStatus === true
          ? "spriteLeftFat.gif"
          : displayedCaloriesStatus === false
          ? "spriteSkinnyLeft.gif"
          : "sprite.gif"
      );

      const pauseTime = Math.floor(Math.random() * (maxPauseTime - minPauseTime + 1)) + minPauseTime;

      setTimeout(() => {
        const newDirection = getRandomDirection();
        setDirection(newDirection); // Set new random direction

        // Set the movement sprite based on new direction and calorie state
        setGifSource(
          newDirection.x === "right"
            ? displayedCaloriesStatus === true
              ? "fatSpriteRightMovement.gif"
              : displayedCaloriesStatus === false
              ? "skinnySpriteRightMovement.gif"
              : "spriteMoveRight.gif"
            : displayedCaloriesStatus === true
            ? "fatSpriteLeftMovement.gif"
            : displayedCaloriesStatus === false
            ? "skinnySpriteLeftMovement.gif"
            : "spriteMoveLeft.gif"
        );

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
  }, [direction, isMoving, displayedCaloriesStatus]);

  return (
    <div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={handleFetchCalories} disabled={loading}>
          {loading ? "Loading..." : "Check Calorie Status"}
        </button>
        <button onClick={handleResetCalories}>Reset Status</button>
      </div>
      {error && <p>Error fetching data: {error.message}</p>}
      <img
        ref={gifRef}
        src={gifSource}
        alt="Animated GIF"
        className="animated-gif"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      />
  
      {/* Speech Bubble for Right Direction */}
      {!isMoving && direction.x === "right" && (
        <img
          src="speech_bubble_right.png"
          alt="Speech Bubble"
          className="speech-bubble"
          style={{
            position: "absolute",
            top: position.y + 160, // Position the bubble above the GIF
            left: position.x + 170, // Center the bubble horizontally relative to the GIF
          }}
        />
      )}
  
      {/* Speech Bubble for Left Direction */}
      {!isMoving && direction.x === "left" && (
        <img
          src="speech_bubble_left.png"
          alt="Speech Bubble"
          className="speech-bubble"
          style={{
            position: "absolute",
            top: position.y + 160, // Position the bubble above the GIF
            left: position.x - 40, // Adjust the bubble position to the left of the GIF
          }}
        />
      )}
    </div>
  );  
};

export default AnimatedGifComponent;
