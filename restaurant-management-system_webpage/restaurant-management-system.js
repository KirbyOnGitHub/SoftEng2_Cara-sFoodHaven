


/*============================================================*/


function disableFormFields(modalName, action) {
    // Get all input fields, selects, textareas, and buttons within the specified modal
    const fields = document.querySelectorAll(
        `#${modalName} input, #${modalName} select, #${modalName} textarea, #${modalName} button:not(.modal_submitButton)`
    );

    // Disable or enable each field based on the 'action' parameter
    fields.forEach(field => {
        field.disabled = action;
    });
}


/*============================================================*/


function updateOtherTableCells(tableId, columnIndex, oldValue, newValue, attributeName) {
    const table = document.getElementById(tableId);

    // Check if the table exists
    if (!table) {
        console.error("Table not found with ID:", tableId);
        return;
    }

    // Iterate through each row of the table
    const rows = table.querySelectorAll("tbody tr");
    rows.forEach(row => {
        // Get the cell in the specified column
        const cell = row.cells[columnIndex];

        // Check if the cell exists and its text content matches the old value
        if (cell && cell.textContent.trim() === oldValue.trim()) {
            // Change the text content to the new value
            cell.textContent = newValue.trim();
        }
    });
}


/*============================================================*/


function highlightModifiedTableCells(tableId, columnIndex, valueToCheck, color) {
    const table = document.getElementById(tableId);

    // Check if the table exists
    if (!table) {
        console.error("Table not found with ID:", tableId);
        return;
    }

    // Iterate through each row of the table
    const rows = table.querySelectorAll("tbody tr");
    rows.forEach(row => {
        // Get the cell in the specified column
        const cell = row.cells[columnIndex];

        // Check if the cell exists and its text content matches the value
        if (cell && cell.textContent.trim() === valueToCheck.trim()) {
            // Apply different background color to the cell
            cell.style.backgroundColor = color; 
        }
    });
}

/*============================================================*/





/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/





/*============================================================*/

// Open the menu item modal
function openMenuItemModal(action) {
    document.getElementById("menuItem-modal").style.display = "block";
    document.querySelector("#menuItem-form button[type='submit']").style.display = "block"; 
    
    // Enable form fields
    disableFormFields("menuItem-form", false);

    // Update modal header text
    const header = document.getElementById("menuItemModal_header");

    if (action === "fill") {
        header.innerHTML = "FILLING UP <br> MENU ITEM FORM";
    } else if (action === "view") {
        header.innerHTML = "VIEWING <br> MENU ITEM FORM";
    } else if (action === "modify") {
        header.innerHTML = "MODIFYING <br> MENU ITEM FORM";
    } else if (action === "delete") {
        header.innerHTML = "DELETE THIS <br> MENU ITEM FORM?";
    }

    const container = document.querySelector('.modal');
    container.scrollTop = 0;
    
    const measurementTypeSelect = document.getElementById("measurement-type-menuItemModal");
    const unitMeasurementSelect = document.getElementById("unit-measurement-menuItemModal");

    // Clear previous options from the unit selection menus
    measurementTypeSelect.innerHTML = "";
    unitMeasurementSelect.innerHTML = "";
}

/*============================================================*/

// Close the menu item modal
function closeMenuItemModal() {
    const tableRows = document.querySelectorAll("#menuItem-table tbody tr");

    // Reset styles for each table row
    tableRows.forEach(tableRow => {
        tableRow.style.backgroundColor = "";
        tableRow.style.border = "";

        const cells = tableRow.querySelectorAll("td");
        cells.forEach(cell => {
            cell.style.border = "";
        });
    });

    // Reset styles for all buttons
    const buttons = document.querySelectorAll("#menuItem-table button");
    buttons.forEach(button => {
        button.style.backgroundColor = "";
        button.style.border = "";
        button.style.transform = "";
    });

    document.getElementById("menuItem-modal").style.display = "none";
    document.getElementById("menuItem-form").reset();

    var submitButton = document.querySelector("#menuItem-form button[type='submit']");
    submitButton.innerText = "Submit";
    submitButton.onclick = function(event) {
        addMenuItemOnTable(event);
    };
}

/*============================================================*/

function addIngredientToTheList() {

    // Get the values from the input fields
    const ingredientName = document.getElementById("ingredient-name-comboBox").value;
    const quantity = document.getElementById("quantity-consumed").value;
    const unitMeasurement = document.getElementById("unit-measurement-menuItemModal").value;
  
    // Check if all fields are filled
    if (!ingredientName || !quantity || !unitMeasurement) {
      alert("Please fill out all ingredient details before adding.");
      return;
    }
  
    // Create the formatted ingredient list item with delete button
    const ingredientListItem = `
      <span class="ingredient-item">
        <button class="remove-ingredient-from-list-btn" type="button" onclick="removeIngredient(this)">x</button>
        ${ingredientName} ${quantity} ${unitMeasurement}
        <br>
      </span>
    `;
  
    // Get the current ingredient list element
    const ingredientList = document.querySelector("span#ingredient-list");
  
    // Add the new ingredient list item to the existing list
    ingredientList.innerHTML += ingredientListItem;
  
    // Reset the ingredient list form
    document.getElementById("ingredient-name-comboBox").selectedIndex = 0;
    document.getElementById("quantity-consumed").value = "";
    document.getElementById("measurement-type-menuItemModal").innerHTML = "";
    document.getElementById("unit-measurement-menuItemModal").innerHTML = "";
}

