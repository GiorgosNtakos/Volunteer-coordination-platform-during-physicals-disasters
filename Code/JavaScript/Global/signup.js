// Λειτουργικότητα για το Sign Up

"use strict";
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("signupForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      var username = document.getElementById("user-signup").value;
      var password = document.getElementById("pass-signup").value;
      var repeatPassword = document.getElementById("pass-repeat-signup").value;
      var email = document.getElementById("email-signup").value;

      if (username.trim() === "") {
        showMessage(
          "extra-error-message",
          "Συμπληρώστε το πεδίο Username.",
          "#user-signup"
        );
        return;
      }

      if (password.trim() === "") {
        showMessage(
          "extra-error-message",
          "Συμπληρώστε το πεδίο Password.",
          "#pass-signup"
        );
        return;
      }

      if (repeatPassword.trim() === "") {
        showMessage(
          "extra-error-message",
          "Συμπληρώστε το πεδίο Repeat Password.",
          "#pass-repeat-signup"
        );
        return;
      }

      if (email.trim() === "") {
        showMessage(
          "extra-error-message",
          "Συμπληρώστε το πεδίο Email Address.",
          "#email-signup"
        );
        return;
      }

      // Ελέγχουμε αν οι κωδικοί είναι ίδιοι
      if (password !== repeatPassword) {
        showMessage(
          "extra-error-message",
          "Οι κωδικοί δεν ταιριάζουν. Παρακαλώ δοκιμάστε ξανά.",
          "#pass-repeat-signup"
        );
        return;
      }

      // Ελέγχουμε την πολυπλοκότητα του κωδικού
      var passwordPattern =
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
      if (!passwordPattern.test(password)) {
        showMessage(
          "extra-error-message",
          "Ο κωδικός πρέπει να είναι τουλάχιστον 8 χαρακτήρες και να περιέχει τουλάχιστον ένα κεφαλαίο γράμμα, ένα αριθμό και ένα σύμβολο (π.χ. #$*&@).",
          "#pass-signup"
        );
        return;
      }

      // Ελέγχουμε την σωστή μορφή του email με βάση την κανονική έκφραση
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showMessage(
          "extra-error-message",
          "Παρακαλώ εισάγετε ένα έγκυρο email(π.χ. user@domain.com).",
          "#email-signup"
        );
        return;
      }

      signup(username, password, email);
    });
});

function signup(username, password, email) {
  // Εδώ κάνουμε την AJAX κλήση για το Sign Up //TODO ισως καποιο χρονομετρο μετα την επιτυχης συνδεση με τυπωση του μηνυματος και μετα αλλαγη σε αλλη σελιδα ή απλα εμφανιση μηνυματος
  //TODO(ΣΕΝΕΧΕΙΑ) και οταν παταει στο tab του login να γινονται κενα τα στοιχεια στο signup.
  $.ajax({
    url: "../../PHP/Global/sign_up.php",
    method: "POST",
    data: { username: username, password: password, email: email },
    success: function (response) {
      // Αναλύουμε το JSON αντικείμενο που λάβαμε από τον εξυπηρετητή

      if (response.status === "created") {
        
        showMessage("extra-success-message", response.message, "#user-signup");
          

        // Ενέργειες που θέλετε να κάνετε μετά την επιτυχημένη εγγραφή
      } else {
        // Η εγγραφή απέτυχε
        showMessage(
          "extra-error-message",
          "Ενώ η εγγραφή ήταν επιτυχής κάτι πήγε στραβά.Παρακακλώ δοκιμάστε ξανά",
          "#user-signup"
        );
        // Ενέργειες που θέλετε να κάνετε αν η εγγραφή αποτύχει
      }
    },
    error: function (response) {
      // Κάτι πήγε στραβά με την κλήση AJAX
      var errorResponse = JSON.parse(response.responseText);
      if (errorResponse.status === "exists_name") {
        showMessage(
          "extra-error-message",
          errorResponse.message,
          "#user-signup"
        );
      } else if (errorResponse.status === "exists_email") {
        showMessage(
          "extra-error-message",
          errorResponse.message,
          "#email-signup"
        );
      } else if (errorResponse.status === "server_error") {
        showMessage(
          "extra-error-message",
          errorResponse.message,
          "#user-signup"
        );
      } else if (errorResponse.status === "missing_400") {
        showMessage(
          "extra-error-message",
          errorResponse.message,
          "#user-signup"
        );
      } else if (errorResponse.status === "wrong_method_405") {
        showMessage(
          "extra-error-message",
          errorResponse.message,
          "#user-signup"
        );
      } else {
        showMessage(
          "extra-error-message",
          "Σφάλμα κατά την εγγραφή. Παρακαλώ δοκιμάστε ξανά.",
          "#user-signup"
        );
      }

      // Ενέργειες που θέλετε να κάνετε αν υπάρξει σφάλμα
    },
  });
}
