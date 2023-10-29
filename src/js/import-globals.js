// Import the 'jquery' and 'moment' libraries
import jquery from "jquery";
import moment from "moment";

// Assign the imported libraries to global variables
// This makes them accessible in the window scope
export default (window.$ = window.jQuery = jquery, window.moment = moment);