/*============================================================*/

function removeIngredient(button) {
    // Get the entire ingredient list item including the <br>
    const entireIngredientItem = button.closest(".ingredient-item"); 
    entireIngredientItem.remove(); // Remove the entire ingredient item
}

/*============================================================*/

function addMenuItemOnTable() {

    // Get form element
    const menuItemForm = document.getElementById("menuItem-form");

    // Check if form is valid before continuing
    if (!menuItemForm.checkValidity()) {
        menuItemForm.reportValidity(); // Show browser validation message
        return; // Prevent further execution if form is invalid
    }

    // Getting form values
    const menuItemID = document.getElementById("menu-item-id").value;
    const menuItemName = document.getElementById("menu-item-name").value;
    const menuCategory = document.getElementById("menu-category").value;
    const menuItemPrice = document.getElementById("menu-item-price").value;
    const menuItemDescription = document.getElementById("menu-item-description").value;
    const ingredientList = document.getElementById("ingredient-list").innerHTML;

    // Creating a new table row element
    const newRow = document.createElement("tr");

    // Creating menuItem data object
    const menuItemData = {
        menuItemID,
        menuItemName,
        menuCategory,
        menuItemPrice,
        menuItemDescription,
        ingredientList
    };

    // Setting menuItem data as a custom attribute on the row
    newRow.setAttribute("data-menuItem", JSON.stringify(menuItemData));  

    // Creating cells
    const menuItemIDCell = document.createElement("td");
    const menuItemNameCell = document.createElement("td");
    const menuCategoryCell = document.createElement("td");
    const menuItemPriceCell = document.createElement("td");
    const ingredientListCell = document.createElement("td");
    const actionCell = document.createElement("td");

    // Setting cell content
    menuItemIDCell.textContent = menuItemID;
    menuItemNameCell.textContent = menuItemName;
    menuCategoryCell.textContent = menuCategory;
    menuItemPriceCell.textContent = "Php " + menuItemPrice;
    ingredientListCell.innerHTML = ingredientList;

    // **Adding class to ingredientListCell**
    ingredientListCell.classList.add("left-align");  // Use classList for modern approach  

    const buttonContainer = document.createElement("div"); // Sub-cell element

    const viewButton = document.createElement("button");
    viewButton.textContent = "View Info";
    viewButton.classList.add("view-info-btn");
    viewButton.onclick = menuItemRow_handleButtonAction; // Set onclick event

    const modifyButton = document.createElement("button");
    modifyButton.textContent = "Modify";
    modifyButton.classList.add("modify-btn");
    modifyButton.onclick = menuItemRow_handleButtonAction; // Set onclick event

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");
    deleteButton.onclick = menuItemRow_handleButtonAction; // Set onclick event

    buttonContainer.appendChild(viewButton);
    buttonContainer.appendChild(modifyButton);
    buttonContainer.appendChild(deleteButton);

    actionCell.appendChild(buttonContainer);

    // Append cells to the new row
    newRow.appendChild(menuItemIDCell);
    newRow.appendChild(menuItemNameCell);
    newRow.appendChild(menuCategoryCell);
    newRow.appendChild(menuItemPriceCell);
    newRow.appendChild(ingredientListCell);
    newRow.appendChild(actionCell);

    // Appending a new row to table
    var table = document.getElementById("menuItem-table");
    table.querySelector("tbody").appendChild(newRow);

    // Clear the form after adding
    document.getElementById("menuItem-form").reset();

    // Close the modal
    closeMenuItemModal();

    hideIngredientRemoveButtons();
}

/*============================================================*/

function hideIngredientRemoveButtons() {
    // Get the table body element
    const tableBody = document.getElementById("menuItem-table_body");
  
    // Get all buttons with the class in the third row (assuming it exists)
    const buttons = tableBody.querySelectorAll("td:nth-child(5) .remove-ingredient-from-list-btn");
  
    // Set display to none for all buttons
    buttons.forEach(button => button.style.display = "none");
}
    
/*============================================================*/

