const overlay = document.getElementById("overlay");
const OptionsFormContainer = document.getElementById("options-form-container");
const RemoveStockFormContainer = document.getElementById("removeStock-form-container");
const addStockFormContainer = document.getElementById("addStock-form-container");

document.addEventListener("DOMContentLoaded", function () {
  var searchTerm = document.getElementById("search-input");
  loadCategories("checkbox-filter", "#categoryFilter", true);
  if(window.location.href === "http://localhost/Collaborative-product-search-platform-of-wide-consumption/Code/HTML/Admin/upload_products.html"){
  loadItems(1, 15, searchTerm.value);
}
  handlePreviousButton();
  handleNextButton();
  filterDropDown();
  searchOperation();

  if(window.location.href === "http://localhost/Collaborative-product-search-platform-of-wide-consumption/Code/HTML/Rescuer/cargo_page.html"){
    loadVehicleCargo(1, 15, searchTerm.value)
    let isBaseCargoShown = false;
    var unloadButton = document.getElementById('unload-vehicle-cargo');

    document.getElementById('show-base-cargo').addEventListener('click', function(){
    isInDistance().then(isClose => {
      if(isClose) {
      if (!isBaseCargoShown) {
        loadItems(1, 15, searchTerm.value);
        this.textContent = 'Εμφάνιση Ειδών από το Όχημα';
        unloadButton.style.display = "block";
        isBaseCargoShown = true;
      } else {
        loadVehicleCargo(1, 15, searchTerm.value)
        unloadButton.style.display = "none";
        this.textContent = 'Εμφάνιση Ειδών από την Βάση';
        isBaseCargoShown = false;
      }

    }else{
        showMessage(
          "error-message",
          "Το όχημα δεν βρίσκεται σε ακτίνα 100 μέτρων από την Βάση/Αποθήκη.",
          "#items-list"
      );
      }
      }).catch(error =>{
      console.error("Σφάλμα κατά τον έλεγχο της απόστασης", error);
      });

    });
  } 
  });

