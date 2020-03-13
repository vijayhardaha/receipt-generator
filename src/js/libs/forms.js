// jQueru dependency.
import $ from "jquery";

// Helpers functions.
import utils from "./utils";

// Define const.
const forms = {};

/**
 * Validate form
 * @param {element} form form element.
 */
forms.validate = ( elem ) => {
  const form = $( elem );
  let error = false;
  form.find( ".require" ).each( ( i, el ) => {
    if ( $( el ).val() === "" ) {
      error = true;
      parent = $( el ).parent().addClass( "has-error" );
    }
  } );

  form.find( ".item-lists .qty-input" ).each( ( i, el ) => {
    if ( $( el ).val() <= 0 ) {
      error = true;
      parent = $( el ).parent().addClass( "has-error" );
    }
  } );

  form.find( ".item-lists .price-input" ).each( ( i, el ) => {
    if ( $( el ).val() <= 0 ) {
      error = true;
      parent = $( el ).parent().addClass( "has-error" );
    }
  } );

  return error;
}

/**
 * Validate custom cost and calculate cost
 * @param {element} form form element.
 */
forms.validateCost = ( form ) => {
  let check = false;
  let cost = form.find( "input[name='cost']" ).val();
  if ( !utils.isEmpty( cost ) ) {
    cost = parseFloat( cost );
    let tax = form.find( "input[name='tax']" ).val() !== "" ? form.find( "input[name='tax']" ).val() : 0;
    let customTotal = parseFloat( parseFloat( cost ) + parseFloat( tax ) ).toFixed( 2 );
    let total = 0;
    form.find( "input[name='price[]']" ).each( ( i, el ) => {
      let qty = $( el ).parents( "div.item-list" ).find( "input[name='qty[]']" ).val();
      total += parseFloat( $( el ).val() ) * parseInt( qty );
    } );
    total = parseFloat( parseFloat( total ) + parseFloat( tax ) ).toFixed( 2 );
    if ( customTotal !== total ) {
      check = true;
    }
  }
  return check;
}

// Export as default.
export default forms;
