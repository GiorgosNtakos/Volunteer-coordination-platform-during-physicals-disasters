

document.addEventListener("DOMContentLoaded", function() {
    var totalPages;
    var currentCategory = ""; // Η τρέχουσα κατηγορία
    var currentSubcategory = ""; // Η τρέχουσα υποκατηγορία
    var searchTerm =  "";
    var deleteAllButton = document.getElementById("delete-all-button");

  
    deleteAllButton.addEventListener("click", function() {
        // Καλείτε τη συνάρτηση για διαγραφή όλων των προϊόντων
        deleteAllProducts();
        loadProducts(1, 50);
    });

    



    // Συνάρτηση για να φορτώσετε τα προϊόντα από τον server
    function loadProducts(page, perPage) {
        $.ajax({
            url: "http://localhost/webproject/Code/PHP/get_products.php",  // Το URL του PHP script
            method: "GET",
            data: {
                page: page,
                per_page: perPage,
                category: currentCategory, // Προσθέστε την τρέχουσα κατηγορία
                subcategory: currentSubcategory,
                searchTerm:  searchTerm
            },  // Ή "POST" ανάλογα με το πώς υλοποιήσετε το get_products.php
            success: function(response) {
                if(response.status === "success"){
                    console.log(response);
                // Τώρα έχετε τα δεδομένα των προϊόντων από τον server
                   
                   var products = response.products;
                    
                   var totalProducts = response.total_count;
                   totalPages = Math.ceil(totalProducts / perPage);

                // Παράδειγμα: Υποθέτουμε ότι ο πίνακας έχει το id "product-list"
                var productList = document.getElementById("product-list");
                productList.innerHTML = "";

                // Εξετάζουμε τα δεδομένα των προϊόντων και δημιουργούμε τα table rows
                products.forEach(function(product) {
                    var row = document.createElement("tr");

                    // Ονομασία προϊόντος
                    var nameCell = document.createElement("td");
                    nameCell.textContent = product.name;
                    row.appendChild(nameCell);

                    // Κατηγορία
                    var categoryCell = document.createElement("td");
                    categoryCell.textContent = product.category;
                    row.appendChild(categoryCell);

                    // Υποκατηγορία
                    var subcategoryCell = document.createElement("td");
                    subcategoryCell.textContent = product.subcategory;
                    row.appendChild(subcategoryCell);

                    // Τιμή
                    var priceCell = document.createElement("td");
                    priceCell.textContent = product.price;
                    row.appendChild(priceCell);

                    var deleteButtonCell = document.createElement("td");
                    var deleteButton = document.createElement("button");
                    deleteButton.textContent = "Διαγραφή";
                    deleteButton.addEventListener("click", function() {
                        // Καλείτε τη συνάρτηση για διαγραφή του προϊόντος με το product.name
                        deleteProduct(product.name);
                        loadProducts(1, 50)
                    });
                    deleteButtonCell.appendChild(deleteButton);
                    row.appendChild(deleteButtonCell);

                    // Προσθέστε τη σειρά στον πίνακα
                    productList.appendChild(row);
                });

                var paginationDiv = document.getElementById("pagination");


                if (page > 1) {
                    var previousButton = document.getElementById("prev");
                    previousButton.addEventListener("click", function() {
                        loadProducts(page - 1, perPage);
                    });
                }

                if (page < totalPages) {
                    var nextButton = document.getElementById("next");
                    nextButton.addEventListener("click", function() {
                        loadProducts(page + 1, perPage);
                    });
                }
        } else if(response.status === "success_but_empty"){
            showMessage("success-message" , response.message, "category-filter")
        } else{
            showMessage("error-message" , "Ενώ η ανάκτηση των δεδομένων ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.", "category-filter")
        }
    },
            error: function(response) {
                var errorResponse = JSON.parse(response.responseText);

             if(errorResponse.status === "wrong_method_405"){
  
                showMessage("error-message", errorResponse.message, "category-filter");
  
              } else if(errorResponse.status === "server_error"){
  
                showMessage("error-message", errorResponse.message, "category-filter");
  
              } else{
                  showMessage("error-message", "Σφάλμα κατά τη διάρκεια φόρτωσης των προϊόντωνν. Παρακαλώ δοκιμάστε ξανά.", "delete-all-button");
              }
            }
        });
    }       

    // Συνάρτηση για να φορτώσετε τα προϊόντα για μια συγκεκριμένη κατηγορία
function loadProductsForCategory(category) {
    currentCategory = category;
    currentSubcategory = "";
    loadProducts(1, 50); // Καλέστε τη συνάρτηση φόρτωσης προϊόντων
}

// Συνάρτηση για να φορτώσετε όλα τα προϊόντα (χωρίς φίλτρα)
function loadAllProducts() {
    currentCategory = "";
    currentSubcategory = "";
    loadProducts(1, 50); // Καλέστε τη συνάρτηση φόρτωσης προϊόντων
}

     // Προσθέστε ακροατές συμβάντων για τις αλλαγές στις επιλογές κατηγορίας και υποκατηγορίας
     $("#category-filter").change(function() {
        var currentCategory = $(this).val();
        var subcategorySelect = $("#subcategory-filter");
        
        // Καθαρίστε τις υπάρχουσες επιλογές
        subcategorySelect.empty();
        
        // Προσθέστε την προεπιλογή
        subcategorySelect.append($("<option>", {
            value: "",
            text: "Όλες οι υποκατηγορίες"
        }));
        
        // Εδώ θα πρέπει να έχετε έναν αντίστοιχο πίνακα που περιέχει τις υποκατηγορίες για κάθε κατηγορία
        var subcategoriesByCategory = {
            "Βρεφικά Είδη": ["Απορρυπαντικά", "Πάνες", "Γάλα", "Περιποιήση σώματος", "Σαμπουάν - Αφρόλουτρα", "Γιαούρτια", "Μωρομάντηλα", "Βρεφικές τροφές"],
            "Καθαριότητα": ["Είδη γενικού καθαρισμού", "Χαρτικά", "Αποσμητικά Χώρου", "Εντομoκτόνα - Εντομοαπωθητικά", "Απορρυπαντικά", "Είδη κουζίνας - Μπάνιου"],
            "Ποτά - Αναψυκτικά": ["Μπύρες", "Εμφιαλωμένα νερά", "Κρασιά", "Ποτά", "Χυμοί", "Αναψυκτικά - Ενεργειακά Ποτά"],
            "Προσωπική φροντίδα": ["Αποσμητικά", "Βαμβάκια", "Βαφές μαλλιών", "Κρέμες μαλλιών", "Λοιπά προϊόντα", "Υγρομάντηλα", "Ξυριστικά - Αποτριχωτικά", "Οδοντόβουρτσες", "Πάνες ενηλίκων", "Περιποίηση προσώπου", "Προϊόντα μαλλιών", "Σαμπουάν - Αφρόλουτρα", "Κρέμα ημέρας", "Κρέμα Σώματος", "Αντρική περιποίηση", "Επίδεσμοι", "Κρέμες ενυδάτωσης", "Κρεμοσάπουνα - Σαπούνι", "Προφυλακτικά", "Σερβιέτες", "Στοματικά διαλύματα", "Στοματική υγιεινή"],
            "Τρόφιμα": ["Αλεύρι - Σιμιγδάλι", "Αλλαντικά", "Αυγά", "Βούτυρο - Μαργαρίνη", "Γιαούρτια", "Είδη Ζαχαροπλαστικής", "Γλυκά/Σοκολάτες", "Επιδόρπια", "Έτοιμα γεύματα/Σούπες", "Ζυμαρικά", "Γλυκά/Κέικ", "Κατεψυγμένα/Πίτσες", "Κατεψυγμένα/Φύλλα - Βάσεις", "Καφέδες", "Κονσέρβες", "Τυποποιημένα κρεατικά", "Κρέμες γάλακτος", "Λάδι", "Όσπρια", "Παγωτά", "Καραμέλες - Τσίχλες", "Ξύδι", "Κύβοι", "Πελτές τομάτας", "Πουρές", "Ροφήματα", "Ρύζι", "Σνάκς/Αρτοσκευάσματα", "Σνάκς/Γαριδάκια", "Σνάκς/Κρουασάν", "Σνάκς/Πατατάκια", "Σνάκς/Ποπ κορν", "Τυριά", "Φούρνος/Τσουρέκια", "Φούρνος/Ψωμί", "Χυμός τομάτας", "Μπαχαρικά", "Σνάκς/Μπάρες - Ράβδοι", "Ειδική διατροφή", "Γάλα", "Γλυκά αλλείματα", "Δημητριακά", "Έτοιμα γεύματα/Σαλάτες", "Κατεψυγμένα/Πατάτες", "Κατεψυγμένα/Ψάρια", "Κατεψυγμένα/Λαχανικά", "Κατεψυγμένα/Πίτες", "Σάλτσες - Dressings", "Σνάκς/Μπισκότα", "Ζάχαρη - Υποκατάστατα ζάχαρης", "Φούρνος/Παξιμάδια", "Φούρνος/Φρυγανίες", "Κατεψυγμένα/Κρεατικά", "Φρέσκα/Αφρόψαρο", "Φρέσκα/Ψάρι", "Φρέσκα/Κοτόπουλο", "Φρέσκα/Αρνί", "Φρέσκα/Κατσίκι", "Φρέσκα/Χοιρινό", "Φρέσκα/Μοσχάρι", "Φρέσκα/Λαχανικά", "Φρέσκα/Φρούτα"],
            "Αντισηπτικά": ["Αντισηπτικά"],
            "Προστασία Υγείας": ["Μάσκες Προσώπου"],
            "Για κατοικίδια": ["Pet shop/Τροφή γάτας", "Pet shop/Τροφή σκύλου"]
        };
    
        // Εάν έχετε επιλέξει μια κατηγορία ή δεν έχετε επιλέξει καμία, τότε φορτώστε όλα τα προϊόντα.
        if (currentCategory) {
            loadProductsForCategory(currentCategory);
            subcategoriesByCategory[currentCategory].forEach(function(subcategory) {
                subcategorySelect.append($("<option>", {
                    value: subcategory,
                    text: subcategory
                }));
            });
        } else {
            loadAllProducts();
            for (var category in subcategoriesByCategory) {
                subcategoriesByCategory[category].forEach(function(subcategory) {
                    subcategorySelect.append($("<option>", {
                        value: subcategory,
                        text: subcategory
                    }));
                });
            }
        }
    });
    

    $("#subcategory-filter").change(function() {
        currentSubcategory = $(this).val();
        loadProducts(1, 50);
    });

    $("#search-button").click(function() {
         searchTerm = $("#search-input").val();
        
        // Καλέστε τη συνάρτηση loadProducts() με τον όρο αναζήτησης
        loadProducts(1, 50); // Τα τελευταία δύο null αφορούν τις κατηγορίες και τις υποκατηγορίες
    });

    // Καλέστε τη συνάρτηση loadProducts() όταν φορτώνει η σελίδα
    loadProducts(1, 50);
});


