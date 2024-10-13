


/*============================================================*/

function clearFormFields(tableId,formId,ifAlert) {
    // Get the form element by ID
    const form = document.getElementById(formId);

    if (form) {
        // Select all input elements within the form and set their value to an empty string
        form.querySelectorAll('input').forEach(input => {
        input.value = '';
        });

        // Select all select elements within the form and set their value to the first option
        form.querySelectorAll('select').forEach(select => {
        select.selectedIndex = 0;
        });

        // Select all textarea elements within the form and set their value to an empty string
        form.querySelectorAll('textarea').forEach(textarea => {
            textarea.value = '';
        });

        // Check if the form is "menu-item-form"
        if (formId === "menu-item-form") {
            // Remove the image source from the imgBox_Display
            const previewImage = document.getElementById("preview-image");
            if (previewImage) {
                previewImage.src = "../img_placeholder.png";  // Set back to placeholder or empty image
            }

            // Remove all rows from the ingredient-list-table
            const ingredientListTableBody = document.getElementById("ingredient-list-table-body");
            if (ingredientListTableBody) {
                ingredientListTableBody.innerHTML = "";  // Clear all rows
            }
        }

        // Scroll the grandparent container of the form back to the top with smooth animation
        const grandParentContainer = form.parentElement?.parentElement;
        if (grandParentContainer) {
            grandParentContainer.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Remove "clickedTableRow" class from the previously clicked row in the specified table
        const table = document.getElementById(tableId);
        if (table) {
            const previouslyClickedRow = table.querySelector(".clickedTableRow");
            if (previouslyClickedRow) {
                previouslyClickedRow.classList.remove("clickedTableRow");
            }

            // Uncheck all checkboxes in each row of the specified table
            const checkboxes = table.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false; // Uncheck the checkbox
            });
        } else {
            showNotification(`Table with ID "${tableId}" not found.`,formId);
        }
    } else {
        showNotification(`Form with ID "${formId}" not found.`,formId);
    }

    if(ifAlert == "YES") {
        showNotification("Form successfully cleared!\nSelected row has been deselected!\nCheckboxes has been unchecked!",formId)
    }
}

/*============================================================*/

function formValidity(formId) {
    // Get form element
    const selectedForm = document.getElementById(formId);

    // Check if form is valid before continuing
    if (!selectedForm.checkValidity()) {
        selectedForm.reportValidity(); // Show browser validation message
        return false; // Prevent further execution if form is invalid
    } else {
        return true;
    }
}

/*============================================================*/

function highlightClickedTableRow(tableId, row) {
    // Get the table by the provided tableId
    const table = document.getElementById(tableId);

    // Check if the clicked row already has the class
    if (row.classList.contains("clickedTableRow")) {
        // If it does, remove the class
        row.classList.remove("clickedTableRow");

        // Construct the form ID by replacing "-table" with "-form"
        const formId = tableId.replace("-table", "-form");
        clearFormFields(tableId,formId);
    } else {
        // Find the previously clicked row within the specified table
        const previouslyClickedRow = table.querySelector(".clickedTableRow");
        if (previouslyClickedRow) {
            previouslyClickedRow.classList.remove("clickedTableRow");
        }

        // Add "clickedTableRow" class to the currently clicked row
        row.classList.add("clickedTableRow");
    }
}

/*============================================================*/

// Function to show the notification inside a specified form
function showNotification(message, formId) {

    // Find the form by its ID
    const form = document.getElementById(formId);

    // Select and remove all existing notifications in the document
    const allNotifications = document.querySelectorAll('.notification');
    allNotifications.forEach(notification => notification.remove());
    
    // Scroll the grandparent to the top with smooth behavior
    const grandparentElement = form.parentElement.parentElement;
    grandparentElement.scrollTo({ top: 0, behavior: 'smooth' });

    // Create a div element for the notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;

    // Insert the notification as the first child of the form
    form.insertBefore(notification, form.firstChild);

    // Add the show class to start the fade-in effect
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remove the notification after 3 seconds with a fade-out effect
    setTimeout(() => {
        notification.classList.add('hide');
        // Remove the element from the DOM after the transition ends
        notification.addEventListener('transitionend', () => {
            notification.remove();
        });
    }, 3000);
}

/*============================================================*/

function repopulateComboBoxFromTable(tableID, dataName, comboBoxID) {
    // Get the table and combo box elements
    const table = document.getElementById(tableID);
    const comboBox = document.getElementById(comboBoxID);

    // Remove all options from the combo box except the first one (index 0)
    while (comboBox.options.length > 1) {
        comboBox.remove(1);  // Remove from index 1 onwards, keeping index 0
    }

    // Get all rows in the table body
    const rows = table.querySelectorAll("tbody tr");
    rows.forEach(row => {
        // Access the data stored in the row's custom attribute
        const rowData = JSON.parse(row.getAttribute(dataName));

        // Assuming rowData is an array with the ID at index 0 and name at index 1
        const IDForValue = rowData.id; 
        const valueToAdd = rowData.name;

        // Add new option to the combo box
        comboBox.add(new Option(valueToAdd, IDForValue));
    });
}

/*============================================================*/

// // Sample calls
// repopulateComboBoxFromTable("menu-category-table", "data-category", "menu-category-combobox");
// repopulateComboBoxFromTable("ingredient-table", "data-ingredient", "ingredient-name-combobox");
// repopulateComboBoxFromTable("ingredient-category-table", "data-category", "ingredient-category-combobox");
// repopulateComboBoxFromTable("ingredient-unit-table", "data-unit", "ingredient-unit-combobox");

/*============================================================*/

function sortTableByColumn(tableId, selectId, button, buttonClicked) {
    const table = document.getElementById(tableId);
    const select = document.getElementById(selectId);
    const selectedColumnIndex = select.value;  // Get the selected column index from the dropdown
    let symbol = button.textContent.trim();  // Get the symbol from the button's text content

    let ascending;

    if (buttonClicked === "YES") {
        // Toggle the button symbol and determine the sort order
        if (symbol === '🡹') {
            button.textContent = '🡻';
            ascending = false;
        } else {
            button.textContent = '🡹';
            ascending = true;
        }
    } else {
        // Do not change the symbol, just determine the sort order from the current symbol
        ascending = (symbol === '🡹');
    }

    // const tbody = table.querySelector("tbody");
    // const rows = Array.from(tbody.querySelectorAll("tr")); // Get all rows in the tbody

    // // Sort the rows based on the text content of the selected column
    // rows.sort((rowA, rowB) => {
    //     const cellA = rowA.cells[selectedColumnIndex].textContent.trim().toLowerCase();
    //     const cellB = rowB.cells[selectedColumnIndex].textContent.trim().toLowerCase();

    //     if (!isNaN(cellA) && !isNaN(cellB)) {
    //         // Sort numerically if both values are numbers
    //         return ascending ? cellA - cellB : cellB - cellA;
    //     }

    //     if (cellA < cellB) {
    //         return ascending ? -1 : 1;
    //     }
    //     if (cellA > cellB) {
    //         return ascending ? 1 : -1;
    //     }
    //     return 0;
    // });

    // // Reorder the rows in the tbody
    // rows.forEach(row => tbody.appendChild(row));
}

/*============================================================*/

function fillForm(inputID, tableID, dataName, formID) {
    const inputValue = document.getElementById(inputID).value.trim(); // Trim any extra spaces

    if (!inputValue) {
        showNotification(`Please enter the ID of a '${dataName}' to auto-fill the form.`, formID);
        return;
    }

    const table = document.getElementById(tableID);
    const rows = table.querySelectorAll("tbody tr");

    if (rows.length === 0) {
        showNotification(`The '${dataName} Table' is empty. There are no rows to search.`, formID);
        return;
    }

    let found = false;
    rows.forEach(row => {
        try {
            const rowData = JSON.parse(row.getAttribute(`data-${dataName}`)); // Parse data-stock
            
            // Ensure both values are of the same type
            if (String(rowData.id) === inputValue) {
                if (row.classList.contains("clickedTableRow")) {
                    showNotification(`The form is already filled with ID: ${inputValue}.`, formID);
                    found = true;
                    return;
                }

                row.click(); // Programmatically click the row
                showNotification(`'${dataName} Form' filled successfully with ID: ${inputValue}!`, formID);
                found = true;
            }
        } catch (error) {
            console.error(`Error parsing data-${dataName} on row:`, error);
        }
    });

    if (!found) {
        showNotification(`No '${dataName}' with the ID: ${inputValue} found.`, formID);
    }
}


/*============================================================*/

function setComboBoxValue(comboBoxId, valueToMatch) {
    const comboBox = document.getElementById(comboBoxId);
    const options = comboBox.options;
    
    for (let i = 0; i < options.length; i++) {
        if (options[i].textContent === valueToMatch) {
            comboBox.selectedIndex = i;
            return;
        }
    }
}

/*============================================================*/

function getSelectedComboBoxText(comboBoxId) {
    const comboBox = document.getElementById(comboBoxId);
    return comboBox.options[comboBox.selectedIndex].textContent;
}

/*============================================================*/

function animateRowHighlight(row) {
    row.classList.add("highlight-animation");
    setTimeout(() => row.classList.remove("highlight-animation"), 1000);
}

/*============================================================*/

