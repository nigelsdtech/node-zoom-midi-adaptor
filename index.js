const main = require('./compiled/src/main.js');

main.main();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nReceived shutdown signal');
  process.exit(0);
});