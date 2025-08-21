import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import MatchUpScreen from "../MatchUpScreen/MatchUpScreen";

import { getToken } from "../../services/authToken";
import {
  connect,
  sendReadyStatus,
  subscribeToReadyConfirmation,
  sendMove,
  subscribeToGameUpdate
} from "../../services/connection";

import "./Room.css";
import Choice from "../Choice/Choice";
import GameBoard from "../GameBoard/GameBoard";

export default function Room() {
  const location = useLocation();
  const { currentPlayer, opponentPlayer } = location.state;
  const { roomId } = useParams();

  const [isConnected, setIsConnected] = useState(false);
  const [isChoosingCompleted, setIsChoosingCompleted] = useState(false);
  const [currentPlayerToken, setCurrentPlayerToken] = useState(null);
  const [opponentPlayerToken, setOpponentPlayerToken] = useState(null);

  const [board, setBoard] = useState(
    Array.from({ length: 9 }, (_, i) => ({ id: i, value: null }))
  );

  const [currentTurn, setCurrentTurn] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  useEffect(() => {
    const token = getToken();
    if (!token) {
      console.error("No auth token found — cannot connect.");
      return;
    }

    const onReadyConfirmed = (msg) => {
      if (msg === "SUCCESS") setIsConnected(true);
    };

    const onConnect = () => {
      sendReadyStatus(roomId);
      subscribeToReadyConfirmation(onReadyConfirmed);
    };

    connect(token, onConnect);

    return () => {

    };
  }, [roomId]);

  useEffect(() => {
    const handleGameUpdate = (gameState) => {
      if (gameState.board) {
        const updatedBoard = gameState.board.map((cell, index) => ({
          id: index,
          value: cell === "X" || cell === "O" ? cell : null,
        }));
        setBoard(updatedBoard);
      }

      if (gameState.currentTurn) {
        setCurrentTurn(gameState.currentTurn);
      }

      if (gameState.scores) {
        setScores(gameState.scores);
      }
    };

    
  }, []);

  const handleCellClick = (cellId) => {
    if (!currentTurn || board[cellId].value) {
      return;
    }

    sendMove({
      roomId,
      cellId,
      playerToken: currentPlayerToken,
    });
  };


  return (
    <main>
      {!isConnected ? (
        !isChoosingCompleted ? (
          <Choice
            currentPlayerName={currentPlayer.name}
            roomId={roomId}
            setBoard={setBoard}
            setCurrentTurn={setCurrentTurn}
            onChoiceComplete={() => setIsChoosingCompleted(true)}
            onSetCurrentPlayerToken={setCurrentPlayerToken}
            onSetOpponentPlayerToken={setOpponentPlayerToken}
          />
        ) : (
          <GameBoard
            currentPlayerName={currentPlayer.name}
            currentPlayerAvatar={currentPlayer.avatarName}
            opponentPlayerName={opponentPlayer.name}
            opponentPlayerAvatar={opponentPlayer.avatarName}
            currentPlayerToken={currentPlayerToken}
            opponentPlayerToken={opponentPlayerToken}
            board={board}
            currentTurn={currentTurn}
            scores={scores}
            onCellClick={handleCellClick}
          />
        )
      ) : (
        <section className="match-up-screen">
          <MatchUpScreen
            player1Name={currentPlayer.name}
            player1Avatar={currentPlayer.avatarName}
            player2Name={opponentPlayer.name}
            player2Avatar={opponentPlayer.avatarName}
          />
          <button type="button" className="play-btn">
            Connecting...
          </button>
        </section>
      )}
    </main>
  );
}
