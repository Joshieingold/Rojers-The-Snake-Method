import React, { useState } from "react";
import "./App.css";
import Snake from "./Snake/snake.jsx";
import Logo from "./assets/pxArt.png";

const GameState = {
  TITLE: "TITLE",
  CHARACTERSELECT: "CHARACTERSELECT",
  PLAYING: "PLAYING",
  GAME_OVER: "GAME_OVER"
};

function App() {
  const [gameState, setGameState] = useState(GameState.TITLE);
  const [score, setScore] = useState(0); // Add a score state variable

  // Handle Game Start
  const startGame = () => {
    setScore(0); // Reset score when starting a new game
    setGameState(GameState.PLAYING);
  };

  const selectCharacter = () => {
    setGameState(GameState.CHARACTERSELECT);
  };

  // Handle Game Over
  const gameOver = (finalScore) => {
    setScore(finalScore); // Update score on game over
    setGameState(GameState.GAME_OVER);
  };

  // Handle Restart Game
  const restartGame = () => {
    setGameState(GameState.PLAYING);
  };

  return (
    <div className="App">
      {gameState === GameState.TITLE && (
        <div className="title-screen">
          <div className="title-container">
            <img src={Logo} className="logoImg" alt="Logo" />
            <h1 className="logo-text">Rojers</h1>
          </div>
          <h2>The Snake Method</h2>
          <button onClick={selectCharacter}>Start Game</button>
        </div>
      )}
      {gameState === GameState.CHARACTERSELECT && (
        <div className="charSelContainer">
          <button onClick={startGame}>Josh</button>
          <button>TK</button>
          <button>Micheal</button>
          <button>Maulik</button>
        </div>
      )}
      {gameState === GameState.PLAYING && (
        <Snake gameOver={gameOver} />
      )}
      {gameState === GameState.GAME_OVER && (
        <div className="game-over-screen">
          <h1>Game Over</h1>
          <h2>You Bom-Wipped: {score} Devices!</h2> {/* Display the final score */}
          <button onClick={restartGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default App;
