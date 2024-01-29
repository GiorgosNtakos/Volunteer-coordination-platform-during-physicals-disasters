//! ΝΑ ΔΩ ΠΩΣ ΘΑ ΦΤΙΑΞΩ ΤΟ DELETE ΜΕ ΤΗΝ ΑΝΑΝΕΩΣΗ ΤΩΝ ΑΝΤΙΚΕΙΜΕΝΩΝ(Αλλαξε και μεθοδο μηπως φτιαξει)

var searchTerm = document.getElementById("search-input");
const overlay = document.getElementById("overlay");
const OptionsFormContainer = document.getElementById("options-form-container");

document.addEventListener("DOMContentLoaded", function () {
  loadCategories("checkbox-filter", "#categoryFilter", true);
  loadItems(1, 15, searchTerm.value);
  handlePreviousButton();
  handleNextButton();

  document.addEventListener("click", function (event) {
    var customSelect = document.querySelector(".custom-select");
    var dropdown = document.querySelector(".custom-dropdown");

    // Ελέγξτε αν το κλικ έγινε εκτός του custom-select div
    if (!customSelect.contains(event.target)) {
      dropdown.style.display = "none"; // Κλείστε τη λίστα
    }
  });

  $("#search-button").click(function () {
    updateItemsBasedOnCategoryAndSearch();
  });

  searchTerm.addEventListener("input", updateItemsBasedOnCategoryAndSearch);
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
    url: "http://localhost/webproject/Code/PHP/Admin/get_items.php",
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
        // Τώρα έχετε τα δεδομένα των προϊόντων από τον server

        var items = response.items;

        var totalItems = response.total_count;
        totalPages = Math.ceil(totalItems / perPage);

        var previousButton = document.getElementById("prev");
        var nextButton = document.getElementById("next");
        previousButton.setAttribute("data-current-page", page);
        nextButton.setAttribute("data-current-page", page);
        updatePaginationButtons(page, totalPages);

        itemList.innerHTML = "";

        // Εξετάζουμε τα δεδομένα των προϊόντων και δημιουργούμε τα table rows
        items.forEach(function (item) {
          var row = document.createElement("tr");

          // Ονομασία προϊόντος
          var nameCell = document.createElement("td");
          nameCell.textContent = item.name;
          row.appendChild(nameCell);

          // Κατηγορία
          var categoryCell = document.createElement("td");
          categoryCell.textContent = item.category;
          row.appendChild(categoryCell);

          // Ποσότητα
          var quantityCell = document.createElement("td");
          quantityCell.textContent = item.quantity;
          row.appendChild(quantityCell);

          // λεπτομέρειες
          var detailsCell = document.createElement("td");
          if (item.details) {
            detailsCell.innerHTML = item.details.replace(/\n/g, "<br>");
          } else {
            detailsCell.innerHTML = "No details"; // or any other placeholder you want to use
          }
          row.appendChild(detailsCell);
          console.log(item.details);

          // Ημερομηνια Εισαγωγης
          var importDateCell = document.createElement("td");
          importDateCell.textContent = item.created_at;
          row.appendChild(importDateCell);

          // Ημερομηνια Εισαγωγης
          var updateDateCell = document.createElement("td");
          updateDateCell.textContent = item.updated_at;
          row.appendChild(updateDateCell);

          var ChoiseButtonCell = document.createElement("td");
          var deleteButton = document.createElement("span");
          deleteButton.title = "Διαγραφή";
          deleteButton.innerHTML = "<i class='fa'>&#xf014;</i>";
          deleteButton.style.marginRight = "20px";
          deleteButton.addEventListener("click", function () {
            // Καλείτε τη συνάρτηση για διαγραφή του προϊόντος με το item.name
            deleteItem(item.name);
            loadItems(1, 15);
          });
          ChoiseButtonCell.appendChild(deleteButton);

          var optionsFormButton = document.createElement("span");
          optionsFormButton.title = "Ρυθμίσεις Είδους";
          optionsFormButton.innerHTML =
            "<i class='fas'  id='" + item.id + "'>&#xf013;</i>";
          optionsFormButton.addEventListener("click", function () {
            overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Προσαρμόστε το χρώμα ανάλογα με τις ανάγκες σας
            overlay.style.display = "block";
            OptionsFormContainer.style.display = "block";
            loadCategories("select", "#category", false);
            getitemInformation(item.name);
            loadItems(1, 15);
          });

          overlay.addEventListener("click", function () {
            resetForms("add-form-container");
            // Κλείστε τη φόρμα και το overlay όταν γίνει κλικ στο overlay
            OptionsFormContainer.style.display = "none";
            overlay.style.display = "none";
          });

          ChoiseButtonCell.appendChild(optionsFormButton);

          row.appendChild(ChoiseButtonCell);

          // Προσθέστε τη σειρά στον πίνακα
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
      } else if (errorResponse.status === "server_error") {
        showMessage("error-message", errorResponse.message, "category-filter");
      } else {
        showMessage(
          "error-message",
          "Σφάλμα κατά τη διάρκεια φόρτωσης των προϊόντωνν. Παρακαλώ δοκιμάστε ξανά.",
          "delete-all-button"
        );
      }
    },
  });
}

function updateItemsBasedOnCategoryAndSearch(currentPage = 1) {
  var selectedCategories = Array.from(
    document.querySelectorAll(".category-checkbox-filter:checked")
  ).map((cb) => cb.value);
  var currentSearchTerm = searchTerm.value;
  loadItems(currentPage, 15, currentSearchTerm, selectedCategories);
}

function handlePreviousButton() {
  var previousButton = document.getElementById("prev");
  previousButton.addEventListener("click", function () {
    var currentPage = parseInt(
      previousButton.getAttribute("data-current-page"),
      10
    );
    if (currentPage > 1) {
      currentPage -= 1; // Μείωσε την τρέχουσα σελίδα κατά 1
      updateItemsBasedOnCategoryAndSearch(currentPage);
    }
  });
}

function handleNextButton() {
  var nextButton = document.getElementById("next");
  nextButton.addEventListener("click", function () {
    var currentPage = parseInt(
      nextButton.getAttribute("data-current-page"),
      10
    );
    if (currentPage < totalPages) {
      currentPage += 1; // Αύξησε την τρέχουσα σελίδα κατά 1
      updateItemsBasedOnCategoryAndSearch(currentPage);
    }
  });
}

function updatePaginationButtons(currentPage, totalPages) {
  var previousButton = document.getElementById("prev");
  var nextButton = document.getElementById("next");

  previousButton.disabled = currentPage <= 1;
  nextButton.disabled = currentPage >= totalPages;
}

// Ενεργοποίηση και απενεργοποίηση του dropdown
function toggleDropdown() {
  var dropdown = document.querySelector(".custom-dropdown");
  dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
}
