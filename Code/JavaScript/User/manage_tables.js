function showHistoryRequests(){
    const historyRequestButton = document.getElementById("Show_History_Requests");
    const searchArea = document.getElementById("search_bar");
    const categoryFilter = document.querySelector(".custom-select");
    const itemsList = document.getElementById("table_of_items");
    const pagination = document.getElementById("pagination");
    const historytables = document.querySelectorAll(".history_requests");
    const headers2 = document.querySelectorAll('h2');

    let showHistoryRequest = false;

    historyRequestButton.addEventListener("click", function() {
        if (!showHistoryRequest) {
            searchArea.style.display = 'none';
            categoryFilter.style.display = 'none';
            itemsList.style.display = 'none';
            pagination.style.display = 'none';
            
            historytables.forEach(function(table){
                table.style.display = 'block';
            });

            headers2.forEach(function(header){
                header.style.display = 'block';
            });

            getRequests();

            historyRequestButton.textContent = "Προβολή Διαθέσιμων Αντικειμένων";
            showHistoryRequest = true;
        } else {
            searchArea.style.display = '';
            categoryFilter.style.display = '';
            itemsList.style.display = '';
            pagination.style.display = '';

            historytables.forEach(function(table){
                table.style.display = 'none';
            });

            headers2.forEach(function(header){
                header.style.display = 'none';
            });

            historyRequestButton.textContent = "Ιστορικό Αιτήσεων";
            showHistoryRequest = false;
        }
    });
}

function showHistoryOffers(){
    const historyOffersButton = document.getElementById("Show_History_Offers");
    const AnnouncementList = document.getElementById("table_of_announcements");
    const historytables = document.querySelectorAll(".history_offers");
    const headers2 = document.querySelectorAll('h2');

    let showHistoryOffers = false;

    historyOffersButton.addEventListener("click", function() {
      if (!showHistoryOffers) {
          // Κρύψε τα στοιχεία για την αναζήτηση και εμφάνιση αντικειμένων
          AnnouncementList.style.display = 'none';

          
          historytables.forEach(function(table){
              table.style.display = 'block';
          });

          headers2.forEach(function(header){
              header.style.display = 'block';
          });

          getOffers();

          historyOffersButton.textContent = "Προβολή Διαθέσιμων Ανακοινώσεων";
          showHistoryOffers = true;
      } else {
          AnnouncementList.style.display = '';

          historytables.forEach(function(table){
              table.style.display = 'none';
          });

          headers2.forEach(function(header){
              header.style.display = 'none';
          });

          historyOffersButton.textContent = "Ιστορικό των Προσφορών σας";
          showHistoryOffers = false;
      }
  });
}

function getRequests(){
    var CurrentRequestsList = document.getElementById("current_requests_list");
    var OldRequestsList = document.getElementById("old_requests_list");
    $.ajax({
        url: "../../PHP/User/get_history_requests.php",
        method: "GET",
        success: function (response) {
            if (response.status === "success") {
                console.log(response);

                var requests = response.requests;

                CurrentRequestsList.innerHTML = "";
                OldRequestsList.innerHTML = "";

                    requests.forEach(function(request){
                        var row = document.createElement("tr");;

                        var requestCell = document.createElement("td");
                        requestCell.textContent ="Αίτηση για " + request.name;
                        row.appendChild(requestCell);

                        var statusCell = document.createElement("td");
                        statusCell.textContent = request.status;
                        row.appendChild(statusCell);

                        var populationCell = document.createElement("td");
                        populationCell.textContent = (request.quantity)/2;
                        row.appendChild(populationCell);

                        var importDateCell = document.createElement("td");
                        importDateCell.textContent = new Date(request.created_at).toLocaleDateString();;
                        row.appendChild(importDateCell);

                        var completeDateCell = document.createElement("td");
                        completeDateCell.textContent = new Date(request.updated_at).toLocaleDateString();
                        row.appendChild(completeDateCell);

                        if(request.status === "completed"){

                            OldRequestsList.appendChild(row);

                        } else {

                            CurrentRequestsList.appendChild(row);
                        }
                    });
            } else if (response.status === "success_but_empty") {
                CurrentRequestsList.innerHTML =
                  "<tr><td colspan='7'>Δεν υπάρχουν αιτήσεις.</td></tr>";
                OldRequestsList.innerHTML =
                  "<tr><td colspan='7'>Δεν υπάρχουν αιτήσεις.</td></tr>";
              } else {
                CurrentRequestsList.innerHTML =
                  "<tr><td colspan='7'>Προέκυψε σφάλμα κατά τη φόρτωση των αντικειμένων.</td></tr>";
                OldRequestsList.innerHTML =
                  "<tr><td colspan='7'>Προέκυψε σφάλμα κατά τη φόρτωση των αντικειμένων.</td></tr>";

              }

        },
        error: function (response) {
            var errorResponse = JSON.parse(response.responseText);
      
            if (errorResponse.status === "wrong_method_405") {
              showMessage("error-message", errorResponse.message, "#current_requests_list");
            } else if(errorResponse.status === "need_connection"){
              showMessage("error-message", errorResponse.message, "#current_requests_list");
            } else if (errorResponse.status === "server_error") {
              showMessage("error-message", errorResponse.message, "#current_requests_list");
            } else {
              showMessage(
                "error-message",
                "Σφάλμα κατά τη διάρκεια φόρτωσης των αιτήσεων. Παρακαλώ δοκιμάστε ξανά.",
                "#current_requests_list"
              );
            }
          }
    });
}