function deleteSelectedTableRow(tableID) {
    // Get the table by ID
    const table = document.getElementById(tableID);

    // Find the currently selected row
    const selectedRow = table.querySelector(".clickedTableRow");

    // Check if a row is selected
    if (!selectedRow) {
        showNotification(`Please select a row in the ${tableID.replace('-table', '')} table to be deleted.`, `${tableID.replace('-table', '-form')}`);
        return;
    }

    // If a selected row is found, remove it
    selectedRow.remove();
    clearFormFields(tableID, `${tableID.replace('-table', '-form')}`);

    // Show notification for deletion
    showNotification(`Item Deleted Successfully!`, `${tableID.replace('-table', '-form')}`);

    // Call repopulateComboBoxFromTable based on tableID
    if (tableID === "menu-category-table") {
        repopulateComboBoxFromTable("menu-category-table", "data-menu-category", "menu-category-combobox");
    } else if (tableID === "ingredient-table") {
        repopulateComboBoxFromTable("ingredient-table", "data-ingredient", "ingredient-name-combobox");
    } else if (tableID === "ingredient-category-table") {
        repopulateComboBoxFromTable("ingredient-category-table", "data-ingredient-category", "ingredient-category-combobox");
    } else if (tableID === "ingredient-unit-table") {
        repopulateComboBoxFromTable("ingredient-unit-table", "data-ingredient-unit", "ingredient-unit-combobox");
    }
}

/*============================================================*/

// Function to show the modal
function openModal(modalID) {
    const modal = document.getElementById(modalID);
    modal.style.display = "flex"; // Show modal using flex
}

// Function to close the modal
function closeModal(modalID) {
    const modal = document.getElementById(modalID);
    modal.style.display = "none"; // Hide the modal
}

/*============================================================*/












/*============================================================*/

function addSelectedIngredientsToStockInTable(tableBodyID, ifStockIN) {
    const tableBody = document.getElementById(tableBodyID);
    const stockInTableBody = document.querySelector('#stock-in-n-out-table tbody');

    // Get all rows from the provided table
    const rows = tableBody.querySelectorAll('tr');

    // Check if at least one checkbox is selected
    const hasChecked = Array.from(rows).some(row => {
        const checkbox = row.querySelector('input[type="checkbox"]');
        return checkbox && checkbox.checked;
    });

    if (!hasChecked) {
        alert('Please select at least one ingredient to stock in/out.');
        return; // Stop further execution if no ingredients are selected
    }

    openModal("stock-in-n-out-modal");

    // Clear previous entries from the stock-in table
    stockInTableBody.innerHTML = '';

    // Update header and button text based on ifStockIN
    const header = document.getElementById('stock-in-n-out-header');
    const columnHead = document.getElementById('stock-in-n-out-column-head');
    const confirmButton = document.getElementById('confirmed-ings-to-stock-btn');

    if (ifStockIN) {
        header.textContent = "INGREDIENTS TO STOCK IN";
        columnHead.innerHTML = "QUANTITY<br>ADDED"; // Use innerHTML for line break
        confirmButton.textContent = "Confirm Stock In";
    } else {
        header.textContent = "INGREDIENTS TO STOCK OUT";
        columnHead.innerHTML = "QUANTITY<br>REMOVED"; // Use innerHTML for line break
        confirmButton.textContent = "Confirm Stock Out";
    }

    rows.forEach(row => {
        const checkbox = row.querySelector('input[type="checkbox"]');

        let stockID = "?";

        if (checkbox && checkbox.checked) {
            let rowData, ingredientIDandNameWithUnit;

            // Check the source table and extract the appropriate data
            if (tableBodyID === "stock-table_body") {
                rowData = JSON.parse(row.getAttribute("data-stock"));
                stockID = rowData.id;
                ingredientIDandNameWithUnit = rowData.ingredientIDandNameWithUnit;
            } else if (tableBodyID === "ingredient-table_body") {
                rowData = JSON.parse(row.getAttribute("data-ingredient"));
                const ingredientIDandName = `[${rowData.id}] ${rowData.name}`;
                const ingredientUnit = rowData.unit;

                // Format ingredientIDandName with unit
                ingredientIDandNameWithUnit = `
                    ${ingredientIDandName}<br><small>(${ingredientUnit})</small>
                `;
            }

            // Create a new row for the stock-in/out table
            const newRow = document.createElement('tr');

            // Add the stock ID (first column)
            const stockIDCell = document.createElement('td');
            stockIDCell.textContent = stockID; 
            newRow.appendChild(stockIDCell);

            // Add the ingredient ID and name with unit as the second column
            const ingredientNameCell = document.createElement('td');
            ingredientNameCell.innerHTML = ingredientIDandNameWithUnit; // Set innerHTML for formatting
            newRow.appendChild(ingredientNameCell);

            // Add input for Quantity Added/Removed
            const quantityCell = document.createElement('td');
            quantityCell.innerHTML = `<input type="number" min="1" placeholder="Qty" required>`; // Placeholder as "Qty"
            newRow.appendChild(quantityCell);

            // Add input for Expiration Date
            const expirationCell = document.createElement('td');
            const expirationInput = document.createElement('input');
            expirationInput.type = 'date';
            expirationInput.required = true;

            // Auto-fill expiration date and disable the input if not stocking in
            if (ifStockIN) {
                if (tableBodyID === "stock-table_body") {
                    expirationInput.value = rowData.expirationDate; // Auto-fill with expiration date from data-stock
                    expirationInput.disabled = true; // Disable the expiration date input
                }
            } else {
                // Auto-fill and disable for stock out
                expirationInput.value = rowData.expirationDate; // Auto-fill with expiration date from data-stock
                expirationInput.disabled = true; // Disable the expiration date input
            }

            expirationCell.appendChild(expirationInput);
            newRow.appendChild(expirationCell);

            // Add input for Days Until Expiration Alert
            const daysAlertCell = document.createElement('td');
            const daysAlertInput = document.createElement('input');
            daysAlertInput.type = 'number';
            daysAlertInput.min = 0;
            daysAlertInput.placeholder = "Days";

            // Auto-fill with alert threshold
            if (tableBodyID === "stock-table_body") {
                daysAlertInput.value = ifStockIN ? rowData.expirationAlertTH : rowData.expirationAlertTH; // Auto-fill with alert threshold from data-stock
            }
            daysAlertCell.appendChild(daysAlertInput);
            newRow.appendChild(daysAlertCell);

            // Add input for Remarks
            const remarksCell = document.createElement('td');
            remarksCell.innerHTML = `<input type="text" placeholder="Remarks">`;
            newRow.appendChild(remarksCell);

            // Append the new row to the stock-in/out table
            stockInTableBody.appendChild(newRow);
        }
    });
}

/*============================================================*/

function confirmedIngsToStock(button) { 
    const stockTableBody = document.querySelector('#stock-table tbody');
    const stockInNOutTableBody = document.querySelector('#stock-in-n-out-table tbody');
    const stockTransactionTableBody = document.querySelector('#stock-transaction-table_body');

    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const isStockOut = button.textContent.trim() === "Confirm Stock Out"; // Check if it's stock-out action

    const generatedStockID = stockTableBody.rows.length + 1; // Auto-generate Stock ID

    Array.from(stockInNOutTableBody.rows).forEach((row) => {
        const stockID = row.cells[0].innerText.trim(); // Ingredient name with unit
        const ingredientName = row.cells[1].innerText.trim(); // Ingredient name with unit
        const quantityAdded = parseInt(row.cells[2].querySelector('input').value || 0);
        const expirationDate = row.cells[3].querySelector('input').value || '';
        const expirationAlertTH = row.cells[4].querySelector('input').value || 0;
        const remarks = row.cells[5].querySelector('input').value || '';

        let currentQtyRemaining = 0;
        let updatedQtyRemaining = quantityAdded;

        // Search for an existing row with the same ingredient name
        const existingRow = Array.from(stockTableBody.rows).find(
            stockRow => stockRow.cells[1].textContent.trim() === stockID
        );

        if (existingRow) {
            // If found, update the existing row's quantity and data attribute
            currentQtyRemaining = parseInt(existingRow.cells[3].textContent);
            updatedQtyRemaining = isStockOut
                ? currentQtyRemaining - quantityAdded
                : currentQtyRemaining + quantityAdded;

            // Prevent negative quantity for stock out
            if (isStockOut && updatedQtyRemaining < 0) {
                alert(`Insufficient quantity available for ${ingredientName}.`);
                return; // Stop processing if not enough stock is available
            }

            // Update the quantity and data attribute
            existingRow.cells[3].textContent = updatedQtyRemaining;

            const stockData = JSON.parse(existingRow.getAttribute('data-stock'));
            stockData.quantityRemaining = updatedQtyRemaining;
            stockData.expirationDate = expirationDate || stockData.expirationDate; // Update expiration if provided
            stockData.expirationAlertTH = expirationAlertTH || stockData.expirationAlertTH; // Update alert threshold

            existingRow.setAttribute('data-stock', JSON.stringify(stockData));
        } else {
            // Generate a new Stock ID and create a new row if no match is found
            const newRow = document.createElement('tr');

            newRow.innerHTML = `
                <td><input type="checkbox"></td>
                <td>${generatedStockID}</td>
                <td>${ingredientName}</td>
                <td>${quantityAdded}</td>
                <td>AVAILABLE</td>
            `;

            newRow.setAttribute('data-stock', JSON.stringify({
                id: generatedStockID,
                ingredientIDandNameWithUnit: ingredientName,
                originalQuantity: quantityAdded,
                quantityRemaining: quantityAdded,
                stockInDate: today,
                expirationDate,
                expirationAlertTH,
                stockStatus: 'AVAILABLE'
            }));
    
            // Add row click event
            newRow.addEventListener('click', function (event) {
                // Check if the click happened inside the first column (td:nth-child(1))
                const clickedCell = event.target.closest('td');
                const firstCell = newRow.querySelector('td:first-child');
            
                if (clickedCell === firstCell) {
                    return; // Ignore the click if it happened on the first column
                }
            
                stock_tableRowClicked('data-stock', newRow); // Handle row selection
                highlightClickedTableRow('stock-table', newRow); // Highlight selected row
            });

            stockTableBody.appendChild(newRow);
        }

        // Create a new stock transaction row
        const txnRow = document.createElement('tr');
        const transactionID = stockTransactionTableBody.rows.length + 1;
        const transactionType = isStockOut ? 'STOCK OUT' : 'STOCK IN';
        const qtyChange = isStockOut ? `- ${quantityAdded}` : `+ ${quantityAdded}`;

        txnRow.innerHTML = `
            <td>${transactionID}</td>
            <td>${existingRow ? existingRow.cells[1].textContent : generatedStockID}</td>
            <td>${ingredientName}</td>
            <td>${qtyChange}</td>
            <td>${transactionType}</td>
        `;

        txnRow.setAttribute('data-stock-transaction', JSON.stringify({
            id: transactionID,
            stock_ID: existingRow ? existingRow.cells[1].textContent : generatedStockID,
            ingredientIDandNameWithUnit: ingredientName,
            quantity_added: isStockOut ? 0 : quantityAdded,
            quantity_removed: isStockOut ? quantityAdded : 0,
            transaction_type: transactionType,
            transactionDateTime: new Date().toISOString(),
            remarks,
            order_ID: '',
            emp_ID: ''
        }));
    
        // Add row click event
        txnRow.addEventListener('click', function (event) {        
            stockTransaction_tableRowClicked('data-stock-transaction', txnRow); // Handle row selection
            highlightClickedTableRow('stock-transaction-table', txnRow); // Highlight selected row
        });

        stockTransactionTableBody.appendChild(txnRow);
    });

    // Clear the stock-in table and uncheck all checkboxes
    stockInNOutTableBody.innerHTML = '';
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Close the modal after confirmation
    closeModal('stock-in-n-out-modal');
}

