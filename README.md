# logger

[![NPM version](https://img.shields.io/npm/v/logger.svg?style=flat)](https://www.npmjs.org/package/logger)
[![Build Status](https://travis-ci.org/psfe/logger.svg?branch=master)](https://travis-ci.org/psfe/logger)
[![Coverage Status](https://coveralls.io/repos/github/psfe/logger/badge.svg?branch=master)](https://coveralls.io/github/psfe/logger?branch=master)
[![Dependency manager](https://img.shields.io/david/psfe/logger.svg?style=flat)](https://david-dm.org/psfe/logger)

## Installation

### Node.js

```bash
npm install psfe-logger
```
 
### Browser

```
<script>window.DEBUG="main"</script>
<script src="dist/logger.min.js"></script>
```

## Usage

```javascript
var logger = require('psfe-logger')('main:foo');

logger.log('bar');
// Output:
// [<timestamp>][main:foo] bar

logger.debug('bar')
// Output only when DEBUG equals "main" or "main:foo"
// [<timestamp>][main:foo] bar
```

## API

### logger.debug

debug output respect to `process.env.DEBUG` or `window.DEBUG`.

### logger.info

info level output implemented by `console.info`.

### logger.log

log level output implemented by `console.log`.

### logger.warn

warn level output implemented by `console.warn`.

### logger.error

error level output implemented by `console.error`.

### Format

format string supports: 

* `"%s"`: string output
* `"%d"`: number output
* `"%j"`: json output
* `"%J"`: prettified json output
* `"%%"`: escaped `%`

For example:

```javascript
logger.log('this logger is authored by %j.', { name: 'harttle' });
// Output:
// this logger is authored by {"name":"harttle"}.
```
