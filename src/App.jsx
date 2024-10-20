import React, { useEffect, useState } from "react";
import "./App.css";

const gridSize = 20;
const canvasSize = 400;
const totalCells = canvasSize / gridSize;

function App() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [food, setFood] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState("startGame");

  // Function to generate random food position
  const generateRandomFood = () => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * totalCells),
        y: Math.floor(Math.random() * totalCells),
      };
    } while (checkCollision(newFood)); // Ensure food does not spawn on the snake
    return newFood;
  };

  // Effect for handling keypresses
  useEffect(() => {
    const handleKeydown = (event) => {
      const { key } = event;
      if (key === "ArrowUp" && direction.y === 0) {
        setDirection({ x: 0, y: -1 });
      } else if (key === "ArrowDown" && direction.y === 0) {
        setDirection({ x: 0, y: 1 });
      } else if (key === "ArrowLeft" && direction.x === 0) {
        setDirection({ x: -1, y: 0 });
      } else if (key === "ArrowRight" && direction.x === 0) {
        setDirection({ x: 1, y: 0 });
      }

      if (gameState === "startGame") {
        resetGame(); // Start the game on first key press
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [direction, gameState]);

  // Effect for game loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState === "ongoing") {
        updateGame();
      }
    
      else if (gameState === "gameOver") {
        resetGame();
      }
    }, 100);
    return () => clearInterval(interval);
  }, [snake, direction, food, gameState]);

  // Draw the game on canvas
  useEffect(() => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    snake.forEach((segment) => {
      ctx.fillStyle = "green";
      ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // Draw the food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
  }, [snake, food]);

  const updateGame = () => {
    const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Check for collision with walls
    if (
      newHead.x < 0 ||
      newHead.x >= totalCells ||
      newHead.y < 0 ||
      newHead.y >= totalCells ||
      checkCollision(newHead)
    ) {
      setGameState("gameOver");
      return;
    }

    const newSnake = [newHead, ...snake];

    // Check if snake eats the food
    if (newHead.x === food.x && newHead.y === food.y) {
      setScore((prevScore) => prevScore + 10);
      setFood(generateRandomFood()); // Update food position
    } else {
      newSnake.pop(); // Remove the tail if no food is eaten
    }

    setSnake(newSnake);
  };

  const checkCollision = (head) => {
    return snake.some((segment) => segment.x === head.x && segment.y === head.y);
  };

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: 0 });
    setFood(generateRandomFood()); // Set initial food position
    setScore(0);
    setGameState("ongoing");
  };

  
  if (gameState === "start") {
    return (
      <div className="App">
        <h1 className="Company">Rojers</h1>
        <h1 className="gameTitle">The Snake Method</h1>
        <canvas id="gameCanvas" width={canvasSize} height={canvasSize} />
        <h2>Score: {score}</h2>
        {gameState === "gameOver" && <h2>Game Over! Press any arrow key to restart.</h2>}
      </div>
    );
  }
  else if (gameState === "ongoing") {
    return (
      <h1>Hello??</h1>
    )
  }

}

export default App;
