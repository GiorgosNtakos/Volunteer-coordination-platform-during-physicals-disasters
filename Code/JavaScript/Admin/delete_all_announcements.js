document.getElementById("delete-all-button").addEventListener("click", function() {
  if (confirm("Είστε σίγουρος/η ότι θέλετε να διαγράψετε όλες τις ανακοινώσεις;")) {
    fetch("http://localhost/webproject/Code/PHP/Admin/delete_all_announcements.php", {
      method: "DELETE",
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Η διαγραφή απέτυχε.");
      }
      return response.json();
    })
    .then(data => {
      alert(data.message);
    
      setTimeout(function() {
        document.getElementById("announcements_body").innerHTML = "";
      }, 500);
    })    
    .catch(error => {
      console.error("Σφάλμα κατά τη διαγραφή:", error);
    });
  }
});
