document.addEventListener("DOMContentLoaded", function() {

    var changePasswordForm = document.getElementById("changePasswordForm");
    var changePasswordButton = document.getElementById("changePasswordButton");

    GetAdminInfo();

    changePasswordButton.addEventListener("click", function() {
        console.log("Κείμενο κουμπιού:", changePasswordButton.textContent);
        if(changePasswordButton.textContent === "Αλλαγή Κωδικού")
        {
            changePasswordButton.textContent = "Ακύρωση Αλλαγής"
            changePasswordForm.style.display = "block";
        } else {
            // Αλλιώς, αν το κουμπί έχει κείμενο "Ακύρωση", αλλάξτε το σε "Αλλαγή Κωδικού"
            changePasswordButton.textContent = "Αλλαγή Κωδικού";
            changePasswordForm.style.display = "none"; // Κρύψτε τη φόρμα
        }
    });

    changePasswordForm.addEventListener("submit", function(event) {
        event.preventDefault();
        var old_password = document.getElementById("oldPassword").value;
        var new_password = document.getElementById("newPassword").value;
        var repeat_new_password = document.getElementById("RepeatNewPassword").value
        var passwordPattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

         if( old_password.trim() === '' || new_password.trim() === '' || repeat_new_password === ''){
            showMessage("error-message", "Συμπληρώστε όλα τα πεδία με έγκυρες τιμές.", "oldPassword");
            return;
        }
        if (!passwordPattern.test(new_password)) {
            showMessage("error-message", "Ο νέος κωδικός πρέπει να είναι τουλάχιστον 8 χαρακτήρες και να περιέχει τουλάχιστον ένα κεφαλαίο γράμμα, ένα αριθμό και ένα σύμβολο (π.χ. #$*&@)", "newPassword")
            return;
        }
        else if(new_password !== repeat_new_password){
            showMessage("error-message", "Οι κωδικοί δεν ταιριάζουν. Παρακαλώ δοκιμάστε ξανά.", "RepeatNewPassword");
            return;
        } 
        else if(old_password === new_password) {
            showMessage("error-message", "O καινουργιος κωδικός δεν μπορει να είναι ιδιος με τον παλιό.", "newPassword");
            return;
        } 
        else{
            AdminChangePassword(old_password, new_password);
            return;
        }
  });
});




function GetAdminInfo()
{
    var adminUsernameElement = document.getElementById("adminUsername");
    var adminEmailElement = document.getElementById("adminEmail");
    var adminPhotoElement = document.getElementById("adminPhoto");

    // Φορτώστε τα στοιχεία του διαχειριστή με AJAX
    $.ajax({
        url: "http://localhost/webproject/Code/PHP/get_admin_data.php", // Αντικαταστήστε με τον σωστό δρόμο προς το PHP αρχείο
        method: "GET",
        success: function(response) {
            if (response.status === "success") {
                
                console.log(response);

                adminUsernameElement.textContent = response.admin_name;
                adminEmailElement.textContent = response.email
                adminPhotoElement.src = response.img_path;

            } else {
                showMessage("error-message","Ενώ η ανάκτηση στοιχείων ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ συνδεθείτε ξανά.", "showbox");
            }
        },
        error: function(response) {
            var errorResponse = JSON.parse(response.responseText);

            if(errorResponse.status === "need_connection"){
                
                showMessage("error-message", errorResponse.message, "showbox");
  
              } else if(errorResponse.status === "not_found_404"){
  
                showMessage("error-message", errorResponse.message, "showbox");
  
              } else if(errorResponse.status === "wrong_method_405"){
  
                showMessage("error-message", errorResponse.message, "showbox");
  
              } else if(errorResponse.status === "server_error"){
  
                showMessage("error-message", errorResponse.message, "showbox");
  
              } else{
                  showMessage("error-message", "Σφάλμα κατά την διάρκεια φόρτωσης των στοιχείων. Παρακαλώ συνδεθείτε ξανά.", "showbox");
              }
        }
    });
}


function AdminChangePassword(oldPassword, newPassword)
{

    $.ajax({
        url: "http://localhost/webproject/Code/PHP/Change_Password.php", // Αντικαταστήστε με τον σωστό δρόμο προς το PHP αρχείο
        method: "POST",
        data:{ oldPassword:oldPassword, newPassword:newPassword },
        success: function(response) {
            if (response.status === "success_change") {
                changePasswordForm.style.display = "none";
                changePasswordButton.textContent = "Αλλαγή Κωδικού"
                showMessage("success-message", response.message, "changePasswordButton");
            } else {
                showMessage("error-message","Ενώ η αλλαγή κωδικού ήταν επιτυχής κάτι πήγε στραβά.Παρακαλώ δοκιμάστε ξανά", "changePasswordButton");
            }
        },
        error: function(response) {
            var errorResponse = JSON.parse(response.responseText);
            if (errorResponse.status === "wrong_old_password") {
  
                  showMessage("error-message", errorResponse.message, "oldPassword");
                  
              } else if(errorResponse.status === "need_connection"){
                
                showMessage("error-message", errorResponse.message, "changePasswordButton");
  
              } else if(errorResponse.status === "not_found_404"){
  
                showMessage("error-message", errorResponse.message, "changePasswordButton");
  
              } else if(errorResponse.status === "missing_400"){
  
                showMessage("error-message", errorResponse.message, "changePasswordButton");
  
              } else if(errorResponse.status === "wrong_method_405"){
  
                showMessage("error-message", errorResponse.message, "changePasswordButton");
  
              } else if(errorResponse.status === "server_error"){
  
                showMessage("error-message", errorResponse.message, "changePasswordButton");
  
              } else{
                  showMessage("error-message", "Σφάλμα κατά την διάρκεια αλλαγής κωδικού. Παρακαλώ δοκιμάστε ξανά.", "changePasswordButton");
              }
        }
    });
}