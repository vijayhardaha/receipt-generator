// Import the 'saveAs' function from the 'file-saver' library
import { saveAs } from "file-saver";

// Define a constant object for download-related functions
const download = {};

/**
 * Convert a base64 string to a Blob.
 * @param {string} uri - base64 string.
 * @return {Blob} - Blob representing the data.
 */
download.base64ToBlob = (uri) => {
  // Decode the base64 string
  const byteString = atob(uri.split(",")[1]);

  // Extract the MIME type from the data URI
  const mimeString = uri.split(",")[0].split(":")[1].split(";")[0];

  // Create an array buffer and populate it with data using array methods
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  // Use forEach to populate the Uint8Array
  byteString.split('').forEach((char, i) => {
    ia[i] = char.charCodeAt(0);
  });

  // Create a Blob with the array buffer and specified MIME type
  const blob = new Blob([ab], { type: mimeString });

  return blob;
};

/**
 * Download a base64 image as a file.
 * @param {string} uri - base64 string.
 */
download.save = (uri = null) => {
  // Check if the URI is empty or not provided
  if (uri === "" || uri === null || typeof uri === "undefined") {
    return false;
  }

  // Get the current date and time
  const date = new Date();
  const time = date.getTime();

  // Convert the base64 string to a Blob
  const blob = download.base64ToBlob(uri);

  // Generate a unique file name based on the timestamp
  const file = `receipt-${time}.png`;

  // Save the Blob as a file with the generated name
  saveAs(blob, file);
};

// Export the 'download' object as the default export
export default download;
