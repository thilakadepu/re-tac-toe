import { useEffect, useState } from 'react';
import { connect, joinGame, subscribeToGameStart } from '../services/connection';
import { getToken } from '../services/authToken';

export default function useMatchmaking(playerAvatar, playerName, onMatchFound) {
  const [isMatchFound, setIsMatchFound] = useState(false);
  const [opponent, setOpponent] = useState({ name: '', avatarName: '' });
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      console.error("No auth token — cannot connect to game server");
      return;
    }

    const handleMatch = (data) => {
      setOpponent({
        name: data.opponentPlayerName,
        avatarName: data.opponentPlayerAvatarName
      });
      setRoomId(data.roomId);
      setIsMatchFound(true);
      onMatchFound?.(data);
    };

    const afterConnected = () => {
      joinGame(playerAvatar);
      subscribeToGameStart(handleMatch);
    };

    connect(token, afterConnected);

    return () => {
      setIsMatchFound(false);
    };
  }, [playerAvatar, playerName]);

  return { isMatchFound, opponent, roomId };
}
