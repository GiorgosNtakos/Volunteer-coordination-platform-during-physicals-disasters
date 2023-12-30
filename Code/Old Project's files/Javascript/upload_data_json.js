document.addEventListener("DOMContentLoaded", function() {
    const uploadBtn = document.getElementById("upload-btn");
    const uploadForm = document.getElementById("upload-form");


    uploadBtn.addEventListener("click", function() {
        const fileInput = document.getElementById("data-file");
        const file = fileInput.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("data-file", file);
            displayFileName();
            $.ajax({
                url: "http://localhost/webproject/Code/PHP/upload_call_data_base.php",  // Το URL του PHP script
                method: "POST",
                data: formData,
                processData: false,  // Απενεργοποίηση της επεξεργασίας δεδομένων
                contentType: false,  // Απενεργοποίηση του content type header
                success: function(Final_Response) {
                
                    if (Final_Response.status === "data_created") {

                    showMessage("success-message", Final_Response.message , "showbox")
                    console.log(JSON.parse(Final_Response.data));

                    } else if(Final_Response.status === "exists"){
                        showMessage("success-message", Final_Response.message , "showbox")

                        console.log("Τα δεδομένα που ανέβηκαν είναι τα παρακάτω:",Final_Response.data_created);
                        console.log("Τα δεδομένα που υπήρχαν ήδη είναι τα παρακάτω:",Final_Response.data_exists);
                        
                    } else if(Final_Response.status === "missing_204"){

                        showMessage("success-message", Final_Response.message , "showbox")

                        console.log("Οι κατηγορίες που δεν είχαν υποκατηγορίες είναι οι παρακάτω:",Final_Response.missing_data);
                    
                    } else{
                        showMessage("error-message", "Ενώ το ανέβασμα των δεδομένων ήταν επιτυχής κάτι πήγε στραβά.Παρακάκω δοκιμάστε ξανά" , "showbox");
                    }
            },
                error: function(Final_Response) {
                    var errorResponse = JSON.parse(Final_Response.responseText);
          if (errorResponse.status === "server_error") {

                showMessage("error-message", errorResponse.message, "showbox");
                
            } else if(errorResponse.status === "missing_400"){

              showMessage("error-message", errorResponse.message, "showbox");

            } else if(errorResponse.status === "wrong_method_405"){

              showMessage("error-message", errorResponse.message, "showbox");

            } else{
                showMessage("error-message", "Σφάλμα κατά την εγγραφή. Παρακαλώ δοκιμάστε ξανά.", "showbox");
            }
      
                }
            });
        }
    });
});


function displayFileName() {
    const fileInput = document.getElementById("data-file");
    const fileNameSpan = document.getElementById("file-name");
    if (fileInput.files.length > 0) {
        fileNameSpan.textContent = "Όνομα αρχείου: " + fileInput.files[0].name;
    } else {
        fileNameSpan.textContent = "Κανένα αρχείο δεν έχει επιλεχθεί";
    }
}