/*============================================================*/

function stock_tableRowClicked(dataRow, row) {
    // Access the data stored in row's custome attribute
    const rowData = JSON.parse(row.getAttribute(dataRow));

    // Populate the form fields with the data from the clicked row
    document.getElementById('stock-id').value = rowData.id;
    document.getElementById('stock-ingredient-id').value = rowData.ingredientIDandNameWithUnit;
    document.getElementById('stock-status').value = rowData.stockStatus;
    document.getElementById('stock-original-qty').value = rowData.originalQuantity;
    document.getElementById('stock-qty-left').value = rowData.quantityRemaining;
    document.getElementById('stock-in-date').value = rowData.stockInDate;
    document.getElementById('stock-expiration-date').value = rowData.expirationDate;
    document.getElementById('stock-expiration-alert-threshold').value = rowData.expirationAlertTH;
}

/*============================================================*/

function stockTransaction_tableRowClicked(dataRow, row) {
    // Access the data stored in row's custome attribute
    const rowData = JSON.parse(row.getAttribute(dataRow));

    // Fill form inputs with transaction data
    document.getElementById('stock-transaction-id').value = rowData.id;
    document.getElementById('stock-transaction-stock-id').value = rowData.stock_ID;
    document.getElementById('stock-transaction-ingredient-id').value = rowData.ingredientIDandNameWithUnit;
    document.getElementById('stock-ingredient-qty-added').value = rowData.quantity_added;
    document.getElementById('stock-ingredient-qty-removed').value = rowData.quantity_removed;
    document.getElementById('stock-transaction-transaction-type').value = rowData.transaction_type;
    document.getElementById('stock-ingredient-transaction-date').value = rowData.transactionDateTime.split('T')[0]; // Extract the date only
    document.getElementById('stock-ingredient-remarks').value = rowData.remarks;
    document.getElementById('stock-transaction-staff-id').value = rowData.emp_ID;
    document.getElementById('stock-transaction-order-id').value = rowData.order_ID;
}

/*============================================================*/












/*============================================================*/

function addNewStaff() {
    // Validate form fields
    if (!formValidity('staff-form')) {
        showNotification("Please fill all the required fields of the 'Staff Form' with valid input.", "staff-form");
        return;
    }

    // Get the values of the input fields
    const staffID = document.getElementById("staff-id").value;
    const staffFirstName = document.getElementById("staff-first-name").value;
    const staffMiddleName = document.getElementById("staff-middle-name").value;
    const staffLastName = document.getElementById("staff-last-name").value;
    const staffDesignation = document.getElementById("staff-designation").value;
    const staffGender = document.getElementById("staff-gender").value;
    const staffBirthdate = document.getElementById("staff-birthdate").value;
    const staffPhoneNumber = document.getElementById("staff-phonenumber").value;
    const staffAddress = document.getElementById("staff-address").value;
    const staffEmail = document.getElementById("staff-email").value;
    const staffEmailConfirm = document.getElementById("staff-email-confirm").value;
    const staffStatus = document.getElementById("staff-status").value;

    // Check if email and confirm email are the same
    if (staffEmail !== staffEmailConfirm) {
        showNotification("The emails do not match. Please ensure that 'Email' and 'Confirm Email' fields are the same.", "staff-form");
        return;
    }

    // Create full name in the desired format
    const staffFullName = `${staffLastName}, ${staffFirstName} ${staffMiddleName ? staffMiddleName : ''}`.trim();

    // Get the table and search for the row where the 2nd column matches the staff full name
    const table = document.getElementById("staff-table");
    const rows = table.querySelectorAll("tbody tr");

    // Check if the staff already exists in the 2nd column
    for (const row of rows) {
        const cells = row.getElementsByTagName("td");
        const existingStaffFullName = cells[1].textContent.trim();

        if (existingStaffFullName.toLowerCase() === staffFullName.toLowerCase()) {
            showNotification("This 'Staff' member already exists!", "staff-form");
            return; // Exit if the staff already exists
        }
    }

    // Create a new table row element
    const newRow = document.createElement("tr");

    // Create staffData object for consistent storage
    const staffData = {
        id: staffID,
        firstName: staffFirstName,
        middleName: staffMiddleName,
        lastName: staffLastName,
        designation: staffDesignation,
        gender: staffGender,
        birthdate: staffBirthdate,
        phoneNumber: staffPhoneNumber,
        address: staffAddress,
        email: staffEmail,
        status: staffStatus
    };

    // Setting staffData as a custom attribute on the row
    newRow.setAttribute("data-staff", JSON.stringify(staffData));

    // Creating cells
    const staffIDCell = document.createElement("td");
    const staffFullNameCell = document.createElement("td");
    const staffContactInfoCell = document.createElement("td");
    const staffStatusCell = document.createElement("td");

    // Setting cell contents
    staffIDCell.textContent = staffID;
    staffFullNameCell.textContent = staffFullName; // Use the formatted full name
    staffContactInfoCell.innerHTML = `${staffPhoneNumber}<br>${staffEmail}`;

    // Create the status badge
    const statusBadge = document.createElement('span');
    statusBadge.textContent = staffStatus;
    statusBadge.className = `status-${staffStatus.toLowerCase()}`;

    // Clear and append the status badge to the status cell
    staffStatusCell.className = 'status-cell'; // Ensure correct cell styling
    staffStatusCell.innerHTML = ''; // Clear any existing content
    staffStatusCell.appendChild(statusBadge);

    // Append cells to the new row
    newRow.appendChild(staffIDCell);
    newRow.appendChild(staffFullNameCell);
    newRow.appendChild(staffContactInfoCell);
    newRow.appendChild(staffStatusCell);

    // Add click event listener to the new row
    newRow.addEventListener('click', function () {
        staff_tableRowClicked('data-staff', newRow); // Call the callback function when a row is clicked
        highlightClickedTableRow('staff-table', newRow); // Call the callback function when a row is clicked
    });

    // Append the new row to the table body
    document.getElementById("staff-table").querySelector("tbody").appendChild(newRow);

    // Clear the input fields of the form
    clearFormFields('staff-table', 'staff-form');

    showNotification(`Staff Added Successfully!`, "staff-form");
}
  
/*============================================================*/

function staff_tableRowClicked(dataRow, row) {
    // Access the data stored in the row's custom attribute
    const rowData = JSON.parse(row.getAttribute(dataRow));

    // Set form field values using the rowData object
    document.getElementById("staff-id").value = rowData.id;
    document.getElementById("staff-status").value = rowData.status;
    document.getElementById("staff-first-name").value = rowData.firstName;
    document.getElementById("staff-middle-name").value = rowData.middleName || ''; // Default to empty if undefined
    document.getElementById("staff-last-name").value = rowData.lastName;
    document.getElementById("staff-designation").value = rowData.designation;
    document.getElementById("staff-gender").value = rowData.gender;
    document.getElementById("staff-birthdate").value = rowData.birthdate;
    document.getElementById("staff-phonenumber").value = rowData.phoneNumber;
    document.getElementById("staff-address").value = rowData.address;
    document.getElementById("staff-email").value = rowData.email;
}

/*============================================================*/