function menuItemRow_handleButtonAction(event) {
    const clickedButton = event.target;
    const tableRow = clickedButton.closest("tr");

    const isButtonAction = clickedButton.textContent === "View Info" || clickedButton.textContent === "Modify" || clickedButton.textContent === "Delete";

    if (isButtonAction) {
        
        // Get menuItem data
        const menuItemDataString = tableRow.getAttribute("data-menuItem");
        const menuItemData = JSON.parse(menuItemDataString);

        // Fill form with menuItem data
        fillMenuItemForm(menuItemData);

        if (clickedButton.textContent === "View Info") {
            
            // Highlight button for action
            clickedButton.style.transform = "scale(1.15)";

            // Highlight cell row for action
            tableRow.style.backgroundColor = "#64b664"; 

            // Show the modal
            openMenuItemModal('view');

            // Fill form with menuItem data
            fillMenuItemForm(menuItemData);

            document.querySelector("#menuItem-form button[type='submit']").style.display = "none"; 

            // Disable form fields
            disableFormFields("menuItem-form", true);   

            // hideIngredientRemoveButtons();

        } else if (clickedButton.textContent === "Modify") {
            
            // Highlight button for action
            clickedButton.style.transform = "scale(1.15)";
            
            // Highlight cell row for action
            tableRow.style.backgroundColor = "#e2d032"; 

            // Show the modal
            openMenuItemModal('modify');

            // Fill form with menuItem data
            fillMenuItemForm(menuItemData);

            // Change submit button text to "Save Changes"
            const submitButton = document.querySelector("#menuItem-form button[type='submit']");
            submitButton.textContent = "Save Changes";

            // Attach function to save changes
            submitButton.onclick = function(event) {
                menuItemInfo_saveChanges(event, tableRow);
            };

            // hideIngredientRemoveButtons();

        } else if (clickedButton.textContent === "Delete") {
            
            // Highlight button for action
            clickedButton.style.transform = "scale(1.15)";

            // Highlight cell row for confirmation
            tableRow.style.backgroundColor = "#ce4e4e";

            // Show the modal
            openMenuItemModal('delete');

            // Fill form with menuItem data
            fillMenuItemForm(menuItemData);

            // Change submit button text to "Save Changes"
            const submitButton = document.querySelector("#menuItem-form button[type='submit']");
            submitButton.textContent = "Delete";

            // Attach function to save changes
            submitButton.onclick = function(event) {
                deleteMenuItemTableRowData(event, tableRow);
            };

            // Disable form fields
            disableFormFields("menuItem-form", true);       

            hideIngredientRemoveButtons();
        }
    }

    hideIngredientRemoveButtons();
    
}


/*============================================================*/


// Add event listener to the table body
const menuItemTableBody = document.getElementById("menuItem-table").querySelector("tbody");
menuItemTableBody.addEventListener("click", menuItemRow_handleButtonAction);


/*============================================================*/


function fillMenuItemForm(menuItemData) {
    // Get modal elements
    const menuItemIDInput = document.getElementById("menu-item-id");
    const menuItemNameInput = document.getElementById("menu-item-name");
    const menuCategoryInput = document.getElementById("menu-category");
    const menuItemPriceInput = document.getElementById("menu-item-price");
    const menuItemDescriptionInput = document.getElementById("menu-item-description");
    const ingredientListInput = document.getElementById("ingredient-list");

    // Fill the form fields with menuItem data
    menuItemIDInput.value = menuItemData.menuItemID;
    menuItemNameInput.value = menuItemData.menuItemName;
    menuCategoryInput.value = menuItemData.menuCategory;
    menuItemPriceInput.value = menuItemData.menuItemPrice;
    menuItemDescriptionInput.value = menuItemData.menuItemDescription;
    ingredientListInput.innerHTML = menuItemData.ingredientList;
}


/*============================================================*/


function menuItemInfo_saveChanges(event, tableRow) {

    // Get form element
    const menuItemForm = document.getElementById("menuItem-form");
  
    // Check if form is valid before continuing
    if (!menuItemForm.checkValidity()) {
      menuItemForm.reportValidity(); // Show browser validation message
      return; // Prevent further execution if form is invalid
    }

    // Getting form values
    const menuItemID = document.getElementById("menu-item-id").value;
    const menuItemName = document.getElementById("menu-item-name").value;
    const menuCategory = document.getElementById("menu-category").value;
    const menuItemPrice = document.getElementById("menu-item-price").value;
    const menuItemDescription = document.getElementById("menu-item-description").value;
    const ingredientList = document.getElementById("ingredient-list").innerHTML;

    // Creating menuItem data object
    const menuItemData = {
        menuItemID,
        menuItemName,
        menuCategory,
        menuItemPrice,
        menuItemDescription,
        ingredientList
    };

    // Update the data-menuItem attribute of the table row
    tableRow.setAttribute("data-menuItem", JSON.stringify(menuItemData));

    // Update the content of the table row cells
    const cells = tableRow.querySelectorAll("td");
    cells[0].textContent = menuItemID;
    cells[1].textContent = menuItemName;
    cells[2].textContent = menuCategory;
    cells[3].textContent = "Php " + menuItemPrice;
    cells[4].innerHTML = ingredientList;

    // Reset styles for the table cells
    cells.forEach(cell => {
        cell.style.backgroundColor = "";
        cell.style.border = "";
    });

    // Close the modal
    closeMenuItemModal();

    hideIngredientRemoveButtons();
}


/*============================================================*/


function deleteMenuItemTableRowData(event, tableRow) {
    event.preventDefault();

    // Get menuItem data from the table row
    const menuItemDataString = tableRow.getAttribute("data-menuItem");
    const menuItemData = JSON.parse(menuItemDataString);
    const menuItemName = menuItemData.menuItemName;

    // Highlighting table cells with data that is now modified
    highlightModifiedTableCells("menuItem-table", 1, menuItemName, "#ce4e4e");
    
    tableRow.remove();
    
    closeMenuItemModal(); // Close the modal after deleting the row
}


/*============================================================*/





/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/





/*============================================================*/