function loadItems(page, perPage, searchTerm, selectedCategories = []) {
  var itemList = document.getElementById("items-list");
  console.log("Loading items with the following parameters:", {
    page,
    perPage,
    searchTerm,
    selectedCategories,
  });
  $.ajax({
    url: "../../PHP/Admin/get_items.php",
    method: "GET",
    data: {
      page: page,
      per_page: perPage,
      searchTerm: searchTerm,
      categories: selectedCategories.join(","),
    },
    success: function (response) {
      if (response.status === "success") {
        console.log(response);

        var items = response.items;

        var totalItems = response.total_count;
        totalPages = Math.ceil(totalItems / perPage);

        var previousButton = document.getElementById("prev");
        var nextButton = document.getElementById("next");
        previousButton.setAttribute("data-current-page", page);
        nextButton.setAttribute("data-current-page", page);
        updatePaginationButtons(page, totalPages);

        itemList.innerHTML = "";

        items.forEach(function (item) {
          var row = document.createElement("tr");

          var nameCell = document.createElement("td");
          nameCell.textContent = item.name;
          row.appendChild(nameCell);

          var categoryCell = document.createElement("td");
          categoryCell.textContent = item.category;
          row.appendChild(categoryCell);

          var quantityCell = document.createElement("td");
          quantityCell.textContent = item.quantity;
          row.appendChild(quantityCell);

          var detailsCell = document.createElement("td");
          if (item.details) {
            detailsCell.innerHTML = item.details.replace(/\n/g, "<br>");
          } else {
            detailsCell.innerHTML = "No details";
          }
          row.appendChild(detailsCell);
          console.log(item.details);

          if(window.location.href === "http://localhost/Collaborative-product-search-platform-of-wide-consumption/Code/HTML/Admin/upload_products.html")
          {
            var importDateCell = document.createElement("td");
            importDateCell.textContent = item.created_at;
            row.appendChild(importDateCell);

            var updateDateCell = document.createElement("td");
            updateDateCell.textContent = item.updated_at;
            row.appendChild(updateDateCell);
          }

          var ChoiseButtonCell = document.createElement("td");
          if(window.location.href === "http://localhost/Collaborative-product-search-platform-of-wide-consumption/Code/HTML/Admin/upload_products.html")
          {
          var deleteButton = document.createElement("span");
          deleteButton.title = "Διαγραφή";
          deleteButton.innerHTML = "<i class='fa' id = 'deleteIcon'>&#xf014;</i>";
          deleteButton.style.marginRight = "20px";
          deleteButton.addEventListener("click", function () {
            deleteItem(item.id);
            updateItemsBasedOnCategoryAndSearch();
          });
          ChoiseButtonCell.appendChild(deleteButton);

          var optionsFormButton = document.createElement("span");
          optionsFormButton.title = "Ρυθμίσεις Είδους";
          optionsFormButton.innerHTML =
            "<i class='fas'  id='optionIcon'" + item.id + "'>&#xf013;</i>";
          optionsFormButton.addEventListener("click", function () {
            overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            overlay.style.display = "block";
            OptionsFormContainer.style.display = "block";
            loadCategories("select", "#category", false);
            getitemInformation(item.name);
            updateItemsBasedOnCategoryAndSearch();
          });

          overlay.addEventListener("click", function () {
            OptionsFormContainer.style.display = "none";
            overlay.style.display = "none";
          });

          ChoiseButtonCell.appendChild(optionsFormButton);
        } else if (window.location.href === "http://localhost/Collaborative-product-search-platform-of-wide-consumption/Code/HTML/Rescuer/cargo_page.html"){
          var addItemsButton = document.createElement("span");
          addItemsButton.title = "Πρόσθεση ποσότητας";
          addItemsButton.innerHTML =
            "<i class='fas'  id='addIcon'" + item.id + "'>&#xf0fe;</i>";
            addItemsButton.addEventListener("click", function () {
            overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            overlay.style.display = "block";
            addStockFormContainer.style.display = "block";
            getitemInformation(item.name);
          });

          overlay.addEventListener("click", function () {
            addStockFormContainer.style.display = "none";
            overlay.style.display = "none";
          });

          ChoiseButtonCell.appendChild(addItemsButton);
        }

          row.appendChild(ChoiseButtonCell);

          itemList.appendChild(row);
        });
      } else if (response.status === "success_but_empty") {
        itemList.innerHTML =
          "<tr><td colspan='7'>Δεν υπάρχουν αντικείμενα αποθηκευμένα.</td></tr>";
        showMessage("success-message", response.message, "#items-list");
      } else {
        itemList.innerHTML =
          "<tr><td colspan='7'>Προέκυψε σφάλμα κατά τη φόρτωση των αντικειμένων.</td></tr>";
        showMessage(
          "error-message",
          "Ενώ η ανάκτηση των δεδομένων ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.",
          "category-filter"
        );
      }
    },
    error: function (response) {
      var errorResponse = JSON.parse(response.responseText);

      if (errorResponse.status === "wrong_method_405") {
        showMessage("error-message", errorResponse.message, "category-filter");
      } else if(errorResponse.status === "missing_400"){
        showMessage("error-message", errorResponse.message, "category-filter");
      } else if (errorResponse.status === "server_error") {
        showMessage("error-message", errorResponse.message, "category-filter");
      } else {
        showMessage(
          "error-message",
          "Σφάλμα κατά τη διάρκεια φόρτωσης των προϊόντωνν. Παρακαλώ δοκιμάστε ξανά.",
          "category-filter"
        );
      }
    },
  });
}

