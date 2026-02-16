interface Logger {
  info(msg: string): void;
  error(msg: string): void;
}

export const consoleLogger: Logger = {
  info: console.log,
  error: console.error,
};

enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

function formatTimestamp() {
  return new Date().toISOString();
}

export class RemoteTransport {
  send(log: any) {
    // Send to server
  }
}