function updateSelectedStaff() {
    // Find the currently selected row
    const selectedRow = document.querySelector("#staff-table .clickedTableRow");

    // Check if a row is selected
    if (!selectedRow) {
        showNotification("Please select a row in the staff table to be updated with what you inputted.", "staff-form");
        return;
    }

    // Validate form fields
    if (!formValidity('staff-form')) {
        showNotification("Please fill all the required fields of the 'Staff Form' with valid input to proceed with the update.", "staff-form");
        return;
    }

    // Get the values of the input fields
    const staffID = document.getElementById("staff-id").value;
    const staffStatus = document.getElementById("staff-status").value;
    const staffFirstName = document.getElementById("staff-first-name").value;
    const staffMiddleName = document.getElementById("staff-middle-name").value;
    const staffLastName = document.getElementById("staff-last-name").value;
    const staffDesignation = document.getElementById("staff-designation").value;
    const staffGender = document.getElementById("staff-gender").value;
    const staffBirthdate = document.getElementById("staff-birthdate").value;
    const staffPhoneNumber = document.getElementById("staff-phonenumber").value;
    const staffAddress = document.getElementById("staff-address").value;
    const staffEmail = document.getElementById("staff-email").value;
    const staffEmailConfirm = document.getElementById("staff-email-confirm").value;

    // Check if email and confirm email are the same
    if (staffEmail !== staffEmailConfirm) {
        showNotification("The emails do not match. Please ensure that 'Email' and 'Confirm Email' fields are the same.", "staff-form");
        return;
    }

    // Update the data-staff attribute with the new data
    const staffData = {
        id: staffID,
        status: staffStatus,
        firstName: staffFirstName,
        middleName: staffMiddleName,
        lastName: staffLastName,
        designation: staffDesignation,
        gender: staffGender,
        birthdate: staffBirthdate,
        phoneNumber: staffPhoneNumber,
        address: staffAddress,
        email: staffEmail,
    };

    selectedRow.setAttribute("data-staff", JSON.stringify(staffData));

    // Create full name in the desired format
    const staffFullName = `${staffLastName}, ${staffFirstName} ${staffMiddleName ? staffMiddleName : ''}`.trim();

    // Update the displayed cell contents
    const cells = selectedRow.querySelectorAll("td");
    if (cells.length >= 4) {
        cells[0].textContent = staffID; // Update the ID cell
        cells[1].textContent = staffFullName; // Update the name cell
        cells[2].innerHTML = `${staffPhoneNumber}<br>${staffEmail}`; // Update contact info
        
        // Create the status badge (span) if it doesn't exist
        let statusBadge = cells[3].querySelector('span');
        if (!statusBadge) {
            statusBadge = document.createElement('span');
            cells[3].appendChild(statusBadge);
        }

        // Update the status badge text and class
        statusBadge.textContent = staffStatus; // Update the status text
        statusBadge.className = `status-${staffStatus.toLowerCase()}`; // Change class based on new status
        cells[3].className = 'status-cell'; // Ensure correct cell styling

        showNotification(`Staff Updated Successfully!`, "staff-form");
    }

    // Clear the input fields of the form
    clearFormFields('staff-table', 'staff-form');
}

/*============================================================*/


/*============================================================*/










/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/










// /*============================================================*/

// function addNewSupplier() {
//     // Validate form fields
//     if (!formValidity('supplier-form')) {
//         showNotification("Please fill all the required fields of the 'Supplier Form' with valid input.", "supplier-form");
//         return;
//     }

//     // Get the values of the input fields
//     const supplierID = document.getElementById("supplier-id").value;
//     const supplierName = document.getElementById("supplier-name").value;
//     const supplierContactPerson = document.getElementById("supplier-contact-person").value;
//     const supplierAddress = document.getElementById("supplier-address").value;
//     const supplierPhoneNumber = document.getElementById("supplier-phonenumber").value;
//     const supplierEmail = document.getElementById("supplier-email").value;

//     // Get the table and search for the row where the 2nd column matches the supplier name
//     const table = document.getElementById("supplier-table");
//     const rows = table.querySelectorAll("tbody tr");

//     // Check if the supplier already exists in the 2nd column
//     for (const row of rows) {
//         const cells = row.getElementsByTagName("td");
//         const existingSupplierName = cells[1].textContent.trim();

//         if (existingSupplierName.toLowerCase() === supplierName.toLowerCase()) {
//             showNotification("This 'Supplier' already exists!", "supplier-form");
//             return; // Exit if the supplier already exists
//         }
//     }

//     // Create a new table row element
//     const newRow = document.createElement("tr");

//     // Creating supplierData object
//     const supplierData = {
//         id: supplierID,
//         name: supplierName,
//         contactPerson: supplierContactPerson,
//         address: supplierAddress,
//         phoneNumber: supplierPhoneNumber,
//         email: supplierEmail
//     };

//     // Setting supplierData as a custom attribute on the row
//     newRow.setAttribute("data-supplier", JSON.stringify(supplierData));

//     // Creating cells
//     const supplierIDCell = document.createElement("td");
//     const supplierNameCell = document.createElement("td");

//     // Setting cell contents
//     supplierIDCell.textContent = supplierID;
//     supplierNameCell.textContent = supplierName; // Use the formatted full name

//     // Append cells to the new row
//     newRow.appendChild(supplierIDCell);
//     newRow.appendChild(supplierNameCell);

//     // Add click event listener to the new row
//     newRow.addEventListener('click', function () {
//         supplier_tableRowClicked('data-supplier', newRow); // Call the callback function when a row is clicked
//         highlightClickedTableRow('supplier-table', newRow); // Call the callback function when a row is clicked
//     });

//     // Append the new row to the table body
//     document.getElementById("supplier-table").querySelector("tbody").appendChild(newRow);

//     // Clear the input fields of the form
//     clearFormFields('supplier-table', 'supplier-form');

//     showNotification(`Supplier Added Successfully!\n\nID: ${supplierID}\nSupplier Name: ${supplierName}.`, "supplier-form");
// }
  
// /*============================================================*/

// function supplier_tableRowClicked(dataRow, row) {
//     // Access the data stored in the row's custom attribute
//     const rowData = JSON.parse(row.getAttribute(dataRow));

//     // Set the input fields with the corresponding data
//     document.getElementById("supplier-id").value = rowData.id;  // Access by key
//     document.getElementById("supplier-name").value = rowData.name;  // Access by key
//     document.getElementById("supplier-contact-person").value = rowData.contactPerson;  // Access by key
//     document.getElementById("supplier-address").value = rowData.address;  // Access by key
//     document.getElementById("supplier-phonenumber").value = rowData.phoneNumber;  // Access by key
//     document.getElementById("supplier-email").value = rowData.email;  // Access by key
// }

// /*============================================================*/

// function updateSelectedSupplier() {
//     // Find the currently selected row
//     const selectedRow = document.querySelector("#supplier-table .clickedTableRow");

//     // Check if a row is selected
//     if (!selectedRow) {
//         showNotification("Please select a row in the supplier table to be updated with what you inputted.", "supplier-form");
//         return;
//     }

//     // Validate form fields
//     if (!formValidity('supplier-form')) {
//         showNotification("Please fill all the required fields of the 'Supplier Form' with valid input to proceed with the update.", "supplier-form");
//         return;
//     }

//     // Get the values of the input fields
//     const supplierData = {
//         id: document.getElementById("supplier-id").value,
//         name: document.getElementById("supplier-name").value,
//         contactPerson: document.getElementById("supplier-contact-person").value,
//         address: document.getElementById("supplier-address").value,
//         phoneNumber: document.getElementById("supplier-phonenumber").value,
//         email: document.getElementById("supplier-email").value
//     };

//     // Update the data-supplier attribute with the new data
//     selectedRow.setAttribute("data-supplier", JSON.stringify(supplierData));

//     // Update the displayed cell contents
//     const cells = selectedRow.querySelectorAll("td");
//     if (cells.length >= 2) {
//         const previousSupplierID = cells[0].textContent;
//         const previousSupplierName = cells[1].textContent;
//         cells[0].textContent = supplierData.id;  // Update the ID cell
//         cells[1].textContent = supplierData.name; // Update the name cell
//         showNotification(`Supplier Updated Successfully!\n\nID: "${previousSupplierID}" ➔ "${supplierData.id}"\nSupplier Name: "${previousSupplierName}" ➔ "${supplierData.name}".`, "supplier-form");
//     }

//     // Clear the input fields of the form
//     clearFormFields('supplier-table', 'supplier-form');
// }

// /*============================================================*/










/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/










/*============================================================*/

function addNewCustomer() {
    // Validate form fields
    if (!formValidity('customer-form')) {
        showNotification("Please fill all the required fields of the 'Customer Form' with valid input.", "customer-form");
        return;
    }

    // Get the values of the input fields
    const customerID = document.getElementById("customer-id").value;
    const customerStatus = document.getElementById("customer-status").value;
    const customerFirstName = document.getElementById("customer-first-name").value;
    const customerMiddleName = document.getElementById("customer-middle-name").value;
    const customerLastName = document.getElementById("customer-last-name").value;
    const customerGender = document.getElementById("customer-gender").value;
    const customerBirthdate = document.getElementById("customer-birthdate").value;
    const customerPhoneNumber = document.getElementById("customer-phonenumber").value;
    const customerAddress = document.getElementById("customer-address").value;
    const customerEmail = document.getElementById("customer-email").value;
    const customerEmailConfirm = document.getElementById("customer-email-confirm").value;

    // Check if email and confirm email are the same
    if (customerEmail !== customerEmailConfirm) {
        showNotification("The emails do not match. Please ensure that 'Email' and 'Confirm Email' fields are the same.", "customer-form");
        return;
    }

    // Create full name in the desired format
    const customerFullName = `${customerLastName}, ${customerFirstName} ${customerMiddleName ? customerMiddleName : ''}`.trim();

    // Get the table and search for the row where the 2nd column matches the customer full name
    const table = document.getElementById("customer-table");
    const rows = table.querySelectorAll("tbody tr");

    // Check if the customer already exists in the 2nd column
    for (const row of rows) {
        const cells = row.getElementsByTagName("td");
        const existingCustomerFullName = cells[1].textContent.trim();

        if (existingCustomerFullName.toLowerCase() === customerFullName.toLowerCase()) {
            showNotification("This 'Customer' already exists!", "customer-form");
            return; // Exit if the customer already exists
        }
    }

    // Create a new table row element
    const newRow = document.createElement("tr");

    // Creating customerData object
    const customerData = {
        id: customerID,
        status: customerStatus,
        firstName: customerFirstName,
        middleName: customerMiddleName,
        lastName: customerLastName,
        gender: customerGender,
        birthdate: customerBirthdate,
        phoneNumber: customerPhoneNumber,
        address: customerAddress,
        email: customerEmail,
        fullName: customerFullName,
    };

    // Setting customerData as a custom attribute on the row
    newRow.setAttribute("data-customer", JSON.stringify(customerData));

    // Creating cells
    const customerIDCell = document.createElement("td");
    const customerFullNameCell = document.createElement("td");
    const customerContactInfoCell = document.createElement("td");
    const customerStatusCell = document.createElement("td");

    // Setting cell contents
    customerIDCell.textContent = customerData.id;
    customerFullNameCell.textContent = customerData.fullName; // Use the formatted full name
    customerContactInfoCell.innerHTML = `${customerData.phoneNumber}<br>${customerData.email}`;

    // Create the status badge
    const statusBadge = document.createElement('span');
    statusBadge.textContent = customerStatus;
    statusBadge.className = `status-${customerStatus.toLowerCase()}`;

    // Clear and append the status badge to the status cell
    customerStatusCell.className = 'status-cell'; // Ensure correct cell styling
    customerStatusCell.innerHTML = ''; // Clear any existing content
    customerStatusCell.appendChild(statusBadge);

    // Append cells to the new row
    newRow.appendChild(customerIDCell);
    newRow.appendChild(customerFullNameCell);
    newRow.appendChild(customerContactInfoCell);
    newRow.appendChild(customerStatusCell);

    // Add click event listener to the new row
    newRow.addEventListener('click', function () {
        customer_tableRowClicked('data-customer', newRow); // Call the callback function when a row is clicked
        highlightClickedTableRow('customer-table', newRow); // Call the callback function when a row is clicked
    });

    // Append the new row to the table body
    document.getElementById("customer-table").querySelector("tbody").appendChild(newRow);

    // Clear the input fields of the form
    clearFormFields('customer-table', 'customer-form');

    showNotification(`Customer Added Successfully!`, "customer-form");
}
  
