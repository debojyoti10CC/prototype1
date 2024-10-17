document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle
    const themeSwitch = document.getElementById('theme-switch');
    const body = document.body;

    if (themeSwitch) {
        themeSwitch.addEventListener('change', () => {
            body.classList.toggle('light-theme');
            localStorage.setItem('theme', body.classList.contains('light-theme') ? 'light' : 'dark');
        });

        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            body.classList.add('light-theme');
            themeSwitch.checked = true;
        }
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑';
    backToTopButton.className = 'back-to-top neon-button';
    document.body.appendChild(backToTopButton);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Simple form validation
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            this.querySelectorAll('input, select, textarea').forEach(field => {
                if (field.hasAttribute('required') && !field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    });

    // Home page specific functionality
    const xValue = document.getElementById('x-value');
    const yValue = document.getElementById('y-value');
    const zValue = document.getElementById('z-value');
    const stageValue = document.getElementById('stage-value');
    const connectBtn = document.getElementById('connect-btn');
    const contactForm = document.getElementById('contact-form');

    if (xValue && yValue && zValue) {
        // Simulated real-time data update
        function updateAxisValues() {
            xValue.textContent = Math.random().toFixed(2);
            yValue.textContent = Math.random().toFixed(2);
            zValue.textContent = Math.random().toFixed(2);
        }
        setInterval(updateAxisValues, 1000);
    }

    if (stageValue) {
        // Simulated tremor stage update
        function updateTremorStage() {
            const stage = Math.floor(Math.random() * 4);
            stageValue.textContent = stage;
            
            const colors = ['#00ff00', '#ffff00', '#ffa500', '#ff0000'];
            stageValue.style.color = colors[stage];
        }
        setInterval(updateTremorStage, 5000);
    }

    if (connectBtn) {
        // Connect button animation
        connectBtn.addEventListener('click', () => {
            connectBtn.classList.add('connecting');
            setTimeout(() => {
                connectBtn.classList.remove('connecting');
            }, 2000);
        });
    }

    if (contactForm) {
        // Form submission (prevent default for demo)
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Form submitted! (This is a demo)');
        });
    }
});