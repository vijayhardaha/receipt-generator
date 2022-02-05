// Define const.
const modal = {};

// Define modal re-usable variables.
modal.openClass = "rg-modal-open";

/**
 * Show modal with animation
 */
modal.open = () => {
  $( document.body ).addClass( modal.openClass );
};

/**
 * Hide modal
 */
modal.close = () => {
  $( document.body ).removeClass( modal.openClass );
};

// Export as default;
export default modal;