// Open the ingredient modal
function openIngredientModal(action) {
    document.getElementById("ingredient-modal").style.display = "block";
    document.querySelector("#ingredient-form button[type='submit']").style.display = "block"; 
    updateUnitValueOptions();
    
    // Enable form fields
    disableFormFields("ingredient-form", false);

    // Update modal header text
    const header = document.getElementById("ingredientModal_header");
    // const header2 = document.getElementById("ingredientModal_header2");

    if (action === "fill") {
        header.innerHTML = "FILLING UP <br> INGREDIENT FORM";
        // header2.innerHTML = "FILLING UP <br> SUPPLIER FORM";
    } else if (action === "view") {
        header.innerHTML = "VIEWING <br> INGREDIENT FORM";
        // header2.innerHTML = "VIEWING <br> SUPPLIER FORM";
    } else if (action === "modify") {
        header.innerHTML = "MODIFYING <br> INGREDIENT FORM";
        // header2.innerHTML = "MODIFYING <br> SUPPLIER FORM";
    } else if (action === "delete") {
        header.innerHTML = "DELETE THIS <br> INGREDIENT FORM?";
        // header2.innerHTML = "DELETE THIS <br> SUPPLIER FORM?";
    }

    const container = document.querySelector('.modal');
    container.scrollTop = 0;
}

/*============================================================*/

// Close the ingredient modal
function closeIngredientModal() {
    const tableRows = document.querySelectorAll("#ingredient-table tbody tr");

    // Reset styles for each table row
    tableRows.forEach(tableRow => {
        tableRow.style.backgroundColor = "";
        tableRow.style.border = "";

        const cells = tableRow.querySelectorAll("td");
        cells.forEach(cell => {
            cell.style.border = "";
        });
    });

    // Reset styles for all buttons
    const buttons = document.querySelectorAll("#ingredient-table button");
    buttons.forEach(button => {
        button.style.backgroundColor = "";
        button.style.border = "";
        button.style.transform = "";
    });

    document.getElementById("ingredient-modal").style.display = "none";
    document.getElementById("ingredient-form").reset();

    var submitButton = document.querySelector("#ingredient-form button[type='submit']");
    submitButton.innerText = "Submit";
    submitButton.onclick = function(event) {
        addIngredientOnTable(event);
    };
}


/*============================================================*/


function addIngredientOnTable() {

    // Get form element
    const ingredientForm = document.getElementById("ingredient-form");
  
    // Check if form is valid before continuing
    if (!ingredientForm.checkValidity()) {
      ingredientForm.reportValidity(); // Show browser validation message
      return; // Prevent further execution if form is invalid
    }
  
    // Getting form values
    const ingredientID = document.getElementById("ingredient-id").value;
    const ingredientName = document.getElementById("ingredient-name").value;
    const ingredientCategory = document.getElementById("ingredient-category").value;
    const ingredientTotalQuantity = 0;
    // const expirationDate = document.getElementById("expiration-date").value;
    // const quantity = document.getElementById("quantity").value;
    const measurementType = document.getElementById("measurement-type-ingredientModal").value;
    const unitMeasurement = document.getElementById("unit-measurement-ingredientModal").value;
    const reorderPoint = document.getElementById("reorder-point").value;
    const minimumInvLevel = document.getElementById("minimum-inventory-level").value;
    const lowStockThreshold = document.getElementById("low-stock-threshold").value;
    const mediumStockThreshold = document.getElementById("medium-stock-threshold").value;
  
    // Creating a new table row element
    const newRow = document.createElement("tr");
  
    // Creating ingredient data object
    const ingredientData = {
        ingredientID,
        ingredientName,
        ingredientCategory,
        ingredientTotalQuantity,
    //   expirationDate: expirationDate ? expirationDate : "N/A", // Check if expirationDate has a value, if not use "N/A"
    //   quantity,
        measurementType,
        unitMeasurement,
        reorderPoint,
        minimumInvLevel,
        lowStockThreshold,
        mediumStockThreshold
    };
  
    // Setting ingredient data as a custom attribute on the row
    newRow.setAttribute("data-ingredient", JSON.stringify(ingredientData));
  
    // Creating cells
    const ingredientIDCell = document.createElement("td");
    const ingredientNameCell = document.createElement("td");
    const ingredientCategoryCell = document.createElement("td");
    const totalQuantityCell = document.createElement("td");
    // const expirationDateCell = document.createElement("td");
    // const quantityCell = document.createElement("td");
    const measurementTypeCell = document.createElement("td");
    const unitMeasurementCell = document.createElement("td");
    const actionCell = document.createElement("td");
  
    // Setting cell content
    ingredientIDCell.textContent = ingredientID;
    ingredientNameCell.textContent = ingredientName;
    ingredientCategoryCell.textContent = ingredientCategory;
    totalQuantityCell.textContent = 0;
    // expirationDateCell.textContent = ingredientData.expirationDate; // Use the value from ingredientData object
    // quantityCell.textContent = quantity;
    measurementTypeCell.textContent = measurementType;
    unitMeasurementCell.textContent = unitMeasurement;
  
    const buttonContainer = document.createElement("div"); // Sub-cell element
  
    const viewButton = document.createElement("button");
    viewButton.textContent = "View Info";
    viewButton.classList.add("view-info-btn");
    viewButton.onclick = ingredientRow_handleButtonAction; // Set onclick event
  
    const modifyButton = document.createElement("button");
    modifyButton.textContent = "Modify";
    modifyButton.classList.add("modify-btn");
    modifyButton.onclick = ingredientRow_handleButtonAction; // Set onclick event
  
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");
    deleteButton.onclick = ingredientRow_handleButtonAction; // Set onclick event
  
    buttonContainer.appendChild(viewButton);
    buttonContainer.appendChild(modifyButton);
    buttonContainer.appendChild(deleteButton);
  
    actionCell.appendChild(buttonContainer);
  
    // Append cells to the new row
    newRow.appendChild(ingredientIDCell);
    newRow.appendChild(ingredientNameCell);
    newRow.appendChild(ingredientCategoryCell);
    newRow.appendChild(totalQuantityCell);
    // newRow.appendChild(expirationDateCell);
    // newRow.appendChild(quantityCell);
    newRow.appendChild(measurementTypeCell);
    newRow.appendChild(unitMeasurementCell);
    newRow.appendChild(actionCell);
  
    // Appending a new row to table
    var table = document.getElementById("ingredient-table");
    table.querySelector("tbody").appendChild(newRow);
  
    // Clear the form after adding
    document.getElementById("ingredient-form").reset();
  
    // Close the modal
    closeIngredientModal();
  
    updateIngredientComboBoxes();
  }


