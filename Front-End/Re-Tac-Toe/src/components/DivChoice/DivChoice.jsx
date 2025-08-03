export default function DivChoice({ element, extraClass = "" }) {
  return (
    <div className={`choice-btn ${element} ${extraClass}`}>{element}</div>
  );
}