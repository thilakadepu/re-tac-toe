import { motion } from 'framer-motion';

import { editableCardMotion } from '../../animation/AnimationVariants';
import PlayerEditableCard from '../PlayerCard/PlayerEditableCard';
import { resolveImage } from '../../helpers/imageHelper';

export default function EditablePlayerCardSection({avatar, isDuplicateUserName}) {
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
        isDuplicateUserName = {isDuplicateUserName}
        name="name"
      />
    </motion.div>
  )
}