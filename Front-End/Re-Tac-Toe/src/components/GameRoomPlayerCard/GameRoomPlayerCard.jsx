import './GameRoomPlayerCard.css';

export default function GameRoomPlayerCard({ name, score, avatar, isActive, playerClass }) {
  return (
    <div className={`player-card ${playerClass} ${isActive ? "active" : ""}`}>
      <img className="avatar" src={avatar} alt={`Player ${name}`} />
      <div className="player-info">
        <p className="player-name" title={name}>{name}</p>
        <p className="player-score">{score}</p>
      </div>
    </div>
  );
}
