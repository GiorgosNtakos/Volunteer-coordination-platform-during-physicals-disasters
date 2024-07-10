const overlay = document.getElementById("overlay");
const offerFormContainer = document.getElementById("offer-form-container");
const offerSubmit = document.getElementById("offer-form");


document.addEventListener("DOMContentLoaded", function () {
    var numberPattern = /^[1-9]\d*$/;
    getAvailableAnnouncements()
    showHistoryOffers()

    offerSubmit.addEventListener("submit", function (event) {
        event.preventDefault();

        var quantity = document.getElementById("quantity").value;

        if (quantity.trim() === "") {
            showMessage(
              "error-message",
              "Παρακαλώ εισάγετε την ποσότητα που προσφέρετε.",
              "#quantity"
            );
            return;
          }
      
          if (!numberPattern.test(quantity)) {
            showMessage(
              "error-message",
              "H ποσότητα πρέπει να είναι θετική ακέραια τιμή και οχι αρνητική τιμή.",
              "#quantity"
            );
            return;
          }
      
          createOffer();
    });
});

function getAvailableAnnouncements() {
    var AnnouncementsList = document.getElementById("Available-announcements-list");

    $.ajax({
        url: "../../PHP/Global/get_announcements.php",
        method: "GET",
        success: function(response){
            if (response.status === "success") {
                
                var announcements = response.announcements;

                AnnouncementsList.innerHTML = "";

                announcements.forEach(function(announcement) {
                    var row = document.createElement("tr");

                    var itemsString = announcement.items.map(function(item) {
                        return item.name + ": " + item.quantity ;
                    }).join(", ");

                    var nameCell = document.createElement("td");
                    nameCell.textContent = itemsString;
                    row.appendChild(nameCell);

                    var ChoiseButtonCell = document.createElement("td");
                    var offerButton = document.createElement("span");
                    offerButton.title = "Δημιουργία Προσφοράς";
                    offerButton.innerHTML = "<i class='fas' id = 'offerIcon'>&#xf06b;</i>";
                    offerButton.style.marginRight = "20px";
                    offerButton.addEventListener("click", function () {
                        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                        overlay.style.display = "block";
                        offerFormContainer.style.display = "block";

                        loadAnnouncementItems("#item_name",announcement.announcement_id)

                      });

                      overlay.addEventListener("click", function () {
                        offerFormContainer.style.display = "none";
                        overlay.style.display = "none";
                      });
                      ChoiseButtonCell.appendChild(offerButton);
                      row.appendChild(ChoiseButtonCell);

                    AnnouncementsList.appendChild(row);
                })
            } else if (response.status === "success_but_empty") {
                AnnouncementsList.innerHTML =
                "<tr><td colspan='4'>Δεν υπάρχουν διαθέσιμες ανακοινώσεις.</td></tr>";
                showMessage("success-message", response.message, "#Available-announcements-list");
            } else {
                AnnouncementsList.innerHTML =
            "<tr><td colspan='4'>Προέκυψε σφάλμα κατά τη φόρτωση των ανακοινώσεων.</td></tr>";
            showMessage(
            "error-message",
            "Ενώ η ανάκτηση των δεδομένων ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.",
            "#Available-announcements-list"
            );
            }
        }, error: function(response) {
            var errorResponse = JSON.parse(response.responseText);

            if(errorResponse.status === "wrong_method_405"){
                showMessage("error-message", errorResponse.message, "#Available-announcements-list");
            } else if (errorResponse.status === "server_error") {
                showMessage("error-message", errorResponse.message, "#Available-announcements-list");
              } else {
                showMessage(
                  "error-message",
                  "Σφάλμα κατά τη διάρκεια φόρτωσης των ανακοινώσεων. Παρακαλώ δοκιμάστε ξανά.",
                  "#Available-announcements-list"
                );
              }
            },
    });
}

function loadAnnouncementItems(elementId,announcement_id) {
    var itemsMapping = {}

    $.ajax({
        method: "GET",
        url: "../../PHP/User/get_announcement_items.php",
        data: { id: announcement_id},
        success: function(response) {
            
            var items = response.items;

            var itemsList = $(elementId);
            itemsList.empty();

            items.forEach(function(item) {
                itemsMapping[item.name] = item.id;
                itemsList.append(
                    `<option value="${item.id}">${item.name}</option>`
                );
            });
            document.getElementById("announcement_id").value = announcement_id;
        },
        error: function (xhr, status, error) {
          console.error("AJAX Error: " + status, error);
        }
    });
}

function createOffer() {
    var selectedItemId = document.getElementById("item_name").value;
    var quantity = document.getElementById("quantity").value;
    var announcementId = document.getElementById("announcement_id").value;

    $.ajax({
        method: "POST",
        url: "../../PHP/User/create_offer.php",
        data: { 
            item_id: selectedItemId, 
            quantity: quantity,
            announcement_id: announcementId
        },
        success: function(response) {
            if (response.status === "success") {
                showMessage(
                  "success-message",
                  response.message,
                  "#offer-form"
                );
              } else{
                showMessage(
                  "error-message",
                  "Ενώ ήταν επιτυχής η διαδικασία προέκυψε κάκοιο σφάλμα. Παρακαλώ δοκιμάστε ξανά.",
                  "#offer-form"
                );
              }
        },
        error: function (response) {
            var errorResponse = JSON.parse(response.responseText);
      
            if (errorResponse.status === "wrong_method_405") {
              showMessage(
                "error-message",
                errorResponse.message,
                "#offer-form"
              );
            } else if (errorResponse.status === "server_error") {
              showMessage(
                "error-message",
                errorResponse.message,
                "#offer-form"
              );
            }  else if (errorResponse.status === "missing_400") {
                showMessage(
                  "error-message",
                  errorResponse.message,
                  "#offer-form"
                );
              } else if (errorResponse.status === "need_connection") {
                showMessage(
                  "error-message",
                  errorResponse.message,
                  "#offer-form"
                );
              }  else {
              showMessage(
                "error-message",
                "Προέκυψε σφάλμα κατά την διαδικασία. Παρακαλώ δοκιμάστε ξανά.",
                "#offer-form"
              );
            }
          }
    });
}