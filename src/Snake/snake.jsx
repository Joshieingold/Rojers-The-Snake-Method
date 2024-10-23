import React, { useEffect, useState } from 'react';

const Snake = ({ character, gameOver }) => {
  // Global Variables
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]); // Snakes initial position
  const [food, setFood] = useState({ x: 5, y: 5 }); // Sets position of food
  const [powerup, setPowerup] = useState({ x: 6, y: 6 }); // sets position of power up
  const [direction, setDirection] = useState({ x: 0, y: 0 }); // Start the game without moving.
  const [speed, setSpeed] = useState(120); // Speed of snake movement (in ms)
  const [isGameOver, setIsGameOver] = useState(false); 
  const [lastMoveTime, setLastMoveTime] = useState(Date.now()); // To throttle rapid direction changes
  const [score, setScore] = useState(0); // sets the score
  const [powerPoints, setPowerPoints] = useState(0); // sets the power points
  const [barcodeScore, setBarcodeScore] = useState(4);
  const [powerScore, setPowerScore] = useState(2)
  const [isJoshPowerActive, setIsJoshPowerActive] = useState(false);
  const [isTKPowerActive, setIsTKPowerActive] = useState(false)
  const [isMaulikPowerActive, setIsMaulikPowerActive] = useState(false)
  // Function to move the snake
  const moveSnake = () => {
    // Global changes for powerups
      
    let newSpeed = 120;  // Default speed
    let newBarcodeScore = 4;  // Default score for barcode
    let newPowerScore = 2;  // Default power score
    
    // Check active power-ups and modify the speed and scores accordingly
    if (isJoshPowerActive) {
      newSpeed = 80;
      newBarcodeScore = 8;
    } 
    else if (isMaulikPowerActive) {
      newSpeed = 40;
      newPowerScore = 0;
    } 
    else if (isTKPowerActive) {
      newSpeed = 80;
    }
  
    setSpeed(newSpeed);
    setBarcodeScore(newBarcodeScore);
    setPowerScore(newPowerScore);
    
    setSnake((prevSnake) => {
      const newHead = {
        x: prevSnake[0].x + direction.x,
        y: prevSnake[0].y + direction.y,
      };
      // Checks if snake hits a wall or itself.
      if (checkCollision(newHead)) {
        setIsGameOver(true); // Send gamestate to parent
        gameOver(score); // Send score to parent
        return prevSnake;
      }
      const newSnake = [newHead];
      // Action for collision with food.
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(prevScore => prevScore + barcodeScore); // Get 4 points
        setFood(generateNewFoodPosition()); // New food appears somewhere.
        return [...newSnake, ...prevSnake]; // Add the previous segments to grow the snake
      }
      // Action for collision with power-up.
      if (newHead.x === powerup.x && newHead.y === powerup.y) {
        if (isTKPowerActive) {
          setScore(prevScore => prevScore + (barcodeScore + 1));
          setPowerup(generateNewPowerupPosition());
        }
        else {
          setPowerup(generateNewPowerupPosition()); // Spawns new power up somwhere.
          setPowerPoints(prevPowerPoints => prevPowerPoints + powerScore) // This is where the logic for the power up goes. I want to make it based on the character soon.
          return [...newSnake, ...prevSnake]; // Add the previous segments to grow the snake
        }
      }
      return [...newSnake, ...prevSnake.slice(0, -1)]; // Normal movement (remove last segment)
    });
  };
  // Check for collision with walls or snake itself
  const checkCollision = (head) => {
    // Check wall collision
      if (!isMaulikPowerActive) {
        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) return true;
        // Check self-collision
        for (let i = 1; i < snake.length; i++) {
          if (snake[i].x === head.x && snake[i].y === head.y) return true;
        }
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
  // Generate a new random position for the power-up
  const generateNewPowerupPosition = () => {
    return {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20),
    };
  };
  // Handle keypresses
  const handleKeyDown = (e) => {
    const now = Date.now();
    if (now - lastMoveTime < 120) return; // prevents rapid keypresses at the cost of responsiveness.
    setLastMoveTime(now);
    switch (e.key) {
      case 'ArrowUp':
        if (direction.y === 0) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        if (direction.y === 0) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        if (direction.x === 0) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        if (direction.x === 0) setDirection({ x: 1, y: 0 });
        break;
      case ' ':
        if (powerPoints >= 10) {
          setPowerPoints((prevPowerPoints) => prevPowerPoints - 10);
          if (character === "TK") {
            setIsTKPowerActive(true);
            setTimeout(() => setIsTKPowerActive(false), 10000); // Power-up is disabled after 10 seconds
          }
          if (character == "Josh") {
            setIsJoshPowerActive(true)
            setTimeout(() => setIsJoshPowerActive(false), 10000);
          }
          if (character == "Maulik") {
            setIsMaulikPowerActive(true);
            setTimeout(() => setIsMaulikPowerActive(false), 5000);
          }
        }
        break;
      default:
        break;
    }
  };


  // Contains the power-ups for Maulik

// Move the snake at normal speed.
  useEffect(() => {
    if (isGameOver) return;

    const intervalId = setInterval(() => {
      moveSnake();
    }, speed);  // Speed changes dynamically

    return () => clearInterval(intervalId); // Clean up interval
  }, [snake, direction, isGameOver, speed]);  // Track `speed` in dependencies
  // Keydown listener for movements.
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);
  // The snake structure
  return (
    <div className='snakeContent'> 
      <div className="game-board">
        {Array.from({ length: 20 }, (_, row) =>
          Array.from({ length: 20 }, (_, col) => {
            const isSnake = snake.some(s => s.x === col && s.y === row);
            const isFood = food.x === col && food.y === row;
            const isPowerup = powerup.x === col && powerup.y === row;
            
            // Add a special class if any power-up is active
            const isPowerSnake = isJoshPowerActive || isTKPowerActive || isMaulikPowerActive;
            
            return (
              <div
                key={`${row}-${col}`}
                className={`cell 
                  ${isSnake ? (isPowerSnake ? 'snake-power' : 'snake') : ''} 
                  ${isFood ? 'food' : ''} 
                  ${isPowerup ? 'powerup' : ''}`}
              />
            );
          })
        )}
      </div>
      <h3 className="score">Bom-Wipped: {score}</h3>
      <h3 className='powerbar'>Power Points {powerPoints}</h3>
    </div>
  );
};
export default Snake;
