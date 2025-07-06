import { useField } from 'formik'

import './PlayerCard.css'
import './PlayerEditableCard.css'

export default function PlayerEditableCard({src, alt, name}) {
  const [field] = useField(name)

  return (
    <article>
      <img src={src} alt={alt} />
      <input
        {...field}
        className='name-input'
        type="text"
        placeholder="Enter player name"
      />
    </article>
  )
}