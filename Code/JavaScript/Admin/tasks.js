fetch('get_data.php')
    .then(response => response.json())
    .then(data => {
        data.tasks.forEach(task => {
            var marker;

            if (task.rescuer_id) {
                marker = L.marker([task.location_lat, task.location_lon], { icon: L.divIcon({ className: 'icon-rescued-task' }) });
            } else {
                marker = L.marker([task.location_lat, task.location_lon], { icon: L.divIcon({ className: 'icon-pending-task' }) });
            }

            marker.addTo(map).bindPopup(`<b>TaskID: ${task.task_id}</b><br>Quantity: ${task.quantity}<br>Type: ${task.type}<br>Status: ${task.status}`);
        });
    })
    .catch(error => console.error('Error fetching data:', error));
