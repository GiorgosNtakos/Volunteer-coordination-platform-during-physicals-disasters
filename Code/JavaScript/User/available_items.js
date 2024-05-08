//? Ισως βαλουμε καποιο οριο στο πληθος των ατομων που δηλωνει ο χρηστης

const overlay = document.getElementById("overlay");
const requestFormContainer = document.getElementById("request-form-container");
const requestSubmit = document.getElementById("request-form");

document.addEventListener("DOMContentLoaded", function () {
  var searchTerm = document.getElementById("search-input");
  var numberPattern = /^[1-9]\d*$/;

  loadCategories("checkbox-filter", "#categoryFilter", true);
  getAvailableItems(1, 15, searchTerm.value);
  handlePreviousButton();
  handleNextButton();
  filterDropDown();
  searchOperation();
  showHistoryRequests();

  requestSubmit.addEventListener("submit", function (event) {
    event.preventDefault();

    var population = document.getElementById("population").value;

    if (population.trim() === "") {
      showMessage(
        "error-message",
        "Παρακαλώ εισάγετε το πλήθος των ατόμων.",
        "#population"
      );
      return;
    }

    if (!numberPattern.test(population)) {
      showMessage(
        "error-message",
        "Το πλήθος πρέπει να είναι ακέραιο και οχι αρνητική τιμή.",
        "#population"
      );
      return;
    }

    createRequest(population);
  });
});

function getAvailableItems(page, perPage, searchTerm, selectedCategories = []) {
  var itemList = document.getElementById("Available-items-list");
  $.ajax({
    url: "../../PHP/User/getAvailableItems.php",
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

          // λεπτομέρειες
          var detailsCell = document.createElement("td");
          if (item.details) {
            detailsCell.innerHTML = item.details.replace(/\n/g, "<br>");
          } else {
            detailsCell.innerHTML = "No details"; // or any other placeholder you want to use
          }
          row.appendChild(detailsCell);
          console.log(item.details);

          var ChoiseButtonCell = document.createElement("td");
          var requestButton = document.createElement("span");
          requestButton.title = "Αίτηση Προϊόντος";
          requestButton.innerHTML =
            "<i class = 'fas' id = 'requestIcon'" + item.id + "'>&#xf256;</i>";
            requestButton.addEventListener("click", function () {
              overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Προσαρμόστε το χρώμα ανάλογα με τις ανάγκες σας
              overlay.style.display = "block";
              requestFormContainer.style.display = "block";
              getitemInformation(item.name);
            });
  
            overlay.addEventListener("click", function () {
              // Κλείστε τη φόρμα και το overlay όταν γίνει κλικ στο overlay
              requestFormContainer.style.display = "none";
              overlay.style.display = "none";
            });
          ChoiseButtonCell.appendChild(requestButton);
          row.appendChild(ChoiseButtonCell);

          // Προσθέστε τη σειρά στον πίνακα
          itemList.appendChild(row);
        });
      }
    },
  });
}

function getitemInformation(itemName) {
  $.ajax({
    url: "../../PHP/Admin/get_item_info.php",
    method: "GET",
    data: { itemName: itemName },
    success: function (response) {
      if (response.status === "success") {
        document.getElementById("name").readOnly = false;
        document.getElementById("name").value = response.item_info.name;
        document.getElementById("name").readOnly = true;
        showMessage("success-message", response.message, "#request-form");
      } else {
        showMessage(
          "error-message",
          "Ενώ η ανάκτηση πληροφοριών του είδους ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανα.",
          "#request-form"
        );
      }
    },
    error: function (response) {
      var errorResponse = JSON.parse(response.responseText);

      if (errorResponse.status === "wrong_method_405") {
        showMessage(
          "error-message",
          errorResponse.message,
          "#request-form"
        );
      } else if (errorResponse.status === "server_error") {
        showMessage(
          "error-message",
          errorResponse.message,
          "#request-form"
        );
      } else if (errorResponse.status === "missing_400") {
        showMessage(
          "error-message",
          errorResponse.message,
          "#request-form"
        );
      } else {
        showMessage(
          "error-message",
          "Προέκυψε σφάλμα κατά την ανάκτηση πληροφοριών του είδους. Παρακαλώ δοκιμάστε ξανά.",
          "#Available-items-list"
        );
      }
    },
  });
}

function createRequest(population){
  $.ajax({
    url: "../../PHP/User/create_request.php",
    method: "POST",
    data:{population : population},
    success: function (response) {
      if (response.status === "success") {
        showMessage(
          "success-message",
          response.message,
          "#request-form"
        );
      } else{
        showMessage(
          "error-message",
          "Ενώ ήταν επιτυχής η διαδικασία προέκυψε κάκοιο σφάλμα. Παρακαλώ δοκιμάστε ξανά.",
          "#request-form"
        );
      }
    },
    error: function (response) {
      var errorResponse = JSON.parse(response.responseText);

      if (errorResponse.status === "wrong_method_405") {
        showMessage(
          "error-message",
          errorResponse.message,
          "#request-form"
        );
      } else if (errorResponse.status === "server_error") {
        showMessage(
          "error-message",
          errorResponse.message,
          "#request-form"
        );
      }  else if (errorResponse.status === "missing_400") {
          showMessage(
            "error-message",
            errorResponse.message,
            "#request-form"
          );
        } else if (errorResponse.status === "need_connection") {
          showMessage(
            "error-message",
            errorResponse.message,
            "#request-form"
          );
        }  else {
        showMessage(
          "error-message",
          "Προέκυψε σφάλμα κατά την διαδικασία. Παρακαλώ δοκιμάστε ξανά.",
          "#request-form"
        );
      }
    }
  });
}