/*============================================================*/


function ingredientRow_handleButtonAction(event) {
    const clickedButton = event.target;
    const tableRow = clickedButton.closest("tr");

    const isButtonAction = clickedButton.textContent === "View Info" || clickedButton.textContent === "Modify" || clickedButton.textContent === "Delete";

    if (isButtonAction) {
        
        // Get ingredient data
        const ingredientDataString = tableRow.getAttribute("data-ingredient");
        const ingredientData = JSON.parse(ingredientDataString);

        // Fill form with ingredient data
        fillIngredientForm(ingredientData);

        if (clickedButton.textContent === "View Info") {
            
            // Highlight button for action
            clickedButton.style.transform = "scale(1.15)";

            // Highlight cell row for action
            tableRow.style.backgroundColor = "#64b664"; 

            // Show the modal
            openIngredientModal('view');

            // Fill form with ingredient data
            fillIngredientForm(ingredientData);

            document.querySelector("#ingredient-form button[type='submit']").style.display = "none"; 

            // Disable form fields
            disableFormFields("ingredient-form", true);       

        } else if (clickedButton.textContent === "Modify") {
            
            // Highlight button for action
            clickedButton.style.transform = "scale(1.15)";
            
            // Highlight cell row for action
            tableRow.style.backgroundColor = "#e2d032"; 

            // Show the modal
            openIngredientModal('modify');

            // Fill form with ingredient data
            fillIngredientForm(ingredientData);

            // Change submit button text to "Save Changes"
            const submitButton = document.querySelector("#ingredient-form button[type='submit']");
            submitButton.textContent = "Save Changes";

            // Attach function to save changes
            submitButton.onclick = function(event) {
                ingredientInfo_saveChanges(event, tableRow);
            };

        } else if (clickedButton.textContent === "Delete") {
            
            // Highlight button for action
            clickedButton.style.transform = "scale(1.15)";

            // Highlight cell row for confirmation
            tableRow.style.backgroundColor = "#ce4e4e";

            // Show the modal
            openIngredientModal('delete');

            // Fill form with ingredient data
            fillIngredientForm(ingredientData);

            // Change submit button text to "Save Changes"
            const submitButton = document.querySelector("#ingredient-form button[type='submit']");
            submitButton.textContent = "Delete";

            // Attach function to save changes
            submitButton.onclick = function(event) {
                deleteIngredientTableRowData(event, tableRow);
            };

            // Disable form fields
            disableFormFields("ingredient-form", true);        
        }
    }
}


/*============================================================*/


// Add event listener to the table body
const ingredientTableBody = document.getElementById("ingredient-table").querySelector("tbody");
ingredientTableBody.addEventListener("click", ingredientRow_handleButtonAction);


/*============================================================*/


function fillIngredientForm(ingredientData) {
    // Get modal elements
    const ingredientIDInput = document.getElementById("ingredient-id");
    const ingredientNameInput = document.getElementById("ingredient-name");
    const ingredientCategoryInput = document.getElementById("ingredient-category");
    const ingredientTotalQuantityInput = document.getElementById("ingredient-total-quantity");
    // const expirationDate = document.getElementById("expiration-date").value;
    // const quantity = document.getElementById("quantity").value;
    const measurementTypeInput = document.getElementById("measurement-type-ingredientModal");
    const unitMeasurementInput = document.getElementById("unit-measurement-ingredientModal");
    const reorderPointInput = document.getElementById("reorder-point");
    const minimumInvLevelInput = document.getElementById("minimum-inventory-level");
    const lowStockThresholdInput = document.getElementById("low-stock-threshold");
    const mediumStockThresholdInput = document.getElementById("medium-stock-threshold");

    // Fill the form fields with ingredient data
    ingredientIDInput.value = ingredientData.ingredientID;
    ingredientNameInput.value = ingredientData.ingredientName;
    ingredientCategoryInput.value = ingredientData.ingredientName;
    ingredientTotalQuantityInput.value = ingredientData.ingredientTotalQuantity;
    // expirationDateInput.value = ingredientData.expirationDate;
    // quantityInput.value = ingredientData.quantity;
    measurementTypeInput.value = ingredientData.measurementType;
    unitMeasurementInput.value = ingredientData.unitMeasurement;
    reorderPointInput.value = ingredientData.reorderPoint;
    minimumInvLevelInput.value = ingredientData.minimumInvLevel;
    lowStockThresholdInput.value = ingredientData.lowStockThreshold;
    mediumStockThresholdInput.value = ingredientData.mediumStockThreshold;
}


