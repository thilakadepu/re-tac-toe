import './Cell.css';

export default function Cell({ value, className, disabled, onClick}) {
  return (
    <button
      className={`grid ${className}`}
      onClick={onClick}
      disabled={disabled || !!value}
    >
      {value}
    </button>
  );
}
