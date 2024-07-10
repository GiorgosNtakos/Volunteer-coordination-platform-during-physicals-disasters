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
        url: "../../PHP/Global/autocomplete_data.php",
        dataType: "json",
        data: {
          term: request.term
        },
        success: function(data) {
          response($.map(data, function(item) {
            return {
                label: item.name,
                value: item.name
            };
        }));
      }
   });
}, minLength: 2,
   select: function(event, ui) {
        console.log("Επιλέχθηκε: " + ui.item.value);
        $("#search-input").val(ui.item.value);
        updateItemsBasedOnCategoryAndSearch();
        // Αποτρέπουμε το να επαναφέρει το autocomplete την παλιά τιμή
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
        currentPage -= 1;
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
        currentPage += 1;
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
    if(window.location.href === "http://localhost/Collaborative-product-search-platform-of-wide-consumption/Code/HTML/Admin/upload_products.html"){
      loadItems(currentPage, 15, currentSearchTerm, selectedCategories);
    } else if (window.location.href === "http://localhost/Collaborative-product-search-platform-of-wide-consumption/Code/HTML/Rescuer/cargo_page.html"){
      var isBaseCargoShown = document.getElementById('show-base-cargo').textContent.includes('Βάση');
                if (isBaseCargoShown) {
                    loadVehicleCargo(currentPage, 15, currentSearchTerm, selectedCategories);
                } else {
                    loadItems(currentPage, 15, currentSearchTerm, selectedCategories);
                }
    } else if (window.location.href === "http://localhost/Collaborative-product-search-platform-of-wide-consumption/Code/HTML/User/request_page.html"){
      getAvailableItems(currentPage, 15, currentSearchTerm, selectedCategories);
    }
  }

  function filterDropDown(){
    document.addEventListener("click", function (event) {
        var customSelect = document.querySelector(".custom-select");
        var dropdown = document.querySelector(".custom-dropdown");
    
        if (!customSelect.contains(event.target)) {
          dropdown.style.display = "none";
        }
      });
  }