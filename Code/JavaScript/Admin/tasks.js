// Κλήση στον server για την ανάκτηση των δεδομένων JSON
fetch('get_data.php')
    .then(response => response.json())
    .then(data => {
        // Προσθήκη markers για τις εργασίες (αιτήματα και προσφορές)
        data.tasks.forEach(task => {
            var marker;

            // Έλεγχος αν η εργασία έχει αναληφθεί από διασώστη
            if (task.rescuer_id) {
                // Εργασία που έχει αναληφθεί
                marker = L.marker([task.location_lat, task.location_lon], { icon: L.divIcon({ className: 'icon-rescued-task' }) });
            } else {
                // Εκκρεμής εργασία
                marker = L.marker([task.location_lat, task.location_lon], { icon: L.divIcon({ className: 'icon-pending-task' }) });
            }

            // Προσθήκη marker στον χάρτη
            marker.addTo(map).bindPopup(`<b>TaskID: ${task.task_id}</b><br>Quantity: ${task.quantity}<br>Type: ${task.type}<br>Status: ${task.status}`);
        });
    })
    .catch(error => console.error('Error fetching data:', error));
