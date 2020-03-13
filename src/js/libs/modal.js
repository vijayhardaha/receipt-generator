// jQueru dependency.
import $ from "jquery";

// Helpers functions.
import utils from "./utils";

// Define const.
const modal = {};

// Define modal re-usable variables.
modal.selector = ".md-modal";
modal.body = ".md-modal .md-body";
modal.openClass = "md-open";
modal.openBodyClass = "md--open";

/**
 * Show modal with animation
 */
modal.open = () => {
  $( document.body ).find( modal.selector ).addClass( modal.openClass );
  $( document.body ).addClass( modal.openBodyClass );
  utils.animate( modal.body, "jackInTheBox" );
}

/**
 * Hide modal
 */
modal.close = () => {
  $( document.body ).removeClass( modal.openBodyClass );
  $( document.body ).find( modal.selector ).removeClass( modal.openClass );
}

// Export as default;
export default modal;
