function loadCategories(type, element) {
  $.ajax({
    method: "GET",
    url: "http://localhost/webproject/Code/PHP/Admin/getCategories.php",
    success: function (response) {
      // Επεξεργασία της απάντησης από τον διακομιστή (πιθανόν JSON)
      var categories = response.categories;

      // Προσθήκη των τσεκβοξ ή options για κάθε κατηγορία στη λίστα
      var categoryList = $(element);

      if (type === "select") {
        // Άδειασμα της λίστας μόνο για το select
        categoryList.empty();
      }

      categories.forEach(function (category) {
        if (type === "checkbox") {
          categoryList.append(
            `<input type="checkbox" class="category-checkbox" id="${category.id}" name="selectedCategories[]" value="${category.category_name}">
               <label>${category.category_name}</label><br>`
          );
        } else if (type === "select") {
          categoryList.append(
            `<option value="${category.id}">${category.category_name}</option>`
          );
        }
      });
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error: " + status, error);
    },
  });
}
