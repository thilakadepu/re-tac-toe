import "./RematchRequestModal.css";

export default function RematchRequestModal({ visible, playerName, onAccept, onReject }) {
  if (!visible) return null;

  return (
    <div className="rematch-modal-overlay">
      <div className="rematch-modal-content">
        <p className="rematch-message">
          <strong>{playerName}</strong> wants a rematch!
        </p>
        <div className="rematch-buttons">
          <button className="btn rematch-accept" onClick={onAccept}>
            Accept
          </button>
          <button className="btn rematch-reject" onClick={onReject}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
