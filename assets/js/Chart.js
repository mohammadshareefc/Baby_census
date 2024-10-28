const ctx = document.getElementById('babiesGraph').getContext('2d');
const babiesChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['01-01-2024', '02-01-2024', '03-01-2024'],
        datasets: [{
            label: 'Babies Born',
            data: [5, 2, 4],
            backgroundColor: ['rgba(75, 192, 192, 0.2)'],
            borderColor: ['rgba(75, 192, 192, 1)'],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