function  deleteAllProducts() {
    $.ajax({
        url: "http://localhost/webproject/Code/PHP/delete_all_products.php",
        method: "DELETE",
        success: function(response){

            console.log("Απάντηση από τον διακομιστή:", response);

            if (response.status === "success") {
                showMessage("success-message", response.message, "delete-all-button")
            } else {
                showMessage("error-message", "Ενώ η διαγραφή των δεδομένων ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανα.", "delete-all-button")
            }
        },
        error: function(response) {  
            var errorResponse = JSON.parse(response.responseText);

             if(errorResponse.status === "wrong_method_405"){
  
                showMessage("error-message", errorResponse.message, "delete-all-button");
  
              } else if(errorResponse.status === "server_error"){
  
                showMessage("error-message", errorResponse.message, "delete-all-button");
  
              } else{
                  showMessage("error-message", "Σφάλμα κατά την διάρκεια διαγραφής των δεδομένων. Παρακαλώ δοκιμάστε ξανά.", "delete-all-button");
              }
        }
    });
}

function deleteProduct(productName)
{
    $.ajax({
        url: "http://localhost/webproject/Code/PHP/delete_product.php",
        method: "POST", //TODO ΚΑΠΟΙΑ ΣΤΙΓΜΗ ΝΑ ΤΟ ΦΤΙΑΞΩ ΜΗΠΩΣ ΚΑΙ ΔΟΥΛΕΨΕΙ ΜΕ ΤΟ DELETE METHOD. Δηλαδη θελει ψαξιμο apache .htaccess και τι methods να κανω allow
        data: { productName: productName},
        success: function(response){
            if (response.status === "success") {
                console.log("Απάντηση από τον διακομιστή:", response);
                console.log(productName);
                showMessage("success-message", response.message, "category-filter")
            } else {
                showMessage("error-message", "Ενώ η διαγραφή του προϊόντος ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανα.", "category-filter")
            }
        },
        error: function(response) {  
            var errorResponse = JSON.parse(response.responseText);

            if(errorResponse.status === "wrong_method_405"){
 
               showMessage("error-message", errorResponse.message, "category-filter");
 
             } else if(errorResponse.status === "server_error"){
 
               showMessage("error-message", errorResponse.message, "category-filter");
 
             } else if(errorResponse.status === "missing_400"){
 
                showMessage("error-message", errorResponse.message, "category-filter");
  
             } else if(errorResponse.status === "not_found_404"){
 
                showMessage("error-message", errorResponse.message, "category-filter");
  
             } else{
                 showMessage("error-message", "Προέκυψε σφάλμα κατά τη διαγραφή του προϊόντος. Παρακαλώ δοκιμάστε ξανά.", "category-filter");
             }
        }
    });
}