/*============================================================*/

function customer_tableRowClicked(dataRow, row) {
    // Access the data stored in the row's custom attribute
    const rowData = JSON.parse(row.getAttribute(dataRow));

    // Populate the form fields with the values from the rowData object
    document.getElementById("customer-id").value = rowData.id;
    document.getElementById("customer-status").value = rowData.status;
    document.getElementById("customer-first-name").value = rowData.firstName;
    document.getElementById("customer-middle-name").value = rowData.middleName;
    document.getElementById("customer-last-name").value = rowData.lastName;
    document.getElementById("customer-gender").value = rowData.gender;
    document.getElementById("customer-birthdate").value = rowData.birthdate;
    document.getElementById("customer-phonenumber").value = rowData.phoneNumber;
    document.getElementById("customer-address").value = rowData.address;
    document.getElementById("customer-email").value = rowData.email;
}

/*============================================================*/

function updateSelectedCustomer() {
    // Find the currently selected row
    const selectedRow = document.querySelector("#customer-table .clickedTableRow");

    // Check if a row is selected
    if (!selectedRow) {
        showNotification("Please select a row in the customer table to be updated with what you inputted.", "customer-form");
        return;
    }

    // Validate form fields
    if (!formValidity('customer-form')) {
        showNotification("Please fill all the required fields of the 'Customer Form' to proceed with the update.", "customer-form");
        return;
    }

    // Get the values of the input fields
    const customerData = {
        id: document.getElementById("customer-id").value,
        status: document.getElementById("customer-status").value,
        firstName: document.getElementById("customer-first-name").value,
        middleName: document.getElementById("customer-middle-name").value,
        lastName: document.getElementById("customer-last-name").value,
        gender: document.getElementById("customer-gender").value,
        birthdate: document.getElementById("customer-birthdate").value,
        phoneNumber: document.getElementById("customer-phonenumber").value,
        address: document.getElementById("customer-address").value,
        email: document.getElementById("customer-email").value,
        emailConfirm: document.getElementById("customer-email-confirm").value
    };

    // Check if email and confirm email are the same
    if (customerData.email !== customerData.emailConfirm) {
        showNotification("The emails do not match. Please ensure that 'Email' and 'Confirm Email' fields are the same.", "staff-form");
        return;
    }

    // Update the data-customer attribute with the new data
    selectedRow.setAttribute("data-customer", JSON.stringify(customerData));

    // Create full name in the desired format
    const customerFullName = `${customerData.lastName}, ${customerData.firstName} ${customerData.middleName ? customerData.middleName : ''}`.trim();

    // Update the displayed cell contents
    const cells = selectedRow.querySelectorAll("td");
    if (cells.length >= 4) {
        cells[0].textContent = customerData.id; // Update the ID cell
        cells[1].textContent = customerFullName; // Update the name cell
        cells[2].innerHTML = `${customerData.phoneNumber}<br>${customerData.email}`; // Update contact info
        
        // Create the status badge (span) if it doesn't exist
        let statusBadge = cells[3].querySelector('span');
        if (!statusBadge) {
            statusBadge = document.createElement('span');
            cells[3].appendChild(statusBadge);
        }

        // Update the status badge text and class
        statusBadge.textContent = customerData.status; // Update the status text
        statusBadge.className = `status-${customerData.status.toLowerCase()}`; // Change class based on new status
        cells[3].className = 'status-cell'; // Ensure correct cell styling

        showNotification(`Customer Updated Successfully!`, "customer-form");
    }

    // Clear the input fields of the form
    clearFormFields('customer-table', 'customer-form');
}

/*============================================================*/











/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/










/*============================================================*/

function addIngredientToList() {
    // Get the selected option from the combobox
    const ingredientComboBox = document.getElementById("ingredient-name-combobox");
    const selectedIndex = ingredientComboBox.selectedIndex;

    if (selectedIndex === 0) { 
        alert("Please select an ingredient to add.");
        return; // Exit if no ingredient is selected
    }

    // Get the selected ingredient text
    const selectedIngredient = ingredientComboBox.options[selectedIndex].textContent.trim();

    // Get the table and search for the row where the data-ingredient matches the selected ingredient
    const table = document.getElementById('ingredient-table');
    const rows = table.querySelectorAll("tbody tr");
    let selectedRow = null;
    let ingID = "";
    let unitText = "";

    // Find the matching row by checking the data-ingredient attribute
    rows.forEach(row => {
        const ingredientData = JSON.parse(row.getAttribute('data-ingredient')); // Parse the data-ingredient attribute
        if (ingredientData.name.trim() === selectedIngredient) {
            selectedRow = row;
            ingID = ingredientData.id.trim();
            unitText = ingredientData.unit.trim();  
        }
    });

    if (!selectedRow) {
        alert("Ingredient not found in the table.");
        return;
    }

    // Check if the ingredient is already in the "ingredient-list-table"
    const ingredientListTableBody = document.getElementById("ingredient-list-table-body");
    const ingredientListRows = ingredientListTableBody.querySelectorAll("tr");

    for (const row of ingredientListRows) {
        const existingIngredient = row.getAttribute('data-ingredient'); // Grab the data-ingredient for comparison
        if (existingIngredient === selectedIngredient) {
            alert("This ingredient has already been added to the list.");
            return;  // Exit if the ingredient is already in the table
        }
    }

    // Add a new row to the "ingredient-list-table"
    const newRow = document.createElement("tr");

    // Create cells for the new row
    const mainIngredientCell = document.createElement("td");
    const qtyCell = document.createElement("td");
    const ingredientCell = document.createElement("td");

    // Create the checkbox for the main ingredient (1st column)
    const mainIngredientCheckbox = document.createElement("input");
    mainIngredientCheckbox.type = "checkbox";
    mainIngredientCheckbox.name = "main-ingredient-checkbox";
    mainIngredientCell.appendChild(mainIngredientCheckbox);

    // Create the input for the quantity (2nd column)
    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.placeholder = "Qty";
    qtyInput.min = "0";  // Ensure no negative values
    qtyCell.appendChild(qtyInput);

    // Set the 3rd column with the ingredient name, unit, and the delete button below the unit
    const ingredientNameElement = document.createElement("span");
    ingredientNameElement.classList.add("ingredient-name");
    ingredientNameElement.textContent = `[${ingID}] ${selectedIngredient}`;

    const ingredientUnitElement = document.createElement("small");
    ingredientUnitElement.classList.add("ingredient-unit");
    ingredientUnitElement.textContent = `(${unitText})`;

    // Create the delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Remove";
    deleteButton.classList.add("deleteButtons");
    deleteButton.onclick = function() {
        ingredientListTableBody.removeChild(newRow);  // Remove the row when "delete" is clicked
    };

    // Append the name, unit, and delete button to the ingredient cell
    ingredientCell.appendChild(ingredientNameElement);
    ingredientCell.appendChild(ingredientUnitElement);
    ingredientCell.appendChild(document.createElement("br"));  // Line break before delete button
    ingredientCell.appendChild(deleteButton);

    // Append the cells to the new row
    newRow.appendChild(mainIngredientCell);
    newRow.appendChild(qtyCell);
    newRow.appendChild(ingredientCell);

    // Set data attributes for the new row (if needed)
    newRow.setAttribute('data-ingredient', selectedIngredient);
    newRow.setAttribute('data-ingredient-assigned-unit', unitText);

    // Append the new row to the ingredient list table body
    ingredientListTableBody.appendChild(newRow);

    // Reset the combobox to its default state
    ingredientComboBox.selectedIndex = 0;
}


/*============================================================*/