function loadVehicleCargo(page, perPage, searchTerm, selectedCategories = []){
  var itemList = document.getElementById("items-list");
  $.ajax({
    url: "../../PHP/Rescuer/get_vehicle_cargo.php",
    method: "GET",
    data: {
      page: page,
      per_page: perPage,
      searchTerm: searchTerm,
      categories: selectedCategories.join(","),
    }, success: function (response) {

      if (response.status === "success") {
      console.log(response);

      var items = response.items;

      var totalItems = response.total_count;
      totalPages = Math.ceil(totalItems / perPage);

      var previousButton = document.getElementById("prev");
      var nextButton = document.getElementById("next");
      previousButton.setAttribute("data-current-page", page);
      nextButton.setAttribute("data-current-page", page);
      updatePaginationButtons(page, totalPages);

      itemList.innerHTML = "";

      items.forEach(function (item) {
        var row = document.createElement("tr");

        var nameCell = document.createElement("td");
        nameCell.textContent = item.name;
        row.appendChild(nameCell);

        var categoryCell = document.createElement("td");
        categoryCell.textContent = item.category;
        row.appendChild(categoryCell);

        var quantityCell = document.createElement("td");
        quantityCell.textContent = item.quantity;
        row.appendChild(quantityCell);

        var detailsCell = document.createElement("td");
        if (item.details) {
          detailsCell.innerHTML = item.details.replace(/\n/g, "<br>");
        } else {
          detailsCell.innerHTML = "No details";
        }
        row.appendChild(detailsCell);
        console.log(item.details);

          var ChoiseButtonCell = document.createElement("td");
          var removeButton = document.createElement("span");
          removeButton.title = "Αφαίρεση Ποσότητας";
          removeButton.innerHTML = "<i class='fa' id = 'removeIcon'" + item.id + "'>&#xf146;</i>";
          removeButton.style.marginRight = "20px";
          removeButton.addEventListener("click", function () {
            isInDistance().then(isClose => {
              if(isClose) {
            overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            overlay.style.display = "block";
            RemoveStockFormContainer.style.display = "block";
            getVehicleitemInformation(item.name);
              } else{
                showMessage(
                  "error-message",
                  "Το όχημα δεν βρίσκεται σε ακτίνα 100 μέτρων από την Βάση/Αποθήκη.",
                  "#items-list"
              );
              }
              }).catch(error =>{
              console.error("Σφάλμα κατά τον έλεγχο της απόστασης", error);
              });
          });

          overlay.addEventListener("click", function () {
            RemoveStockFormContainer.style.display = "none";
            overlay.style.display = "none";
          });
          ChoiseButtonCell.appendChild(removeButton);
          row.appendChild(ChoiseButtonCell);

        itemList.appendChild(row);
      });
    } else if (response.status === "success_but_empty") {
      itemList.innerHTML =
        "<tr><td colspan='7'>Δεν υπάρχουν αντικείμενα αποθηκευμένα.</td></tr>";
      showMessage("success-message", response.message, "#items-list");
    } else {
      itemList.innerHTML =
        "<tr><td colspan='7'>Προέκυψε σφάλμα κατά τη φόρτωση των αντικειμένων.</td></tr>";
      showMessage(
        "error-message",
        "Ενώ η ανάκτηση των δεδομένων ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.",
        "category-filter"
      );
    }
    },
    error: function (response) {
      var errorResponse = JSON.parse(response.responseText);

      if (errorResponse.status === "wrong_method_405") {
        showMessage("error-message", errorResponse.message, "category-filter");
      } else if(errorResponse.status === "missing_400"){
        showMessage("error-message", errorResponse.message, "category-filter");
      } else if(errorResponse.status === "need_connection"){
        showMessage("error-message", errorResponse.message, "category-filter");
      } else if(errorResponse.status === "vehicle_not_found"){
        showMessage("error-message", errorResponse.message, "category-filter");
      } else if (errorResponse.status === "server_error") {
        showMessage("error-message", errorResponse.message, "category-filter");
      } else {
        showMessage(
          "error-message",
          "Σφάλμα κατά τη διάρκεια φόρτωσης των προϊόντωνν. Παρακαλώ δοκιμάστε ξανά.",
          "delete-all-button"
        );
      }
    }
  });
}