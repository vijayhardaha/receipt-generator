// jQueru dependency.
import $ from "jquery";

// Helpers functions.
import utils from "./utils";

// Define const.
const items = {};

// Define re-usable variables.
items.container = "div.item-lists";
items.item = "div.item-list";
items.row = "<div class='item-list'><div class='row'><div class='col-sm-5'><input type='text' class='form-control require item-name-input' name='item_name[]' value='' placeholder='Item Name*'></div><div class='col-sm-3'><input type='text' class='form-control require qty-input' name='qty[]' value='' placeholder='QTY*'></div><div class='col-sm-3'><input type='text' class='form-control price-input require' name='price[]' value='' placeholder='Price*'></div><a href='#' class='remove-item-row has-tooltip' data-tippy-content='Remove Item'><span class='icon-cross'></span></a></div></div>";

/**
 * Add new item row.
 */
items.add = () => {
  $( document.body ).find( items.container ).append( items.row );
  // Setup input mask and tippy for new item row.
  utils.setup();
}

/**
 * Remove item row
 * @param {element} el item row element.
 */
items.remove = ( el ) => {
  const parent = $( el ).parents( items.item );
  parent.fadeOut().remove();
}

// Export as default.
export default items;
