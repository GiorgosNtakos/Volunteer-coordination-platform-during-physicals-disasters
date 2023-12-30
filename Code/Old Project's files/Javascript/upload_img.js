$(".image-container").click(function (e) {
  $("#imageUpload").click();
});

$("#imageUpload").change(function () {
  let formData = new FormData();
  formData.append("image", $("#imageUpload")[0].files[0]);

  if (this.files && this.files[0]) {
    const reader = new FileReader();

    reader.onload = function (event) {
      $.ajax({
        type: "POST",
        url: "https://localhost/webproject/Code/PHP/upload_admin_photo.php",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
          // Αν θέλετε να κάνετε κάτι μετά την επιτυχί
          if (response.status === "success") {
            $("#adminPhoto").attr("src", event.target.result);
            showMessage("success-message", response.message, "showbox");
          } else {
            showMessage(
              "error-message",
              "Ενώ η αλλαγή φωτογραφίας ήταν επιτυχής κάτι πήγε στραβά.Παρακαλώ δοκιμάστε ξανά",
              "showbox"
            );
          }
        }, //TODO ΝΑ ΒΑΛΩ ΚΑΙ ΤΙ ΥΠΟΛΟΙΠΕΣ ΣΥΝΘΗΚΕΣ ELSE ΓΙΑ ΚΑΘΕ STATUS
        error: function (response) {
          var errorResponse = JSON.parse(response.responseText);

          if (errorResponse.status === "need_connection") {
            showMessage("error-message", errorResponse.message, "showbox");
          } else if (errorResponse.status === "missing_400") {
            showMessage("error-message", errorResponse.message, "showbox");
          } else if (errorResponse.status === "wrong_method_405") {
            showMessage("error-message", errorResponse.message, "showbox");
          } else if (errorResponse.status === "server_error") {
            showMessage("error-message", errorResponse.message, "showbox");
          } else {
            showMessage(
              "error-message",
              "Σφάλμα κατά την διάρκεια αλλαγής κωδικού. Παρακαλώ δοκιμάστε ξανά.",
              "showbox"
            );
          }
        },
      });
    };
    reader.readAsDataURL(this.files[0]);
  }
});