/*============================================================*/


function ingredientInfo_saveChanges(event, tableRow) {

  // Get form element
  const ingredientForm = document.getElementById("ingredient-form");

  // Check if form is valid before continuing
  if (!ingredientForm.checkValidity()) {
    ingredientForm.reportValidity(); // Show browser validation message
    return; // Prevent further execution if form is invalid
  }

  // Getting form values
    const ingredientID = document.getElementById("ingredient-id").value;
    const ingredientName = document.getElementById("ingredient-name").value;
    const ingredientCategory = document.getElementById("ingredient-category").value;
    const ingredientTotalQuantity = 0;
    // const expirationDate = document.getElementById("expiration-date").value;
    // const quantity = document.getElementById("quantity").value;
    const measurementType = document.getElementById("measurement-type-ingredientModal").value;
    const unitMeasurement = document.getElementById("unit-measurement-ingredientModal").value;
    const reorderPoint = document.getElementById("reorder-point").value;
    const minimumInvLevel = document.getElementById("minimum-inventory-level").value;
    const lowStockThreshold = document.getElementById("low-stock-threshold").value;
    const mediumStockThreshold = document.getElementById("medium-stock-threshold").value;

  // Creating ingredient data object
  const ingredientData = {
    ingredientID,
    ingredientName,
    ingredientCategory,
    ingredientTotalQuantity,
//   expirationDate: expirationDate ? expirationDate : "N/A", // Check if expirationDate has a value, if not use "N/A"
//   quantity,
    measurementType,
    unitMeasurement,
    reorderPoint,
    minimumInvLevel,
    lowStockThreshold,
    mediumStockThreshold
  };

  // Update the data-ingredient attribute of the table row
  tableRow.setAttribute("data-ingredient", JSON.stringify(ingredientData));

  // Update the content of the table row cells
  const cells = tableRow.querySelectorAll("td");
  cells[0].textContent = ingredientID;
  cells[1].textContent = ingredientName;
  cells[2].textContent = ingredientCategory;
  cells[3].textContent = ingredientTotalQuantity;
//   cells[1].textContent = ingredientData.expirationDate; // Use the value from ingredientData object
//   cells[2].textContent = quantity;
  cells[4].textContent = measurementType;
  cells[5].textContent = unitMeasurement;

  // Reset styles for the table cells
  cells.forEach(cell => {
    cell.style.backgroundColor = "";
    cell.style.border = "";
  });

  // Close the modal
  closeIngredientModal();

  updateIngredientComboBoxes();
}


/*============================================================*/


function deleteIngredientTableRowData(event, tableRow) {
    event.preventDefault();

    // Get ingredient data from the table row
    const ingredientDataString = tableRow.getAttribute("data-ingredient");
    const ingredientData = JSON.parse(ingredientDataString);
    const ingredientName = ingredientData.ingredientName;

    // Highlighting table cells with data that is now modified
    highlightModifiedTableCells("menuItem-table", 1, ingredientName, "#ce4e4e");
    
    tableRow.remove();
    
    closeIngredientModal(); // Close the modal after deleting the row

    updateIngredientComboBoxes();
}


/*============================================================*/


function updateIngredientComboBoxes() {
    const comboBoxIds = [
      "ingredient-name-comboBox"
    ];
  
    // Step 1: Clear all existing options from the combo boxes
    comboBoxIds.forEach(comboBoxId => {
      const comboBox = document.getElementById(comboBoxId);
      if (comboBox) {
        comboBox.innerHTML = ''; // Clear options
  
        // Create and add a default option for "null data"
        const defaultOption = document.createElement('option');
        defaultOption.value = ""; // Empty value for "null data"
        defaultOption.textContent = "Select an Ingredient to Add";
        comboBox.appendChild(defaultOption);
      }
    });

    // Step 2 & 3: Populate each combo box with the full name from each table row
    const tableRows = document.querySelectorAll("#ingredient-table tbody tr");
    tableRows.forEach(tableRow => {
        const fullName = tableRow.cells[1].textContent.trim(); // Get the full name from the table cell
        comboBoxIds.forEach(comboBoxId => {
            const comboBox = document.getElementById(comboBoxId);
            if (comboBox) { // Ensure the combo box exists
                const option = document.createElement('option');
                option.value = fullName;
                option.textContent = fullName;
                comboBox.appendChild(option);
            }
        });
    });
  }


/*============================================================*/





/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/







/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/





/*============================================================*/


