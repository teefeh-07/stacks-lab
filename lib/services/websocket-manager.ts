import { Server } from "socket.io";

export class WebSocketManager {
  private io: Server;

  constructor(server: any) {
    this.io = new Server(server);
  }

  private clients = new Map<string, any>();

  addClient(id: string, client: any) {
    this.clients.set(id, client);
  }

  broadcast(event: string, data: any) {
    this.io.emit(event, data);
  }

  joinRoom(clientId: string, room: string) {
    const client = this.clients.get(clientId);
    if (client) client.join(room);
  }

  handleDisconnect(clientId: string) {
    this.clients.delete(clientId);
  }
}
