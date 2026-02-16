import { Server } from "socket.io";

export class WebSocketManager {
  private io: Server;

  constructor(server: any) {
    this.io = new Server(server);
  }

