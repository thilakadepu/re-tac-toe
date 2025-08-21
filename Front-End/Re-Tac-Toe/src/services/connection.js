import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

let stompClient = null;

const joinGame = (avatar) => {
  if (stompClient && stompClient.connected) {
    stompClient.send('/app/game/join', {}, avatar);
  }
}

const connect = (jwtToken, onConnectCallback) => {
  stompClient = Stomp.over(() => new SockJS("http://localhost:8080/ws"));

  const headers = { Authorization: `Bearer ${jwtToken}` }

  stompClient.debug = () => {};

  stompClient.connect(headers, () => {
    if (onConnectCallback) {
      onConnectCallback()
    }
  })
}

const subscribeToGameStart = (onMatchFound) => {
  if (stompClient && stompClient.connected) {
    stompClient.subscribe('/user/queue/match/found', (message) => {
      const gameRoom = JSON.parse(message.body)
      // console.log("CLIENT RECEIVED: Match found : ", gameRoom);
      if(gameRoom) {
        onMatchFound(gameRoom);
      }
    })
  } else {
    console.error("STOMP client not connected. Cannot subscribe.")
  }
};

const sendReadyStatus = (roomId) => {
  if (stompClient && stompClient.connected) {
    stompClient.send('/app/game/ready', {}, roomId);
  } else {
    console.error("STOMP client not connected. Cannot send ready status.");
  }
};

const subscribeToReadyConfirmation = (handleSubscribeToReadyConfirmation) => {
  if (stompClient && stompClient.connected) {
    stompClient.subscribe('/user/queue/ready/updates', (message) => {
      const data = JSON.parse(message.body);
      handleSubscribeToReadyConfirmation(data); 
    });
  } else {
    console.error("STOMP client not connected. Cannot subscribe for ready confirmation.");
  }
};

const subscribeToChoice = (handleToChoice) => {
  if (stompClient && stompClient.connected) {
    stompClient.subscribe('/user/queue/choice', (message) => {
      const data = JSON.parse(message.body);
      console.log(data);
      handleToChoice(data); 
    });
  } else {
    console.error("STOMP client not connected. Cannot subscribe for ready confirmation.");
  }
}

const sendChoice = (payload) => {
  if (stompClient && stompClient.connected) {
    stompClient.send('/app/game/choice', {}, JSON.stringify(payload));
    console.log(payload);
  } else {
    console.error("STOMP client not connected. Cannot send ready status.");
  }
}

const subscribeToToken = (handleSubscribeToToken) => {
  if (stompClient && stompClient.connected) {
    stompClient.subscribe('/user/queue/token', (message) => {
      const data = JSON.parse(message.body);
      console.log(data);
      handleSubscribeToToken(data); 
    });
  } else {
    console.error("STOMP client not connected. Cannot subscribe for ready confirmation.");
  }
}

const subscribeToGameUpdate = (handleSubscribeToGameUpdate) => {
  if (stompClient && stompClient.connected) {
    stompClient.subscribe('/user/queue/game/update', (message) => {
      const data = JSON.parse(message.body);
      console.log(data);
      handleSubscribeToGameUpdate(data);
    });
  } else {
    console.error("STOMP client not connected. Cannot subscribe for game updates.");
  }
}

const sendMove = (payload) => {
  if (stompClient && stompClient.connected) {
    stompClient.subscribe('app/game/move', {}, JSON.stringify(payload));
  } else {
    console.error("STOMP client not connected. Cannot subscribe for game updates.");
  }
}

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
  subscribeToReadyConfirmation,
  subscribeToChoice,
  sendChoice,
  subscribeToToken,
  subscribeToGameUpdate,
  sendMove
};