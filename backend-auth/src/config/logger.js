import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'taskforge-backend' },
  transports: [
    // Console output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, stack, service, ...meta }) => {
          const extra = stack ? { ...meta, stack } : meta;
          const details = Object.keys(extra).length ? ` ${JSON.stringify(extra)}` : '';
          return `${timestamp} ${level}: ${message}${details}`;
        })
      ),
    }),

    // Error log file
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),

    // Combined log file
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});

export default logger;
