import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom"
import MatchUpScreen from "../MatchUpScreen/MatchUpScreen";

import { getToken } from "../../services/authToken";
import { connect, disconnect, sendReadyStatus, subscribeToReadyConfirmation } from "../../services/connection"

import './Room.css'

export default function Room() {
  const location = useLocation();
  const { currentPlayer, opponentPlayer } = location.state;
  const { roomId } = useParams();
  
  const [isConnected, setIsConnected] = useState('false');

  useEffect(() => {
    const token = getToken();
    if (!token) {
      console.error("Authentication token not found. Cannot connect to the game server.");
      return; 
    }

    const handleSubscribeToReadyConfirmation = (msg) => {
      if (msg === 'SUCCESS') {
        setIsConnected(true);
      }
    }

    const handleSendReady = () => {
      sendReadyStatus(roomId);
      subscribeToReadyConfirmation(handleSubscribeToReadyConfirmation);
    }

    connect(token, handleSendReady);

    return () => {
      disconnect();
    };
  }, [])

  return (
    <main>
      <section className="match-up-screen">
      <MatchUpScreen
        player1Name={currentPlayer.name}
        player1Avatar={currentPlayer.avatarName}
        player2Name={opponentPlayer.name}
        player2Avatar={opponentPlayer.avatarName}
      />
      <button type='submit' className="play-btn">
        Connecting
      </button>
    </section>
    </main>
  )
}