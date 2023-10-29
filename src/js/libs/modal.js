// Define an object for managing modals
const modal = {};

// Define a class name for showing the modal
modal.openClass = "rg-modal-open";

/**
 * Show the modal with animation
 */
modal.open = () => {
	// Add the 'rg-modal-open' class to the body to show the modal
	$(document.body).addClass(modal.openClass);
};

/**
 * Hide the modal
 */
modal.close = () => {
	// Remove the 'rg-modal-open' class from the body to hide the modal
	$(document.body).removeClass(modal.openClass);
};

// Export the 'modal' object as the default export
export default modal;
