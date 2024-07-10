$(document).ready(function () {
  document.getElementById("loadType").addEventListener("change", function () {
    var urlSection = document.getElementById("urlSection");
    var fileSection = document.getElementById("fileSection");

    displayFileName("jsonFile");

    if (this.value === "url") {
      urlSection.style.display = "block";
      fileSection.style.display = "none";
    } else if (this.value === "file") {
      urlSection.style.display = "none";
      fileSection.style.display = "block";
    }
  });

  const loadDataFormContainer = document.getElementById(
    "load-data-form-container"
  );
  const loadDataFormButton = document.getElementById("show-load-data-form");

  loadDataFormButton.addEventListener("click", function () {
    const overlay = document.getElementById("overlay");
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.display = "block";
    loadDataFormContainer.style.display = "block";
    uploadDatas();
  });

  overlay.addEventListener("click", function () {
    resetUploadForm();
    loadDataFormContainer.style.display = "none";
    overlay.style.display = "none";
  });
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
      url: "../../PHP/Admin/uploadData.php",
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        console.log(response);
        loadItems(1, 15, "");
      },
      error: function (error, response) {
        console.log(response);
        console.error("AJAX Error:", error);
      },
    });
  });
}

function displayFileName(id) {
  document.getElementById(id).addEventListener("change", function (event) {
    var filenameSpan = this.parentNode.querySelector("label .filename");
    if (filenameSpan && this.files && this.files.length > 0) {
      filenameSpan.textContent = this.files[0].name;
      filenameSpan.classList.remove("no-file");
    } else {
      filenameSpan.textContent = "Δεν επιλέχθηκε κανένα αρχείο.";
      filenameSpan.classList.add("no-file");
    }
  });
}

function resetUploadForm() {
  document.getElementById("loadType").value = "url";
  document.getElementById("urlSection").style.display = "block";
  document.getElementById("fileSection").style.display = "none";
  document.querySelector(".filename").textContent =
    "Δεν επιλέχθηκε κανένα αρχείο.";
}
