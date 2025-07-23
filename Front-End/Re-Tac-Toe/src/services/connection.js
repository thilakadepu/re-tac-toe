import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

let stompClient = null;

const joinGame = (avatar) => {
  if (stompClient && stompClient.connected) {
    stompClient.send('/app/game.join', {}, avatar);
  }
}

const connect = (jwtToken, onConnectCallback) => {
  const socket = new SockJS("http://localhost:8080/ws")
  stompClient = Stomp.over(socket)
  const headers = { Authorization: `Bearer ${jwtToken}` }

  stompClient.debug = () => {};

  stompClient.connect(headers, () => {
    if (onConnectCallback) {
      onConnectCallback()
    }
  })
}

const subscribeToGameStart = (onOpponentFound, onOpponentAvatarFound, onId) => {
  if (stompClient && stompClient.connected) {
    stompClient.subscribe('/user/queue/match.found', (message) => {
      const gameRoom = JSON.parse(message.body)
      // console.log('Received match.found message:', gameRoom);

      const preGameData = JSON.parse(message.body);
      console.log("CLIENT RECEIVED: Match found with ID: ", preGameData.roomId);

      if (gameRoom.opponent && onOpponentFound) {
        onOpponentFound(gameRoom.opponent);
      }
      if (gameRoom.opponentAvatarName && onOpponentAvatarFound) {
        onOpponentAvatarFound(gameRoom.opponentAvatarName);
      }

      if(gameRoom.id && onId) {
        onId(gameRoom.id);
      }

    })
  } else {
    console.error("STOMP client not connected. Cannot subscribe.")
  }
};

const sendReadyStatus = (roomId) => {
  if (stompClient && stompClient.connected) {
    const destination = '/app/game.ready';
    const payload = roomId;
    
    console.log(`Sending 'ready' status for room: ${roomId}`);
    stompClient.send(destination, {}, payload);
  } else {
    console.error("STOMP client not connected. Cannot send ready status.");
  }
};

const subscribeToReadyConfirmation = (onGameReadyCallback) => {
  if (stompClient && stompClient.connected) {
    const destination = '/user/queue/ready.updates'; // As requested.
    
    stompClient.subscribe(destination, (message) => {
      const parsedMessage = JSON.parse(message.body);
      console.log('Received a message on the subscribed queue:', parsedMessage);

      // You'll need to know what message the server sends to confirm the game is starting.
      // For example, it might be a message with a specific status.
      // This is a placeholder for that logic.
      if (parsedMessage.status === 'GAME_STARTING' && onGameReadyCallback) {
        onGameReadyCallback(parsedMessage);
      }
    });
  } else {
    console.error("STOMP client not connected. Cannot subscribe for ready confirmation.");
  }
};

const disconnect = () => {
  if (stompClient) {
    console.log("Disconnected!")
    stompClient.disconnect()
  }
}

export {
  connect,
  disconnect,
  subscribeToGameStart,
  joinGame,
  sendReadyStatus,
  subscribeToReadyConfirmation
};