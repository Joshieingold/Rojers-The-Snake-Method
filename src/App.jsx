import React, { useState } from "react";
import "./App.css";
import joshSprite from "./assets/joshSprite.png";
import maulikSprite from "./assets/maulkSprite.png";
import michealSprite from "./assets/michealSprite.png";
import tkSprite from "./assets/tkSprite.png";
import Snake from "./Snake/snake.jsx";

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
        <div className="screenContainer">
          <div className="title-container">
            <h1 className="logo-text">Rojers</h1>
          </div>
          <h2 className="sub-title">The Snake Method</h2>
          <button onClick={selectCharacter}>Start Game</button>
        </div>
      )}
      {gameState === GameState.CHARACTERSELECT && (
        <div className="screenContainer">
        <h1 className="title-text">Choose your Bom-Wipper!</h1>
        <div className="charSelContainer">
          <div className="joshContainer">
            <button onClick={startGame} className="charBtn"><img src={joshSprite} className="sprite"></img></button>  
            <h4 className="charName">Josh</h4>          
          </div>
          <div className="tkContainer">
            <button onClick={startGame} className="charBtn"><img src={tkSprite} className="sprite"></img></button>  
            <h4 className="charName">TK</h4>          
          </div>
          <div className="michealContainer">
            <button onClick={startGame} className="charBtn"><img src={michealSprite} className="sprite"></img></button>  
            <h4 className="charName">Micheal</h4>          
          </div>
          <div className="MaulikContainer">
            <button onClick={startGame} className="charBtn"><img src={maulikSprite} className="sprite"></img></button>  
            <h4 className="charName">Maulik</h4>          
          </div>
        </div>
        </div>

      )}
      {gameState === GameState.PLAYING && (
        <Snake gameOver={gameOver} />
      )}
      {gameState === GameState.GAME_OVER && (
        <div className="screenContainer-gameover">
          <h1>It is what it is.</h1>
          <h2>You Bom-Wipped: {score} Devices Today</h2> {/* Display the final score */}
          <div className="buttonContainer">
            <button className="gameOverButton" onClick={restartGame}>Play Again</button>
            <button className="gameOverButton" onClick={selectCharacter}>Change Character</button>
            <button className="gameOverButton">Leaderboard</button>
          </div>

        </div>
      )}
    </div>
  );
}

export default App;
