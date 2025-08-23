import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Confetti from "react-confetti";

import { getToken } from "../../services/authToken";
import {
  connect,
  sendReadyStatus,
  subscribeToReadyConfirmation,
  sendMove,
  subscribeToGameUpdate,
  subscribeToGameWinUpdate,
  sendRematchRequest,
  subscribeToRematchRequest,
  sendRematchResponse,
  subscribeToRematchResponse
} from "../../services/connection";

import Choice from "../Choice/Choice";
import GameBoard from "../GameBoard/GameBoard";
import MatchUpScreen from "../MatchUpScreen/MatchUpScreen";
import "./Room.css";

export default function Room() {
  const location = useLocation();
  const { currentPlayer, opponentPlayer } = location.state;
  const { roomId } = useParams();

  const [isConnected, setIsConnected] = useState(false);
  const [isChoosingCompleted, setIsChoosingCompleted] = useState(false);
  const [currentPlayerToken, setCurrentPlayerToken] = useState(null);
  const [opponentPlayerToken, setOpponentPlayerToken] = useState(null);
  const [myTurn, setMyTurn] = useState(false);
  const [gameStatus, setGameStatus] = useState('');
  const [winningCombination, setWinningCombination] = useState([]);
  const [winner, setWinner] = useState(null);
  const [loser, setLoser] = useState(null);
  const [showWinMessage, setShowWinMessage] = useState(false);

  const [rematchUsername, setRematchUsername] = useState(null);
  const [rematchStatus, setRematchStatus] = useState("idle");
  const [rematchDeclineMessage, setRematchDeclineMessage] = useState(null);

  const myTurnRef = useRef(myTurn);

  const [board, setBoard] = useState(
    Array.from({ length: 9 }, (_, i) => ({ id: i, value: null }))
  );

  const [currentTurn, setCurrentTurn] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  useEffect(() => {
    myTurnRef.current = myTurn;
  }, [myTurn]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      console.error("No auth token found — cannot connect.");
      return;
    }

    const onReadyConfirmed = (msg) => {
      if (msg === "SUCCESS") setIsConnected(true);
    };

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

      if (gameState.winningCombination) {
        setWinningCombination(gameState.winningCombination);
      } else {
        setWinningCombination([]);
      }

      setRematchStatus("idle");
      setMyTurn(gameState.myTurn);
      setGameStatus(gameState.status);
    };

    const handleGameWin = (winData) => {
      setWinner(winData.winnerUsername);
      setLoser(winData.loserUsername);
      setWinningCombination(winData.winningCombination);

      setTimeout(() => {
        setShowWinMessage(true);
      }, 1800);
    };

    const handleRematchRequest = (data) => {
      setRematchUsername(data.requesterUsername);
      setRematchStatus("pending");
      setRematchDeclineMessage(null);
    };

    const handleRematchResponse = (data) => {
      if (data.accepted) {
        setWinner(null);
        setLoser(null);
        setShowWinMessage(false);
        setRematchUsername(null);
        setRematchStatus("idle");
        setRematchDeclineMessage(null);
        setBoard(Array.from({ length: 9 }, (_, i) => ({ id: i, value: null })));
        setWinningCombination([]);
        setGameStatus("");
      } else {
        setRematchUsername(null);
        setRematchStatus("idle");
        setRematchDeclineMessage("Rematch request declined.");
      }
    };

    const onConnect = () => {
      sendReadyStatus(roomId);
      subscribeToReadyConfirmation(onReadyConfirmed);
      subscribeToGameUpdate(handleGameUpdate);
      subscribeToGameWinUpdate(handleGameWin);
      subscribeToRematchRequest(handleRematchRequest);
      subscribeToRematchResponse(handleRematchResponse);
    };

    connect(token, onConnect);
  }, [roomId]);

  const handleCellClick = (cellId) => {
    if (board[cellId].value || !myTurnRef.current) return;

    const payload = {
      roomId,
      cellId,
      playerToken: currentPlayerToken,
    };

    sendMove(payload);
  };

  const handlePlayAgain = () => {
    setShowWinMessage(false);
    setWinner(null);
    setLoser(null);
    setRematchDeclineMessage(null);
    setRematchStatus("requested");
    sendRematchRequest({ roomId });
  };

  const handleNewGame = () => {
    console.log("New Game clicked");
  };

  const handleRematchAccept = () => {
    sendRematchResponse({ roomId, accepted: true });

    setWinner(null);
    setLoser(null);
    setShowWinMessage(false);
    setRematchUsername(null);
    setRematchStatus("idle");
    setRematchDeclineMessage(null);
    setBoard(Array.from({ length: 9 }, (_, i) => ({ id: i, value: null })));
    setWinningCombination([]);
  };

  const handleRematchDecline = () => {
    sendRematchResponse({ roomId, accepted: false });
    setRematchStatus("idle");
    setRematchUsername(null);
  };

  const isWinner = winner === currentPlayer.name;
  const shouldShowConfetti = showWinMessage && isWinner;

  return (
    <main>
      {shouldShowConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={250}
          gravity={0.3}
          recycle={true}
          style={{
            position: "fixed",
            top: 0,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        />
      )}

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
            winningCombination={winningCombination}
            onCellClick={handleCellClick}
            winner={showWinMessage ? winner : null}
            loser={showWinMessage ? loser : null}
            onPlayAgain={handlePlayAgain}
            onNewGame={handleNewGame}
            rematchRequestFromPlayer={rematchUsername}
            onRematchAccept={handleRematchAccept}
            onRematchDecline={handleRematchDecline}
            rematchStatus={rematchStatus}
            rematchDeclineMessage={rematchDeclineMessage}
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
