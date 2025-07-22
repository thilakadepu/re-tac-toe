import { motion } from "framer-motion"

import { playerCardVariants, playerCardsContainerVariants } from '../../animation/AnimationVariants';
import { resolveImage, getRandomImageName} from "../../helpers/imageHelper";
import PlayerCard from "../PlayerCard/PlayerCard";
import { useEffect, useState } from "react";
import { connect, disconnect, subscribeToGameStart, joinGame} from "../../services/connection";
import { getToken } from "../../services/authToken";

export default function PlayerCardDisplay({avatar, player1Name, setIsConnected}) {
  const [player2Avatar, setPlayer2Avatar] = useState(getRandomImageName())
  const [player2Name, setPlayer2Name] = useState('')

  useEffect(() => {
    const token = getToken();
    if (!token) {
      console.error("Could not get token");
      return; 
    }

    const handleOpponentFound = (name) => {
      setPlayer2Name(name);
      setIsConnected(true)
    };
    
    const handleOpponentAvatarFound = (avatarFound) => {
      setPlayer2Avatar(avatarFound.trim())
    }

    const afterConnected = () => {
      subscribeToGameStart(handleOpponentFound, handleOpponentAvatarFound);
      joinGame(avatar)
    };
    
    connect(token, afterConnected);

    return () => {
      disconnect();
      setIsConnected(false)
    };
  }, [avatar, player1Name, setIsConnected]);

  useEffect(() => {
    if (player2Name === '') {
      const intervalId = setInterval(() => {
        setPlayer2Avatar(getRandomImageName());
      }, 999);

      return () => clearInterval(intervalId)
    }

  }, [player2Name])

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
          src={resolveImage(player2Avatar)}
          alt="Player 2"
          name={player2Name === '' ? 'Searching ..' : player2Name}
        />
      </motion.div>
    </motion.div>
  )
}