// Basic ANSI color codes
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

export const logger = {
  info: (msg: string) =>
    console.log(`${colors.green}[INFO]${colors.reset} ${msg}`),

  warn: (msg: string) =>
    console.warn(`${colors.yellow}[WARN]${colors.reset} ${msg}`),
  error: (msg: string) =>
    console.error(`${colors.red}[ERROR]${colors.reset} ${msg}`),
};
