const { getScreenshot } = require( "./chromium" );

const express = require( "express" );
const cors = require( "cors" );
const app = express();

// use it before all route definitions
app.use( cors( { origin: true } ) );

app.use( express.urlencoded( { extended: false } ) );
app.use( express.json() );

// Handler to take screenshots of a URL.
app.post( "/*", async ( req, res ) => {
  try {
    const html = req.body.html;
    if ( html === "" || typeof html === "undefined" ) {
      throw "No Tricks Please!";
    }
    const file = await getScreenshot( html );
    response = res
      .status( 200 )
      .send( { success: true, image: "data:image/png;base64," + file } );
  } catch ( e ) {
    let message = e.message ?
      e.message :
      "Sorry, there was a Server  problem";
    response = res
      .status( 400 )
      .send( { success: false, error: message, e: e } );
  }
  return response;
} );

module.exports = app;