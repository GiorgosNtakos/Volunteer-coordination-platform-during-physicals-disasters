function searchOperation(){
  var searchTerm = document.getElementById("search-input");
  $("#search-button").click(function () {
    updateItemsBasedOnCategoryAndSearch();
  });

  searchTerm.addEventListener("input", function() {
    updateItemsBasedOnCategoryAndSearch();
});
$( "#search-input" ).autocomplete({
    source: function(request, response) {
      $.ajax({
        url: "../../PHP/Global/autocomplete_data.php", // Η διεύθυνση του σεναρίου αναζήτησης στον server
        dataType: "json",
        data: {
          term: request.term
        },
        success: function(data) {
          // Μετατρέπουμε την απόκριση σε μια μορφή που μπορεί να χειριστεί το Autocomplete:
          response($.map(data, function(item) {
            return {
                label: item.name, // Εδώ υποθέτουμε ότι η απόκριση περιέχει ένα πεδίο "name"
                value: item.name
            };
        }));
      }
   });
}, minLength: 2, // Ορίζετε τον ελάχιστο αριθμό χαρακτήρων που πρέπει να πληκτρολογήσει ο χρήστης πριν εμφανιστούν προτάσεις
   select: function(event, ui) {
        // Προαιρετικά: Κάτι να συμβεί όταν ο χρήστης επιλέγει μια πρόταση
        console.log("Επιλέχθηκε: " + ui.item.value);
        $("#search-input").val(ui.item.value);
        updateItemsBasedOnCategoryAndSearch();
        // Αποτρέψτε την προεπιλεγμένη συμπεριφορά του autocomplete που θα επαναφέρει την παλιά τιμή
        return false;
       }
    });
}


function handlePreviousButton() {
    var previousButton = document.getElementById("prev");
    previousButton.addEventListener("click", function () {
      var currentPage = parseInt(
        previousButton.getAttribute("data-current-page"),
        10
      );
      if (currentPage > 1) {
        currentPage -= 1; // Μείωσε την τρέχουσα σελίδα κατά 1
        updateItemsBasedOnCategoryAndSearch(currentPage);
      }
    });
  }
  
  function handleNextButton() {
    var nextButton = document.getElementById("next");
    nextButton.addEventListener("click", function () {
      var currentPage = parseInt(
        nextButton.getAttribute("data-current-page"),
        10
      );
      if (currentPage < totalPages) {
        currentPage += 1; // Αύξησε την τρέχουσα σελίδα κατά 1
        updateItemsBasedOnCategoryAndSearch(currentPage);
      }
    });
  }
  
  function updatePaginationButtons(currentPage, totalPages) {
    var previousButton = document.getElementById("prev");
    var nextButton = document.getElementById("next");
  
    previousButton.disabled = currentPage <= 1;
    nextButton.disabled = currentPage >= totalPages;
  }
  
  // Ενεργοποίηση και απενεργοποίηση του dropdown
  function toggleDropdown() {
    var dropdown = document.querySelector(".custom-dropdown");
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
  }
  
  function updateItemsBasedOnCategoryAndSearch(currentPage = 1) {
    var searchTerm = document.getElementById("search-input");
    var selectedCategories = Array.from(
      document.querySelectorAll(".category-checkbox-filter:checked")
    ).map((cb) => cb.value);
    var currentSearchTerm = searchTerm.value;
    if(window.location.href === "http://localhost/webproject/Code/HTML/Admin/upload_products.html"){
      loadItems(currentPage, 15, currentSearchTerm, selectedCategories);
    } else if (window.location.href === "http://localhost/webproject/Code/HTML/Rescuer/cargo_page.html"){
      var isBaseCargoShown = document.getElementById('show-base-cargo').textContent.includes('Βάση');
                if (isBaseCargoShown) {
                    loadVehicleCargo(currentPage, 15, currentSearchTerm, selectedCategories);
                } else {
                    loadItems(currentPage, 15, currentSearchTerm, selectedCategories);
                }
    }
  }

  function filterDropDown(){
    document.addEventListener("click", function (event) {
        var customSelect = document.querySelector(".custom-select");
        var dropdown = document.querySelector(".custom-dropdown");
    
        // Ελέγξτε αν το κλικ έγινε εκτός του custom-select div
        if (!customSelect.contains(event.target)) {
          dropdown.style.display = "none"; // Κλείστε τη λίστα
        }
      });
  }