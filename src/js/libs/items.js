// Helpers functions.
import utils from "./utils";

// Define const.
const items = {};

// Define re-usable variables.
items.container = "table.items-table tbody";
items.row = `<tr>
<td><input type="text" class="form-control item-name-input input-mask" name="item_name[]" placeholder="Item Name*" required /></td>
<td><input type="text" class="form-control qty-input input-mask" name="qty[]" placeholder="QTY*" required /></td>
<td><input type="text" class="form-control price-input input-mask" name="price[]" placeholder="Price*" required /></td>
<td class="item-remove"><a href="#" class="btn btn-danger remove-item-row">&times;</a></td>
</tr>`;

/**
 * Add new item row.
 */
items.add = () => {
  $( document.body ).find( items.container ).append( items.row );
  // Setup input mask.
  utils.setupInputMask();
};

/**
 * Remove item row
 * @param {element} el item row element.
 */
items.remove = ( el ) => {
  $( el ).closest( "tr" ).remove();
};

// Export as default.
export default items;