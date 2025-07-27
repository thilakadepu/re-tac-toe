import { motion } from "framer-motion";
import { playerCardVariants, playerCardsContainerVariants } from '../../animation/AnimationVariants';
import { resolveImage } from "../../helpers/imageHelper";
import PlayerCard from "../PlayerCard/PlayerCard";

export default function MatchUpScreen({ player1Name, player1Avatar, player2Name, player2Avatar }) {
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
          src={resolveImage(player1Avatar)}
          alt="Player 1 Avatar"
          name={player1Name}
        />
      </motion.div>

      <motion.div
        variants={playerCardVariants}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <PlayerCard
          src={resolveImage(player2Avatar)}
          alt="Player 2 Avatar"
          name={player2Name === '' ? 'Searching...' : player2Name}
        />
      </motion.div>
    </motion.div>
  );
}