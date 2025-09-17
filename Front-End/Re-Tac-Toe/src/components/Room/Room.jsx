import { useEffect, useRef, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";

import { getToken } from "../../services/authToken";
import {
  connect,
  disconnect,
  sendReadyStatus,
  sendMove,
  sendRematchRequest,
  sendRematchResponse,
  subscribeToReadyConfirmation,
  subscribeToGameUpdate,
  subscribeToGameWinUpdate,
  subscribeToRematchRequest,
  subscribeToRematchResponse,
  subscribeToGameForfeit,
} from "../../services/connection";

import Choice from "../Choice/Choice";
import GameBoard from "../GameBoard/GameBoard";
import MatchUpScreen from "../MatchUpScreen/MatchUpScreen";
import "./Room.css";

export default function Room() {
  const { currentPlayer, opponentPlayer } = useLocation().state || {};
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [isConnected, setIsConnected] = useState(false);
  const [isChoosingCompleted, setIsChoosingCompleted] = useState(false);

  const [currentPlayerToken, setCurrentPlayerToken] = useState(null);
  const [opponentPlayerToken, setOpponentPlayerToken] = useState(null);

  const [board, setBoard] = useState(
    Array.from({ length: 9 }, (_, i) => ({ id: i, value: null }))
  );
  const [currentTurn, setCurrentTurn] = useState(null);
  const [myTurn, setMyTurn] = useState(false);
  const [gameStatus, setGameStatus] = useState("");
  const [winningCombination, setWinningCombination] = useState([]);

  const [winner, setWinner] = useState(null);
  const [loser, setLoser] = useState(null);
  const [showWinMessage, setShowWinMessage] = useState(false);
  const [forfeitMessage, setForfeitMessage] = useState(null);

  const [rematchUsername, setRematchUsername] = useState(null);
  const [rematchStatus, setRematchStatus] = useState("idle");
  const [rematchDeclineMessage, setRematchDeclineMessage] = useState(null);

  const [scores, setScores] = useState({});

  const myTurnRef = useRef(myTurn);

  useEffect(() => {
    myTurnRef.current = myTurn;
  }, [myTurn]);

  useEffect(() => {
    if (currentPlayer?.name && opponentPlayer?.name) {
      setScores({
        [currentPlayer.name]: 0,
        [opponentPlayer.name]: 0,
      });
    }
  }, [currentPlayer?.name, opponentPlayer?.name]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      console.error("No auth token found — cannot connect.");
      return;
    }

    const onConnect = () => {
      sendReadyStatus(roomId);

      subscribeToReadyConfirmation((msg) => {
        if (msg === "SUCCESS") setIsConnected(true);
      });

      subscribeToGameUpdate((gameState) => {
        if (gameState.board) {
          const updatedBoard = gameState.board.map((cell, index) => ({
            id: index,
            value: cell === "X" || cell === "O" ? cell : null,
          }));
          setBoard(updatedBoard);
        }

        if (gameState.currentTurn !== undefined) {
          setCurrentTurn(gameState.currentTurn);
        }

        setWinningCombination(gameState.winningCombination || []);
        setMyTurn(gameState.myTurn);
        setGameStatus(gameState.status);

        setRematchStatus("idle");
        setShowWinMessage(false);
        setForfeitMessage(null);
      });

      subscribeToGameWinUpdate((winData) => {
        setWinner(winData.winnerUsername);
        setLoser(winData.loserUsername);
        setWinningCombination(winData.winningCombination);

        setScores((prev) => ({
          ...prev,
          [winData.winnerUsername]: winData.winnerScore,
          [winData.loserUsername]: winData.loserScore,
        }));

        setTimeout(() => {
          setShowWinMessage(true);
        }, 1800);
      });

      subscribeToGameForfeit((forfeitData) => {
        setWinner(forfeitData.winnerUsername);
        setScores((prev) => ({
          ...prev,
          [forfeitData.winnerUsername]: forfeitData.winnerScore,
        }));
        setForfeitMessage(forfeitData.message);
        setShowWinMessage(true);
      });

      subscribeToRematchRequest((data) => {
        setRematchUsername(data.requesterUsername);
        setRematchStatus("pending");
        setRematchDeclineMessage(null);
      });

      subscribeToRematchResponse((data) => {
        if (data.accepted) {
          resetBoardState(); 
        } else {
          setRematchDeclineMessage("Rematch request declined.");
          setRematchStatus("idle");
        }
      });
    };

    connect(token, onConnect);

    return () => {
      disconnect(); 
    };
  }, [roomId, currentPlayer?.name, opponentPlayer?.name]);

  const resetBoardState = () => {
    setBoard(Array.from({ length: 9 }, (_, i) => ({ id: i, value: null })));
    setCurrentTurn(null);
    setMyTurn(false);
    setWinningCombination([]);
    setWinner(null);
    setLoser(null);
    setShowWinMessage(false);
    setForfeitMessage(null);
    setRematchUsername(null);
    setRematchStatus("idle");
    setRematchDeclineMessage(null);
    setGameStatus("");
  };

  const handleCellClick = (cellId) => {
    if (board[cellId].value || !myTurnRef.current) return;
    sendMove({ roomId, cellId, playerToken: currentPlayerToken });
  };

  const handlePlayAgain = () => {
    setRematchStatus("requested");
    sendRematchRequest({ roomId });
  };

  const handleRematchAccept = () => {
    resetBoardState(); 
    sendRematchResponse({ roomId, accepted: true });
  };

  const handleRematchDecline = () => {
    sendRematchResponse({ roomId, accepted: false });
  };

  const handleNewGame = () => {
    disconnect();
    navigate("/", { replace: true });
  };

  const isWinnerCurrent = winner === currentPlayer?.name;
  const showConfetti = showWinMessage && isWinnerCurrent;

  return (
    <main>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={250}
          gravity={0.3}
          recycle={true}
          style={{ position: "fixed", top: 0, zIndex: 9999, pointerEvents: "none" }}
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
            showWinMessage={showWinMessage}
            winner={winner}
            loser={loser}
            forfeitMessage={forfeitMessage}
            onCellClick={handleCellClick}
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
