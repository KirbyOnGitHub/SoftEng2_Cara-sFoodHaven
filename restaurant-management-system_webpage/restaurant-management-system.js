


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
        } else {
            showNotification(`Table with ID "${tableId}" not found.`,formId);
        }
    } else {
        showNotification(`Form with ID "${formId}" not found.`,formId);
    }

    if(ifAlert == "YES") {
        showNotification("Form successfully cleared!\nSelected row has been deselected!",formId)
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
    } else;{
        return true;
    }
}

/*============================================================*/

function highlightClickedTableRow(tableId, row) {
    // Get the table by the provided tableId
    const table = document.getElementById(tableId);

    // Check if the table exists
    if (!table) {
        console.error(`Table with ID ${tableId} not found.`);
        return;
    }

    // Find the previously clicked row within the specified table
    const previouslyClickedRow = table.querySelector(".clickedTableRow");
    if (previouslyClickedRow && previouslyClickedRow !== row) {
        previouslyClickedRow.classList.remove("clickedTableRow");
    }

    // Add "clickedTableRow" class to the currently clicked row
    row.classList.add("clickedTableRow");
}

/*============================================================*/

// Function to show the notification inside a specified form
function showNotification(message, formId) {
    // Find the form by its ID
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Form with ID "${formId}" not found.`);
        return;
    }

    // Check if there's already a notification inside the form
    const existingNotification = form.querySelector('.notification');

    if (existingNotification) {
        // If the existing notification message is the same, do nothing
        if (existingNotification.innerText === message) {
            existingNotification.remove();
            showNotification(message, formId);
            return;
        } else {
            existingNotification.remove();
            showNotification(message, formId);
            return;
        }
    }

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










/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/










/*============================================================*/

function fillMenuCategoryForm() {
    const menuCategoryID = document.getElementById("menu-category-id").value;

    if(!menuCategoryID) {
        showNotification("Please enter the ID of the menu category to auto-fill the form.","menu-category-form");
        return;
    }

    // Get the table by the provided tableId
    const table = document.getElementById('menu-category-table');

    // Get all rows from the table body
    const rows = table.querySelectorAll("tbody tr");

    // Check if the table is empty
    if (rows.length === 0) {
        showNotification("The menu category table is empty. There are no rows to search.","menu-category-form");
        return;
    }

    // Iterate through each row to find a matching menuCategoryID
    rows.forEach(row => {
        const rowData = JSON.parse(row.getAttribute("data-menuCategory"));
        
        // Check if the menuCategoryID matches
        if (rowData.menuCategoryID === menuCategoryID) {
            // Programmatically click the row
            row.click(); // This will trigger the event listener for row clicks
        } else {
            showNotification("No menu category with that ID found!","menu-category-form");
            return;
        }
    });
}

/*============================================================*/

function addNewMenuCategory() {

  // Get the values of the input fields
  const menuCategoryID = document.getElementById("menu-category-id").value;
  const menuCategory = document.getElementById("menu-category-name").value;

  if(!formValidity('menu-category-form')) {
    showNotification("Please fill all the required fields of the menu item form.","menu-category-form");
    return;
  }

  // Create a new table row element
  const newRow = document.createElement("tr");

  // Creating menuCategory data object
  const menuCategoryData = [
      menuCategoryID,
      menuCategory
  ];

  // Setting menuItem data as a custom attribute on the row
  newRow.setAttribute("data-menuCategory", JSON.stringify(menuCategoryData));  

  // Creating cells
  const menuCategoryIDCell = document.createElement("td");
  const menuCategoryCell = document.createElement("td");

  // Setting cell contents
  menuCategoryIDCell.textContent = menuCategoryID;
  menuCategoryCell.textContent = menuCategory;

  // Append cells to the new row
  newRow.appendChild(menuCategoryIDCell);
  newRow.appendChild(menuCategoryCell);

  // Add click event listener to the new row
  newRow.addEventListener('click', function () {
    menuCategory_tableRowClicked('data-menuCategory',newRow); // Call the callback function when a row is clicked
    highlightClickedTableRow('menu-category-table',newRow); // Call the callback function when a row is clicked
  });

  // Append the new row to the table body
  document.getElementById("menu-category-table").querySelector("tbody").appendChild(newRow);

  // Clear the input fields of the form
  clearFormFields('menu-category-table','menu-category-form');

  const menuCategory_comboBox = document.getElementById("menu-category-combobox");
  menuCategory_comboBox.add(new Option(menuCategory));
//   menuCategory_comboBox.add(new Option(menuCategory,menuCategoryID));

  showNotification(`Menu Category Added Successfully!`,"menu-category-form");
}

/*============================================================*/

function menuCategory_tableRowClicked(dataRow,row) {
    // Access the data stored in the row's custom attribute
    const rowData = JSON.parse(row.getAttribute(dataRow));

    document.getElementById("menu-category-id").value = rowData[0];
    document.getElementById("menu-category-name").value = rowData[1];
}

/*============================================================*/

function updateSelectedMenuCategory() {

    // Get the values from the input fields
    const menuCategoryID = document.getElementById("menu-category-id").value;
    const menuCategory = document.getElementById("menu-category-name").value;

    // Find the currently selected row
    const selectedRow = document.querySelector("#menu-category-table .clickedTableRow");

    // Check if a row is selected
    if (!selectedRow) {
        showNotification("Please select a row in the menu category table to be updated with what you inputted.","menu-category-form");
        return;
    }

    // Update the data-menuCategory attribute with the new data
    const menuCategoryData = [
        menuCategoryID,
        menuCategory
    ];

    selectedRow.setAttribute("data-menuCategory", JSON.stringify(menuCategoryData));

    // Update the displayed cell contents
    const cells = selectedRow.querySelectorAll("td");
    if (cells.length >= 2) {
        cells[0].textContent = menuCategoryID; // Update the ID cell
        cells[1].textContent = menuCategory;    // Update the name cell
        showNotification(`Menu Category Updated Successfully!`,"menu-category-form");
    }

    // Clear the input fields of the form
    clearFormFields('menu-category-table','menu-category-form');
}

/*============================================================*/

function deleteSelectedMenuCategory() {
    // Get the table by ID
    const table = document.getElementById("menu-category-table");

    // Find the currently selected row
    const selectedRow = table.querySelector(".clickedTableRow");

    // Check if a row is selected
    if (!selectedRow) {
        showNotification("Please select a row in the menu category table to be deleted.","menu-category-form");
        return;
    }

    // If a selected row is found, remove it
    if (selectedRow) {
        showNotification(`Menu Category Deleted Successfully!`,"menu-category-form");
        selectedRow.remove(); // Remove the row from the table
    }

    // Clear the input fields of the form
    clearFormFields('menu-category-table','menu-category-form');
}

/*============================================================*/










/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/










/*============================================================*/

function fillIngredientForm() {
    const ingredientID = document.getElementById("ingredient-id").value;

    if(!ingredientID) {
        showNotification("Please enter the ID of the ingredient to auto-fill the form.","ingredient-form");
        return;
    }

    // Get the table by the provided tableId
    const table = document.getElementById('ingredient-table');

    // Get all rows from the table body
    const rows = table.querySelectorAll("tbody tr");

    // Check if the table is empty
    if (rows.length === 0) {
        showNotification("The ingredient table is empty. There are no rows to search.","ingredient-form");
        return;
    }

    // Iterate through each row to find a matching ingredientID
    rows.forEach(row => {
        const rowData = JSON.parse(row.getAttribute("data-ingredient"));
        
        // Check if the ingredientID matches
        if (rowData.ingredientID === ingredientID) {
            // Programmatically click the row
            row.click(); // This will trigger the event listener for row clicks
        } else {
            showNotification("No ingredient with that ID found!","ingredient-form");
            return;
        }
    });
}

/*============================================================*/

function addNewIngredient() {

  // Get the values of the input fields
  const ingredientID = document.getElementById("ingredient-id").value;
  const ingredientName = document.getElementById("ingredient-name").value;
  const ingredientAssignedCategory = document.getElementById("ingredient-category-combobox").value;
  const ingredientAssignedUnit = document.getElementById("ingredient-unit-combobox").value;
  const ingredientLowStockThreshold = document.getElementById("ingredient-low-stock-threshold").value;
  const ingredientMediumStockThreshold = document.getElementById("ingredient-medium-stock-threshold").value;

  if(!formValidity('ingredient-form')) {
    showNotification("Please fill all the required fields of the ingredient form.","ingredient-form");
    return;
  }

  // Create a new table row element
  const newRow = document.createElement("tr");

  // Creating ingredient data object
  const ingredientData = [
      ingredientID,
      ingredientName,
      ingredientAssignedCategory,
      ingredientAssignedUnit,
      ingredientLowStockThreshold,
      ingredientMediumStockThreshold
  ];

  // Setting ingredientItem data as a custom attribute on the row
  newRow.setAttribute("data-ingredient", JSON.stringify(ingredientData));  

  // Creating cells
  const ingredientIDCell = document.createElement("td");
  const ingredientNameCell = document.createElement("td");
  const ingredientAssignedCategoryCell = document.createElement("td");
  const ingredientAssignedUnitCell = document.createElement("td");

  // Setting cell contents
  ingredientIDCell.textContent = ingredientID;
  ingredientNameCell.textContent = ingredientName;
  ingredientAssignedCategoryCell.textContent = ingredientAssignedCategory;
  ingredientAssignedUnitCell.textContent = ingredientAssignedUnit;

  // Append cells to the new row
  newRow.appendChild(ingredientIDCell);
  newRow.appendChild(ingredientNameCell);
  newRow.appendChild(ingredientAssignedCategoryCell);
  newRow.appendChild(ingredientAssignedUnitCell);

  // Add click event listener to the new row
  newRow.addEventListener('click', function () {
    ingredient_tableRowClicked('data-ingredient',newRow); // Call the callback function when a row is clicked
    highlightClickedTableRow('ingredient-table',newRow); // Call the callback function when a row is clicked
  });

  // Append the new row to the table body
  document.getElementById("ingredient-table").querySelector("tbody").appendChild(newRow);

  // Clear the input fields of the form
  clearFormFields('ingredient-table','ingredient-form');

  const ingredient_comboBox = document.getElementById("ingredient-name-combobox");
  ingredient_comboBox.add(new Option(ingredientName));
//   ingredient_comboBox.add(new Option(ingredientName,ingredientID));

  showNotification(`Ingredient Added Successfully!`,"ingredient-form");
}

/*============================================================*/

function ingredient_tableRowClicked(dataRow,row) {
    // Access the data stored in the row's custom attribute
    const rowData = JSON.parse(row.getAttribute(dataRow));

    document.getElementById("ingredient-id").value = rowData[0];
    document.getElementById("ingredient-name").value = rowData[1];
    document.getElementById("ingredient-category-combobox").value = rowData[2];
    document.getElementById("ingredient-unit-combobox").value = rowData[3];
    document.getElementById("ingredient-low-stock-threshold").value = rowData[4];
    document.getElementById("ingredient-medium-stock-threshold").value = rowData[5];
}

/*============================================================*/

function updateSelectedIngredient() {

  // Get the values of the input fields
  const ingredientID = document.getElementById("ingredient-id").value;
  const ingredientName = document.getElementById("ingredient-name").value;
  const ingredientAssignedCategory = document.getElementById("ingredient-category-combobox").value;
  const ingredientAssignedUnit = document.getElementById("ingredient-unit-combobox").value;
  const ingredientLowStockThreshold = document.getElementById("ingredient-low-stock-threshold").value;
  const ingredientMediumStockThreshold = document.getElementById("ingredient-medium-stock-threshold").value;

    // Find the currently selected row
    const selectedRow = document.querySelector("#ingredient-table .clickedTableRow");

    // Check if a row is selected
    if (!selectedRow) {
        showNotification("Please select a row in the ingredient table to be updated with what you inputted.","ingredient-form");
        return;
    }

    // Update the data-ingredient attribute with the new data
  const ingredientData = [
    ingredientID,
    ingredientName,
    ingredientAssignedCategory,
    ingredientAssignedUnit,
    ingredientLowStockThreshold,
    ingredientMediumStockThreshold
];

    selectedRow.setAttribute("data-ingredient", JSON.stringify(ingredientData));

    // Update the displayed cell contents
    const cells = selectedRow.querySelectorAll("td");
    if (cells.length >= 4) {
        cells[0].textContent = ingredientID; 
        cells[1].textContent = ingredientName; 
        cells[2].textContent = ingredientAssignedCategory;    
        cells[3].textContent = ingredientAssignedUnit;    
        showNotification(`Ingredient Updated Successfully!`,"ingredient-form");
    }

    // Clear the input fields of the form
    clearFormFields('ingredient-table','ingredient-form');
}

/*============================================================*/

function deleteSelectedIngredient() {
    // Get the table by ID
    const table = document.getElementById("ingredient-table");

    // Find the currently selected row
    const selectedRow = table.querySelector(".clickedTableRow");

    // Check if a row is selected
    if (!selectedRow) {
        showNotification("Please select a row in the ingredient table to be deleted.","ingredient-form");
        return;
    }

    // If a selected row is found, remove it
    if (selectedRow) {
        showNotification(`Ingredient Deleted Successfully!`,"ingredient-cform");
        selectedRow.remove(); // Remove the row from the table
    }

    // Clear the input fields of the form
    clearFormFields('ingredient-table','ingredient-form');
}

/*============================================================*/










/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/










/*============================================================*/

function fillIngredientCategoryForm() {
    const ingredientCategoryID = document.getElementById("ingredient-category-id").value;

    if(!ingredientCategoryID) {
        showNotification("Please enter the ID of the ingredient category to auto-fill the form.","ingredient-category-form");
        return;
    }

    // Get the table by the provided tableId
    const table = document.getElementById('ingredient-category-table');

    // Get all rows from the table body
    const rows = table.querySelectorAll("tbody tr");

    // Check if the table is empty
    if (rows.length === 0) {
        showNotification("The ingredient category table is empty. There are no rows to search.","ingredient-category-form");
        return;
    }

    // Iterate through each row to find a matching ingredientCategoryID
    rows.forEach(row => {
        const rowData = JSON.parse(row.getAttribute("data-ingredientCategory"));
        
        // Check if the ingredientCategoryID matches
        if (rowData.ingredientCategoryID === ingredientCategoryID) {
            // Programmatically click the row
            row.click(); // This will trigger the event listener for row clicks
        } else {
            showNotification("No ingredient category with that ID found!","ingredient-category-form");
            return;
        }
    });
}

/*============================================================*/

function addNewIngredientCategory() {

  // Get the values of the input fields
  const ingredientCategoryID = document.getElementById("ingredient-category-id").value;
  const ingredientCategory = document.getElementById("ingredient-category-name").value;

  if(!formValidity('ingredient-category-form')) {
    showNotification("Please fill all the required fields of the ingredient form.","ingredient-category-form");
    return;
  }

  // Create a new table row element
  const newRow = document.createElement("tr");

  // Creating ingredientCategory data object
  const ingredientCategoryData = [
      ingredientCategoryID,
      ingredientCategory
  ];

  // Setting ingredientItem data as a custom attribute on the row
  newRow.setAttribute("data-ingredientCategory", JSON.stringify(ingredientCategoryData));  

  // Creating cells
  const ingredientCategoryIDCell = document.createElement("td");
  const ingredientCategoryCell = document.createElement("td");

  // Setting cell contents
  ingredientCategoryIDCell.textContent = ingredientCategoryID;
  ingredientCategoryCell.textContent = ingredientCategory;

  // Append cells to the new row
  newRow.appendChild(ingredientCategoryIDCell);
  newRow.appendChild(ingredientCategoryCell);

  // Add click event listener to the new row
  newRow.addEventListener('click', function () {
    ingredientCategory_tableRowClicked('data-ingredientCategory',newRow); // Call the callback function when a row is clicked
    highlightClickedTableRow('ingredient-category-table',newRow); // Call the callback function when a row is clicked
  });

  // Append the new row to the table body
  document.getElementById("ingredient-category-table").querySelector("tbody").appendChild(newRow);

  // Clear the input fields of the form
  clearFormFields('ingredient-category-table','ingredient-category-form');

  const ingredientCategory_comboBox = document.getElementById("ingredient-category-combobox");
  ingredientCategory_comboBox.add(new Option(ingredientCategory));
//   ingredientCategory_comboBox.add(new Option(ingredientCategory,ingredientCategoryID));

  showNotification(`Ingredient Category Added Successfully!`,"ingredient-category-form");
}

/*============================================================*/

function ingredientCategory_tableRowClicked(dataRow,row) {
    // Access the data stored in the row's custom attribute
    const rowData = JSON.parse(row.getAttribute(dataRow));

    document.getElementById("ingredient-category-id").value = rowData[0];
    document.getElementById("ingredient-category-name").value = rowData[1];
}

/*============================================================*/

function updateSelectedIngredientCategory() {

    // Get the values from the input fields
    const ingredientCategoryID = document.getElementById("ingredient-category-id").value;
    const ingredientCategory = document.getElementById("ingredient-category-name").value;

    // Find the currently selected row
    const selectedRow = document.querySelector("#ingredient-category-table .clickedTableRow");

    // Check if a row is selected
    if (!selectedRow) {
        showNotification("Please select a row in the ingredient category table to be updated with what you inputted.","ingredient-category-form");
        return;
    }

    // Update the data-ingredientCategory attribute with the new data
    const ingredientCategoryData = [
        ingredientCategoryID,
        ingredientCategory
    ];

    selectedRow.setAttribute("data-ingredientCategory", JSON.stringify(ingredientCategoryData));

    // Update the displayed cell contents
    const cells = selectedRow.querySelectorAll("td");
    if (cells.length >= 2) {
        cells[0].textContent = ingredientCategoryID; // Update the ID cell
        cells[1].textContent = ingredientCategory;    // Update the name cell
        showNotification(`Ingredient Category Updated Successfully!`,"ingredient-category-form");
    }

    // Clear the input fields of the form
    clearFormFields('ingredient-category-table','ingredient-category-form');
}

/*============================================================*/

function deleteSelectedIngredientCategory() {
    // Get the table by ID
    const table = document.getElementById("ingredient-category-table");

    // Find the currently selected row
    const selectedRow = table.querySelector(".clickedTableRow");

    // Check if a row is selected
    if (!selectedRow) {
        showNotification("Please select a row in the ingredient category table to be deleted.","ingredient-category-form");
        return;
    }

    // If a selected row is found, remove it
    if (selectedRow) {
        showNotification(`Ingredient Category Deleted Successfully!`,"ingredient-category-form");
        selectedRow.remove(); // Remove the row from the table
    }

    // Clear the input fields of the form
    clearFormFields('ingredient-category-table','ingredient-category-form');
}

/*============================================================*/










/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/










/*============================================================*/

function fillIngredientUnitForm() {
    const ingredientUnitID = document.getElementById("ingredient-unit-id").value;

    if(!ingredientUnitID) {
        showNotification("Please enter the ID of the ingredient unit to auto-fill the form.","ingredient-unit-form");
        return;
    }

    // Get the table by the provided tableId
    const table = document.getElementById('ingredient-unit-table');

    // Get all rows from the table body
    const rows = table.querySelectorAll("tbody tr");

    // Check if the table is empty
    if (rows.length === 0) {
        showNotification("The ingredient unit table is empty. There are no rows to search.","ingredient-unit-form");
        return;
    }

    // Iterate through each row to find a matching ingredientUnitID
    rows.forEach(row => {
        const rowData = JSON.parse(row.getAttribute("data-ingredientUnit"));
        
        // Check if the ingredientUnitID matches
        if (rowData.ingredientUnitID === ingredientUnitID) {
            // Programmatically click the row
            row.click(); // This will trigger the event listener for row clicks
        } else {
            showNotification("No ingredient unit with that ID found!","ingredient-unit-form");
            return;
        }
    });
}

/*============================================================*/

function addNewIngredientUnit() {

  // Get the values of the input fields
  const ingredientUnitID = document.getElementById("ingredient-unit-id").value;
  const ingredientUnit = document.getElementById("ingredient-unit-name").value;

  if(!formValidity('ingredient-unit-form')) {
    showNotification("Please fill all the required fields of the ingredient form.","ingredient-unit-form");
    return;
  }

  // Create a new table row element
  const newRow = document.createElement("tr");

  // Creating ingredientUnit data object
  const ingredientUnitData = [
    ingredientUnitID,
    ingredientUnit
  ];

  // Setting ingredientItem data as a custom attribute on the row
  newRow.setAttribute("data-ingredientUnit", JSON.stringify(ingredientUnitData));  

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
    ingredientUnit_tableRowClicked('data-ingredientUnit',newRow); // Call the callback function when a row is clicked
    highlightClickedTableRow('ingredient-unit-table',newRow); // Call the callback function when a row is clicked
  });

  // Append the new row to the table body
  document.getElementById("ingredient-unit-table").querySelector("tbody").appendChild(newRow);

  // Clear the input fields of the form
  clearFormFields('ingredient-unit-table','ingredient-unit-form');

  const ingredientUnit_comboBox = document.getElementById("ingredient-unit-combobox");
  ingredientUnit_comboBox.add(new Option(ingredientUnit));
//   ingredientUnit_comboBox.add(new Option(ingredientUnit,ingredientUnitID));

  showNotification(`Ingredient Unit Added Successfully!`,"ingredient-unit-form");
}

/*============================================================*/

function ingredientUnit_tableRowClicked(dataRow,row) {
    // Access the data stored in the row's custom attribute
    const rowData = JSON.parse(row.getAttribute(dataRow));

    document.getElementById("ingredient-unit-id").value = rowData[0];
    document.getElementById("ingredient-unit-name").value = rowData[1];
}

/*============================================================*/

function updateSelectedIngredientUnit() {

    // Get the values from the input fields
    const ingredientUnitID = document.getElementById("ingredient-unit-id").value;
    const ingredientUnit = document.getElementById("ingredient-unit-name").value;

    // Find the currently selected row
    const selectedRow = document.querySelector("#ingredient-unit-table .clickedTableRow");

    // Check if a row is selected
    if (!selectedRow) {
        showNotification("Please select a row in the ingredient unit table to be updated with what you inputted.","ingredient-unit-form");
        return;
    }

    // Update the data-ingredientUnit attribute with the new data
    const ingredientUnitData = [
        ingredientUnitID,
        ingredientUnit
    ];

    selectedRow.setAttribute("data-ingredientUnit", JSON.stringify(ingredientUnitData));

    // Update the displayed cell contents
    const cells = selectedRow.querySelectorAll("td");
    if (cells.length >= 2) {
        cells[0].textContent = ingredientUnitID; // Update the ID cell
        cells[1].textContent = ingredientUnit;    // Update the name cell
        showNotification(`Ingredient Unit Updated Successfully!`,"ingredient-unit-form");
    }

    // Clear the input fields of the form
    clearFormFields('ingredient-unit-table','ingredient-unit-form');
}

/*============================================================*/

function deleteSelectedIngredientUnit() {
    // Get the table by ID
    const table = document.getElementById("ingredient-unit-table");

    // Find the currently selected row
    const selectedRow = table.querySelector(".clickedTableRow");

    // Check if a row is selected
    if (!selectedRow) {
        showNotification("Please select a row in the ingredient unit table to be deleted.","ingredient-unit-form");
        return;
    }

    // If a selected row is found, remove it
    if (selectedRow) {
        showNotification(`Ingredient Unit Deleted Successfully!`,"ingredient-unit-form");
        selectedRow.remove(); // Remove the row from the table
    }

    // Clear the input fields of the form
    clearFormFields('ingredient-unit-table','ingredient-unit-form');
}

/*============================================================*/










/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/










/*============================================================*/

function fillStaffForm() {
    const staffID = document.getElementById("staff-id").value;

    if(!staffID) {
        showNotification("Please enter the ID of the staff to auto-fill the form.","staff-form");
        return;
    }

    // Get the table by the provided tableId
    const table = document.getElementById('staff-form');

    // Get all rows from the table body
    const rows = table.querySelectorAll("tbody tr");

    // Check if the table is empty
    if (rows.length === 0) {
        showNotification("The staff table is empty. There are no rows to search.","staff-form");
        return;
    }

    // Iterate through each row to find a matching ingredientUnitID
    rows.forEach(row => {
        const rowData = JSON.parse(row.getAttribute("data-staff"));
        
        // Check if the ingredientUnitID matches
        if (rowData.staffID === staffID) {
            // Programmatically click the row
            row.click(); // This will trigger the event listener for row clicks
        } else {
            showNotification("No staff with that ID found!","staff-form");
            return;
        }
    });
}

/*============================================================*/

function addNewStaff() {
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

    // Validate form fields
    if (!formValidity('staff-form')) {
        showNotification("Please fill all the required fields of the staff form.", "staff-form");
        return;
    }

    // Create a new table row element
    const newRow = document.createElement("tr");

    // Creating staffData object
    const staffData = [
        staffID,
        staffFirstName,
        staffMiddleName,
        staffLastName,
        staffDesignation,
        staffGender,
        staffBirthdate,
        staffPhoneNumber,
        staffAddress,
        staffEmail
    ];

    // Setting staffData as a custom attribute on the row
    newRow.setAttribute("data-staff", JSON.stringify(staffData));  

    // Create full name in the desired format
    const staffFullName = `${staffLastName}, ${staffFirstName} ${staffMiddleName ? staffMiddleName : ''}`.trim();

    // Creating cells
    const staffIDCell = document.createElement("td");
    const staffFullNameCell = document.createElement("td");

    // Setting cell contents
    staffIDCell.textContent = staffID;
    staffFullNameCell.textContent = staffFullName; // Use the formatted full name

    // Append cells to the new row
    newRow.appendChild(staffIDCell);
    newRow.appendChild(staffFullNameCell);

    // Add click event listener to the new row
    newRow.addEventListener('click', function () {
        staff_tableRowClicked('data-staff', newRow); // Call the callback function when a row is clicked
        highlightClickedTableRow('staff-table', newRow); // Call the callback function when a row is clicked
    });

    // Append the new row to the table body
    document.getElementById("staff-table").querySelector("tbody").appendChild(newRow);

    // Clear the input fields of the form
    clearFormFields('staff-table', 'staff-form');

    // const staff_comboBox = document.getElementById("staff-combobox");
    // staff_comboBox.add(new Option(staffFullName,staffID));

    showNotification(`Staff Added Successfully!\n\nID: ${staffID}\nFull Name: ${staffFullName}.`, "staff-form");
}
  
  /*============================================================*/

function staff_tableRowClicked(dataRow,row) {
    // Access the data stored in the row's custom attribute
    const rowData = JSON.parse(row.getAttribute(dataRow));

    document.getElementById("staff-id").value = rowData[0];
    document.getElementById("staff-first-name").value = rowData[1];
    document.getElementById("staff-middle-name").value = rowData[2];
    document.getElementById("staff-last-name").value = rowData[3];
    document.getElementById("staff-designation").value = rowData[4];
    document.getElementById("staff-gender").value = rowData[5];
    document.getElementById("staff-birthdate").value = rowData[6];
    document.getElementById("staff-phonenumber").value = rowData[7];
    document.getElementById("staff-address").value = rowData[8];
    document.getElementById("staff-email").value = rowData[9];
}

/*============================================================*/

function updateSelectedStaff() {

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


    // Find the currently selected row
    const selectedRow = document.querySelector("#staff-table .clickedTableRow");

    // Check if a row is selected
    if (!selectedRow) {
        showNotification("Please select a row in the staff table to be updated with what you inputted.","staff-form");
        return;
    }

    // Update the data-staff attribute with the new data
    const staffData = [
        staffID,
        staffFirstName,
        staffMiddleName,
        staffLastName,
        staffDesignation,
        staffGender,
        staffBirthdate,
        staffPhoneNumber,
        staffAddress,
        staffEmail
    ];

    selectedRow.setAttribute("data-staff", JSON.stringify(staffData));

    // Create full name in the desired format
    const staffFullName = `${staffLastName}, ${staffFirstName} ${staffMiddleName ? staffMiddleName : ''}`.trim();

    // Update the displayed cell contents
    const cells = selectedRow.querySelectorAll("td");
    if (cells.length >= 2) {
        const previousStaffID = cells[0].textContent;
        const previousStaffFullName = cells[1].textContent;
        cells[0].textContent = staffID; // Update the ID cell
        cells[1].textContent = staffFullName;    // Update the name cell
        showNotification(`Staff Updated Successfully!\n\nID: "${previousStaffID}" ➔ "${staffID}"\nFull Name: "${previousStaffFullName}" ➔ "${staffFullName}".`,"staff-form");
    }

    // Clear the input fields of the form
    clearFormFields('staff-table','staff-form');
}

/*============================================================*/

function deleteSelectedStaff() {
    // Get the table by ID
    const table = document.getElementById("staff-table");

    // Find the currently selected row
    const selectedRow = table.querySelector(".clickedTableRow");

    // Check if a row is selected
    if (!selectedRow) {
        showNotification("Please select a row in the staff table to be deleted.","staff-form");
        return;
    }

    // If a selected row is found, remove it
    if (selectedRow) {
        const cells = selectedRow.querySelectorAll("td");
        const staffID = cells[0].textContent;
        const staffFullName = cells[1].textContent;

        showNotification(`Staff Deleted Successfully!\n\nID: ${staffID}\nFull Name: ${staffFullName}.`,"staff-form");
        selectedRow.remove(); // Remove the row from the table
    }

    // Clear the input fields of the form
    clearFormFields('staff-table','staff-form');
}

/*============================================================*/










/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/










/*============================================================*/

function fillSupplierForm() {
    const supplierID = document.getElementById("supplier-id").value;

    if(!supplierID) {
        showNotification("Please enter the ID of the supplier to auto-fill the form.","supplier-form");
        return;
    }

    // Get the table by the provided tableId
    const table = document.getElementById('supplier-form');

    // Get all rows from the table body
    const rows = table.querySelectorAll("tbody tr");

    // Check if the table is empty
    if (rows.length === 0) {
        showNotification("The supplier table is empty. There are no rows to search.","supplier-form");
        return;
    }

    // Iterate through each row to find a matching ingredientUnitID
    rows.forEach(row => {
        const rowData = JSON.parse(row.getAttribute("data-supplier"));
        
        // Check if the ingredientUnitID matches
        if (rowData.supplierID === supplierID) {
            // Programmatically click the row
            row.click(); // This will trigger the event listener for row clicks
        } else {
            showNotification("No supplier with that ID found!","supplier-form");
            return;
        }
    });
}

/*============================================================*/

function addNewSupplier() {
    // Get the values of the input fields
    const supplierID = document.getElementById("supplier-id").value;
    const supplierName = document.getElementById("supplier-name").value;
    const supplierContactPerson = document.getElementById("supplier-contact-person").value;
    const supplierAddress = document.getElementById("supplier-address").value;
    const supplierPhoneNumber = document.getElementById("supplier-phonenumber").value;
    const supplierEmail = document.getElementById("supplier-email").value;

    // Validate form fields
    if (!formValidity('supplier-form')) {
        showNotification("Please fill all the required fields of the supplier form.", "supplier-form");
        return;
    }

    // Create a new table row element
    const newRow = document.createElement("tr");

    // Creating supplierData object
    const supplierData = [
        supplierID,
        supplierName,
        supplierContactPerson,
        supplierAddress,
        supplierPhoneNumber,
        supplierEmail
    ];

    // Setting supplierData as a custom attribute on the row
    newRow.setAttribute("data-supplier", JSON.stringify(supplierData));  

    // Creating cells
    const supplierIDCell = document.createElement("td");
    const supplierNameCell = document.createElement("td");

    // Setting cell contents
    supplierIDCell.textContent = supplierID;
    supplierNameCell.textContent = supplierName; // Use the formatted full name

    // Append cells to the new row
    newRow.appendChild(supplierIDCell);
    newRow.appendChild(supplierNameCell);

    // Add click event listener to the new row
    newRow.addEventListener('click', function () {
        supplier_tableRowClicked('data-supplier', newRow); // Call the callback function when a row is clicked
        highlightClickedTableRow('supplier-table', newRow); // Call the callback function when a row is clicked
    });

    // Append the new row to the table body
    document.getElementById("supplier-table").querySelector("tbody").appendChild(newRow);

    // Clear the input fields of the form
    clearFormFields('supplier-table', 'supplier-form');

    // const supplier_comboBox = document.getElementById("supplier-combobox");
    // supplier_comboBox.add(new Option(supplierName,supplierID));

    showNotification(`Supplier Added Successfully!\n\nID: ${supplierID}\nSupplier Name: ${supplierName}.`, "supplier-form");
}
  
  /*============================================================*/

function supplier_tableRowClicked(dataRow,row) {
    // Access the data stored in the row's custom attribute
    const rowData = JSON.parse(row.getAttribute(dataRow));

    document.getElementById("supplier-id").value = rowData[0];
    document.getElementById("supplier-name").value = rowData[1];
    document.getElementById("supplier-contact-person").value = rowData[2];
    document.getElementById("supplier-address").value = rowData[3];
    document.getElementById("supplier-phonenumber").value = rowData[4];
    document.getElementById("supplier-email").value = rowData[5];
}

/*============================================================*/

function updateSelectedSupplier() {

    // Get the values of the input fields
    const supplierID = document.getElementById("supplier-id").value;
    const supplierName = document.getElementById("supplier-name").value;
    const supplierContactPerson = document.getElementById("supplier-contact-person").value;
    const supplierAddress = document.getElementById("supplier-address").value;
    const supplierPhoneNumber = document.getElementById("supplier-phonenumber").value;
    const supplierEmail = document.getElementById("supplier-email").value;


    // Find the currently selected row
    const selectedRow = document.querySelector("#supplier-table .clickedTableRow");

    // Check if a row is selected
    if (!selectedRow) {
        showNotification("Please select a row in the supplier table to be updated with what you inputted.","supplier-form");
        return;
    }

    // Update the data-supplier attribute with the new data
    const supplierData = [
        supplierID,
        supplierName,
        supplierContactPerson,
        supplierAddress,
        supplierPhoneNumber,
        supplierEmail
    ];

    selectedRow.setAttribute("data-supplier", JSON.stringify(supplierData));

    // Update the displayed cell contents
    const cells = selectedRow.querySelectorAll("td");
    if (cells.length >= 2) {
        const previousSupplierID = cells[0].textContent;
        const previousSupplierName = cells[1].textContent;
        cells[0].textContent = supplierID; // Update the ID cell
        cells[1].textContent = supplierName;    // Update the name cell
        showNotification(`Supplier Updated Successfully!\n\nID: "${previousSupplierID}" ➔ "${supplierID}"\nSupplier Name: "${previousSupplierName}" ➔ "${supplierName}".`,"supplier-form");
    }

    // Clear the input fields of the form
    clearFormFields('supplier-table','supplier-form');
}

/*============================================================*/

function deleteSelectedSupplier() {
    // Get the table by ID
    const table = document.getElementById("supplier-table");

    // Find the currently selected row
    const selectedRow = table.querySelector(".clickedTableRow");

    // Check if a row is selected
    if (!selectedRow) {
        showNotification("Please select a row in the supplier table to be deleted.","supplier-form");
        return;
    }

    // If a selected row is found, remove it
    if (selectedRow) {
        const cells = selectedRow.querySelectorAll("td");
        const supplierID = cells[0].textContent;
        const supplierName = cells[1].textContent;

        showNotification(`Supplier Deleted Successfully!\n\nID: ${supplierID}\nFull Name: ${supplierName}.`,"supplier-form");
        selectedRow.remove(); // Remove the row from the table
    }

    // Clear the input fields of the form
    clearFormFields('supplier-table','supplier-form');
}

/*============================================================*/










/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/
/*============================================================*/ /*============================================================*/










/*============================================================*/

function fillCustomerForm() {
    const customerID = document.getElementById("customer-id").value;

    if(!customerID) {
        showNotification("Please enter the ID of the customer to auto-fill the form.","customer-form");
        return;
    }

    // Get the table by the provided tableId
    const table = document.getElementById('customer-form');

    // Get all rows from the table body
    const rows = table.querySelectorAll("tbody tr");

    // Check if the table is empty
    if (rows.length === 0) {
        showNotification("The customer table is empty. There are no rows to search.","customer-form");
        return;
    }

    // Iterate through each row to find a matching ingredientUnitID
    rows.forEach(row => {
        const rowData = JSON.parse(row.getAttribute("data-customer"));
        
        // Check if the ingredientUnitID matches
        if (rowData.customerID === customerID) {
            // Programmatically click the row
            row.click(); // This will trigger the event listener for row clicks
        } else {
            showNotification("No customer with that ID found!","customer-form");
            return;
        }
    });
}

/*============================================================*/

function addNewCustomer() {
    // Get the values of the input fields
    const customerID = document.getElementById("customer-id").value;
    const customerType = document.getElementById("customer-type").value;
    const customerFirstName = document.getElementById("customer-first-name").value;
    const customerMiddleName = document.getElementById("customer-middle-name").value;
    const customerLastName = document.getElementById("customer-last-name").value;
    const customerGender = document.getElementById("customer-gender").value;
    const customerBirthdate = document.getElementById("customer-birthdate").value;
    const customerPhoneNumber = document.getElementById("customer-phonenumber").value;
    const customerAddress = document.getElementById("customer-address").value;
    const customerEmail = document.getElementById("customer-email").value;

    // Validate form fields
    if (!formValidity('customer-form')) {
        showNotification("Please fill all the required fields of the customer form.", "customer-form");
        return;
    }

    // Create a new table row element
    const newRow = document.createElement("tr");

    // Creating customerData object
    const customerData = [
        customerID,
        customerType,
        customerFirstName,
        customerMiddleName,
        customerLastName,
        customerGender,
        customerBirthdate,
        customerPhoneNumber,
        customerAddress,
        customerEmail
    ];

    // Setting customerData as a custom attribute on the row
    newRow.setAttribute("data-customer", JSON.stringify(customerData));  

    // Create full name in the desired format
    const customerFullName = `${customerLastName}, ${customerFirstName} ${customerMiddleName ? customerMiddleName : ''}`.trim();

    // Creating cells
    const customerIDCell = document.createElement("td");
    const customerFullNameCell = document.createElement("td");

    // Setting cell contents
    customerIDCell.textContent = customerID;
    customerFullNameCell.textContent = customerFullName; // Use the formatted full name

    // Append cells to the new row
    newRow.appendChild(customerIDCell);
    newRow.appendChild(customerFullNameCell);

    // Add click event listener to the new row
    newRow.addEventListener('click', function () {
        customer_tableRowClicked('data-customer', newRow); // Call the callback function when a row is clicked
        highlightClickedTableRow('customer-table', newRow); // Call the callback function when a row is clicked
    });

    // Append the new row to the table body
    document.getElementById("customer-table").querySelector("tbody").appendChild(newRow);

    // Clear the input fields of the form
    clearFormFields('customer-table', 'customer-form');

    // const customer_comboBox = document.getElementById("customer-combobox");
    // customer_comboBox.add(new Option(customerFullName,customerID));

    showNotification(`Customer Added Successfully!\n\nID: ${customerID}\nFull Name: ${customerFullName}.`, "customer-form");
}
  
  /*============================================================*/

function customer_tableRowClicked(dataRow,row) {
    // Access the data stored in the row's custom attribute
    const rowData = JSON.parse(row.getAttribute(dataRow));

    document.getElementById("customer-id").value = rowData[0];
    document.getElementById("customer-type").value = rowData[1];
    document.getElementById("customer-first-name").value = rowData[2];
    document.getElementById("customer-middle-name").value = rowData[3];
    document.getElementById("customer-last-name").value = rowData[4];
    document.getElementById("customer-gender").value = rowData[5];
    document.getElementById("customer-birthdate").value = rowData[6];
    document.getElementById("customer-phonenumber").value = rowData[7];
    document.getElementById("customer-address").value = rowData[8];
    document.getElementById("customer-email").value = rowData[9];
}

/*============================================================*/

function updateSelectedCustomer() {

    // Get the values of the input fields
    const customerID = document.getElementById("customer-id").value;
    const customerType = document.getElementById("customer-type").value;
    const customerFirstName = document.getElementById("customer-first-name").value;
    const customerMiddleName = document.getElementById("customer-middle-name").value;
    const customerLastName = document.getElementById("customer-last-name").value;
    const customerGender = document.getElementById("customer-gender").value;
    const customerBirthdate = document.getElementById("customer-birthdate").value;
    const customerPhoneNumber = document.getElementById("customer-phonenumber").value;
    const customerAddress = document.getElementById("customer-address").value;
    const customerEmail = document.getElementById("customer-email").value;


    // Find the currently selected row
    const selectedRow = document.querySelector("#customer-table .clickedTableRow");

    // Check if a row is selected
    if (!selectedRow) {
        showNotification("Please select a row in the customer table to be updated with what you inputted.","customer-form");
        return;
    }

    // Update the data-customer attribute with the new data
    const customerData = [
        customerID,
        customerType,
        customerFirstName,
        customerMiddleName,
        customerLastName,
        customerGender,
        customerBirthdate,
        customerPhoneNumber,
        customerAddress,
        customerEmail
    ];

    selectedRow.setAttribute("data-customer", JSON.stringify(customerData));

    // Create full name in the desired format
    const customerFullName = `${customerLastName}, ${customerFirstName} ${customerMiddleName ? customerMiddleName : ''}`.trim();

    // Update the displayed cell contents
    const cells = selectedRow.querySelectorAll("td");
    if (cells.length >= 2) {
        const previousCustomerID = cells[0].textContent;
        const previousCustomerFullName = cells[1].textContent;
        cells[0].textContent = customerID; // Update the ID cell
        cells[1].textContent = customerFullName;    // Update the name cell
        showNotification(`Customer Updated Successfully!\n\nID: "${previousCustomerID}" ➔ "${customerID}"\nFull Name: "${previousCustomerFullName}" ➔ "${customerFullName}".`,"customer-form");
    }

    // Clear the input fields of the form
    clearFormFields('customer-table','customer-form');
}

/*============================================================*/

function deleteSelectedCustomer() {
    // Get the table by ID
    const table = document.getElementById("customer-table");

    // Find the currently selected row
    const selectedRow = table.querySelector(".clickedTableRow");

    // Check if a row is selected
    if (!selectedRow) {
        showNotification("Please select a row in the customer table to be deleted.","customer-form");
        return;
    }

    // If a selected row is found, remove it
    if (selectedRow) {
        const cells = selectedRow.querySelectorAll("td");
        const customerID = cells[0].textContent;
        const customerFullName = cells[1].textContent;

        showNotification(`Customer Deleted Successfully!\n\nID: ${customerID}\nFull Name: ${customerFullName}.`,"customer-form");
        selectedRow.remove(); // Remove the row from the table
    }

    // Clear the input fields of the form
    clearFormFields('customer-table','customer-form');
}

/*============================================================*/