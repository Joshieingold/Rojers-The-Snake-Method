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

  // Handle Game Start
  const startGame = () => {
    setGameState(GameState.PLAYING);
  };
  const selectCharater = () => {
    setCharacter("No Character Selected")
  }
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
          <div className="title-container">
            <img src={Logo} className="logoImg"></img>
            <h1 className="logo-text">Rojers</h1>
          </div>
          
          <h2>The Snake Method</h2>
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
