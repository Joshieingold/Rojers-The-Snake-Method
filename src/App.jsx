import React, { useState } from "react";
import "./App.css";
import Snake from "./Snake/snake.jsx";

const GameState = {
  TITLE: "TITLE",
  PLAYING: "PLAYING",
  GAME_OVER: "GAME_OVER"
};

function App() {
  const [gameState, setGameState] = useState(GameState.TITLE);

  // Handle Game Start
  const startGame = () => {
    setGameState(GameState.PLAYING);
  };

  // Handle Game Over
  const gameOver = () => {
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
          <h1>Snake Game</h1>
          <button onClick={startGame}>Start Game</button>
        </div>
      )}
      {gameState === GameState.PLAYING && (
        <Snake gameOver={gameOver} />
      )}
      {gameState === GameState.GAME_OVER && (
        <div className="game-over-screen">
          <h1>Game Over</h1>
          <button onClick={restartGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default App;
