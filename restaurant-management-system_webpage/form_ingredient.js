/*============================================================*/

function addNewIngredient() {
    if (!formValidity('ingredient-form')) {
        showNotification(`Fill all required fields with valid input.`);
        return;
    }

    // Get input values
    const ingredientID = document.querySelector('#ingredient-table tbody').rows.length + 1
    const ingredientName = document.getElementById("ingredient-name").value.trim();
    const categoryComboBox = document.getElementById("ingredient-category-combobox");
    const assignedCategory = categoryComboBox.options[categoryComboBox.selectedIndex].textContent;
    const unitComboBox = document.getElementById("ingredient-unit-combobox");
    const assignedUnit = unitComboBox.options[unitComboBox.selectedIndex].textContent;
    const lowStockThreshold = parseFloat(document.getElementById("ingredient-low-stock-threshold").value);
    const mediumStockThreshold = parseFloat(document.getElementById("ingredient-medium-stock-threshold").value);
    const reorderPoint = parseFloat(document.getElementById("ingredient-reorder-point").value);

    if (lowStockThreshold >= mediumStockThreshold) {
        showNotification(`Low Stock Threshold must be less than Medium Stock Threshold.`);
        document.getElementById("ingredient-low-stock-threshold").focus();
        return;
    }

    // Default total quantity
    const totalQuantity = 0;
    const formattedQuantity = `${totalQuantity} ${assignedUnit}`;

    // Check for duplicate ingredient name in the table
    const table = document.getElementById("ingredient-table");
    const existingRows = table.querySelectorAll("tbody tr");

    for (const row of existingRows) {
        const rowData = JSON.parse(row.getAttribute("data-ingredient"));
        const existingName = rowData.name.trim();

        if (existingName.toLowerCase() === ingredientName.toLowerCase()) {
            showNotification(`Ingredient: '${ingredientName}' already exists!`);
            return;
        }
    }

    // Create a new table row
    const newRow = document.createElement("tr");

    // Store ingredient data as a custom attribute
    const ingredientData = {
        id: ingredientID,
        name: ingredientName,
        category: assignedCategory,
        unit: assignedUnit,
        lowStockTH: lowStockThreshold,
        mediumStockTH: mediumStockThreshold,
        reorderPoint: reorderPoint,
        quantity: totalQuantity
    };
    newRow.setAttribute("data-ingredient", JSON.stringify(ingredientData));

    // Create cells
    const checkBoxCell = document.createElement("td");
    const ingredientCell = document.createElement("td");
    const categoryCell = document.createElement("td");
    const quantityCell = document.createElement("td");

    // Add checkbox input
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkBoxCell.appendChild(checkbox);

    // Set cell values
    ingredientCell.innerHTML = `[${ingredientID}] ${ingredientName}<br><small>(${assignedUnit})</small>`;
    categoryCell.textContent = assignedCategory;

    // Create the status badge (span) for quantity
    const statusBadge = document.createElement('span');
    statusBadge.textContent = formattedQuantity;
    statusBadge.className = 'status-lowstockth'; // Default class for new ingredients

    // Append the status badge to the quantity cell
    quantityCell.appendChild(statusBadge);

    // Append cells to the row
    newRow.append(checkBoxCell, ingredientCell, categoryCell, quantityCell);
    
    // Add row click event
    newRow.addEventListener('click', function (event) {
        // Check if the click happened inside the first column (td:nth-child(1))
        const clickedCell = event.target.closest('td');
        const firstCell = newRow.querySelector('td:first-child');
    
        if (clickedCell === firstCell) {
            return; // Ignore the click if it happened on the first column
        }
    
        ingredient_tableRowClicked('data-ingredient', newRow); // Handle row selection
        highlightClickedTableRow('ingredient-table', newRow); // Highlight selected row
    });

    // Append the row to the table body
    table.querySelector("tbody").appendChild(newRow);

    // Clear form fields after submission
    clearFormFields('ingredient-table', 'ingredient-form');

    // Add ingredient to the combo box
    const ingredientComboBox = document.getElementById("ingredient-name-combobox");
    ingredientComboBox.add(new Option(ingredientName, ingredientID));

    // Show success notification
    showNotification(`Ingredient: '${ingredientName}' added successfully!`);
    
    updateBadge('ingredientPage', 1);
}

/*============================================================*/

