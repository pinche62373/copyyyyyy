# Design Decision - Console Logging

## Problem

Our codebase requires consistent a logging implementation to prevent:

- Custom logging methods in different classes
- Mixed usage of `console.log` and `console.error`
- Inconsistent handling of verbosity levels
- Duplicate logging code across files
- No standardized way to handle log levels

## Solution

We have decided to use [winston](https://github.com/winstonjs/winston) as our logging solution.

## Why Winston?

We chose Winston as our logging library because it offers:

1. Typescript support out of the box
2. Strong community maintenance
3. Built-in support for log levels
4. Highly configurable formats and transports
5. Support for both synchronous and asynchronous logging
6. Structured logging with metadata

## Implementation

We centralized our logging configuration in a single file:

```typescript
// .sync/utils/logger.ts
import winston from 'winston';

const log = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

export default log;
```

## Usage

Import and use the logger in any file:

```typescript
import log from './utils/logger';

// Basic logging
log.info("Process started");
log.error("Something went wrong");
log.debug("Debug information");

// Logging with metadata
log.error("Failed to process file", {
  filename: "example.txt",
  error: error.message
});
```

## Log Levels

Winston supports standard log levels in order of priority:

| Level   | Priority | Description               |
|---------|----------|---------------------------|
| error   | 0        | Error conditions          |
| warn    | 1        | Warning conditions        |
| info    | 2        | Normal information        |
| http    | 3        | HTTP request logging      |
| verbose | 4        | Detailed information      |
| debug   | 5        | Debug information         |
| silly   | 6        | Extra detailed debugging  |

## Environment Configuration

Control logging verbosity through the `LOG_LEVEL` environment variable:

```bash
# Local development
LOG_LEVEL=debug npm start

# Production
LOG_LEVEL=info npm start
```

In CI environments:

```yaml
- name: Run tests
  env:
    LOG_LEVEL: debug
  run: npm test
```

Setting a log level shows that level and all levels with higher priority. For example:

- `LOG_LEVEL=debug` shows all logs
- `LOG_LEVEL=info` shows error, warn, and info
- `LOG_LEVEL=error` shows only errors
