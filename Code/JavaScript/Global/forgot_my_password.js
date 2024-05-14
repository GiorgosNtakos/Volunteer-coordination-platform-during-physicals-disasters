$(document).ready(function() {
    var passwordPattern =
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

    $('#forgot_password_form').on('submit', function(event) {
        event.preventDefault();

        var email = $('#email').val();
        var newPassword = $('#newPassword').val();
        var confirmPassword = $('#confirmPassword').val();

        if (email.trim() === "") {
            showMessage(
              "error-message",
              "Συμπληρώστε το πεδίο Email.",
              "#email"
            );
            return;
          }

        if (newPassword.trim() === "") {
            showMessage(
              "error-message",
              "Συμπληρώστε το πεδίο Νέος Κωδικός.",
              "#newPassword"
            );
            return;
          }

          if (confirmPassword.trim() === "") {
            showMessage(
              "error-message",
              "Συμπληρώστε το πεδίο Επιβεβαίωση Νέου Κωδικού.",
              "#confirmPassword"
            );
            return;
          }

          if (!passwordPattern.test(newPassword)) {
            showMessage(
              "error-message",
              "Ο κωδικός πρέπει να είναι τουλάχιστον 8 χαρακτήρες και να περιέχει τουλάχιστον ένα κεφαλαίο γράμμα, ένα αριθμό και ένα σύμβολο (π.χ. #$*&@).",
              "#newPassword"
            );
            return;
          }

        if (newPassword !== confirmPassword) {
            showMessage(
                "error-message",
                "Οι κωδικοί δεν ταιριάζουν. Παρακαλώ δοκιμάστε ξανά.",
                "#confirmPassword"
              );
            return;
        }
        $.ajax({
            url: "http://localhost/webproject/Code/PHP/Global/forgot_my_password.php",
            method: "POST",
            data: {
                email: email,
                newPassword: newPassword
            },
            success: function(response) {
                if (response.status === "success") {
                    showMessage(
                        "success-message",
                        response.message,
                        "#forgot_password_form"
                      );
                } else {
                    showMessage(
                        "error-message",
                        "Ενώ η αλλαγή κωδικού ήταν επιτυχής κάτι πήγε στραβά.Παρακαλώ δοκιμάστε ξανά",
                        "#forgot_password_form"
                      );
                }
            },
            error: function(response) {
                var errorResponse = JSON.parse(response.responseText);
                if (errorResponse.status === "not_found") {
                    showMessage("error-message", errorResponse.message, "#email");
                }  else if (errorResponse.status === "missing_400") {
                    showMessage(
                    "error-message",
                    errorResponse.message,
                    "#forgot_password_form"
                    );
                } else if (errorResponse.status === "wrong_method_405") {
                    showMessage(
                    "error-message",
                    errorResponse.message,
                    "#forgot_password_form"
                    );
                } else if (errorResponse.status === "server_error") {
                    showMessage(
                    "error-message",
                    errorResponse.message,
                    "#forgot_password_form"
                    );
                } else {
                    showMessage(
                    "error-message",
                    "Σφάλμα κατά την διάρκεια αλλαγής κωδικού. Παρακαλώ δοκιμάστε ξανά.",
                    "#forgot_password_form"
                    );
                }
            }
        });
    });
});