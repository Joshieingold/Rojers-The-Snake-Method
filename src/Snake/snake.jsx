import React, { useEffect, useState } from 'react';

const Snake = ({ gameOver }) => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]); // Snake starts in the middle
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 1, y: 0 }); // Start moving to the right
  const [speed, setSpeed] = useState(100); // Speed of snake movement (in ms)
  const [isGameOver, setIsGameOver] = useState(false);
  const [lastMoveTime, setLastMoveTime] = useState(Date.now()); // To throttle rapid direction changes

  // Function to move the snake
  const moveSnake = () => {
    setSnake((prevSnake) => {
      const newHead = {
        x: prevSnake[0].x + direction.x,
        y: prevSnake[0].y + direction.y,
      };
      const newSnake = [newHead, ...prevSnake.slice(0, -1)];

      if (checkCollision(newHead)) {
        setIsGameOver(true);
        gameOver(newSnake.length - 1); // Send score to parent
        return prevSnake;
      }

      if (newHead.x === food.x && newHead.y === food.y) {
        setFood(generateNewFoodPosition());
        return [...newSnake, newSnake[newSnake.length - 1]]; // Grow the snake
      }

      return newSnake;
    });
  };

  // Check for collision with walls or snake itself
  const checkCollision = (head) => {
    // Check wall collision
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) return true;
    // Check self-collision
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) return true;
    }
    return false;
  };

  // Generate a new random position for the food
  const generateNewFoodPosition = () => {
    return {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20),
    };
  };

  // Handle keypresses to update the direction, prevent opposite direction changes, and throttle spam
  const handleKeyDown = (e) => {
    const now = Date.now();
    // Throttle rapid keypresses (allow only every 150ms)
    if (now - lastMoveTime < 100) return;
    setLastMoveTime(now);

    switch (e.key) {
      case 'ArrowUp':
        if (direction.y === 0) setDirection({ x: 0, y: -1 }); // Prevent moving opposite (down to up)
        break;
      case 'ArrowDown':
        if (direction.y === 0) setDirection({ x: 0, y: 1 }); // Prevent moving opposite (up to down)
        break;
      case 'ArrowLeft':
        if (direction.x === 0) setDirection({ x: -1, y: 0 }); // Prevent moving opposite (right to left)
        break;
      case 'ArrowRight':
        if (direction.x === 0) setDirection({ x: 1, y: 0 }); // Prevent moving opposite (left to right)
        break;
      default:
        break;
    }
  };

  // Use an interval to move the snake at a regular speed
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isGameOver) moveSnake();
    }, speed);

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [snake, direction, isGameOver, speed]);

  // Attach keydown event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  return (
    <div className="game-board">
      {Array.from({ length: 20 }, (_, row) =>
        Array.from({ length: 20 }, (_, col) => {
          const isSnake = snake.some(s => s.x === col && s.y === row);
          const isFood = food.x === col && food.y === row;
          return (
            <div
              key={`${row}-${col}`}
              className={`cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}
            />
          );
        })
      )}
    </div>
  );
};

export default Snake;
