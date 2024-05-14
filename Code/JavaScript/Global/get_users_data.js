document.addEventListener("DOMContentLoaded", function () {
    const overlay = document.getElementById("overlay");
    const fileInput = document.getElementById("fileInput");
    var passwordPattern =
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

    const changePasswordButton = document.getElementById("changePassword");
    const passwordChangeArea = document.getElementById("passwordChangeArea");
    const submitPasswordChange = document.getElementById("submitPasswordChange");
    const cancelPasswordChange = document.getElementById("cancelPasswordChange");

    changePasswordButton.addEventListener("click", function() {
        changePasswordButton.style.display = "none"; // Απόκρυψη του κουμπιού "Αλλαγή Κωδικού"
        passwordChangeArea.style.display = "block"; // Εμφάνιση της περιοχής αλλαγής κωδικού
    });

    cancelPasswordChange.addEventListener("click", function() {
        changePasswordButton.style.display = "block"; // Επανεμφάνιση του κουμπιού "Αλλαγή Κωδικού"
        passwordChangeArea.style.display = "none"; // Απόκρυψη της περιοχής αλλαγής κωδικού
        resetPasswordFields(); // Επαναφορά των πεδίων κωδικού
    });

    submitPasswordChange.addEventListener("click", function() {
        // Εδώ μπορείτε να προσθέσετε τη λογική για την υποβολή του νέου κωδικού μέσω AJAX
        const oldPassword = document.getElementById("oldPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (oldPassword.trim() === "") {
            showMessage(
              "error-message",
              "Συμπληρώστε το πεδίο Παλιός Κωδικός.",
              "#oldPassword"
            );
            return;
          }

          if (newPassword.trim() === "") {
            showMessage(
              "error-message",
              "Συμπληρώστε το πεδίο Καινούργιος Κωδικός.",
              "#newPassword"
            );
            return;
          }

          if (confirmPassword.trim() === "") {
            showMessage(
              "error-message",
              "Συμπληρώστε το πεδίο Επιβεβαίωση Καινούργιου Κωδικού.",
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

        changeOldPassword(oldPassword, newPassword)

    });

    GetUserInfo();

    overlay.addEventListener("click", function() {
        fileInput.click();
    });

    fileInput.addEventListener("change", function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById("profileImage").src = e.target.result;
            }
            reader.readAsDataURL(file);

            // Κλήση της συνάρτησης για αλλαγή εικόνας
            changeImg(file);
        }
    });

});

function GetUserInfo() {
    var UsernameElement = document.getElementById("username");
    var EmailElement = document.getElementById("email");
    var PhotoElement = document.getElementById("profileImage");
  
    // Φορτώστε τα στοιχεία του διαχειριστή με AJAX
    $.ajax({
      url: "http://localhost/webproject/Code/PHP/Global/get_user_data.php", // Αντικαταστήστε με τον σωστό δρόμο προς το PHP αρχείο
      method: "GET",
      success: function (response) {
        if (response.status === "success") {
          console.log(response);

          UsernameElement.readOnly = false;
          EmailElement.readOnly = false;

          UsernameElement.value = response.username;
          EmailElement.value = response.email;
          PhotoElement.src = response.img_path;

          UsernameElement.readOnly = true;
          EmailElement.readOnly = true;
        } else {
          showMessage(
            "error-message",
            "Ενώ η ανάκτηση στοιχείων ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ συνδεθείτε ξανά.",
            "#userData_form"
          );
        }
      },
      error: function (response) {
        var errorResponse = JSON.parse(response.responseText);
  
        if (errorResponse.status === "need_connection") {
          showMessage("error-message", errorResponse.message, "#userData_form");
        } else if (errorResponse.status === "not_found_404") {
          showMessage("error-message", errorResponse.message, "#userData_form");
        } else if (errorResponse.status === "wrong_method_405") {
          showMessage("error-message", errorResponse.message, "#userData_form");
        } else if (errorResponse.status === "server_error") {
          showMessage("error-message", errorResponse.message, "#userData_form");
        } else {
          showMessage(
            "error-message",
            "Σφάλμα κατά την διάρκεια φόρτωσης των στοιχείων. Παρακαλώ συνδεθείτε ξανά.",
            "#userData_form"
          );
        }
      },
    });
  }

  function changeImg(file) {
    const formData = new FormData();
    formData.append('file', file);

    $.ajax({
        url: "http://localhost/webproject/Code/PHP/Global/change_profile_image.php", // Αντικαταστήστε με τον σωστό δρόμο προς το PHP αρχείο
        method: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            if (response.status === "success") {
                showMessage(
                    "success-message",
                    "Η φωτογραφία σας ανανεώθηκε επιτυχώς.",
                    "#userData_form"
                  );
            } else {
                showMessage(
                    "error-message",
                    "Η φωτογραφία σας ανανεώθηκε επιτυχώς αλλά υπήρχε κάποιο σφάλμα.Παρακαλώ δοκιμάστε ξανά.",
                    "#userData_form"
                  );
            }
        },
        error: function(response) {
            var errorResponse = JSON.parse(response.responseText);
            if (errorResponse.status === "need_connection") {
                showMessage(
                "error-message",
                errorResponse.message,
                "#userData_form"
                );
            }  else if (errorResponse.status === "missing_400") {
                showMessage(
                "error-message",
                errorResponse.message,
                "#userData_form"
                );
            } else if (errorResponse.status === "wrong_method_405") {
                showMessage(
                "error-message",
                errorResponse.message,
                "#userData_form"
                );
            } else if (errorResponse.status === "server_error") {
                showMessage(
                "error-message",
                errorResponse.message,
                "#userData_form"
                );
            } else {
                showMessage(
                "error-message",
                "Σφάλμα κατά την διάρκεια αλλαγής φωτογραφίας. Παρακαλώ δοκιμάστε ξανά.",
                "#userData_form"
                );
            }
        }
    });
}

