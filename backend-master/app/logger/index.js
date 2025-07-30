const winston = require('winston');
const moment = require('moment');
const fs = require('fs');
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf } = format;

const logBaseDir = 'logs';

// Function to create daily log directory
const getLogDir = () => {
  const logDir = `${logBaseDir}/${moment().format('YYYYMMDD')}`;
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  return logDir;
};

// Custom format for logs
const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create a new logger instance
const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    customFormat
  ),
  transports: [
    new transports.File({
      filename: `${getLogDir()}/error.log`,
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    }),
    new transports.File({
      filename: `${getLogDir()}/combined.log`,
      maxsize: 10485760, // 10MB
      maxFiles: 5
    })
  ]
});

// If in production, log to console as well
if (process.env.NODE_ENV === 'production') {
  logger.add(
    new transports.Console({
      format: combine(
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        customFormat
      )
    })
  );
}

module.exports = logger;
