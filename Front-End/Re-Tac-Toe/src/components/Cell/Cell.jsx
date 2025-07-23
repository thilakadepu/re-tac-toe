import '../Board/Board.css'

export default function Cell({ value, put}) {
  const styles = {
    color: value === "X" ? "#DCBF3F" : "#72CFF9"
  }

  return(
    <button onClick={put} style={styles} className="grid">{value}</button>
  )
}