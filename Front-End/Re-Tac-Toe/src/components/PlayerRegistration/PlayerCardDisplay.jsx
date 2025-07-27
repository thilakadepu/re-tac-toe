import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRandomImageName} from "../../helpers/imageHelper";
import { connect, disconnect, subscribeToGameStart, joinGame} from "../../services/connection";
import { getToken } from "../../services/authToken";
import MatchUpScreen from "../MatchUpScreen/MatchUpScreen";

export default function PlayerCardDisplay({avatar, player1Name, setIsMatchFound}) {
  const [player2Avatar, setPlayer2Avatar] = useState(getRandomImageName());
  const [player2Name, setPlayer2Name] = useState('');
  const [roomId, setRoomId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      console.error("Authentication token not found. Cannot connect to the game server.");
      return; 
    }

    const handleMatchFound = (data) => {
      setPlayer2Avatar(data.opponentPlayerAvatarName);
      setPlayer2Name(data.opponentPlayerName);
      setRoomId(data.roomId);
      setIsMatchFound(true);
    }

    const afterConnected = () => {
      joinGame(avatar);
      subscribeToGameStart(handleMatchFound);
    };
    
    connect(token, afterConnected);

    return () => {
      disconnect();
      setIsMatchFound(false)
    };
  }, []);

  useEffect(() => {
    if (player2Name && roomId) {
      const navigationTimeout = setTimeout(() => {
        navigate(`/room/${roomId}`, { 
          state: {
            currentPlayer: {
              name: player1Name,
              avatarName: avatar
            },
            opponentPlayer: {
              name: player2Name,
              avatarName: player2Avatar
            }
          }
        });
      }, 1750); 

      return () => clearTimeout(navigationTimeout);
    }
  }, [player2Name, roomId, navigate]);

  useEffect(() => {
    if (player2Name === '') {
      const avatarInterval = setInterval(() => {
        setPlayer2Avatar(getRandomImageName());
      }, 999);

      return () => clearInterval(avatarInterval);
    }
  }, [player2Name])

  return (
    <MatchUpScreen
      player1Name={player1Name}
      player1Avatar={avatar}
      player2Name={player2Name}
      player2Avatar={player2Avatar}
    />
  )
}