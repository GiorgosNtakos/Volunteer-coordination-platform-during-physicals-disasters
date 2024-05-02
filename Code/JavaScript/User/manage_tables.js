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
            // Κρύψε τα στοιχεία για την αναζήτηση και εμφάνιση αντικειμένων
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

            // Αλλαγή του κειμένου του κουμπιού
            historyRequestButton.textContent = "Προβολή Διαθέσιμων Αντικειμένων";
            showHistoryRequest = true;
        } else {
            // Εμφάνισε τα στοιχεία για την αναζήτηση και εμφάνιση αντικειμένων
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

            // Επαναφορά του κειμένου του κουμπιού
            historyRequestButton.textContent = "Ιστορικό Αιτήσεων";
            showHistoryRequest = false;
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

                        // Αίτηση Προιοντος
                        var requestCell = document.createElement("td");
                        requestCell.textContent ="Αίτηση για " + request.name;
                        row.appendChild(requestCell);

                        // Κατασταση Αιτησης
                        var statusCell = document.createElement("td");
                        statusCell.textContent = request.status;
                        row.appendChild(statusCell);

                        // Ατομα
                        var populationCell = document.createElement("td");
                        populationCell.textContent = (request.quantity)/2;
                        row.appendChild(populationCell);

                        // Ημερομηνια Εισαγωγης
                        var importDateCell = document.createElement("td");
                        importDateCell.textContent = request.created_at;
                        row.appendChild(importDateCell);

                        // Ημερομηνια Ολοκλήρωσης/Εγκρισης
                        var completeDateCell = document.createElement("td");
                        completeDateCell.textContent = request.updated_at;
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
                "Σφάλμα κατά τη διάρκεια φόρτωσης των προϊόντωνν. Παρακαλώ δοκιμάστε ξανά.",
                "#current_requests_list"
              );
            }
          }
    });
}