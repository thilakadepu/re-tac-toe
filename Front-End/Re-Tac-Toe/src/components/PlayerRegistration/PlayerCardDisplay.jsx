import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRandomImageName } from '../../helpers/imageHelper';
import MatchUpScreen from '../MatchUpScreen/MatchUpScreen';
import useMatchmaking from '../../hooks/useMatchmaking';

export default function PlayerCardDisplay({ avatar, player1Name, setIsMatchFound }) {
  const [player2Avatar, setPlayer2Avatar] = useState(getRandomImageName());
  const navigate = useNavigate();

  const { isMatchFound, opponent, roomId } = useMatchmaking(avatar, player1Name, () => {
    setIsMatchFound(true);
  });

  useEffect(() => {
    if (opponent.name && roomId) {
      const timeout = setTimeout(() => {
        navigate(`/room/${roomId}`, {
          state: {
            currentPlayer: {
              name: player1Name,
              avatarName: avatar
            },
            opponentPlayer: {
              name: opponent.name,
              avatarName: opponent.avatarName
            }
          }
        });
      }, 1750);
      return () => clearTimeout(timeout);
    }
  }, [opponent, roomId]);

  useEffect(() => {
    if (!opponent.name) {
      const interval = setInterval(() => {
        setPlayer2Avatar(getRandomImageName());
      }, 999);
      return () => clearInterval(interval);
    }
  }, [opponent]);

  return (
    <MatchUpScreen
      player1Name={player1Name}
      player1Avatar={avatar}
      player2Name={opponent.name}
      player2Avatar={opponent.avatarName || player2Avatar}
    />
  );
}
