// Dependency for downloading file.
import { saveAs } from "file-saver";

// Define const.
const download = {};

/**
 * Convert base64 to Blob.
 * @param {string} uri base64 string.
 * @return {Blob}
 */
download.base64ToBlob = ( uri ) => {
  var byteString = atob( uri.split( "," )[ 1 ] );
  var mimeString = uri.split( "," )[ 0 ].split( ":" )[ 1 ].split( ";" )[ 0 ];
  var ab = new ArrayBuffer( byteString.length );
  var ia = new Uint8Array( ab );
  for ( var i = 0; i < byteString.length; i++ ) {
    ia[ i ] = byteString.charCodeAt( i );
  }
  var blob = new Blob( [ ab ], { type: mimeString } );
  return blob;
};

/**
 * Download base64 image.
 * @param {string} uri base64 string.
 */
download.save = ( uri = null ) => {
  if ( uri === "" || uri === null || typeof uri === "undefined" ) {
    return false;
  }
  const date = new Date();
  const blob = download.base64ToBlob( uri );
  const time = date.getTime();
  const file = `recipt-${time}.png`;
  saveAs( blob, file );
};

// Export as default.
export default download;