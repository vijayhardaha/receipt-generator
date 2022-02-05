// jquery.inputmask.js dependency.
import "inputmask/dist/jquery.inputmask.min.js";

// Define const.
const utils = {};

// Define error selector.
utils.errorSelector = "#receipt-form .alert";

/**
 * Return true if empty, null or undefined, else false
 */
utils.isEmpty = ( data ) => {
  return data === "" || data === null || typeof data === "undefined";
};

/**
 * Converts new line to br tag.
 */
utils.nl2br = ( str, is_xhtml ) => {
  if ( typeof str === "undefined" || str === null ) {
    return "";
  }
  var breakTag = is_xhtml || typeof is_xhtml === "undefined" ? "<br />" : "<br>";
  return ( str + "" ).replace( /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, "$1" + breakTag + "$2" );
};

/**
 * Display error notice
 * @param {string} message error message text.
 */
utils.showError = ( message = "" ) => {
  const el = $( document.body ).find( utils.errorSelector );
  el.html( message ).removeClass( "d-none" );
};

/**
 * Hide error notice
 */
utils.hideError = () => {
  const el = $( document.body ).find( utils.errorSelector );
  el.empty().addClass( "d-none" );
};

/**
 * Show/Hide loader
 * @param {bool} show show if true else hide.
 */
utils.loader = ( show = true ) => {
  if ( show ) {
    $( document.body ).find( "#receipt-form" ).addClass( "processing" );
  } else {
    $( document.body ).find( "#receipt-form" ).removeClass( "processing" );
  }
};

/**
 * Setup Input mask
 */
utils.setupInputMask = () => {
  $( document.body ).find( ".price-input" ).attr( "data-inputmask", "'alias': 'numeric', 'groupSeparator': ',', 'digits': 2,'digitsOptional': false" ).trigger( "change" );
  $( document.body ).find( ".qty-input" ).attr( "data-inputmask-regex", "[0-9]{1,4}" ).trigger( "change" );
  $( ".input-mask" ).inputmask( {
    showMaskOnHover: false,
    rightAlign: false
  } );
};

/**
 * Setup datepicker.
 */
utils.setupDatePicker = () => {
  $( "#date" ).bootstrapMaterialDatePicker( {
    time: true,
    clearButton: true,
    format: 'DD-MMM-YYYY hh:mm A',
    shortTime: true,
    nowButton: true,
  } );

  $( "#date" ).bootstrapMaterialDatePicker( 'setDate', moment() );
}

// Export as default.
export default utils;