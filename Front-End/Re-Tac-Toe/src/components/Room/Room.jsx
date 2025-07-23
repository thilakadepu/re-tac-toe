import { useEffect } from "react";
import { useParams } from "react-router-dom";

import Board from "../Board/Board";
import WaitingForOpponent from "../WaitingForOpponent/WaitingForOpponent";
import { connect, sendReadyStatus, subscribeToReadyConfirmation } from "../../services/connection";
import { getToken } from "../../services/authToken";

export default function Room() {
  const { roomId } = useParams();

  useEffect(() => {
    if (!roomId) {
      console.error("No Room ID found in URL.");
      return;
    }

    const token = getToken();
    if (!token) {
      console.error("No token found.");
      return;
    }

    const afterConnected = () => {
      console.log(`Connection successful for room: ${roomId}. Sending ready status...`);
      sendReadyStatus(roomId);
      subscribeToReadyConfirmation((gameStartMessage) => {
        console.log("Game is starting!", gameStartMessage);
      });
    };
    
    connect(token, afterConnected);

  }, [roomId]); 

  return (
    <>
      {/* <WaitingForOpponent /> */}
      <Board />
    </>
  );
}