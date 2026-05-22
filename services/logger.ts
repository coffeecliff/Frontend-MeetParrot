const isDev = __DEV__;

// 🧪 Para testar modo produção em dev, descomente a linha abaixo:
// const isDev = false;

type LogLevel = 'log' | 'info' | 'warn' | 'error';

const sanitizeData = (data: any): any => {
  if (!data) return data;
  if (typeof data === 'string') return data.length > 50 ? `${data.substring(0, 50)}...` : data;
  if (Array.isArray(data)) return `[Array(${data.length})]`;
  if (typeof data === 'object') {
    const sanitized: any = {};
    const sensitiveKeys = ['token', 'password', 'email', 'senderId', 'userId', 'roomId', 'id'];
    for (const key in data) {
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
        sanitized[key] = '[REDACTED]';
      } else if (key === 'text' || key === 'message') {
        sanitized[key] = typeof data[key] === 'string' && data[key].length > 20 ? `${data[key].substring(0, 20)}...` : data[key];
      } else {
        sanitized[key] = data[key];
      }
    }
    return sanitized;
  }
  return data;
};

const createLogger = (level: LogLevel, prefix: string) => {
  return (...args: any[]) => {
    if (isDev) {
      console[level](prefix, ...args);
    } else {
      const sanitized = args.map(sanitizeData);
      console[level](prefix, ...sanitized);
    }
  };
};

export const logger = {
  auth: {
    log: createLogger('log', '[AUTH]'),
    info: createLogger('info', '[AUTH]'),
    warn: createLogger('warn', '[AUTH]'),
    error: createLogger('error', '[AUTH]'),
  },
  ws: {
    log: createLogger('log', '[WS]'),
    info: createLogger('info', '[WS]'),
    warn: createLogger('warn', '[WS]'),
    error: createLogger('error', '[WS]'),
  },
  chat: {
    log: createLogger('log', '[CHAT]'),
    info: createLogger('info', '[CHAT]'),
    warn: createLogger('warn', '[CHAT]'),
    error: createLogger('error', '[CHAT]'),
  },
  room: {
    log: createLogger('log', '[ROOM]'),
    info: createLogger('info', '[ROOM]'),
    warn: createLogger('warn', '[ROOM]'),
    error: createLogger('error', '[ROOM]'),
  },
};
