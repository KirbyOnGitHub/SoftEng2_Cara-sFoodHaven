/*============================================================*/

function addNewIngredientUnit() {
    if (!formValidity('ingredient-unit-form')) {
        showNotification(`Fill all required fields with valid input.`);
        return;
    }

    // Get the values of the input fields
    const ingredientUnitID = document.querySelector('#ingredient-unit-table tbody').rows.length + 1
    const ingredientUnitName = document.getElementById("ingredient-unit-name").value;

    // Check for duplicate name in the table
    const table = document.getElementById("ingredient-unit-table");
    const existingRows = table.querySelectorAll("tbody tr");

    for (const row of existingRows) {
        const rowData = JSON.parse(row.getAttribute("data-ingredient-unit"));
        const existingName = rowData.name.trim();

        if (existingName.toLowerCase() === ingredientUnitName.toLowerCase()) {
            showNotification(`Ingredient Unit: '${ingredientUnitName}' already exists!`);
            return;
        }
    }

    // Create a new table row element
    const newRow = document.createElement("tr");

    // Create an object for ingredient unit data
    const ingredientUnitData = {
        id: ingredientUnitID,
        name: ingredientUnitName
    };

    // Setting ingredient unit data as a custom attribute on the row
    newRow.setAttribute("data-ingredient-unit", JSON.stringify(ingredientUnitData));  

    // Creating cells
    const ingredientUnitIDCell = document.createElement("td");
    const ingredientUnitCell = document.createElement("td");

    // Setting cell contents
    ingredientUnitIDCell.textContent = ingredientUnitID;
    ingredientUnitCell.textContent = ingredientUnitName;

    // Append cells to the new row
    newRow.appendChild(ingredientUnitIDCell);
    newRow.appendChild(ingredientUnitCell);

    // Add click event listener to the new row
    newRow.addEventListener('click', function () {
        ingredientUnit_tableRowClicked('data-ingredient-unit', newRow); // Call the callback function when a row is clicked
        highlightClickedTableRow('ingredient-unit-table', newRow); // Call the callback function when a row is clicked
    });

    // Append the new row to the table body
    table.querySelector("tbody").appendChild(newRow);

    // Clear the input fields of the form
    clearFormFields('ingredient-unit-table', 'ingredient-unit-form');

    const ingredientUnit_comboBox = document.getElementById("ingredient-unit-combobox");
    ingredientUnit_comboBox.add(new Option(ingredientUnitName, ingredientUnitID));

    showNotification(`Ingredient Unit: '${ingredientUnitName}' added successfully!`);
}

/*============================================================*/

function ingredientUnit_tableRowClicked(dataRow, row) {
    // Access the data stored in the row's custom attribute
    const rowData = JSON.parse(row.getAttribute(dataRow));

    // Set the input fields with the data retrieved from the row
    document.getElementById("ingredient-unit-id").value = rowData.id; // Use the 'id' property
    document.getElementById("ingredient-unit-name").value = rowData.name; // Use the 'name' property
}

/*============================================================*/

function updateSelectedIngredientUnit() {

    // Find the currently selected row
    const selectedRow = document.querySelector("#ingredient-unit-table .clickedTableRow");

    // Check if a row is selected
    if (!selectedRow) {
        showNotification(`Select a row to update from the table.`);
        return;
    }

    if (!formValidity('ingredient-unit-form')) {
        showNotification(`Fill all required fields with valid input.`);
        return;
    }

    // Get the values from the input fields
    const selectedRowData = JSON.parse(selectedRow.getAttribute('data-ingredient-unit'));
    const ingredientUnitID = selectedRowData.id;
    
    const ingredientUnitName = document.getElementById("ingredient-unit-name").value;

    // Create an object to hold the updated data
    const ingredientUnitData = {
        id: ingredientUnitID,
        name: ingredientUnitName
    };

    // Update the data-ingredient-unit attribute with the new data
    selectedRow.setAttribute("data-ingredient-unit", JSON.stringify(ingredientUnitData));

    // Update the displayed cell contents
    const cells = selectedRow.querySelectorAll("td");
    if (cells.length >= 2) {
        cells[0].textContent = ingredientUnitID; // Update the ID cell
        cells[1].textContent = ingredientUnitName;    // Update the name cell
        showNotification(`Ingredient Unit: '${ingredientUnitName}' updated successfully!`);
    }

    // Highlight the updated row for visual feedback
    animateRowHighlight(selectedRow);
    
    // Repopulate the combo box to reflect changes
    repopulateComboBoxFromTable("ingredient-unit-table", "data-ingredient-unit", "ingredient-unit-combobox");

    // Clear the input fields of the form
    clearFormFields('ingredient-unit-table', 'ingredient-unit-form');
}

/*============================================================*/

function deleteSelectedIngredientUnit(tableID, dataName) {
    // Get the table by ID
    const table = document.getElementById(tableID);

    // Find the currently selected row
    const selectedRow = table.querySelector(".clickedTableRow");

    // Check if a row is selected
    if (!selectedRow) {
        showNotification(`Select a row to delete from the table.`);
        return;
    }

    // Grab the selected row's data attribute and its ID
    const selectedRowData = JSON.parse(selectedRow.getAttribute(`data-${dataName}`));
    const selectedRowID = parseInt(selectedRowData.id); // Ensure ID is a number

    // Remove the selected row
    selectedRow.remove();
    clearFormFields(tableID, `${tableID.replace('-table', '-form')}`);

    // Show notification for deletion
    showNotification(`Record ID: '${selectedRowID}' deleted successfully!`);

    // Update IDs for rows with higher IDs than the deleted one
    const remainingRows = Array.from(table.querySelectorAll("tbody tr"));
    remainingRows.forEach(row => {
        const rowData = JSON.parse(row.getAttribute(`data-${dataName}`));
        const rowID = parseInt(rowData.id);

        if (rowID > selectedRowID) {
            const newID = rowID - 1;

            // Update the data attribute with the new ID
            rowData.id = newID;
            row.setAttribute(`data-${dataName}`, JSON.stringify(rowData));

            // Find the first cell with textContent matching the current ID
            for (const cell of row.cells) {
                if (parseInt(cell.textContent) === rowID) {
                    cell.textContent = newID; // Update the cell's content
                    break; // Stop searching after the first match
                }
            }
        }
    });
    
    repopulateComboBoxFromTable("ingredient-unit-table", "data-ingredient-unit", "ingredient-unit-combobox");

}

/*============================================================*/