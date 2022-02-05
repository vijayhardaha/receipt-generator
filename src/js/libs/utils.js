// jQueru dependency.
import $ from "jquery";

// Tippy.js dependency.
import tippy, { roundArrow } from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/dist/svg-arrow.css";
import "tippy.js/animations/perspective.css";

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
 * Returns current timestamp
 */
utils.getTime = () => {
  const date = new Date();
  return date.getTime();
};

/**
 * Animate element
 * @param {string} selector css selector.
 * @param {cls} string animatation effect class name.
 */
utils.animate = ( selector, cls = "bounceIn" ) => {
  const _cls = cls + " animated";
  $( document.body )
    .find( selector )
    .removeClass( _cls )
    .addClass( _cls )
    .one(
      "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
      ( e ) => {
        $( e.currentTarget ).removeClass( _cls );
      }
    );
};

/**
 * Display error notice
 * @param {string} message error message text.
 */
utils.showError = ( message = "" ) => {
  const el = $( document.body ).find( utils.errorSelector );
  el.html( message ).addClass( "show" );
  utils.animate( utils.errorSelector, "bounceIn" );
};

/**
 * Hide error notice
 */
utils.hideError = () => {
  const el = $( document.body ).find( utils.errorSelector );
  el.empty().removeClass( "show" );
};

/**
 * Show/Hide loader
 * @param {bool} show show if true else hide.
 */
utils.loader = ( show = true ) => {
  if ( show ) {
    $( document.body ).find( "#loader" ).addClass( "visible" );
  } else {
    $( document.body ).find( "#loader" ).removeClass( "visible" );
  }
};

/**
 * Setup Input mask
 */
utils.setupInputMask = () => {
  $( document.body )
    .find( ".price-input" )
    .attr(
      "data-inputmask",
      "'alias': 'numeric', 'groupSeparator': ',', 'digits': 2,'digitsOptional': false, 'placeholder': '0'"
    )
    .change();
  $( document.body )
    .find( ".qty-input" )
    .attr( "data-inputmask-regex", "[0-9]{1,4}" )
    .change();
  $( ":input" ).inputmask( {
    showMaskOnHover: false,
  } );
};

/**
 * Setup Tippy tooltip
 */
utils.setupTippy = () => {
  if ( $( document.body ).find( ".has-tooltip" ).length > 0 ) {
    tippy( ".has-tooltip", {
      delay: 0,
      arrow: roundArrow,
      animation: "perspective",
      placement: "top",
    } );
  }
};

/**
 * Setup required features
 */
utils.setup = () => {
  utils.setupInputMask();
  utils.setupTippy();
};

// Export as default.
export default utils;