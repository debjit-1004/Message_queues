const Redis = require("ioredis");  //using the ioredis

const connection = new Redis({maxRetriesPerRequest: null});

module.exports = connection;