import { useState, useEffect } from "react";
import GameRoomPlayerCard from "../GameRoomPlayerCard/GameRoomPlayerCard";
import Cell from "../Cell/Cell";
import RematchRequestModal from "../RematchRequestModal/RematchRequestModal";
import { resolveImage } from "../../helpers/imageHelper";
import "./GameBoard.css";

export default function GameBoard({
  currentPlayerName,
  currentPlayerAvatar,
  opponentPlayerName,
  opponentPlayerAvatar,
  currentPlayerToken,
  opponentPlayerToken,
  board = [],
  currentTurn,
  scores = { X: 0, O: 0 },
  winningCombination = [],
  winner = null,
  loser = null,
  onCellClick,
  onPlayAgain,
  onNewGame,
  rematchRequestFromPlayer = null,
  onRematchAccept,
  onRematchDecline,
  rematchStatus = "idle", 
}) {
  const isOpponentRequestingRematch =
    rematchRequestFromPlayer && rematchRequestFromPlayer !== currentPlayerName;

  const renderCells = board.map((cell) => {
    const isWinning = winningCombination.includes(cell.id);
    const cellClass = [
      cell.value ? cell.value.toLowerCase() : "",
      isWinning ? "winning" : "",
    ].join(" ");

    const disabled = !currentTurn || cell.value !== null;

    return (
      <Cell
        key={cell.id}
        value={cell.value}
        className={cellClass}
        disabled={disabled}
        onClick={() => {
          if (!disabled) onCellClick(cell.id);
        }}
      />
    );
  });

  return (
    <div className="background-wrapper">
      <article className="tic-tac-toe-container">
        <div className="board-wrapper">
          <section className="player-container">
            <GameRoomPlayerCard
              name={currentPlayerName}
              score={scores[currentPlayerToken] ?? 0}
              avatar={resolveImage(currentPlayerAvatar)}
              isActive={currentTurn}
              playerClass="player-a"
            />
            <GameRoomPlayerCard
              name={opponentPlayerName}
              score={scores[opponentPlayerToken] ?? 0}
              avatar={resolveImage(opponentPlayerAvatar)}
              isActive={!currentTurn}
              playerClass="player-b"
            />
          </section>

          {/* 1. If rematch requested (you asked for rematch) */}
          {rematchStatus === "requested" && (
            <div className="rematch-requesting-message">
              <span className="spinner" aria-label="Loading">
                ⏳
              </span>
              <p>Waiting for opponent to accept your rematch request...</p>
            </div>
          )}

          {/* 2. If rematch pending (opponent requested rematch, you decide) */}
          {rematchStatus === "pending" && isOpponentRequestingRematch && (
            <RematchRequestModal
              visible={true}
              playerName={rematchRequestFromPlayer}
              onAccept={onRematchAccept}
              onReject={onRematchDecline}
            />
          )}

          {/* 3. If winner exists and no rematch in progress */}
          {winner && rematchStatus === "idle" && (
            <div className="winner-container">
              <h2 className="winner-title">🎉 {winner} won the game!</h2>
              <p className="winner-subtitle">😢 Better luck next time, {loser}.</p>
              <div className="action-buttons">
                <button className="btn play-again-btn" onClick={onPlayAgain}>
                  Play Again
                </button>
                <button className="btn new-game-btn" onClick={onNewGame}>
                  New Game
                </button>
              </div>
            </div>
          )}

          {/* 4. Default: show board only when no rematch modal/waiting/winner */}
          {!winner && rematchStatus === "idle" && (
            <section className="grid-container">{renderCells}</section>
          )}
        </div>
      </article>
    </div>
  );
}