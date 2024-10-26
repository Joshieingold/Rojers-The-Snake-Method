// Imports
import { collection, doc, getDocs, limit, orderBy, query, setDoc } from "firebase/firestore"; // Import Firestore functions
import React, { useState } from "react";
import "./App.css";
import joshSprite from "./assets/joshSprite.png";
import maulikSprite from "./assets/maulkSprite.png"; // Fixed spelling for Maulik sprite
import tkSprite from "./assets/tkSprite.png";
import { db } from "./firebase"; // Ensure the path is correct based on your file structure

import Snake from "./Snake/snake.jsx";

const GameState = {
  TITLE: "TITLE",
  CHARACTERSELECT: "CHARACTERSELECT",
  PLAYING: "PLAYING",
  GAME_OVER: "GAME_OVER",
  LEADERBOARD: "LEADERBOARD" // Added LEADERBOARD state
};

// Main function of the app
function App() {
  // Define hooks inside the functional component
  const [gameState, setGameState] = useState(GameState.TITLE);
  const [score, setScore] = useState(0);
  const [character, setCharacter] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]); // Correct placement
  const [username, setUsername] = useState("");

  // Function to submit a new score
  const submitScore = async (username, score, character) => {
    try {
      const scoreRef = doc(db, "leaderboard", username); // Write to the "leaderboard" collection
      await setDoc(scoreRef, { username: username, score: score, character: character }); // Include character in the saved document
      console.log("Score submitted successfully!");
    } catch (error) {
      console.error("Error submitting score: ", error);
    }
  };
  
  
  const handleScoreSubmission = async () => {
    if (username.trim() === "") {
      alert("Please enter a username to submit your score.");
      return; // Prevent submission if username is empty
    }
    await submitScore(username, score, character); // Save score and character to Firebase
    loadLeaderboard(); // Load the leaderboard after submitting the score
  };
  

  const skipScoreSubmission = () => {
    // Optionally clear the username or perform other actions
    setUsername(""); // Clear the username input
    setGameState(GameState.TITLE); // Return to the title screen or another appropriate state
  };
  // Function to retrieve the leaderboard from Firestore
  async function getLeaderboard() {
    const q = query(collection(db, "leaderboard"), orderBy("score", "desc"), limit(10));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  }

  const loadLeaderboard = async () => {
    const data = await getLeaderboard();
    setLeaderboard(data);
    setGameState(GameState.LEADERBOARD);
  };

  // Update gameOver to include submitting the score
  const gameOver = (finalScore) => {
    setScore(finalScore);
    setGameState(GameState.GAME_OVER); // Move directly to game over state
  };

  // Handle Game Start
  const startGame = (selectedCharacter) => {
    setScore(0); // Reset score when starting a new game
    setCharacter(selectedCharacter); // Set selected character
    setGameState(GameState.PLAYING);
  };

  // Handles character select link
  const selectCharacter = () => {
    setGameState(GameState.CHARACTERSELECT);
  };

  // Handle Restart Game
  const restartGame = () => {
    setGameState(GameState.PLAYING);
  };

  const getCharacterSprite = () => {
    switch (character) {
      case "Josh":
        return joshSprite;
      case "Maulik":
        return maulikSprite;
      case "TK":
        return tkSprite;
      default:
        return null;
    }
  };

  // All the HTML based on GameState
  return (
    <div className="App"> 
      {/* Div for title screen */}
      {gameState === GameState.TITLE && (
        <div className="screenContainer">
          <h1 className="logo-text">Rojers</h1>
          <h2 className="sub-title">The Snake Method</h2>
          <div className="homeButtonContainer">
            <button onClick={selectCharacter} className="homeBtn">Start Game</button>
            <button onClick={loadLeaderboard} className="homeBtn">View Leaderboard</button>
          </div>
        </div>
      )}
      
      {/* Div for Character select */}
      {gameState === GameState.CHARACTERSELECT && (
        <div className="screenContainer">
          <h1 className="title-text">Choose your Bom-Wipper!</h1>
          <div className="charSelContainer">
            {/* Container for Josh Character */}
            <div className="charContainer">
              <button onClick={() => startGame("Josh")} className="charBtn">
                <img src={joshSprite} className="sprite" alt="Josh" />
              </button>  
              <h4 className="charName">Josh</h4>          
            </div>
            {/* Container for TK Character */}
            <div className="charContainer">
              <button onClick={() => startGame("TK")} className="charBtn">
                <img src={tkSprite} className="sprite" alt="TK" />
              </button>  
              <h4 className="charName">TK</h4>          
            </div>
            {/* Container for Maulik Character */}
            <div className="charContainer">
              <button onClick={() => startGame("Maulik")} className="charBtn">
                <img src={maulikSprite} className="sprite" alt="Maulik" />
              </button>  
              <h4 className="charName">Maulik</h4>          
            </div>
          </div>
        </div>
      )}

      {/* Play the game */}
      {gameState === GameState.PLAYING && (
        <div className="gameContainer">
          <Snake character={character} gameOver={gameOver} />
          <div className="gameCharContainer">
            <p className="charNameContainer">{character}</p>
            <img src={getCharacterSprite()} alt={character} className="selectedCharacterSprite" />
          </div>
        </div>
      )}

      {/* Div for Game Over screen */}
 {/* Game Over screen with username input */}
 {gameState === GameState.GAME_OVER && (
        <div className="screenContainer-gameover">
          <h1>It is what it is.</h1>
          <h2>You Bom-Wipped: {score} Devices Today</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update username state
            placeholder="Enter your username"
            className="usernameInput" // Optional: add a class for styling
          />
          <div className="buttonContainer">
            <div className="gameplayButtons">
              <button className="gameOverButton" onClick={restartGame}>Play Again</button>
              <button className="gameOverButton" onClick={selectCharacter}>Change Character</button>
            </div>
            <div className="leaderboardButtons">
            <button className="gameOverButton" onClick={handleScoreSubmission}>
              Submit Score
            </button>
              <button className="gameOverButton" onClick={loadLeaderboard}>View Leaderboard</button>
              <button className="gameOverButton" onClick={skipScoreSubmission}>
              Skip Submission
            </button>
            </div>

            
          </div>
        </div>
      )}

{gameState === GameState.LEADERBOARD && (
  <div className="screenContainer leaderboardContainer">
    <h1>Leaderboard</h1>
    <div className="leaderboard">
      <div className="leaderboardHeader">
        <span>Rank</span>
        <span>Player Name</span>
        <span>Character Used</span>
        <span>Score</span>
      </div>
      <ul>
        {leaderboard.map((entry, index) => (
          <li key={index} className="leaderboardEntry">
            <span>{index + 1}</span>
            <span>{entry.username}</span>
            <span>{entry.character}</span>
            <span>{entry.score}</span>
          </li>
        ))}
      </ul>
    </div>
    <button className="backButton" onClick={() => setGameState(GameState.TITLE)}>Back to Title</button>
  </div>
)}


    </div>
  );
}

export default App;
