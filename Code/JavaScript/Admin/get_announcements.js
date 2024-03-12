$(document).ready(function(){
    $.ajax({
        url: "http://localhost/webproject/Code/PHP/Admin/get_announcements.php",
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log(data); // Εκτύπωση της απάντησης στο console για έλεγχο
            
            if (data.length > 0) {
                // Εκτυπώνουμε το πρώτο στοιχείο του πίνακα για επιπλέον ελέγχους - Δε θα χρειάζεται όταν τελειώσει το debugging
                console.log(data[0]);

                data.forEach(function(announcement) {
                    var deleteButton = '<button onclick="deleteAnnouncement(\'' + announcement.id + '\')">Διαγραφή</button>';

                    var row = '<tr><td>' + announcement.id + '</td><td>' + announcement.item_name + '</td><td>' + announcement.task_quantity + '</td><td>' + announcement.task_type + '</td><td>' + announcement.task_status + '</td><td>' + deleteButton + '</td></tr>';
                    $('#announcements_body').append(row);
                });
            } else {
                // Δεν υπάρχουν ανακοινώσεις
                var emptyRow = '<tr><td colspan="6">Δεν υπάρχουν διαθέσιμες ανακοινώσεις.</td></tr>';
                $('#announcements_body').append(emptyRow);
            }
        },
        error: function(xhr, status, error) {
            console.error(status + ": " + error);
        }
    });
});
