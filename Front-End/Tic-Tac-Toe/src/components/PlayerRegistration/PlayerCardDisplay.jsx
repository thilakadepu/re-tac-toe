import { motion } from "framer-motion"

import { playerCardVariants, playerCardsContainerVariants } from '../../animation/AnimationVariants';
import { resolveImage } from "../../helpers/imageHelper";
import PlayerCard from "../PlayerCard/PlayerCard";

export default function PlayerCardDisplay({avatar, player1Name}) {
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