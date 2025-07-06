import { Form, Formik } from 'formik';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomImageName, resolveImage } from '../../helpers/imageHelper';
import { editableCardMotion, playerCardVariants, playerCardsContainerVariants} from '../../animation/AnimationVariants';

import PlayerCard from '../PlayerCard/PlayerCard';
import PlayerEditableCard from '../PlayerCard/PlayerEditableCard';
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
