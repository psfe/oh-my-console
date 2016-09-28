// Run this by: 
//  DEBUG=main node index.js
//  DEBUG=main:sub node index.js
var Logger = require('../..');

console.log('Functional Test:');

var logger = Logger('functional-test');
logger.log('some information');
logger.info('some information');
logger.warn('some information');
logger.error('there was an error');

console.log('\nDEBUG test:');

var mainlogger = Logger('main');
var sublogger = Logger('main:sub');
mainlogger.debug('matches main');
sublogger.debug('matches main, main:sub');