function addNewMenuItem() {
    if (!formValidity('menu-item-form')) {
        showNotification("Please fill all the required fields of the 'Menu Item Form' with valid input.", "menu-item-form");
        return;
    }

    // Gather data from the form fields
    const menuItemImage = document.getElementById('preview-image').src;
    const menuItemId = document.getElementById('menu-item-id').value;
    const menuItemName = document.getElementById('menu-item-name').value;
    const menuItemAssignedCategory_ComboBox = document.getElementById("menu-category-combobox");
    const menuItemAssignedCategory = menuItemAssignedCategory_ComboBox.options[menuItemAssignedCategory_ComboBox.selectedIndex].textContent;
    let menuItemPrice = document.getElementById('menu-item-price').value;
    const menuItemDescription = document.getElementById('menu-item-description').value;

    // Check if the menu item name already exists in the menu-item-table
    const menuItemTableBody = document.getElementById('menu-item-table-body');
    for (let row of menuItemTableBody.rows) {
        const existingMenuItemName = row.cells[1].innerText; // The second column contains the menu item name
        if (existingMenuItemName.toLowerCase() === menuItemName.toLowerCase()) {
            showNotification(`A menu item with the name "${menuItemName}" already exists. Please choose a different name.`, "menu-item-form");
            return;
        }
    }

    // Validate price input
    menuItemPrice = parseFloat(menuItemPrice);
    if (isNaN(menuItemPrice) || menuItemPrice <= 0) {
        showNotification(`Invalid price: Please enter a valid number greater than zero for the price.`, "menu-item-form");
        return;
    }
    menuItemPrice = `Php ${menuItemPrice.toFixed(2)}`;

    // Gather ingredients from the ingredient list table
    const ingredientsTable = document.getElementById('ingredient-list-table-body');
    const ingredientsData = [];
    if (ingredientsTable.rows.length === 0) {
        showNotification(`A menu item must have at least one ingredient in its recipe. Please add ingredients.`, "menu-item-form");
        return;
    }

    let mainIngredientSelected = false;
    for (let row of ingredientsTable.rows) {
        const mainIngredientCheckbox = row.cells[0].querySelector('input[type="checkbox"]');
        const quantityConsumed = row.cells[1].querySelector('input').value;
        const ingredientName = row.cells[2].querySelector('.ingredient-name').textContent.trim();
        const ingredientUnit = row.cells[2].querySelector('.ingredient-unit').textContent.trim();
        const formattedIngredientUnit = ingredientUnit.slice(1, -1).trim();

        if (!quantityConsumed || isNaN(parseFloat(quantityConsumed)) || parseFloat(quantityConsumed) <= 0) {
            showNotification(`Invalid quantity for ingredient: ${ingredientName}. Please enter a valid quantity.`, "menu-item-form");
            return;
        }

        if (mainIngredientCheckbox.checked) {
            mainIngredientSelected = true;
        }

        ingredientsData.push({
            ingredientName,
            ingredientUnit: formattedIngredientUnit,
            quantityConsumed: parseFloat(quantityConsumed),
            isMainIngredient: mainIngredientCheckbox.checked
        });
    }

    if (!mainIngredientSelected) {
        showNotification("Please select at least one key ingredient for this menu item.", "menu-item-form");
        return;
    }

    // Create a new row for the menu item table
    const newRow = document.createElement('tr');

    // Add the data to the table row
    newRow.innerHTML = `
      <td><img src="${menuItemImage}" alt="${menuItemName}" id="menu-item-img-column"></td>
      <td>[${menuItemId}] ${menuItemName}</td>
      <td>${menuItemAssignedCategory}</td>
      <td>${menuItemPrice}</td>
    `;

    // Store all data as a data attribute for the row
    newRow.setAttribute('data-menu-item', JSON.stringify({
        imageSrc: menuItemImage,
        id: menuItemId,
        name: menuItemName,
        category: menuItemAssignedCategory,
        price: menuItemPrice,
        description: menuItemDescription,
        ingredients: ingredientsData
    }));

    // Add click event listener to the new row
    newRow.addEventListener('click', function () {
        menuItem_tableRowClicked('data-menu-item', newRow);
        highlightClickedTableRow('menu-item-table', newRow);
    });

    // Append the new row to the menu item table
    menuItemTableBody.appendChild(newRow);

    // Clear the input fields of the form
    clearFormFields('menu-item-table', 'menu-item-form');

    showNotification(`Menu Item Added Successfully!`, "menu-item-form");
}

/*============================================================*/

function menuItem_tableRowClicked(dataRow, row) {
    // Access the data stored in the row's custom attribute
    const rowData = JSON.parse(row.getAttribute(dataRow));

    // Populate the form fields with the data
    document.getElementById('menu-item-id').value = rowData.id;
    document.getElementById('menu-item-name').value = rowData.name;

    const categoryComboBox = document.getElementById('menu-category-combobox');
    for (let i = 0; i < categoryComboBox.options.length; i++) {
        if (categoryComboBox.options[i].textContent === rowData.category) {
            categoryComboBox.selectedIndex = i;
            break;
        }
    }

    // Remove "Php " from the price to get the numeric value
    const rawPrice = rowData.price.replace("Php ", "");

    // Populate the price field with the numeric value
    document.getElementById('menu-item-price').value = rawPrice;
    document.getElementById('menu-item-description').value = rowData.description;

    // Set the image source in the preview image element
    const previewImage = document.getElementById('preview-image');
    previewImage.src = rowData.imageSrc;

    // Clear the existing ingredient list table
    const ingredientListTableBody = document.getElementById('ingredient-list-table-body');
    ingredientListTableBody.innerHTML = '';

    // Repopulate the ingredient list table with the data
    rowData.ingredients.forEach(ingredient => {
        const newRow = document.createElement('tr');

        // Create the checkbox for marking the main ingredient (1st column)
        const mainIngredientCell = document.createElement('td');
        const mainIngredientCheckbox = document.createElement('input');
        mainIngredientCheckbox.type = 'checkbox';
        mainIngredientCheckbox.name = 'main-ingredient-checkbox';
        mainIngredientCheckbox.checked = ingredient.isMainIngredient; // Check if it's the main ingredient
        mainIngredientCell.appendChild(mainIngredientCheckbox);

        // Create the quantity input field (2nd column)
        const qtyCell = document.createElement('td');
        const qtyInput = document.createElement('input');
        qtyInput.type = 'number';
        qtyInput.value = ingredient.quantityConsumed;
        qtyInput.required = true;
        qtyCell.appendChild(qtyInput);

        // Create the ingredient name, unit, and delete button (3rd column)
        const ingredientCell = document.createElement('td');

        // Create the ingredient name element
        const ingredientNameElement = document.createElement("span");
        ingredientNameElement.classList.add("ingredient-name");
        ingredientNameElement.textContent = ingredient.ingredientName;

        // Create the ingredient unit element
        const ingredientUnitElement = document.createElement("small");
        ingredientUnitElement.classList.add("ingredient-unit");
        ingredientUnitElement.textContent = `(${ingredient.ingredientUnit})`;

        // Create the delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Remove";
        deleteButton.classList.add("deleteButtons");
        deleteButton.onclick = function() {
            ingredientListTableBody.removeChild(newRow);  // Remove the row when "delete" is clicked
        };

        // Append the name, unit, and delete button to the ingredient cell
        ingredientCell.appendChild(ingredientNameElement);
        ingredientCell.appendChild(ingredientUnitElement);
        ingredientCell.appendChild(document.createElement("br"));  // Line break before delete button
        ingredientCell.appendChild(deleteButton);  // Append delete button below unit text

        // Append the cells to the new row
        newRow.appendChild(mainIngredientCell);
        newRow.appendChild(qtyCell);
        newRow.appendChild(ingredientCell);

        // Append the new row to the ingredient list table body
        ingredientListTableBody.appendChild(newRow);
    });

    showNotification(`Menu Item Form filled with the selected row's data!`, "menu-item-form");
}

/*============================================================*/

function updateSelectedMenuItem() {
    // Get the selected row with the class "clickedTableRow"
    const selectedRow = document.querySelector('#menu-item-table .clickedTableRow');
    
    if (!selectedRow) {
        showNotification("Please select a row in the 'Menu Item Table' to be updated with what you inputted.", "menu-item-form");
        return;
    }
    
    if (!formValidity('menu-item-form')) {
        showNotification("Please fill all the required fields of the 'Menu Item Form' with valid input to proceed with the update.", "menu-item-form");
        return;
    }

    // Gather updated data from the form fields
    const updatedMenuItemImage = document.getElementById('preview-image').src;
    const updatedMenuItemId = document.getElementById('menu-item-id').value;
    const updatedMenuItemName = document.getElementById('menu-item-name').value;
    const updatedMenuItemAssignedCategory_ComboBox = document.getElementById("menu-category-combobox");
    const updatedMenuItemAssignedCategory = updatedMenuItemAssignedCategory_ComboBox.options[updatedMenuItemAssignedCategory_ComboBox.selectedIndex].textContent;
    let updatedMenuItemPrice = document.getElementById('menu-item-price').value;
    const updatedMenuItemDescription = document.getElementById('menu-item-description').value;

    // Validate price input
    updatedMenuItemPrice = parseFloat(updatedMenuItemPrice); // Convert to a number (float)
    
    if (isNaN(updatedMenuItemPrice) || updatedMenuItemPrice <= 0) {
        showNotification(`Invalid price: Please enter a valid number greater than zero for the price.`, "menu-item-form");
        return; // Exit the function if the price is invalid
    }

    // Format the price to always show two decimal places and add "Php " prefix
    updatedMenuItemPrice = `Php ${updatedMenuItemPrice.toFixed(2)}`;

    // Gather updated ingredients from the ingredient list table
    const ingredientsTable = document.getElementById('ingredient-list-table-body');
    const updatedIngredientsData = [];

    // Check if the ingredient list is empty
    if (ingredientsTable.rows.length === 0) {
        showNotification(`A menu item must have at least one ingredient in its recipe. Please add ingredients.`, "menu-item-form");
        return; // Exit the function if no ingredients are provided
    }

    let mainIngredientSelected = false;
    for (let row of ingredientsTable.rows) {
        const mainIngredientCheckbox = row.cells[0].querySelector('input[type="checkbox"]');
        const quantityConsumed = row.cells[1].querySelector('input').value;
        const ingredientName = row.cells[2].querySelector('.ingredient-name').textContent.trim();
        const ingredientUnit = row.cells[2].querySelector('.ingredient-unit').textContent.trim(); 

        // Remove parentheses from ingredient unit
        const formattedIngredientUnit = ingredientUnit.slice(1, -1).trim(); // Remove first and last character

        // Check for empty or invalid inputs
        if (!quantityConsumed || isNaN(parseFloat(quantityConsumed)) || parseFloat(quantityConsumed) <= 0) {
            showNotification(`Invalid quantity for ingredient: ${ingredientName}. Please enter a valid quantity.`, "menu-item-form");
            return; // Exit the function if the quantity is invalid
        }
        if (!ingredientName) {
            showNotification(`Ingredient name cannot be empty. Please enter a valid ingredient name.`, "menu-item-form");
            return; // Exit the function if the ingredient name is invalid
        }

        // Check if the main ingredient checkbox is checked
        if (mainIngredientCheckbox.checked) {
            mainIngredientSelected = true;
        }

        // Store the updated ingredient data (including unit)
        updatedIngredientsData.push({
            ingredientName,  // Store the name of the ingredient
            ingredientUnit: formattedIngredientUnit, // Store the formatted unit
            quantityConsumed: parseFloat(quantityConsumed),  // Ensure it's a number
            isMainIngredient: mainIngredientCheckbox.checked  // Track if it's the main ingredient
        });
    }

    // Ensure that at least one main ingredient is selected
    if (!mainIngredientSelected) {
        showNotification("Please select at least one key ingredient for this menu item.", "menu-item-form");
        return; // Exit the function if no main ingredient is selected
    }

    // Update the row's HTML with the new values
    selectedRow.innerHTML = `
      <td><img src="${updatedMenuItemImage}" alt="${updatedMenuItemName}" id="menu-item-img-column"></td>
      <td>[${updatedMenuItemId}] ${updatedMenuItemName}</td>
      <td>${updatedMenuItemAssignedCategory}</td>
      <td>${updatedMenuItemPrice}</td>
    `;

    // Update the data attribute for the selected row
    selectedRow.setAttribute('data-menu-item', JSON.stringify({
        imageSrc: updatedMenuItemImage,
        id: updatedMenuItemId,
        name: updatedMenuItemName,
        category: updatedMenuItemAssignedCategory,
        price: updatedMenuItemPrice,
        description: updatedMenuItemDescription,
        ingredients: updatedIngredientsData  // Store the updated ingredient data including unit and main ingredient
    }));

    // Clear the input fields of the form
    clearFormFields('menu-item-table', 'menu-item-form');

    showNotification(`Menu Item Updated Successfully!`, "menu-item-form");
}

