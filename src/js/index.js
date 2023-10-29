// Import global dependencies and libraries
import "./import-globals";
import "bootstrap-material-datetimepicker/js/bootstrap-material-datetimepicker.js";
import utils from "./libs/utils";
import modal from "./libs/modal";
import items from "./libs/items";
import download from "./libs/download";

/**
 * Do things when document is ready
 */
(function ($) {
	// Define app const.
	const app = {
		/**
		 * Initialize app
		 */
		init: () => {
			/**
			 * Setup inputmask.
			 */
			utils.setupInputMask();

			/**
			 * Setup datepicker.
			 */
			utils.setupDatePicker();

			// Define re-usable variables.
			app.imageElem = ".preview-box img";
			app.defaultImage = $(app.imageElem).attr("src");
			app.downloadBtn = $(document.body).find("#download");
			app.imagebase64 = null;
			app.processing = false;

			// Load event listeners.
			app.loadEvents();
		},

		/**
		 * Generate raw html for processing
		 * @param {element} form form element.
		 * @return {string} receipt html.
		 */
		generateRawHtml: (form) => {
			const data = {
				date: form.find(":input[name='date']").val(),
				business: form.find(":input[name='business']").val(),
				address: utils.nl2br(form.find(":input[name='address']").val()),
				currency: form.find(":input[name='currency']").val() || "",
				taxType: form.find(":input[name='tax_type']").val(),
				paymentType: form.find(":input[name='payment_type']").val(),
				tax: parseFloat(form.find(":input[name='tax']").val()).toFixed(2),
			};

			const items = form.find("input[name='price[]']").map((i, el) => {
				const parent = $(el).closest("tr");
				const price = parseFloat($(el).val()).toFixed(2);
				const qty = parent.find("input[name='qty[]']").val();
				const itemName = parent.find("input[name='item_name[]']").val();
				const itemTotal = (parseFloat(price) * parseInt(qty, 10)).toFixed(2);
				return {
					itemName,
					qty,
					price: data.currency + price,
					itemTotal: data.currency + itemTotal,
				};
			});

			const total = items
				.toArray()
				.reduce((acc, item) => parseFloat(item.itemTotal) + acc, 0)
				.toFixed(2);

			const htmlArray = [
				`<!DOCTYPE html>`,
				`<html lang="en">`,
				`<head>`,
				`<meta charset="UTF-8"/>`,
				`<meta http-equiv="X-UA-Compatible" content="IE=edge"/>`,
				`<meta name="viewport" content="width=device-width, initial-scale=1.0"/>`,
				`<link href="https://fonts.googleapis.com/css?family=Cutive+Mono&display=swap" rel="stylesheet"/>`,
				`<style>`,
				`*{box-sizing:border-box}html,body{margin:0;padding:0;width:480px;font-size:16px}`,
				`body,#receipt{background:#f5f5f5}#receipt,#receipt *,#receipt p{font-family:"Cutive Mono",monospace}`,
				`#receipt{padding:50px 60px;text-align:left;font-size:22px;margin:0 auto}#receipt p{margin-top:0;margin-bottom:0;line-height:1.5}`,
				`#receipt .address{margin-bottom:18px}#receipt .date{padding:10px 0;border:1px dashed #999;border-left:0;border-right:0;margin-bottom:18px}`,
				`#receipt .payment{margin-bottom:18px}#receipt .table{width:100%;margin-bottom:18px;max-width:100%;font-size:15px;border-collapse:collapse;border-spacing:0}`,
				`#receipt .table>tbody>tr>td,#receipt .table>tbody>tr>th,#receipt .table>tfoot>tr>td,#receipt .table>tfoot>tr>th,#receipt .table>thead>tr>td,#receipt .table>thead>tr>th{padding:8px 5px;text-align:right}`,
				`#footer{text-align:center}`,
				`</style>`,
				`</head>`,
				`<body>`,
				`<div id="receipt">`,
				`<div class="address">`,
				`<p>${data.business}</p>`,
				`<p>${data.address}</p>`,
				`</div>`,
				`<p class="date">${data.date}</p>`,
				`<p class="payment"><strong>Payment Type:</strong>${data.paymentType}</p>`,
				`<table class="table">`,
				`<thead>`,
				`<tr><th>Item</th><th>Qty</th><th>Unit</th><th>Price</th></tr>`,
				`</thead>`,
				`<tbody>`,
				...items
					.toArray()
					.map(
						(item) =>
							`<tr><td>${item.itemName}</td><td>${item.qty}</td><td>${item.price}</td><td>${item.itemTotal}</td></tr>`
					),
				`</tbody>`,
				`<tfoot>`,
				`<tr><th colspan="3">Subtotal:</th><td>${data.currency}${total}</td></tr>`,
				data.tax !== ""
					? `<tr><th colspan="3">${data.taxType}:</th><td>${data.currency}${data.tax}</td></tr>`
					: ``,
				`<tr><th colspan="3">Total:</th><td>${data.currency}${total}</td></tr>`,
				`</tfoot>`,
				`</table>`,
				`<p id="footer">Thank You!</p>`,
				`</div>`,
				`</body>`,
				`</html>`,
			];

			return htmlArray.join("");
		},

		/**
		 * Load event listers
		 */
		loadEvents: () => {
			$(document.body)
				/**
				 * Click event to add new item row
				 * @param {event} e event object.
				 */
				.on("click", "a.add-new-item-row", (e) => {
					e.preventDefault();
					items.add(e.currentTarget);
				})

				/**
				 * Click event to remove item row.
				 * @param {event} e event object.
				 */
				.on("click", ".remove-item-row", (e) => {
					e.preventDefault();
					items.remove(e.currentTarget);
				})

				/**
				 * Focus event to remove error class from inputs
				 * @param {event} e event object.
				 */
				.on("focus", ".form-control", (e) => {
					e.preventDefault();
					$(e.currentTarget).parent().removeClass("has-error");
				})

				/**
				 * From submit event
				 * @param {event} e event object.
				 */
				.on("submit", "#receipt-form", (e) => {
					e.preventDefault();

					// Return if processing is already happening
					if (app.processing) {
						return false;
					}

					// Define target & form const.
					const target = e.currentTarget;
					const form = $(target);

					// Hide error notice.
					utils.hideError();
					form.removeClass("was-validated");

					// check if the input is valid using a 'valid' property
					if (!e.target.checkValidity()) {
						form.addClass("was-validated");
						return false;
					}

					// Define submit button const.
					const btn = form.find("button[type='submit']");

					// Generate receipt image raw html.
					const html = app.generateRawHtml(form);

					// Setup Ajax call for api call.
					$.ajax({
						type: "POST",
						data: { html: html },
						url: process.env.API_URL,
						dataType: "json",
						beforeSend: () => {
							utils.loader(true);
							$(app.imageElem).attr("src", app.defaultImage);
							app.downloadBtn.attr("disabled", true);
							app.imagebase64 = null;
							app.processing = true;
							btn.attr("disabled", true);
							modal.close();
						},
						success: (response) => {
							if (response.success) {
								app.imagebase64 = response.image;
								app.downloadBtn.attr("disabled", false);
								$(app.imageElem).attr("src", app.imagebase64);
								modal.open();
							} else {
								utils.showError(
									"Sorry, something went wrong, please try later."
								);
							}
						},
						error: () => {
							utils.showError(
								"Sorry, something went wrong, please try after sometime."
							);
						},
						complete: () => {
							utils.loader(false);
							app.processing = false;
							btn.attr("disabled", false);
						},
					});
				})

				/**
				 * Click event to download image.
				 * @param {event} e event object.
				 */
				.on("click", "#download", (e) => {
					e.preventDefault();
					download.save(app.imagebase64);
				})

				/**
				 * Click event for view sample receipt
				 * @param {event} e event object.
				 */
				.on("click", "#view-sample", (e) => {
					e.preventDefault();
					$(app.imageElem).attr("src", app.defaultImage);
					app.downloadBtn.attr("disabled", true);
					modal.open();
				})

				/**
				 * Click event for modal close button.
				 * @param {event} e event object.
				 */
				.on("click", ".rg-modal-close", (e) => {
					e.preventDefault();
					modal.close();
				});
		},
	};
	app.init();
})(jQuery);
