// Animated heading
const heading = document.getElementById('animated-heading');
const text = heading.textContent;
heading.textContent = '';

function typeWriter(text, i) {
    if (i < text.length) {
        heading.textContent += text.charAt(i);
        setTimeout(() => typeWriter(text, i + 1), 100);
    }
}

typeWriter(text, 0);

// Sample data for charts
const sampleData = {
    daily: [10, 8, 12, 15, 7, 9, 11],
    weekly: [65, 59, 80, 81, 56, 55, 40],
    monthly: [200, 185, 190, 210, 220, 205, 195, 230, 215, 185, 195, 200],
    overall: [500, 650, 750, 800, 950, 1000, 1100, 1050, 1200, 1150, 1300, 1250]
};

// Create charts
function createChart(ctx, label, data) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: data.length}, (_, i) => i + 1),
            datasets: [{
                label: label,
                data: data,
                borderColor: '#00ff00',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

createChart(document.getElementById('daily-chart').getContext('2d'), 'Daily Tremor Intensity', sampleData.daily);
createChart(document.getElementById('weekly-chart').getContext('2d'), 'Weekly Tremor Intensity', sampleData.weekly);
createChart(document.getElementById('monthly-chart').getContext('2d'), 'Monthly Tremor Intensity', sampleData.monthly);
createChart(document.getElementById('overall-chart').getContext('2d'), 'Overall Tremor Intensity', sampleData.overall);

// Generate full report
document.getElementById('generate-report').addEventListener('click', function() {
    // Here you would typically generate a PDF or detailed report
    alert('Generating full report... This feature is not yet implemented.');
});