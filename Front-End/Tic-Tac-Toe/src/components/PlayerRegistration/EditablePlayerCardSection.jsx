import { motion } from 'framer-motion';

import { editableCardMotion } from '../../animation/AnimationVariants';
import PlayerEditableCard from '../PlayerCard/PlayerEditableCard';
import { resolveImage } from '../../helpers/imageHelper';

export default function EditablePlayerCardSection({avatar}) {
  return (
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
  )
}