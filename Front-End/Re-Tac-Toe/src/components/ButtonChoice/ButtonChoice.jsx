export default function ButtonChoice({ element, handleSelectChoice, selectedChoice }) {
  return (
    <button
      className={`choice-btn ${element} ${selectedChoice === element ? 'selected' : ''}`}
      onClick={() => handleSelectChoice(element)}
      aria-label={`Select ${element}`}
    >
      {element}
    </button>
  );
}
