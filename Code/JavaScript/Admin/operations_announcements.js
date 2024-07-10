$(document).ready(function(){
    getAvailableAnnouncements();
});


function getAvailableAnnouncements(){
    var AnnouncementsList = document.getElementById("announcements_body");

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
                        return item.name + ": " + "0/" + item.quantity ;
                    }).join(", ");

                    var nameCell = document.createElement("td");
                    nameCell.textContent = itemsString;
                    row.appendChild(nameCell);

                    var createdCell = document.createElement("td");
                    createdCell.textContent = new Date(announcement.created_at).toLocaleDateString();
                    row.appendChild(createdCell);

                    var updatedCell = document.createElement("td");
                    updatedCell.textContent = new Date(announcement.updated_at).toLocaleDateString();
                    row.appendChild(updatedCell);

                    var ChoiseButtonCell = document.createElement("td");
                    var deleteButton = document.createElement("span");
                    deleteButton.title = "Διαγραφή Ανακοίνωσης";
                    deleteButton.innerHTML = "<i class='fa' id = 'deleteIcon'>&#xf014;</i>";
                    deleteButton.style.marginRight = "20px";
                    deleteButton.addEventListener("click", function () {
                        var currentRow = $(this).closest("tr");
                        deleteAnnouncement(announcement.announcement_id, currentRow);
                      });
                      ChoiseButtonCell.appendChild(deleteButton);
                      row.appendChild(ChoiseButtonCell);

                    AnnouncementsList.appendChild(row);
                })
            } else if (response.status === "success_but_empty") {
                AnnouncementsList.innerHTML =
                "<tr><td colspan='4'>Δεν υπάρχουν διαθέσιμες ανακοινώσεις.</td></tr>";
                showMessage("success-message", response.message, "#announcements_body");
            } else {
                AnnouncementsList.innerHTML =
            "<tr><td colspan='4'>Προέκυψε σφάλμα κατά τη φόρτωση των ανακοινώσεων.</td></tr>";
            showMessage(
            "error-message",
            "Ενώ η ανάκτηση των δεδομένων ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.",
            "#announcements_body"
            );
            }
        }, error: function(response) {
            var errorResponse = JSON.parse(response.responseText);

            if(errorResponse.status === "wrong_method_405"){
                showMessage("error-message", errorResponse.message, "#announcements_body");
            } else if (errorResponse.status === "server_error") {
                showMessage("error-message", errorResponse.message, "#announcements_body");
              } else {
                showMessage(
                  "error-message",
                  "Σφάλμα κατά τη διάρκεια φόρτωσης των ανακοινώσεων. Παρακαλώ δοκιμάστε ξανά.",
                  "#announcements_body"
                );
              }
            },
    });
}

function deleteAllAnnouncement(){
    $.ajax({
        url: "../../PHP/Admin/delete_all_announcements.php",
        method: "DELETE",
        success: function (response) {
          console.log("Απάντηση από τον διακομιστή:", response);
    
          if (response.status === "success") {
            showMessage("success-message", response.message, "#announcements_body");
          } else {
            showMessage(
              "error-message",
              "Ενώ η διαγραφή των δεδομένων ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανα.",
              "#announcements_body"
            );
          }
        },
        error: function (response) {
          var errorResponse = JSON.parse(response.responseText);
    
          if (errorResponse.status === "wrong_method_405") {
            showMessage(
              "error-message",
              errorResponse.message,
              "#announcements_body"
            );
          } else if (errorResponse.status === "server_error") {
            showMessage(
              "error-message",
              errorResponse.message,
              "#announcements_body"
            );
          } else {
            showMessage(
              "error-message",
              "Σφάλμα κατά την διάρκεια διαγραφής των δεδομένων. Παρακαλώ δοκιμάστε ξανά.",
              "#announcements_body"
            );
          }
        },
      });
}

function deleteAnnouncement(announcementId, row) {
    console.log("deleteAnnouncement called with row:", row);
    
    $.ajax({
      url: "../../PHP/Admin/delete_announcement.php",
      method: "DELETE",
      data: { id: announcementId },
      success: function (response) {
        console.log("Success response:", response);
  
        if (response.status === "success") {
          showMessage("success-message", response.message, "#announcements_body");
          if (row) {
            console.log("Row:", row);
            console.log("Fading out row:", row);
            row.fadeOut(300, function() {
              console.log("Row faded out. Removing...");
              $(this).remove();
            });
          }
        } else {
          showMessage(
            "error-message",
            "Ενώ η διαγραφή της ανακοίνωσης ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανα.",
            "#announcements_body"
          );
        }
  
        if (row) {
          row.empty();
        }
      },
      error: function (response) {
        var errorResponse = JSON.parse(response.responseText);
  
        if (errorResponse.status === "wrong_method_405") {
          showMessage("error-message", errorResponse.message, "#announcements_body");
        } else if (errorResponse.status === "server_error") {
          showMessage("error-message", errorResponse.message, "#announcements_body");
        } else if (errorResponse.status === "missing_400") {
          showMessage("error-message", errorResponse.message, "#announcements_body");
        } else if (errorResponse.status === "not_found_404") {
          showMessage("error-message", errorResponse.message, "#announcements_body");
        } else {
          showMessage(
            "error-message",
            "Προέκυψε σφάλμα κατά τη διαγραφή του είδους. Παρακαλώ δοκιμάστε ξανά.",
            "#announcements_body"
          );
        }
      },
    });
  }