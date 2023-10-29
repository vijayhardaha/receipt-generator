// Import required modules
const { createServer } = require("http");
const PORT = 8080;

// Import the request handler from the 'api/index.js' file
const handleServer = require("./api/index.js");

// Define a callback function for when the server is listening
const handleListen = () => console.log(`Listening on ${PORT}...`);

// Create an HTTP server and start listening on the specified port
createServer(handleServer).listen(PORT, handleListen);
