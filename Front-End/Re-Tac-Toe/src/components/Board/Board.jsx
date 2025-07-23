import { useState } from "react"

import Cell from "../Cell/Cell"
import '../Board/Board.css'

export default function Board() {
  const [board, setBoard] = useState([])

  const cellElements = board.map((cell) => {
    return <Cell key={cell.id} />
  })

  return (
    <main>
      <article className="tic-tac-toe-container">
        <section className="player-container">
          <div className="player">
            <p>PLAYER X</p>
            <span>0</span>
          </div>
          <div className="player">
            <p>PLAYER O</p>
            <span>1</span>
          </div>
        </section>
        <section className="grid-container">{cellElements}</section>
      </article>
    </main>
  )
}