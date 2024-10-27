// Imports
import { collection, doc, getDocs, limit, orderBy, query, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import "./App.css";
import joshSprite from "./assets/joshSprite.png";
import maulikSprite from "./assets/maulkSprite.png";
import tkSprite from "./assets/tkSprite.png";
import { db } from "./firebase";
import Snake from "./Snake/snake.jsx";

// The game states.
const GameState = {
  TITLE: "TITLE",
  CHARACTERSELECT: "CHARACTERSELECT",
  PLAYING: "PLAYING",
  GAME_OVER: "GAME_OVER",
  LEADERBOARD: "LEADERBOARD"
};

// Main function of the game
function App() {
  // GLOBAL VARIABLES // 
  const [gameState, setGameState] = useState(GameState.TITLE);
  const [score, setScore] = useState(0);
  const [character, setCharacter] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]); 
  const [username, setUsername] = useState("");
  const [audio] = useState(new Audio("src/assets/snakeTheme.mp3")); 

  // MUSIC //
  useEffect(() => {
    audio.loop = true; // Loop the audio
    audio.volume = 0.5; // Set the volume to 50%

    // Prints an error in the console if the music doesnt load
    audio.addEventListener('error', () => {
      console.error("Music did not load.");
    });

    // Cleanup for music
    return () => {
      audio.pause();
      audio.currentTime = 0; // Reset audio
    };
  }, [audio]);

  const playMusic = () => {
    audio.play().catch(error => {
      console.error("Playback failed:", error);
    });
  };
  
  // GENERAL FUNCTIONS //

  // Finds the character being used for use of the image on the gameplay page.
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

  // Function to submit a new score to global leaderboard
  const submitScore = async (username, score, character) => {
    try {
      const submissionId = `${username}_${Date.now()}`;
      const scoreRef = doc(db, "leaderboard", submissionId);    
      await setDoc(scoreRef, { username: username, score: score, character: character }); 
      console.log("Score submitted successfully!");
    } catch (error) {
      console.error("Error submitting score: ", error);
    }
  };

  // Handles skipping the submission and returning to title
  const skipScoreSubmission = () => {
    setUsername(""); 
    setGameState(GameState.TITLE);
  };

  // Gets the data from the global leaderboard.
  async function getLeaderboard() {
    const q = query(collection(db, "leaderboard"), orderBy("score", "desc"), limit(10));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  }
  
  // Uses the leaderboard data and puts it as a useable variable. 
  const loadLeaderboard = async () => {
    const data = await getLeaderboard();
    setLeaderboard(data);
    setGameState(GameState.LEADERBOARD);
  };
  
  // Main function that is called on button click.
  const handleScoreSubmission = async () => {
    if (username.trim() === "") {
      alert("Please enter a username to submit your score.");
      return; 
    }
    await submitScore(username, score, character); 
    loadLeaderboard();
  };
  
  // GAMESTATES //

  // Handle Game over
  const gameOver = (finalScore) => {
    setScore(finalScore);
    setGameState(GameState.GAME_OVER); 
  };

  // Handle Game Start
  const startGame = (selectedCharacter) => {
    setScore(0); // Reset score when starting a new game
    setCharacter(selectedCharacter); // Set selected character
    setGameState(GameState.PLAYING);
    playMusic(); // Play music when the game starts
  };

  // Handles character select
  const selectCharacter = () => {
    setGameState(GameState.CHARACTERSELECT);
  };

  // Handle Restart Game
  const restartGame = () => {
    setGameState(GameState.PLAYING);
  };

  // All the HTML based on GameState //

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
            <div className="charContainer">
              <button onClick={() => startGame("Josh")} className="charBtn">
                <img src={joshSprite} className="sprite" alt="Josh" />
              </button>  
              <h4 className="charName">Josh</h4>          
            </div>
            <div className="charContainer">
              <button onClick={() => startGame("TK")} className="charBtn">
                <img src={tkSprite} className="sprite" alt="TK" />
              </button>  
              <h4 className="charName">TK</h4>          
            </div>
            <div className="charContainer">
              <button onClick={() => startGame("Maulik")} className="charBtn">
                <img src={maulikSprite} className="sprite" alt="Maulik" />
              </button>  
              <h4 className="charName">Maulik</h4>          
            </div>
          </div>
        </div>
      )}

      {/* Div for Playing the game */}
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
      {gameState === GameState.GAME_OVER && (
        <div className="screenContainer-gameover">
          <h1>It is what it is.</h1>
          <h2>You Bom-Wipped: {score} Devices Today</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Enter your username"
            className="usernameInput" 
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

      {/* Div for Leaderboard */}
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