function getOffers(){
  var CurrentOffersList = document.getElementById("current_offers_list");
  var OldOffersList = document.getElementById("old_offers_list");
  $.ajax({
      url: "../../PHP/User/get_history_offers.php",
      method: "GET",
      success: function (response) {
          if (response.status === "success") {
              console.log(response);

              var offers = response.offers;

              CurrentOffersList.innerHTML = "";
              OldOffersList.innerHTML = "";

                  offers.forEach(function(offer){
                      var row = document.createElement("tr");;

                      var offerCell = document.createElement("td");
                      offerCell.textContent ="Προσφορά για " + offer.name;
                      row.appendChild(offerCell);

                      var statusCell = document.createElement("td");
                      statusCell.textContent = offer.status;
                      row.appendChild(statusCell);

                      var populationCell = document.createElement("td");
                      populationCell.textContent = offer.quantity;
                      row.appendChild(populationCell);

                      var importDateCell = document.createElement("td");
                      importDateCell.textContent = new Date(offer.created_at).toLocaleDateString();
                      row.appendChild(importDateCell);

                      var completeDateCell = document.createElement("td");
                      completeDateCell.textContent = new Date(offer.updated_at).toLocaleDateString();
                      row.appendChild(completeDateCell);

                      if(offer.status === "completed"){

                          OldOffersList.appendChild(row);

                      } else {
                        var ChoiseButtonCell = document.createElement("td");
                        var deleteButton = document.createElement("span");
                        deleteButton.title = "Ακύρωση Προσφοράς";
                        deleteButton.innerHTML = "<i class='fa' id = 'deleteIcon'>&#xf056;</i>";
                        deleteButton.style.marginRight = "20px";
                        deleteButton.addEventListener("click", function () {
                            var currentRow = $(this).closest("tr");
                            cancelOffer(offer.id, currentRow);
                          });
                          ChoiseButtonCell.appendChild(deleteButton);
                          row.appendChild(ChoiseButtonCell);

                          CurrentOffersList.appendChild(row);
                      }
                  });
          } else if (response.status === "success_but_empty") {
              CurrentOffersList.innerHTML =
                "<tr><td colspan='7'>Δεν υπάρχουν προσφορές.</td></tr>";
              OldOffersList.innerHTML =
                "<tr><td colspan='7'>Δεν υπάρχουν προσφορές.</td></tr>";
            } else {
              CurrentOffersList.innerHTML =
                "<tr><td colspan='7'>Προέκυψε σφάλμα κατά τη φόρτωση των αντικειμένων.</td></tr>";
              OldOffersList.innerHTML =
                "<tr><td colspan='7'>Προέκυψε σφάλμα κατά τη φόρτωση των αντικειμένων.</td></tr>";

            }

      },
      error: function (response) {
          var errorResponse = JSON.parse(response.responseText);
    
          if (errorResponse.status === "wrong_method_405") {
            showMessage("error-message", errorResponse.message, "#current_offers_list");
          } else if(errorResponse.status === "need_connection"){
            showMessage("error-message", errorResponse.message, "#current_offers_list");
          } else if (errorResponse.status === "server_error") {
            showMessage("error-message", errorResponse.message, "#current_offers_list");
          } else {
            showMessage(
              "error-message",
              "Σφάλμα κατά τη διάρκεια φόρτωσης των προσφορών. Παρακαλώ δοκιμάστε ξανά.",
              "#current_offers_list"
            );
          }
        }
  });
}

function cancelOffer(offerId, currentRow) {
  $.ajax({
    method: "DELETE",
    url: "../../PHP/User/cancel_offer.php",
    data: { offer_id: offerId },
    success: function(response) {
        if (response.status === "success") {
            showMessage("success-message", "Η προσφορά ακυρώθηκε επιτυχώς.", "#Show_History_Offers");
            currentRow.remove();
        } else {
            showMessage("error-message", response.message, "#Show_History_Offers");
        }
    },
    error: function(response) {
      var errorResponse = JSON.parse(response.responseText);
  
      if (errorResponse.status === "wrong_method_405") {
        showMessage("error-message", errorResponse.message, "#Show_History_Offers");
      } else if (errorResponse.status === "server_error") {
        showMessage("error-message", errorResponse.message, "#Show_History_Offers");
      } else if (errorResponse.status === "missing_400") {
        showMessage("error-message", errorResponse.message, "#Show_History_Offers");
      } else if (errorResponse.status === "not_found_404") {
        showMessage("error-message", errorResponse.message, "#Show_History_Offers");
      } else{
        showMessage("error-message", "Παρουσιάστηκε σφάλμα κατά την ακύρωση της προσφοράς.", "#Show_History_Offers");
      }    
    }
});
}