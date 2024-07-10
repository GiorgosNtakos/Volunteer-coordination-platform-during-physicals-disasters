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
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}
