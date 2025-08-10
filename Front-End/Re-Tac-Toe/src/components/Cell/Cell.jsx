import './Cell.css';

export default function Cell({ value, onClick, className }) {
  return (
    <button
      className={`grid ${className}`}
      onClick={onClick}
      disabled={!!value}
    >
      {value}
    </button>
  );
}
