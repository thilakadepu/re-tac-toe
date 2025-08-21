import GameRoomPlayerCard from "../GameRoomPlayerCard/GameRoomPlayerCard";
import Cell from "../Cell/Cell";
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
  onCellClick,
}) {
  const cellElements = (Array.isArray(board) ? board : []).map((cell) => {
    const cellClass = cell.value ? cell.value.toLowerCase() : "";
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
              isActive={currentTurn === currentPlayerToken}
              playerClass="player-a"
            />
            <GameRoomPlayerCard
              name={opponentPlayerName}
              score={scores[opponentPlayerToken] ?? 0}
              avatar={resolveImage(opponentPlayerAvatar)}
              isActive={currentTurn === opponentPlayerToken}
              playerClass="player-b"
            />
          </section>
          <section className="grid-container">{cellElements}</section>
          <div className="action-buttons">
            <button className="btn play-again-btn" disabled>
              Play Again
            </button>
            <button className="btn new-game-btn" disabled>
              New Game
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
