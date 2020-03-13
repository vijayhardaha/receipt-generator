// jQueru dependency.
import $ from "jquery";

// Import stylesheet.
import "../css/style.scss";

// Helpers functions.
import utils from "./libs/utils";
import modal from "./libs/modal";
import items from "./libs/items";
import forms from "./libs/forms";
import download from "./libs/download";

/**
 * Do things when document is ready
 */
$( document ).ready( () => {
  // Define app const.
  const app = {
    /**
     * Initialize app
     */
    init: () => {
      /**
       * Setup Inputmask & tippy
       */
      utils.setup();

      // Define re-usable variables.
      app.imageElem = ".preview-box img";
      app.defaultImage = $( app.imageElem ).attr( "src" );
      app.$download = $( document.body ).find( "#download" );
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
    generateRawHtml: ( form ) => {
      const date = form.find( ":input[name='date']" ).val();
      const time = form.find( ":input[name='time']" ).val();
      const business = form.find( ":input[name='business']" ).val();
      const address = form.find( ":input[name='address']" ).val();
      const location = form.find( ":input[name='location']" ).val();
      const currency = form.find( ":input[name='currency']" ).val();
      const taxType = form.find( ":input[name='tax_type']" ).val();
      const paymentType = form.find( ":input[name='payment_type']" ).val();
      const items = form.find( "input[name='price[]']" );

      let tax = form.find( ":input[name='tax']" ).val();
      let curr = currency !== '' ? currency : '';
      let total = 0.00;

      let bodyHtml = `<div id="receipt"><div class="address-section"><p>${business}</p><p>${address}</p><p>${location}</p></div><div class="date-section"><p><span class="date">${date}</span><span class="time">${time}</span></p></div><div class="payment-section"><p><strong>PAYMENT TYPE:</strong> ${paymentType}</p></div><div class="items-section"><table class="table"><tr><th>Item</th><th>QTY</th><th>Unit</th><th>Price</th></tr>`;
      items.each( ( i, el ) => {
        let parent = $( el ).parents( app.itemListElem );
        let price = $( el ).val();
        price = parseFloat( price ).toFixed( 2 );
        let qty = parent.find( "input[name='qty[]']" ).val();
        let itemName = parent.find( "input[name='item_name[]']" ).val();
        let itemTotal = ( parseFloat( price ) * parseInt( qty ) ).toFixed( 2 );
        total = parseFloat( parseFloat( total ) + parseFloat( itemTotal ) ).toFixed( 2 );
        bodyHtml += `<tr><td>${itemName}</td><td>${qty}</td><td>${curr}${price}</td><td>${curr}${itemTotal}</td></tr>`;
      } );
      bodyHtml += `<tr><th colspan="3">SUB-TOTAL:</th><td>${curr}${total}</td></tr>`;
      if ( tax !== "" ) {
        tax = parseFloat( tax ).toFixed( 2 );
        total = parseFloat( parseFloat( total ) + parseFloat( tax ) ).toFixed( 2 );
        bodyHtml += `<tr><th colspan="3">${taxType}:</th><td>${curr}${tax}</td></tr>`;
      }
      bodyHtml += `<tr><th colspan="3">TOTAL:</th><td>${curr}${total}</td></tr>`;
      bodyHtml += `</table></div><div id="footer"><p>Thank You!</p></div></div>`;

      const html = `<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link href="https://fonts.googleapis.com/css?family=Cutive+Mono&display=swap" rel="stylesheet"><style>*{box-sizing:border-box}html,body{margin:0;padding:0;width:100%}body,#receipt{background:#f5f5f5}#receipt,#receipt *,#receipt p{font-family:'Cutive Mono',monospace}#receipt{padding:50px 60px;text-align:left;font-size:22px;margin:0 auto}#receipt p{margin-bottom:0;line-height:20px}#receipt .address-section{margin-bottom:15px}#receipt .date-section{padding:10px 0;border:1px dashed #999;border-left:0;border-right:0;margin-bottom:20px}#receipt .date-section .date{margin-right:50px}#receipt .payment-section{margin-bottom:30px}#receipt .table{width:100%;margin-bottom:20px;max-width:100%;border-collapse:collapse;border-spacing:0}#receipt .table>tbody>tr>td,#receipt .table>tbody>tr>th,#receipt .table>tfoot>tr>td,#receipt .table>tfoot>tr>th,#receipt .table>thead>tr>td,#receipt .table>thead>tr>th{padding:5px;text-align:right}#footer{text-align:center}</style></head><body>${bodyHtml}</body>`;
      return html;
    },

    /**
     * Load event listers
     */
    loadEvents: () => {
      $( document.body )
        /**
         * Click event to add new item row
         * @param {event} e event object.
         */
        .on( "click", "a.add-new-item-row", ( e ) => {
          e.preventDefault();
          items.add( e.currentTarget );
        } )

        /**
         * Click event to remove item row.
         * @param {event} e event object.
         */
        .on( "click", ".remove-item-row", ( e ) => {
          e.preventDefault();
          items.remove( e.currentTarget );
        } )

        /**
         * Focus event to remove error class from inputs
         * @param {event} e event object.
         */
        .on( "focus", ".form-control", ( e ) => {
          e.preventDefault();
          $( e.currentTarget ).parent().removeClass( "has-error" );
        } )

        /**
         * From submit event
         * @param {event} e event object.
         */
        .on( "submit", "#receipt-form", ( e ) => {
          e.preventDefault();

          // Return if processing is already happening
          if ( app.processing ) {
            return false;
          }

          // Define target & form const.
          const target = e.currentTarget;
          const form = $( target );

          // Define and suppose form doesn't have any error.
          let hasError = false;

          // Remove all error borders from inputs.
          form.find( ".has-error" ).removeClass( "has-error" );
          // Hide error notice.
          utils.hideError();

          // Validate form and store the result.
          hasError = forms.validate( target );

          // If form has error then show error & return.
          if ( hasError ) {
            utils.showError( "Please fill all required fields." );
            return false;
          }

          // Validate cost.
          hasError = forms.validateCost( form );
          // If form has cost error then show error & return.
          if ( hasError ) {
            utils.showError( "Total cost is not equals to items total price." );
            return false;
          }

          // Define submit button const.
          const btn = form.find( "button[type='submit']" );

          // Generate receipt image raw html.
          const html = app.generateRawHtml( form );

          // Setup Ajax call for api call.
          $.ajax( {
            type: "POST",
            data: { html: html },
            url: process.env.API_URL,
            dataType: "json",
            beforeSend: () => {
              /**
               * Show Loader
               * Set default images
               * Disable download button
               * Set null on imagebase64 variable
               * Set processing to true
               * Disable submit button
               * Close modal
               */
              utils.loader( true );
              $( app.imageElem ).attr( "src", app.defaultImage );
              app.$download.attr( "disabled", true );
              app.imagebase64 = null;
              app.processing = true;
              btn.attr( "disabled", true );
              modal.close();
            },
            success: ( response ) => {
              // Set processing to false.
              app.processing = false;
              // Activate submit button.
              btn.attr( "disabled", false );
              // Hide Loader.
              utils.loader( false );

              // Check if response has success reponse?
              if ( response.success ) {
                // Store response data image base64 to app variable.
                app.imagebase64 = response.image;
                // Activate donwload button.
                app.$download.attr( "disabled", false );
                // Set new image data to element
                $( app.imageElem ).attr( "src", app.imagebase64 );
                // Open modal.
                modal.open();
              } else {
                // Show error if response doesn't have success response.
                utils.showError( "Sorry, something went wrong, please try later." );
              }
            },
            error: () => {
              // Hide Loader.
              utils.loader( false );
              // Set processing to false.
              app.processing = false;
              // Activate submit button.
              btn.attr( "disabled", false );
              // Show error.
              utils.showError( "Sorry, Server has some error, Please come back later." );
            }
          } );
        } )

        /**
         * Click event to download image.
         * @param {event} e event object.
         */
        .on( "click", "#download", ( e ) => {
          e.preventDefault();
          // Download image.
          download.save( app.imagebase64 );
        } )

        /**
         * Click event for view sample receipt
         * @param {event} e event object.
         */
        .on( "click", ".view-sample", ( e ) => {
          e.preventDefault();
          // Set default sample receipt image.
          $( app.imageElem ).attr( "src", app.defaultImage );
          // Disable download button for sample image.
          app.$download.attr( "disabled", true );
          // Open modal.
          modal.open();
        } )

        /**
         * Click event for modal close button.
         * @param {event} e event object.
         */
        .on( "click", ".md-close", ( e ) => {
          e.preventDefault();
          // Close modal.
          modal.close();
        } );
    }
  };
  app.init();
} );
