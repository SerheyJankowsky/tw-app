import io, { Socket } from "socket.io-client";

export class SocketConnection {
  private socket: typeof Socket | null = null;

  private createConnection() {
    if (!this.socket) {
      this.socket = io("http://localhost:8080", {
        secure: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      }); // Replace with your server URL
      this.socket!.on("connect", () => {
        console.log("Socket connected:", this.socket?.id);
      });

      this.socket!.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      this.socket!.on("connect_error", (err: any) => {
        console.error("Connection error:", err.message);
        this.tryConnect();
      });
    }
  }

  private tryConnect() {
    if (!this.socket || !this.socket.connected) {
      this.createConnection();
    }
  }

  public subscribe(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  public unsubscribe(event: string, callback: (data: any) => void) {
    this.socket?.off(event, callback);
  }

  public emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }

  public connect() {
    this.createConnection();
  }
}

let socket = new SocketConnection();
export { socket };
