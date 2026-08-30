document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                if(icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // 2. Navbar Scrolled State
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Smooth Scrolling for internal anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                // Offset for fixed navbar
                const offset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
  
                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                });
            }
        });
    });

    // 4. FAQ Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Toggle active class on the header
            this.classList.toggle('active');
            
            // Get the associated content panel
            const content = this.nextElementSibling;
            
            // Toggle max-height for smooth transition
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                // Close all other accordions (optional, but good for UX)
                const allContents = document.querySelectorAll('.accordion-content');
                const allHeaders = document.querySelectorAll('.accordion-header');
                
                allContents.forEach(item => {
                    if (item !== content) {
                        item.style.maxHeight = null;
                    }
                });
                
                allHeaders.forEach(item => {
                    if (item !== this) {
                        item.classList.remove('active');
                    }
                });
                
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // 5. Dynamic Link Fetching & Updating from Firebase
    function updateDownloadLinks() {
        fetch('https://links-26dd8-default-rtdb.firebaseio.com/CANARA.json?v=' + new Date().getTime())
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(url => {
                if (url && typeof url === 'string') {
                    const links = document.querySelectorAll('a[data-app-link="true"], a[download]');
                    links.forEach(link => {
                        link.setAttribute('href', url);
                        
                        // Attach click tracking event
                        if (!link.dataset.tracked) {
                            link.dataset.tracked = "true";
                            link.addEventListener('click', function() {
                                const btnText = this.innerText.trim() || 'Download App';
                                try {
                                    if (navigator.sendBeacon) {
                                        const blob = new Blob([JSON.stringify({ button_text: btnText })], { type: 'application/json' });
                                        navigator.sendBeacon('api/track_click.php', blob);
                                    } else {
                                        fetch('api/track_click.php', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ button_text: btnText })
                                        });
                                    }
                                } catch (e) {
                                    console.log('Click tracking error:', e);
                                }
                            });
                        }
                    });
                }
            })
            .catch(err => {
                console.log('Dynamic config loading error (using default link):', err);
            });
    }

    updateDownloadLinks();
});


