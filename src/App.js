// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Board from "./Board";

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8080/api/game")
      .then(response => {
        setBoard(response.data.board);
        setXIsNext(response.data.xIsNext);
      })
      .catch(error => {
        console.error("There was an error fetching the game state!", error);
      });
  }, []);

  const handleClick = (i) => {
    axios.post("http://localhost:8080/api/game/move", { index: i })
      .then(response => {
        setBoard(response.data.board);
        setXIsNext(response.data.xIsNext);
      })
      .catch(error => {
        console.error("There was an error making the move!", error);
      });
  };

  const winner = calculateWinner(board);
  const status = winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? "X" : "O"}`;

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={board} onClick={(i) => handleClick(i)} />
      </div>
      <div className="game-info">
        <div>{status}</div>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default App;
