import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

let stompClient = null;

const connect = (jwtToken) => {
  const socket = new SockJS("http://localhost:8080/ws")
  stompClient = Stomp.over(socket)

  const headers = {
    Authorization: `Bearer ${jwtToken}`
  }

  stompClient.connect(headers, () => {
    console.log("Success")

    stompClient.send("/app/hello", {}, "Hello from Front End")
  })

}

const disconnect = () => {
  if (stompClient) {
    stompClient.disconnect()
  }
}

export {connect, disconnect}