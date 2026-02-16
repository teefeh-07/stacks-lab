interface Logger {
  info(msg: string): void;
  error(msg: string): void;
}

export const consoleLogger: Logger = {
  info: console.log,
  error: console.error,
};

