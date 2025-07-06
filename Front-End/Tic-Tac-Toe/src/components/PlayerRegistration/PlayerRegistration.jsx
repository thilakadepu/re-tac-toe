import { useState, useEffect } from 'react';
import { getRandomImageName} from '../../helpers/imageHelper';

import RegistrationForm from './RegistrationForm';
import '../PlayerRegistration/PlayerRegistration.css';

export default function PlayerRegistration() {

  const [avatar, setAvatar] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [player1Name, setPlayer1Name] = useState(null)

  useEffect(() => {
      setAvatar(getRandomImageName());
  }, [])

  const handleSubmit = (values) => {
    setPlayer1Name(values.name)
    setIsSubmitted(true)
  }

  return (
    <main>
      <RegistrationForm
        avatar={avatar}
        isSubmitted={isSubmitted}
        player1Name={player1Name}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
