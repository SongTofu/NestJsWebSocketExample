import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server;

  @SubscribeMessage("message")
  //  handleMessage(@MessageBody() message: string): void {
  handleMessage(client: Socket, message: string): void {
    console.log("client", client.id);
    console.log("message", message);
    this.server.emit("message", message);
  }

  @SubscribeMessage("join")
  //  handleMessage(@MessageBody() message: string): void {
  handleJoin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: { data: string },
  ): void {
    //console.log("sock", socket);
    console.log("message", "join " + body.data);
    socket.join(body.data);
    this.server.in(body.data).emit("message", "join " + body.data);
  }

  @SubscribeMessage("leave")
  //  handleMessage(@MessageBody() message: string): void {
  handleLeave(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: { data: string },
  ): void {
    //console.log("sock", socket);
    console.log("message", "leave " + body.data);
    socket.leave(body.data);
    this.server.in(body.data).emit("message", "leave " + body.data);
  }
}
