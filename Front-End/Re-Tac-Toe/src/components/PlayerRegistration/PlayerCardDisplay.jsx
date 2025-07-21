import { motion } from "framer-motion"

import { playerCardVariants, playerCardsContainerVariants } from '../../animation/AnimationVariants';
import { resolveImage } from "../../helpers/imageHelper";
import PlayerCard from "../PlayerCard/PlayerCard";
import { useEffect } from "react";
import { connect, disconnect } from "../../services/connection";
import { getToken } from "../../services/authToken";

export default function PlayerCardDisplay({avatar, player1Name}) {

  useEffect(() => {
    const token = getToken();

    if (token) {
      connect(token);
    } else {
      console.error("Could not get token. User might not be logged in.");
    }

    return () => {
      disconnect()
    }
  }, [])

  return (
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
  )
}