function openEmployeeModal(action) {
    document.getElementById("employee-modal").style.display = "block";
    document.querySelector("#employee-form button[type='submit']").style.display = "block"; 
    
    // Enable form fields
    disableFormFields("employee-form", false);

    // Update modal header text
    const header = document.getElementById("employeeModal_header");

    if (action === "fill") {
        header.innerHTML = "FILLING UP <br> EMPLOYEE FORM";
    } else if (action === "view") {
        header.innerHTML = "VIEWING <br> EMPLOYEE FORM";
    } else if (action === "modify") {
        header.innerHTML = "MODIFYING <br> EMPLOYEE FORM";
    } else if (action === "delete") {
        header.innerHTML = "DELETE THIS <br> EMPLOYEE FORM?";
    }
}


/*============================================================*/


function closeEmployeeModal() {
    const tableRows = document.querySelectorAll("#employee-table tbody tr");

    // Reset styles for each table row
    tableRows.forEach(tableRow => {
        tableRow.style.backgroundColor = "";
        tableRow.style.border = "";

        const cells = tableRow.querySelectorAll("td");
        cells.forEach(cell => {
            cell.style.border = "";
        });
    });

    // Reset styles for all buttons
    const buttons = document.querySelectorAll("#employee-table button");
    buttons.forEach(button => {
        button.style.backgroundColor = "";
        button.style.border = "";
        button.style.transform = "";
    });

    document.getElementById("employee-modal").style.display = "none";
    document.getElementById("employee-form").reset();

    var submitButton = document.querySelector("#employee-form button[type='submit']");
    submitButton.innerText = "Submit";
    submitButton.onclick = function(event) {
        addEmployeeOnTable(event);
    };
}


/*============================================================*/


function addEmployeeOnTable() {
    event.preventDefault();

    // Getting form values
    const empId = document.getElementById("emp-id").value;
    const firstName = document.getElementById("first-name").value;
    const middleName = document.getElementById("middle-name").value;
    const lastName = document.getElementById("last-name").value;
    const designation = document.getElementById("designation").value;
    const sex = document.getElementById("sex").value;
    const birthdate = document.getElementById("birthdate").value;
    const phoneNumber = document.getElementById("phonenumber").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("employee-email").value;

    // Creating a new table row element
    const newRow = document.createElement("tr");

    // Creating employee data object
    const employeeData = {
      empId,
      firstName,
      middleName,
      lastName,
      designation,
      sex,
      birthdate,
      phoneNumber,
      address,
      email
    };
  
    // Setting employee data as a custom attribute on the row
    newRow.setAttribute("data-employee", JSON.stringify(employeeData));  

    // Creating cells
    const empIdCell = document.createElement("td");
    const empFullNameCell = document.createElement("td");
    const contactInfoCell = document.createElement("td");
    const designationCell = document.createElement("td");
    const actionCell = document.createElement("td");

    // Setting cell content
    empIdCell.textContent = empId;
    empFullNameCell.textContent = `${lastName}, ${firstName} ${middleName !== "" ? middleName + " " : ""}`;  // Combine full name
    contactInfoCell.innerHTML = `${phoneNumber} <br> ${email}`;
    designationCell.textContent = designation;

    const buttonContainer = document.createElement("div"); // Sub-cell element

    const viewProfileButton = document.createElement("button");
    viewProfileButton.textContent = "View Profile";
    viewProfileButton.classList.add("view-info-btn");
    viewProfileButton.onclick = employeeRow_handleButtonAction; // Set onclick event

    const modifyProfileButton = document.createElement("button");
    modifyProfileButton.textContent = "Modify Profile";
    modifyProfileButton.classList.add("modify-btn");
    modifyProfileButton.onclick = employeeRow_handleButtonAction; // Set onclick event

    const deleteProfileButton = document.createElement("button");
    deleteProfileButton.textContent = "Delete Profile";
    deleteProfileButton.classList.add("delete-btn");
    deleteProfileButton.onclick = employeeRow_handleButtonAction; // Set onclick event

    buttonContainer.appendChild(viewProfileButton);
    buttonContainer.appendChild(modifyProfileButton);
    buttonContainer.appendChild(deleteProfileButton);

    actionCell.appendChild(buttonContainer);

    // Append cells to the new row
    newRow.appendChild(empIdCell);
    newRow.appendChild(empFullNameCell);
    newRow.appendChild(contactInfoCell);
    newRow.appendChild(designationCell);
    newRow.appendChild(actionCell);

    // Appending a new row to table
    var table = document.getElementById("employee-table");
    table.querySelector("tbody").appendChild(newRow);

    // Clear the form after adding
    document.getElementById("employee-form").reset();

    // Close the modal
    closeEmployeeModal();
}


/*============================================================*/