function ingredient_tableRowClicked(dataRow, row) {
    // Parse the data stored in the row's custom attribute
    const rowData = JSON.parse(row.getAttribute(dataRow));

    // Populate the form fields with the ingredient data
    document.getElementById("ingredient-id").value = rowData.id;
    document.getElementById("ingredient-name").value = rowData.name;

    // Match and select the correct category in the combobox
    setComboBoxValue("ingredient-category-combobox", rowData.category);

    // Match and select the correct unit in the combobox
    setComboBoxValue("ingredient-unit-combobox", rowData.unit);

    // Populate threshold values and reorder point
    document.getElementById("ingredient-low-stock-threshold").value = rowData.lowStockTH;
    document.getElementById("ingredient-medium-stock-threshold").value = rowData.mediumStockTH;
    document.getElementById("ingredient-reorder-point").value = rowData.reorderPoint;
}

/*============================================================*/

function updateSelectedIngredient() {
    // Find the currently selected row
    const selectedRow = document.querySelector("#ingredient-table .clickedTableRow");

    // Check if a row is selected
    if (!selectedRow) {
        showNotification(`Select a row to update from the table.`);
        return;
    }

    // Validate the form inputs
    if (!formValidity('ingredient-form')) {
        showNotification(`Fill all required fields with valid input.`);
        return;
    }

    // Retrieve input values
    const selectedRowData = JSON.parse(selectedRow.getAttribute('data-ingredient'));
    const ingredientID = selectedRowData.id;
    
    const ingredientName = document.getElementById("ingredient-name").value.trim();
    const ingredientCategory = getSelectedComboBoxText("ingredient-category-combobox");
    const ingredientUnit = getSelectedComboBoxText("ingredient-unit-combobox");
    const lowStockThreshold = parseInt(document.getElementById("ingredient-low-stock-threshold").value, 10);
    const mediumStockThreshold = parseInt(document.getElementById("ingredient-medium-stock-threshold").value, 10);
    const reorderPoint = parseInt(document.getElementById("ingredient-reorder-point").value, 10);

    if (lowStockThreshold >= mediumStockThreshold) {
        showNotification(`Low Stock Threshold must be less than Medium Stock Threshold.`);
        document.getElementById("ingredient-low-stock-threshold").focus();
        return;
    }

    try {
        // Parse the existing quantity from the row's data attribute
        const existingData = JSON.parse(selectedRow.getAttribute("data-ingredient")) || {};
        const existingQuantity = existingData.quantity || 0;
        const formattedQuantity = `${existingQuantity} ${ingredientUnit}`; // E.g., "0 kg"

        // Prepare the updated ingredient data
        const updatedIngredientData = {
            id: ingredientID,
            name: ingredientName,
            category: ingredientCategory,
            unit: ingredientUnit,
            lowStockTH: lowStockThreshold,
            mediumStockTH: mediumStockThreshold,
            reorderPoint: reorderPoint,
            quantity: existingQuantity
        };

        // Update the row's data attribute
        selectedRow.setAttribute("data-ingredient", JSON.stringify(updatedIngredientData));

        // Update the visible table cells
        const cells = selectedRow.querySelectorAll("td");
        if (cells.length >= 4) {
            cells[1].innerHTML = `[${ingredientID}] ${ingredientName}<br><small>(${ingredientUnit})</small>`;
            cells[2].textContent = ingredientCategory;

            // Create or update the <span> inside the quantity cell
            let quantitySpan = cells[3].querySelector("span");
            if (!quantitySpan) {
                quantitySpan = document.createElement("span");
                cells[3].appendChild(quantitySpan);
            }
            quantitySpan.textContent = formattedQuantity;
        }

        // Highlight the updated row for visual feedback
        animateRowHighlight(selectedRow);

        // Show success notification
        showNotification(`Ingredient: '${ingredientName}' updated successfully!`);

        // Repopulate the combobox with the updated ingredient data
        repopulateComboBoxFromTable("ingredient-table", "data-ingredient", "ingredient-name-combobox");

        // Clear the form fields
        clearFormFields("ingredient-table", "ingredient-form");
    } catch (error) {
        console.error("Error updating ingredient:", error);
    }
}

/*============================================================*/

function deleteSelectedIngredient(tableID, dataName) {
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
    
    // Check if the table is the ingredient-table
    if (tableID === "ingredient-table") {
        // Get the quantity cell and check its class
        const quantityCell = selectedRow.querySelector("td:last-child span");
        if (quantityCell && quantityCell.classList.contains('status-lowstockth')) {
            updateBadge('ingredientPage', -1);
        }
    }

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

    repopulateComboBoxFromTable("ingredient-table", "data-ingredient", "ingredient-name-combobox");

}

/*============================================================*/