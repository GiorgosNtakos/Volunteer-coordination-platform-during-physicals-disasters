function loadCategories(type, element, listen) {
  var categoryMapping = {};
  $.ajax({
    method: "GET",
    url: "../../PHP/Admin/getCategories.php",
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
        categoryMapping[category.category_name] = category.id;
        if (type === "checkbox-activate") {
          categoryList.append(
            `<div class="category-item"><input type="checkbox" class="category-checkbox" id="${category.id}" name="selectedCategories[]" value="${category.category_name}">
               <label class="category-label">${category.category_name}</label><br></div>`
          );
        } else if (type === "checkbox-filter") {
          categoryList.append(
            `<div class="custom-checkbox"><input type="checkbox" class="category-checkbox-filter" id="filter-${category.id}" name="selectedCategories[]" value="${category.category_name}">
               <label for="category-${category.id}">${category.category_name}</label><br></div>`
          );
        } else if (type === "select") {
          categoryList.append(
            `<option value="${category.id} σ">${category.category_name}</option>`
          );
        }
      });
      if (listen === true) {
        updateCategoryCheckboxesListeners();
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error: " + status, error);
    },
  });
}

function updateCategoryCheckboxesListeners() {
  var checkboxes = document.querySelectorAll(".category-checkbox-filter");
  checkboxes.forEach(function (checkbox) {
    checkbox.removeEventListener("change", handleCheckboxChange);
    checkbox.addEventListener("change", function () {
      handleCheckboxChange();
      updateItemsBasedOnCategoryAndSearch(); // Νέα συνάρτηση που θα φτιάξουμε
    });
  });
}

function handleCheckboxChange() {
  console.log("Checkbox value:", this.value);
  var tagsInput = document.querySelector(".tags-input");
  // Ελέγχουμε εάν το checkbox είναι επιλεγμένο ή όχι
  if (this.checked) {
    // Δημιουργούμε μια νέα ετικέτα
    var tag = createTag(this.value);
    tagsInput.appendChild(tag);
  } else {
    // Αναζητούμε και αφαιρούμε την αντίστοιχη ετικέτα
    var tag = tagsInput.querySelector(`.tag[data-value="${this.value}"]`);
    if (tag) {
      tagsInput.removeChild(tag);
    }
  }
  updatePlaceholderText();
}

function createTag(value) {
  var span = document.createElement("span");
  span.className = "tag";
  span.setAttribute("data-value", value);
  span.textContent = value;
  var i = document.createElement("i");
  i.className = "fas fa-times";
  i.onclick = function (e) {
    tagClicked(e, span); // Περνάμε το event object και το span ως όρισμα
  };
  span.appendChild(i);
  return span;
}

function tagClicked(e, span) {
  e.stopPropagation();
  removeTag(span);
  updatePlaceholderText();
}

function removeTag(tag) {
  var value = tag.getAttribute("data-value");
  // Ο ενημερωμένος selector τώρα περιορίζει την αναζήτηση μόνο στα checkboxes που σχετίζονται με tags
  var checkbox = document.querySelector(
    `.category-checkbox-filter[value="${value}"]`
  );
  if (checkbox) {
    checkbox.checked = false;
  }
  tag.remove();
  updateItemsBasedOnCategoryAndSearch();
}

function updatePlaceholderText() {
  var checkboxes = document.querySelectorAll(".category-checkbox-filter");
  var selectedCategories = Array.from(checkboxes).filter(
    (checkbox) => checkbox.checked
  );
  var tagsInput = document.querySelector(".tags-input");

  // Καθαρίζουμε το tags-input div
  tagsInput.innerHTML = "";

  if (selectedCategories.length > 0) {
    // Δημιουργούμε και προσθέτουμε tags
    selectedCategories.forEach((checkbox) => {
      var tag = createTag(checkbox.value);
      tagsInput.appendChild(tag);
    });
  } else if (selectedCategories.length === checkboxes.length) {
    tagsInput.textContent = "Επιλέχθηκαν όλες οι κατηγορίες";
  } else {
    // Προσθέτουμε το αρχικό κείμενο ως placeholder
    tagsInput.textContent = "Επιλογή Ειδών Βάση Κατηγορίας";
  }
}