function employeeRow_handleButtonAction(event) {
    const clickedButton = event.target;
    const tableRow = clickedButton.closest("tr");

    const isProfileButton = clickedButton.textContent === "View Profile" || clickedButton.textContent === "Modify Profile" || clickedButton.textContent === "Delete Profile";

    if (isProfileButton) {
        
        // Get employee data
        const employeeDataString = tableRow.getAttribute("data-employee");
        const employeeData = JSON.parse(employeeDataString);

        // Fill form with employee data
        fillEmployeeForm(employeeData);

        if (clickedButton.textContent === "View Profile") {
            
            // Highlight button for action
            clickedButton.style.transform = "scale(1.15)";

            // Highlight cell row for action
            tableRow.style.backgroundColor = "#64b664"; 

            // Show the modal
            openEmployeeModal('view');

            // Fill form with employee data
            fillEmployeeForm(employeeData);

            document.querySelector("#employee-form button[type='submit']").style.display = "none"; 

            // Disable form fields
            disableFormFields("employee-form", true);        

        } else if (clickedButton.textContent === "Modify Profile") {
            
            // Highlight button for action
            clickedButton.style.transform = "scale(1.15)";
            
            // Highlight cell row for action
            tableRow.style.backgroundColor = "#e2d032"; 

            // Show the modal
            openEmployeeModal('modify');

            // Fill form with employee data
            fillEmployeeForm(employeeData);

            // Change submit button text to "Save Changes"
            const submitButton = document.querySelector("#employee-form button[type='submit']");
            submitButton.textContent = "Save Changes";

            // Attach function to save changes
            submitButton.onclick = function(event) {
                employeeProfile_saveChanges(event, tableRow);
            };

        } else if (clickedButton.textContent === "Delete Profile") {
            
            // Highlight button for action
            clickedButton.style.transform = "scale(1.15)";

            // Highlight cell row for confirmation
            tableRow.style.backgroundColor = "#ce4e4e";

            // Show the modal
            openEmployeeModal('delete');

            // Fill form with employee data
            fillEmployeeForm(employeeData);

            // Change submit button text to "Save Changes"
            const submitButton = document.querySelector("#employee-form button[type='submit']");
            submitButton.textContent = "Delete";

            // Attach function to save changes
            submitButton.onclick = function(event) {
                deleteEmployeeTableRowData(event, tableRow);
            };

            // Disable form fields
            disableFormFields("employee-form", true);        
        }
    }
}


/*============================================================*/


// Add event listener to the table body 
const employeeTableBody = document.getElementById("employee-table").querySelector("tbody");
employeeTableBody.addEventListener("click", employeeRow_handleButtonAction);


/*============================================================*/


function fillEmployeeForm(employeeData) {
    // Get modal elements
    const empIdInput = document.getElementById("emp-id");
    const firstNameInput = document.getElementById("first-name");
    const middleNameInput = document.getElementById("middle-name");
    const lastNameInput = document.getElementById("last-name");
    const designationInput = document.getElementById("designation");
    const sexSelect = document.getElementById("sex");
    const birthdateInput = document.getElementById("birthdate");
    const phoneNumberInput = document.getElementById("phonenumber");
    const addressInput = document.getElementById("address");
    const emailInput = document.getElementById("employee-email");

    // Fill the form fields with employee data
    empIdInput.value = employeeData.empId;
    firstNameInput.value = employeeData.firstName;
    middleNameInput.value = employeeData.middleName;
    lastNameInput.value = employeeData.lastName;
    designationInput.value = employeeData.designation;
    sexSelect.value = employeeData.sex;
    birthdateInput.value = employeeData.birthdate;
    phoneNumberInput.value = employeeData.phoneNumber;
    addressInput.value = employeeData.address;
    emailInput.value = employeeData.email;
}


/*============================================================*/


function employeeProfile_saveChanges(event, tableRow) {

    // Get form element
    const employeeForm = document.getElementById("employee-form");
  
    // Check if form is valid before continuing
    if (!employeeForm.checkValidity()) {
        employeeForm.reportValidity(); // Show browser validation message
      return; // Prevent further execution if form is invalid
    }

    // Getting form values
    const empId = document.getElementById("emp-id").value;
    const firstName = document.getElementById("first-name").value;
    const middleName = document.getElementById("middle-name").value;
    const lastName = document.getElementById("last-name").value;
    const designation = document.getElementById("designation").value;
    const sex = document.getElementById("sex").value;
    const birthdate = document.getElementById("birthdate").value;
    const phoneNumber = document.getElementById("phonenumber").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("employee-email").value;

    // Creating employee data object
    const employeeData = {
      empId,
      firstName,
      middleName,
      lastName,
      designation,
      sex,
      birthdate,
      phoneNumber,
      address,
      email
    };

    // Update the data-employee attribute of the table row
    tableRow.setAttribute("data-employee", JSON.stringify(employeeData));

    // Update the content of the table row cells
    const cells = tableRow.querySelectorAll("td");
    cells[0].textContent = empId;
    cells[1].textContent = `${lastName}, ${firstName} ${middleName !== "" ? middleName + " " : ""}`;
    cells[2].innerHTML = `${phoneNumber} <br> ${email}`;
    cells[3].textContent = designation;

    // Reset styles for the table cells
    cells.forEach(cell => {
        cell.style.backgroundColor = "";
        cell.style.border = "";
    });

    // Close the modal
    closeEmployeeModal();
}


/*============================================================*/


function deleteEmployeeTableRowData(event, tableRow) {
    event.preventDefault();

    // Get employee data from the table row
    const employeeDataString = tableRow.getAttribute("data-employee");
    const employeeData = JSON.parse(employeeDataString);

    tableRow.remove();
    
    closeEmployeeModal(); // Close the modal after deleting the row
}


/*============================================================*/