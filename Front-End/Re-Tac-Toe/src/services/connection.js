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

  stompClient.connect(headers, () => {
    if (onConnectCallback) {
      onConnectCallback()
    }
  })
}

const subscribeToGameStart = (onOpponentFound, onOpponentAvatarFound) => {
  if (stompClient && stompClient.connected) {
    stompClient.subscribe('/user/queue/game.start', (message) => {
      const gameRoom = JSON.parse(message.body)
      console.log('Received game.start message:', gameRoom);

      if (gameRoom.opponent && onOpponentFound) {
        onOpponentFound(gameRoom.opponent);
      }
      if (gameRoom.opponentAvatarName && onOpponentAvatarFound) {
        onOpponentAvatarFound(gameRoom.opponentAvatarName);
      }
    })
  } else {
    console.error("STOMP client not connected. Cannot subscribe.")
  }
};

const disconnect = () => {
  if (stompClient) {
    console.log("Disconnected!")
    stompClient.disconnect()
  }
}

export { connect, disconnect, subscribeToGameStart, joinGame }