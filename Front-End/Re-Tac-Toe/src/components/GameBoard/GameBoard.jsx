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
  scores = {},
  winningCombination = [],
  winner = null,
  loser = null,
  onCellClick,
  showWinMessage,
  forfeitMessage,
  onPlayAgain,
  onNewGame,
  rematchRequestFromPlayer = null,
  onRematchAccept,
  onRematchDecline,
  rematchStatus = "idle",
  rematchDeclineMessage,
}) {
  const isOpponentRequestingRematch =
    rematchRequestFromPlayer && rematchRequestFromPlayer !== currentPlayerName;

  const renderCells = board.map((cell) => {
    const isWinning = winningCombination.includes(cell.id);
    const classes = [cell.value?.toLowerCase(), isWinning ? "winning" : ""]
      .filter(Boolean)
      .join(" ");

    const disabled = !currentTurn || cell.value !== null;

    return (
      <Cell
        key={cell.id}
        value={cell.value}
        className={classes}
        disabled={disabled}
        onClick={() => !disabled && onCellClick(cell.id)}
      />
    );
  });

  const showWinnerScreen = showWinMessage && rematchStatus === "idle";

  return (
    <div className="background-wrapper">
      <article className="tic-tac-toe-container">
        <div className="board-wrapper">
          <section className="player-container">
            <GameRoomPlayerCard
              name={currentPlayerName}
              score={scores[currentPlayerName] ?? 0}
              avatar={resolveImage(currentPlayerAvatar)}
              isActive={currentTurn}
              playerClass="player-a"
            />
            <GameRoomPlayerCard
              name={opponentPlayerName}
              score={scores[opponentPlayerName] ?? 0}
              avatar={resolveImage(opponentPlayerAvatar)}
              isActive={!currentTurn}
              playerClass="player-b"
            />
          </section>

          {showWinnerScreen || rematchDeclineMessage ? (
            <div className="winner-container">
              {showWinMessage && (
                forfeitMessage ? (
                  <h2 className="winner-title">{forfeitMessage}</h2>
                ) : (
                  winner && <h2 className="winner-title">🎉 {winner} won!</h2>
                )
              )}
              {showWinMessage && loser && (
                <p className="winner-subtitle">
                  😢 Better luck next time, {loser}.
                </p>
              )}
              {rematchDeclineMessage && (
                <div className="rematch-decline-notification">
                  {rematchDeclineMessage}
                </div>
              )}
              <div className="action-buttons">
                {!forfeitMessage && (
                  <button className="btn play-again-btn" onClick={onPlayAgain}>
                    Play Again
                  </button>
                )}
                <button className="btn new-game-btn" onClick={onNewGame}>
                  New Game
                </button>
              </div>
            </div>
          ) : rematchStatus === "requested" ? (
            <div className="rematch-requesting-message">
              <span className="spinner" aria-label="Loading">
                ⏳
              </span>
              <p>Waiting for opponent to accept your rematch request…</p>
            </div>
          ) : rematchStatus === "pending" && isOpponentRequestingRematch ? (
            <RematchRequestModal
              visible={true}
              playerName={rematchRequestFromPlayer}
              onAccept={onRematchAccept}
              onReject={onRematchDecline}
            />
          ) : (
            <section className="grid-container">{renderCells}</section>
          )}
        </div>
      </article>
    </div>
  );
}
