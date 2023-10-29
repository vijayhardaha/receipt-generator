// Import utility functions from the 'utils' module
import utils from "./utils";

// Define an object for managing items
const items = {};

// Define re-usable HTML template for a new item row
items.row = `<tr>
  <td><input type="text" class="form-control item-name-input input-mask" name="item_name[]" placeholder="Item Name*" required /></td>
  <td><input type text" class="form-control qty-input input-mask" name="qty[]" placeholder="QTY*" required /></td>
  <td><input type="text" class="form-control price-input input-mask" name="price[]" placeholder="Price*" required /></td>
  <td class="item-remove"><a href="#" class="btn btn-danger remove-item-row">&times;</a></td>
</tr>`;

/**
 * Add a new item row to the table.
 */
items.add = () => {
	// Find the item container in the document and append a new row
	$(document.body).find(items.container).append(items.row);

	// Set up input masking for the new row
	utils.setupInputMask();
};

/**
 * Remove an item row.
 * @param {element} el - The item row element to be removed.
 */
items.remove = (el) => {
	// Remove the closest 'tr' element when the remove button is clicked
	$(el).closest("tr").remove();
};

// Export the 'items' object as the default export
export default items;