/*============================================================*/










/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/










/*============================================================*/

function addNewMenuCategory() {

    if (!formValidity('menu-category-form')) {
        showNotification("Please fill all the required fields of the 'Menu Category Form' with valid input.", "menu-category-form");
        return;
    }

    // Get the values of the input fields
    const menuCategoryID = document.getElementById("menu-category-id").value;
    const menuCategoryName = document.getElementById("menu-category-name").value;

    // Get the table and search for a row where the 2nd column matches the menu category name
    const table = document.getElementById("menu-category-table");
    const rows = table.querySelectorAll("tbody tr");

    // Check if the category already exists in the 2nd column
    for (const row of rows) {
        const existingCategoryName = row.cells[1].textContent.trim();
        if (existingCategoryName.toLowerCase() === menuCategoryName.toLowerCase()) {
            showNotification("This 'Menu Category' already exists!", "menu-category-form");
            return;
        }
    }

    // Create a new table row element
    const newRow = document.createElement("tr");

    // Store category data as an object with clear keys
    const menuCategoryData = {
        id: menuCategoryID,
        name: menuCategoryName
    };

    // Set the data object as a custom attribute on the row
    newRow.setAttribute("data-menu-category", JSON.stringify(menuCategoryData));

    // Create cells for the row
    newRow.innerHTML = `
        <td>${menuCategoryID}</td>
        <td>${menuCategoryName}</td>
    `;

    // Add a click event listener to the new row
    newRow.addEventListener('click', function () {
        menuCategory_tableRowClicked('data-menu-category', newRow);
        highlightClickedTableRow('menu-category-table', newRow);
    });

    // Append the new row to the table body
    table.querySelector("tbody").appendChild(newRow);

    // Add the new category to the combobox with its ID and name
    const menuCategoryComboBox = document.getElementById("menu-category-combobox");
    menuCategoryComboBox.add(new Option(menuCategoryName, menuCategoryID));

    // Clear the input fields of the form
    clearFormFields('menu-category-table', 'menu-category-form');

    showNotification(`Menu Category Added Successfully!`, "menu-category-form");
}

/*============================================================*/

function menuCategory_tableRowClicked(dataRow, row) {
    // Access the data stored in the row's custom attribute as an object
    const rowData = JSON.parse(row.getAttribute(dataRow));

    // Set the input fields with the corresponding values
    document.getElementById("menu-category-id").value = rowData.id;
    document.getElementById("menu-category-name").value = rowData.name;
}

/*============================================================*/

function updateSelectedMenuCategory() {
    // Find the currently selected row
    const selectedRow = document.querySelector("#menu-category-table .clickedTableRow");

    // Check if a row is selected
    if (!selectedRow) {
        showNotification(
            "Please select a row in the 'Menu Category Table' to update with your input.",
            "menu-category-form"
        );
        return;
    }

    // Validate the form inputs
    if (!formValidity('menu-category-form')) {
        showNotification(
            "Please fill all the required fields of the 'Menu Category Form' with valid input.",
            "menu-category-form"
        );
        return;
    }

    // Get values from the input fields
    const menuCategoryID = document.getElementById("menu-category-id").value;
    const menuCategoryName = document.getElementById("menu-category-name").value;

    // Update the data-menu-category attribute with new data as an object
    const menuCategoryData = {
        id: menuCategoryID,
        name: menuCategoryName
    };
    selectedRow.setAttribute("data-menu-category", JSON.stringify(menuCategoryData));

    // Update the visible content of the row cells
    const cells = selectedRow.querySelectorAll("td");
    if (cells.length >= 2) {
        cells[0].textContent = menuCategoryID;   // Update the ID cell
        cells[1].textContent = menuCategoryName; // Update the Name cell
    }

    showNotification("Menu Category Updated Successfully!", "menu-category-form");

    // Update the combo box with the new data
    repopulateComboBoxFromTable("menu-category-table", "data-menu-category", "menu-category-combobox");

    // Clear the input fields of the form
    clearFormFields('menu-category-table', 'menu-category-form');
}

/*============================================================*/










/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/










/*============================================================*/

