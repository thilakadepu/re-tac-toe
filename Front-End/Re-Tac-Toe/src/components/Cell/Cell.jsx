import './Cell.css';

export default function Cell({ value, className, disabled, onClick }) {
  const isDisabled = disabled || !!value;

  return (
    <button
      className={`grid ${className} ${isDisabled ? "disabled" : ""}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {value}
    </button>
  );
}

