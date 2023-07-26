
"use strict";
function createUsers() {
    // Τα δεδομένα που θα στείλουμε στον server
    const userData = {
        email: "user@example.com",
        username: "new_user",
        password: "password123"
    };

    // Κλήση του PHP αρχείου με τη χρήση AJAX για τη δημιουργία των χρηστών
    $.ajax({
        url: "http://localhost/webproject/Code/PHP/auto_gen_users.php",
        method: "POST",
        data: userData,
        //dataType: "json", // Ορίζουμε τον τύπο των δεδομένων που αναμένουμε να λάβουμε από τον server
        success: function(response) {
            // Εδώ μπορείτε να επεξεργαστείτε την απάντηση που λάβατε από τον server
            // Εάν ο server επιστρέψει JSON δεδομένα, μπορείτε να τα προσπελάσετε ως ακολούθως:
            // var data = response.key; (όπου key είναι το πεδίο των δεδομένων που θέλετε να προσπελάσετε)
            alert("Users created successfully!");
        },
        error: function(xhr, status, error) {
            alert("Error: " + status);
        }
    });
}

// Προσθήκη event listener για το κουμπί "Create Users"
document.getElementById("create-users-btn").addEventListener("click", createUsers);
