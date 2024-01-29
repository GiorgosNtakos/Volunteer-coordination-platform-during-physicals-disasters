document.addEventListener("DOMContentLoaded", function () {
  const AddItemTab = document.getElementById("AddItemTab");
  const AddCategoryTab = document.getElementById("AddCategoryTab");

  AddItemTab.addEventListener("click", function (event) {
    event.preventDefault();
    openTab(event, "add-item-form");
  });

  AddCategoryTab.addEventListener("click", function (event) {
    event.preventDefault();
    openTab(event, "add-category-form");
  });
});
function openTab(evt, tabName) {
  // Hide all tab content
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Remove 'active' class from all tab links
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the selected tab content and add 'active' class to the clicked tab link
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}
