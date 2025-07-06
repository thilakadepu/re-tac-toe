import { Form, Formik } from 'formik';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomImageName, resolveImage } from '../../helpers/imageHelper';
import { editableCardMotion, playerCardVariants, playerCardsContainerVariants} from '../../animation/AnimationVariants';

import PlayerCard from '../PlayerCard/PlayerCard';
import PlayerEditableCard from '../PlayerCard/PlayerEditableCard';
import '../PlayerRegistration/PlayerRegistration.css';

export default function PlayerRegistration() {
  const [avatar, setAvatar] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [player1Name, setPlayer1Name] = useState(null)

  const handleSubmit = (values) => {
    setPlayer1Name(values.name)
    setIsSubmitted(true)
  }

  useEffect(() => {
    setAvatar(getRandomImageName());
  }, [])

  return (
    <main>
      <Formik 
        initialValues={{name: ''}}
        onSubmit={handleSubmit}
      >
        <Form className={`transition-wrapper ${isSubmitted ? 'show' : 'hide'} registration-form`}>
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="editable"
                  initial={editableCardMotion.initial}
                  animate={editableCardMotion.animate}
                  exit={editableCardMotion.exit}
                  transition={editableCardMotion.transition}
                >
                  <PlayerEditableCard
                    src={resolveImage(avatar)}
                    alt="Player 1"
                    name="name"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="cards"
                  className="player-cards"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={playerCardsContainerVariants}
                >
                  <motion.div
                    variants={playerCardVariants}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <PlayerCard
                      src={resolveImage(avatar)}
                      alt="Player 1"
                      name={player1Name}
                    />
                  </motion.div>

                  <motion.div
                    variants={playerCardVariants}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <PlayerCard
                      src={resolveImage(avatar)}
                      alt="Player 2"
                      name="Player 2"
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            <button type='submit' className="play-btn">
              {!isSubmitted ? "Play" : "Connecting ..."}
            </button>
          </Form>
      </Formik>
    </main>
  );
}
