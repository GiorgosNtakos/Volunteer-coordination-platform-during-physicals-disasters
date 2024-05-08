$(document).ready(function(){
    // Λήψη ανακοινώσεων και προσθήκη στον πίνακα
    $.ajax({
        url: "../../PHP/Admin/get_announcements.php",
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log(data);

            if (data.length > 0) {
                console.log(data[0]);

                data.forEach(function(announcement) {
                    // Δίνει το id του announcement στο κουμπί για τη διαγραφή
                    var deleteButton = '<button class="delete-button" data-id="' + announcement.id + '">Διαγραφή</button>';

                    var row = '<tr><td>' + announcement.id + '</td><td>' + announcement.item_name + '</td><td>' + announcement.task_quantity +'</td><td>' + announcement.username + '</td><td>' + announcement.task_type + '</td><td>' + announcement.task_status +  '</td><td>' + deleteButton + '</td></tr>';
                    $('#announcements_body').append(row);
                });
            } else {
                var emptyRow = '<tr><td colspan="6">Δεν υπάρχουν διαθέσιμες ανακοινώσεις.</td></tr>';
                $('#announcements_body').append(emptyRow);
            }

            // Κρύβει την πρώτη στήλη με τα IDs μετά την προσθήκη δεδομένων
            $('.announcement-table th:first-child, .announcement-table td:first-child').hide();
        },
        error: function(xhr, status, error) {
            console.error(status + ": " + error);
        }
    });
});
