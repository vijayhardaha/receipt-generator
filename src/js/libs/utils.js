// Import the 'jquery.inputmask.js' dependency
import "inputmask/dist/jquery.inputmask.min.js";

// Define an object for utility functions
const utils = {};

// Define the error selector
utils.errorSelector = "#receipt-form .alert";

/**
 * Check if data is empty, null, or undefined.
 * @param {any} data - Data to be checked.
 * @return {boolean} - True if empty, null, or undefined; else false.
 */
utils.isEmpty = (data) => {
	return data === "" || data === null || typeof data === "undefined";
};

/**
 * Convert newline characters to <br> tags.
 * @param {string} str - Input string.
 * @param {boolean} is_xhtml - Flag for XHTML compatibility.
 * @return {string} - Converted string with <br> tags.
 */
utils.nl2br = (str, is_xhtml) => {
	if (typeof str === "undefined" || str === null) {
		return "";
	}
	const breakTag =
		is_xhtml || typeof is_xhtml === "undefined" ? "<br />" : "<br>";
	return (str + "").replace(
		/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
		"$1" + breakTag + "$2"
	);
};

/**
 * Display an error notice.
 * @param {string} message - Error message text.
 */
utils.showError = (message = "") => {
	const el = $(document.body).find(utils.errorSelector);
	el.html(message).removeClass("d-none");
};

/**
 * Hide the error notice.
 */
utils.hideError = () => {
	const el = $(document.body).find(utils.errorSelector);
	el.empty().addClass("d-none");
};

/**
 * Show/Hide loader.
 * @param {boolean} show - Show if true, else hide.
 */
utils.loader = (show = true) => {
	if (show) {
		$(document.body).find("#receipt-form").addClass("processing");
	} else {
		$(document.body).find("#receipt-form").removeClass("processing");
	}
};

/**
 * Setup input mask for numeric fields.
 */
utils.setupInputMask = () => {
	$(document.body)
		.find(".price-input")
		.attr(
			"data-inputmask",
			"'alias': 'numeric', 'groupSeparator': ',', 'digits': 2,'digitsOptional': false"
		)
		.trigger("change");
	$(document.body)
		.find(".qty-input")
		.attr("data-inputmask-regex", "[0-9]{1,4}")
		.trigger("change");
	$(".input-mask").inputmask({
		showMaskOnHover: false,
		rightAlign: false,
	});
};

/**
 * Setup datepicker.
 */
utils.setupDatePicker = () => {
	$("#date").bootstrapMaterialDatePicker({
		time: true,
		clearButton: true,
		format: "DD-MMM-YYYY hh:mm A",
		shortTime: true,
		nowButton: true,
	});

	$("#date").bootstrapMaterialDatePicker("setDate", moment());
};

// Export the 'utils' object as the default export
export default utils;
