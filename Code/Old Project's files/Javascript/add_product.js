"use strict"

document.addEventListener("DOMContentLoaded", function() {
    const addProductFormContainer = document.getElementById("add-product-form-container");
    const showAddProductFormButton = document.getElementById("show-add-product-form");
    const addProductForm = document.getElementById("add-product-form");

    showAddProductFormButton.addEventListener("click", function() {

        // Αλλάζετε το φόντο του overlay σε θολό χρώμα και το εμφανίζετε όταν εμφανίζεται η φόρμα
    const overlay = document.getElementById("overlay");
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Προσαρμόστε το χρώμα ανάλογα με τις ανάγκες σας
    overlay.style.display = "block";
    addProductFormContainer.style.display = "block";

    });

    overlay.addEventListener("click", function() {
        // Κλείστε τη φόρμα και το overlay όταν γίνει κλικ στο overlay
        addProductFormContainer.style.display = "none";
        overlay.style.display = "none";
    });

        addProductForm.addEventListener("submit", function(event) {
            event.preventDefault();
        
            const productName = document.getElementById("product-name").value;
            const category = document.getElementById("category").value;
            const subcategory = document.getElementById("subcategory").value;
            const price = document.getElementById("price").value;
        
            // Ελέγξτε αν όλα τα πεδία έχουν συμπληρωθεί
            if (productName.trim() === '' || category.trim() === '' || subcategory.trim() === '' || price.trim() === '') {
                showMessage("error-message", "Συμπληρώστε όλα τα πεδία με έγκυρες τιμές.", "product-name");
                return;
            }
            insertProductToDatabase(productName, category, subcategory, price);
            document.getElementById("product-name").value = '';
            document.getElementById("category").value = '';
            document.getElementById("subcategory").value = '';
            document.getElementById("price").value = '';
        });
    });

// Κώδικας για εισαγωγή του προϊόντος στη βάση δεδομένων
function insertProductToDatabase(productName, category, subcategory, price) {
    // Κώδικας για την αποστολή των δεδομένων προς τον διακομιστή για την εισαγωγή του προϊόντος
    // Χρησιμοποιήστε τα $productName, $category, $subcategory και $price όπως πριν

    $.ajax({
        url: "http://localhost/webproject/Code/PHP/add_new_product.php", // Αντικαταστήστε το με τη σωστή διαδρομή προς τον PHP κώδικα
        method: "POST",
        data: { product_name: productName, category: category, subcategory: subcategory, price: price},
        success: function(response) {
            console.log("Απάντηση από τον διακομιστή:", response);
            if (response.status === "created") {
                showMessage("success-message", response.message, "product-name");
            } else {
                showMessage("error-message", "Ενώ η προσθήκη του προϊόντος ήταν επιτυχής κάτι πήγε στραβά.Παρακάκω δοκιμάστε ξανά", "show-add-product-form");
            }
        },
        error: function(response) {  

            var errorResponse = JSON.parse(response.responseText);

          if (errorResponse.status === "exists") {

                showMessage("error-message", errorResponse.message, "product-name");
                
            } else if(errorResponse.status === "server_error"){

              showMessage("error-message", errorResponse.message, "product-name");

            } else if(errorResponse.status === "missing_400"){

              showMessage("error-message", errorResponse.message, "product-name");

            } else if(errorResponse.status === "wrong_method_400"){

              showMessage("error-message", errorResponse.message, "product-name");

            } else{
                showMessage("error-message", "Σφάλμα κατά την εγγραφή. Παρακαλώ δοκιμάστε ξανά.", "product-name");
            }
        }
    });
}
