// ! : It's beautiful. I've looked at this for 5 hours now. <3

// Στο κλικ καθορίζουμε το row και το id για το συγκεκριμένο κουμπί διαγραφής 
$("#announcements_body").on("click", ".delete-button", function() {
  var currentRow = $(this).closest("tr");
  var announcementId = $(this).data("id");

  // Καλείται η συνάρτηση με τα σωστά καθορισμένα ορίσματα
  deleteAnnouncement(announcementId, currentRow);
});

function deleteAnnouncement(announcementId, row) {
  console.log("deleteAnnouncement called with row:", row);
  
  $.ajax({
    url: "../../PHP/Admin/delete_announcement.php",
    method: "POST",
    data: { id: announcementId },
    success: function (response) {
      console.log("Success response:", response);

      if (response.status === "success") {
        showMessage("success-message", response.message, "#announcements-list");
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
          "#announcements-list"
        );
      }

      if (row) {
        row.empty();
      }
    },
    error: function (response) {
      var errorResponse = JSON.parse(response.responseText);

      if (errorResponse.status === "wrong_method_405") {
        showMessage("error-message", errorResponse.message, "#announcements-list");
      } else if (errorResponse.status === "server_error") {
        showMessage("error-message", errorResponse.message, "#announcements-list");
      } else if (errorResponse.status === "missing_400") {
        showMessage("error-message", errorResponse.message, "#announcements-list");
      } else if (errorResponse.status === "not_found_404") {
        showMessage("error-message", errorResponse.message, "#announcements-list");
      } else {
        showMessage(
          "error-message",
          "Προέκυψε σφάλμα κατά τη διαγραφή του είδους. Παρακαλώ δοκιμάστε ξανά.",
          "#announcements-list"
        );
      }
    },
  });
}
function showMessage(type, message, targetSelector) {
  // Ορίζουμε το στοιχείο μηνύματος
  var messageElement = $('<div class="' + type + '">' + message + '</div>');

  // Εισάγουμε το στοιχείο μηνύματος στον καθορισμένο χώρο
  $(targetSelector).append(messageElement);

  // Κρύβουμε το μήνυμα μετά από ένα διάστημα
  setTimeout(function () {
    messageElement.fadeOut(300, function () {
      $(this).remove();
    });
  }, 3000); // Το μήνυμα θα εξαφανιστεί μετά από 3 δευτερόλεπτα (3000 milliseconds)
}
