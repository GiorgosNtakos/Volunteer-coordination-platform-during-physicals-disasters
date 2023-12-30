// * CHANGE THE NAME OF FILE AFTER FINISHED

$(document).ready(function () {
  document.getElementById("loadType").addEventListener("change", function () {
    var urlSection = document.getElementById("urlSection");
    var fileSection = document.getElementById("fileSection");

    if (this.value === "url") {
      urlSection.style.display = "block";
      fileSection.style.display = "none";
    } else if (this.value === "file") {
      urlSection.style.display = "none";
      fileSection.style.display = "block";
    }
  });

  uploadDatas();
});

function uploadDatas() {
  $("#uploadDataForm").submit(function (event) {
    event.preventDefault();

    var loadType = $("#loadType").val();
    var formData = new FormData();

    if (loadType === "url") {
      formData.append("loadType", "url");
      formData.append("jsonUrl", $("#jsonUrl").val());
    } else if (loadType === "file") {
      formData.append("loadType", "file");
      formData.append("jsonFile", $("#jsonFile")[0].files[0]);
    }

    $.ajax({
      method: "POST",
      url: "http://localhost/webproject/Code/PHP/Admin/uploadData.php", // Αντικαταστήστε με το πραγματικό όνομα του PHP αρχείου
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        console.log(response);
      },
      error: function (error, response) {
        console.log(response);
        console.error("AJAX Error:", error);
      },
    });
  });
}
