import { useField } from 'formik'

import './PlayerCard.css'
import './PlayerEditableCard.css'

export default function PlayerEditableCard({src, alt, isDuplicateUserName, name}) {
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
      <div className='error-div'>
        {isDuplicateUserName && <p className='error-player-name'>Player name already exists</p>}  
      </div>
    </article>
  )
}