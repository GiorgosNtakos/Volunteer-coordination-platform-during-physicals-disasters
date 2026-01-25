let statsChart;
let currentChartType = 'bar'

// Initialize with default date range
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    document.getElementById('end-date').value = formatDate(today);
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    document.getElementById('start-date').value = formatDate(lastWeek);

    updateStatistics(currentChartType);
});

$(function() {
    $("#start-date, #end-date").datepicker({
        dateFormat: "dd-mm-yy"
    });
});

function formatDate(date) {
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function updateStatistics(chartType) {
    const startDate = $('#start-date').datepicker('getDate');
    const endDate = $('#end-date').datepicker('getDate');

    $.ajax({
        url: "../../PHP/Admin/get_statistics.php",
        method: "GET",
        data: {
            start_date: $.datepicker.formatDate('yy-mm-dd', startDate),
            end_date: $.datepicker.formatDate('yy-mm-dd', endDate)
        },
        success: function(response) {
            const data = [response.statistics.new_requests, response.statistics.new_offers, response.statistics.completed_requests, response.statistics.completed_offers];

            let backgroundColor, borderColor;

                if (chartType === 'bar') {
                    backgroundColor = 'rgba(67, 0, 99, 1)'; // Μωβ για το ραβδόγραμμα
                    borderColor = 'rgba(67, 0, 99, 1)'; // Μωβ για το ραβδόγραμμα
                } else {
                    backgroundColor = [
                        'rgba(255, 0, 0, 1)', // Κόκκινο για Νέα Αιτήματα
                        'rgba(255, 255, 0, 1)', // Κίτρινο για Νέες Προσφορές
                        'rgba(0, 255, 0, 1)', // Πράσινο για Ολοκληρωμένα Αιτήματα
                        'rgba(0, 191, 255, 1)' // Γαλάζιο για Ολοκληρωμένες Προσφορές
                    ];
                    borderColor = [
                        'rgba(255, 0, 0, 1)', // Κόκκινο για Νέα Αιτήματα
                        'rgba(255, 255, 0, 1)', // Κίτρινο για Νέες Προσφορές
                        'rgba(0, 255, 0, 1)', // Πράσινο για Ολοκληρωμένα Αιτήματα
                        'rgba(0, 191, 255, 1)' // Γαλάζιο για Ολοκληρωμένες Προσφορές
                    ];
                }

            const chartConfig = {
                type: chartType,
                data: {
                    labels: ['Νέα Αιτήματα', 'Νέες Προσφορές', 'Ολοκληρωμένα Αιτήματα', 'Ολοκληρωμένες Προσφορές'],
                    datasets: [{
                        label: 'Ποσοστά',
                        data: data,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            display: chartType === 'bar' // Μόνο όταν είναι bar να εμφανίζεται ο άξονας
                        },
                        x: {
                            display: chartType === 'bar' // Μόνο όταν είναι bar να εμφανίζεται ο άξονας
                        }
                    }
                }
            };

            if (statsChart) {
                statsChart.destroy();
            }

            statsChart = new Chart(
                document.getElementById('statsChart'),
                chartConfig
            );
        },
        error: function(xhr, status, error) {
            console.error("An error occurred fetching statistics: " + status + ", " + error);
        }
    });
}

function toggleChartType() {
    const chartContainer = document.getElementById('chartContainer');
    if (currentChartType === 'bar') {
        currentChartType = 'doughnut';
        document.getElementById('toggleChartButton').innerText = 'Εμφάνιση Δεδομένων σε Γράφημα Ράβδων';
        chartContainer.classList.add('doughnut');
    } else {
        currentChartType = 'bar';
        document.getElementById('toggleChartButton').innerText = 'Εμφάνιση Δεδομένων σε Donut';
        chartContainer.classList.remove('doughnut');
    }
    updateStatistics(currentChartType);
}