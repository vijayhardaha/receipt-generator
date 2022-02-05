const { createServer } = require( "http" );
const PORT = 8080;
const handleServer = require( "./api/index" );
const handleListen = () => console.log( `Listening on ${PORT}...` );
createServer( handleServer ).listen( PORT, handleListen );