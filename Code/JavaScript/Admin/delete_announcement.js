function deleteAnnouncement(announcementId, row) {
  $.ajax({
    url: "../../PHP/Admin/delete_announcement.php",
    method: "POST",
    data: { id: announcementId },
    success: function (response) {
      // Επιτυχής απάντηση server
      if (response.status === "success") {
        showMessage("success-message", response.message, "#announcements-list");
        row.fadeOut(300, function() {
          $(this).remove(); 
        });
      } else {
        showMessage(
          "error-message",
          "Ενώ η διαγραφή της ανακοίνωσης ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανα.",
          "#announcements-list"
        );
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
