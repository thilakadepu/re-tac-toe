import './PlayerCard.css'

export default function PlayerCard({src, alt, name}) {
  return (
    <article>
      <img src={src} alt={alt} />
      <p>{name}</p>
    </article>
  )
}