function changeOldPassword(oldPassword, newPassword){
    const changePasswordButton = document.getElementById("changePassword");
    const passwordChangeArea = document.getElementById("passwordChangeArea");
    $.ajax({
        url: "http://localhost/webproject/Code/PHP/Global/change_password.php",
        method: "POST",
        data: {
            oldPassword: oldPassword,
            newPassword: newPassword
        },
        success: function(response) {
            if (response.status === "success") {
                showMessage(
                    "success-message",
                    response.message,
                    "#userData_form"
                  );
                changePasswordButton.style.display = "block"; // Επανεμφάνιση του κουμπιού "Αλλαγή Κωδικού"
                passwordChangeArea.style.display = "none"; // Απόκρυψη της περιοχής αλλαγής κωδικού
                resetPasswordFields(); // Επαναφορά των πεδίων κωδικού
            } else {
                showMessage(
                    "error-message",
                    "Ενώ η αλλαγή κωδικού ήταν επιτυχής κάτι πήγε στραβά.Παρακαλώ δοκιμάστε ξανά",
                    "#userData_form"
                  );
            }
        },
        error: function(response) {
            var errorResponse = JSON.parse(response.responseText);
            if (errorResponse.status === "wrong_old_password") {
                showMessage("error-message", errorResponse.message, "#oldPassword");
            } else if (errorResponse.status === "need_connection") {
                showMessage(
                "error-message",
                errorResponse.message,
                "#userData_form"
                );
            } else if (errorResponse.status === "not_found_404") {
                showMessage(
                "error-message",
                errorResponse.message,
                "#userData_form"
                );
            } else if (errorResponse.status === "missing_400") {
                showMessage(
                "error-message",
                errorResponse.message,
                "#userData_form"
                );
            } else if (errorResponse.status === "wrong_method_405") {
                showMessage(
                "error-message",
                errorResponse.message,
                "#userData_form"
                );
            } else if (errorResponse.status === "server_error") {
                showMessage(
                "error-message",
                errorResponse.message,
                "#userData_form"
                );
            } else {
                showMessage(
                "error-message",
                "Σφάλμα κατά την διάρκεια αλλαγής κωδικού. Παρακαλώ δοκιμάστε ξανά.",
                "#userData_form"
                );
            }
        }
    });
}

function resetPasswordFields() {
    document.getElementById("oldPassword").value = '';
    document.getElementById("newPassword").value = '';
    document.getElementById("confirmPassword").value = '';
}