function addNewIngredient() {
    if (!formValidity('ingredient-form')) {
        showNotification("Please fill all the required fields of the 'Ingredient Form' with valid input.", "ingredient-form");
        return;
    }

    // Get input values
    const ingredientID = document.getElementById("ingredient-id").value.trim();
    const ingredientName = document.getElementById("ingredient-name").value.trim();
    const categoryComboBox = document.getElementById("ingredient-category-combobox");
    const assignedCategory = categoryComboBox.options[categoryComboBox.selectedIndex].textContent;
    const unitComboBox = document.getElementById("ingredient-unit-combobox");
    const assignedUnit = unitComboBox.options[unitComboBox.selectedIndex].textContent;
    const lowStockThreshold = parseFloat(document.getElementById("ingredient-low-stock-threshold").value);
    const mediumStockThreshold = parseFloat(document.getElementById("ingredient-medium-stock-threshold").value);
    const reorderPoint = parseFloat(document.getElementById("ingredient-reorder-point").value);

    // Default total quantity
    const totalQuantity = 0;
    const formattedQuantity = `${totalQuantity} ${assignedUnit}`;

    // Check for duplicate ingredient name in the table
    const table = document.getElementById("ingredient-table");
    const existingRows = table.querySelectorAll("tbody tr");

    for (const row of existingRows) {
        const existingName = row.cells[1].textContent.split('] ')[1].trim();
        if (existingName.toLowerCase() === ingredientName.toLowerCase()) {
            showNotification("This 'Ingredient' already exists!", "ingredient-form");
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
        lowStock: lowStockThreshold,
        mediumStock: mediumStockThreshold,
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
    ingredientCell.textContent = `[${ingredientID}] ${ingredientName}`;
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
    showNotification(`Ingredient Added Successfully!`, "ingredient-form");
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
    document.getElementById("ingredient-low-stock-threshold").value = rowData.lowStock;
    document.getElementById("ingredient-medium-stock-threshold").value = rowData.mediumStock;
    document.getElementById("ingredient-reorder-point").value = rowData.reorderPoint;
}

/*============================================================*/

function updateSelectedIngredient() {
    // Find the currently selected row
    const selectedRow = document.querySelector("#ingredient-table .clickedTableRow");

    // Check if a row is selected
    if (!selectedRow) {
        showNotification(
            "Please select a row in the 'Ingredient Table' to update with your input.",
            "ingredient-form"
        );
        return;
    }

    // Validate the form inputs
    if (!formValidity('ingredient-form')) {
        showNotification(
            "Please fill all the required fields of the 'Ingredient Form' with valid input to proceed.",
            "ingredient-form"
        );
        return;
    }

    // Retrieve input values
    const ingredientID = document.getElementById("ingredient-id").value.trim();
    const ingredientName = document.getElementById("ingredient-name").value.trim();
    const ingredientCategory = getSelectedComboBoxText("ingredient-category-combobox");
    const ingredientUnit = getSelectedComboBoxText("ingredient-unit-combobox");
    const lowStockThreshold = parseInt(document.getElementById("ingredient-low-stock-threshold").value, 10);
    const mediumStockThreshold = parseInt(document.getElementById("ingredient-medium-stock-threshold").value, 10);
    const reorderPoint = parseInt(document.getElementById("ingredient-reorder-point").value, 10);

    // Ensure input integrity
    if (!ingredientID || !ingredientName) {
        showNotification("Ingredient ID and Name cannot be empty.", "ingredient-form");
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
            lowStock: lowStockThreshold,
            mediumStock: mediumStockThreshold,
            reorderPoint: reorderPoint,
            quantity: existingQuantity
        };

        // Update the row's data attribute
        selectedRow.setAttribute("data-ingredient", JSON.stringify(updatedIngredientData));

        // Update the visible table cells
        const cells = selectedRow.querySelectorAll("td");
        if (cells.length >= 4) {
            cells[1].textContent = `[${ingredientID}] ${ingredientName}`;
            cells[2].textContent = ingredientCategory;

            // Create or update the <span> inside the quantity cell
            let quantitySpan = cells[3].querySelector("span");
            if (!quantitySpan) {
                quantitySpan = document.createElement("span");
                cells[3].appendChild(quantitySpan);
            }
            quantitySpan.textContent = formattedQuantity;
        }

        // Optional: Highlight the updated row for visual feedback
        animateRowHighlight(selectedRow);

        // Show success notification
        showNotification("Ingredient Updated Successfully!", "ingredient-form");

        // Repopulate the combobox with the updated ingredient data
        repopulateComboBoxFromTable("ingredient-table", "data-ingredient", "ingredient-name-combobox");

        // Clear the form fields
        clearFormFields("ingredient-table", "ingredient-form");
    } catch (error) {
        console.error("Failed to update the ingredient:", error);
        showNotification("An error occurred while updating the ingredient. Please try again.", "ingredient-form");
    }
}

/*============================================================*/










/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/










/*============================================================*/

function addNewIngredientCategory() {
    if (!formValidity('ingredient-category-form')) {
        showNotification("Please fill all the required fields of the 'Ingredient Category Form' with valid input.", "ingredient-category-form");
        return;
    }

    // Gather data from the form fields
    const ingredientCategoryID = document.getElementById("ingredient-category-id").value;
    const ingredientCategoryName = document.getElementById("ingredient-category-name").value;

    // Check if the ingredient category already exists in the table
    const tableBody = document.getElementById("ingredient-category-table").querySelector("tbody");
    for (const row of tableBody.rows) {
        const existingCategoryName = row.cells[1].textContent.trim();
        if (existingCategoryName.toLowerCase() === ingredientCategoryName.toLowerCase()) {
            showNotification("This 'Ingredient Category' already exists!", "ingredient-category-form");
            return;
        }
    }

    // Create a new row for the ingredient category table
    const newRow = document.createElement("tr");

    // Store data as an object and attach it as a data attribute
    const ingredientCategoryData = {
        id: ingredientCategoryID,
        name: ingredientCategoryName
    };
    newRow.setAttribute("data-ingredient-category", JSON.stringify(ingredientCategoryData));

    // Populate the row's cells
    newRow.innerHTML = `
        <td>${ingredientCategoryID}</td>
        <td>${ingredientCategoryName}</td>
    `;

    // Add click event listener to the new row
    newRow.addEventListener('click', function () {
        ingredientCategory_tableRowClicked('data-ingredient-category', newRow);
        highlightClickedTableRow('ingredient-category-table', newRow);
    });

    // Append the new row to the table body
    tableBody.appendChild(newRow);

    // Add the new category to the combo box
    const ingredientCategoryComboBox = document.getElementById("ingredient-category-combobox");
    ingredientCategoryComboBox.add(new Option(ingredientCategoryName, ingredientCategoryID));

    // Clear the form fields
    clearFormFields('ingredient-category-table', 'ingredient-category-form');

    // Show a success notification
    showNotification(`Ingredient Category Added Successfully!`, "ingredient-category-form");
}

/*============================================================*/

function ingredientCategory_tableRowClicked(dataRow, row) {
    // Access the data stored in the row's custom attribute
    const rowData = JSON.parse(row.getAttribute(dataRow));

    // Set the form fields with the retrieved data
    document.getElementById("ingredient-category-id").value = rowData.id;
    document.getElementById("ingredient-category-name").value = rowData.name;
}

/*============================================================*/

function updateSelectedIngredientCategory() {
    // Find the currently selected row
    const selectedRow = document.querySelector("#ingredient-category-table .clickedTableRow");

    // Check if a row is selected
    if (!selectedRow) {
        showNotification("Please select a row in the ingredient category table to be updated with what you inputted.", "ingredient-category-form");
        return;
    }

    // Validate form input
    if (!formValidity('ingredient-category-form')) {
        showNotification("Please fill all the required fields of the 'Ingredient Category Form' with valid input to proceed with the update.", "ingredient-category-form");
        return;
    }

    // Get the values from the input fields
    const ingredientCategoryID = document.getElementById("ingredient-category-id").value;
    const ingredientCategory = document.getElementById("ingredient-category-name").value;

    // Create an object to store the ingredient category data
    const ingredientCategoryData = {
        id: ingredientCategoryID,
        name: ingredientCategory
    };

    // Update the data-ingredient-category attribute with the new data
    selectedRow.setAttribute("data-ingredient-category", JSON.stringify(ingredientCategoryData));

    // Update the displayed cell contents
    const cells = selectedRow.querySelectorAll("td");
    if (cells.length >= 2) {
        cells[0].textContent = ingredientCategoryID; // Update the ID cell
        cells[1].textContent = ingredientCategory;    // Update the name cell
        showNotification(`Ingredient Category Updated Successfully!`, "ingredient-category-form");
    }

    // Repopulate the combo box from the table
    repopulateComboBoxFromTable("ingredient-category-table", "data-ingredient-category", "ingredient-category-combobox");

    // Clear the input fields of the form
    clearFormFields('ingredient-category-table', 'ingredient-category-form');
}

/*============================================================*/










/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/










/*============================================================*/

function addNewIngredientUnit() {
    if (!formValidity('ingredient-unit-form')) {
        showNotification("Please fill all the required fields of the 'Ingredient Unit Form' with valid input.", "ingredient-unit-form");
        return;
    }

    // Get the values of the input fields
    const ingredientUnitID = document.getElementById("ingredient-unit-id").value;
    const ingredientUnit = document.getElementById("ingredient-unit-name").value;

    // Get the table and search for the row where the 2nd column matches the ingredient name
    const table = document.getElementById("ingredient-unit-table");
    const rows = table.querySelectorAll("tbody tr");

    // Check if the ingredient already exists in the 2nd column
    for (const row of rows) {
        const cells = row.getElementsByTagName("td");
        const existingIngredientUnit = cells[1].textContent.trim();

        if (existingIngredientUnit.toLowerCase() === ingredientUnit.toLowerCase()) {
            showNotification("This 'Ingredient Unit' already exists!", "ingredient-unit-form");
            return; // Exit if the ingredient already exists
        }
    }

    // Create a new table row element
    const newRow = document.createElement("tr");

    // Create an object for ingredient unit data
    const ingredientUnitData = {
        id: ingredientUnitID,
        name: ingredientUnit
    };

    // Setting ingredient unit data as a custom attribute on the row
    newRow.setAttribute("data-ingredient-unit", JSON.stringify(ingredientUnitData));  

    // Creating cells
    const ingredientUnitIDCell = document.createElement("td");
    const ingredientUnitCell = document.createElement("td");

    // Setting cell contents
    ingredientUnitIDCell.textContent = ingredientUnitID;
    ingredientUnitCell.textContent = ingredientUnit;

    // Append cells to the new row
    newRow.appendChild(ingredientUnitIDCell);
    newRow.appendChild(ingredientUnitCell);

    // Add click event listener to the new row
    newRow.addEventListener('click', function () {
        ingredientUnit_tableRowClicked('data-ingredient-unit', newRow); // Call the callback function when a row is clicked
        highlightClickedTableRow('ingredient-unit-table', newRow); // Call the callback function when a row is clicked
    });

    // Append the new row to the table body
    document.getElementById("ingredient-unit-table").querySelector("tbody").appendChild(newRow);

    // Clear the input fields of the form
    clearFormFields('ingredient-unit-table', 'ingredient-unit-form');

    const ingredientUnit_comboBox = document.getElementById("ingredient-unit-combobox");
    ingredientUnit_comboBox.add(new Option(ingredientUnit, ingredientUnitID));

    showNotification(`Ingredient Unit Added Successfully!`, "ingredient-unit-form");
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
        showNotification("Please select a row in the 'Ingredient Unit Table' to be updated with what you inputted.", "ingredient-unit-form");
        return;
    }

    if (!formValidity('ingredient-unit-form')) {
        showNotification("Please fill all the required fields of the 'Ingredient Unit Form' with valid input.", "ingredient-unit-form");
        return;
    }

    // Get the values from the input fields
    const ingredientUnitID = document.getElementById("ingredient-unit-id").value;
    const ingredientUnit = document.getElementById("ingredient-unit-name").value;

    // Create an object to hold the updated data
    const ingredientUnitData = {
        id: ingredientUnitID,
        name: ingredientUnit
    };

    // Update the data-ingredient-unit attribute with the new data
    selectedRow.setAttribute("data-ingredient-unit", JSON.stringify(ingredientUnitData));

    // Update the displayed cell contents
    const cells = selectedRow.querySelectorAll("td");
    if (cells.length >= 2) {
        cells[0].textContent = ingredientUnitID; // Update the ID cell
        cells[1].textContent = ingredientUnit;    // Update the name cell
        showNotification(`Ingredient Unit Updated Successfully!`, "ingredient-unit-form");
    }
    
    // Repopulate the combo box to reflect changes
    repopulateComboBoxFromTable("ingredient-unit-table", "data-ingredient-unit", "ingredient-unit-combobox");

    // Clear the input fields of the form
    clearFormFields('ingredient-unit-table', 'ingredient-unit-form');
}

/*============================================================*/










/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/