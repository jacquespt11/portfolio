document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Initialisation de Swiper pour le carrousel des compétences
    const swiper = new Swiper('.mySwiper', {
        loop: true,
        grabCursor: true,
        spaceBetween: 30,
        breakpoints: {
            640: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // 2. Animations au défilement avec Intersection Observer
    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (element.id === 'home') {
                    // Animation pour la section Hero
                    const heroElements = element.querySelectorAll('h1, p, a');
                    heroElements.forEach((el, index) => {
                        el.style.animationDelay = `${index * 0.3}s`;
                        el.classList.add('animate-fade-in-down');
                        el.classList.remove('opacity-0');
                    });
                } else {
                    // Animation pour les autres sections
                    element.classList.remove('opacity-0');
                    element.classList.add('animate-fade-in-up');
                }
                observer.unobserve(element);
            }
        });
    };

    const sections = document.querySelectorAll('header, section');
    const options = {
        root: null,
        threshold: 0.1,
    };
    const observer = new IntersectionObserver(animateOnScroll, options);
    sections.forEach(section => observer.observe(section));

    // 3. Validation de formulaire et feedback
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Validation basique
        if (!name || !email || !message) {
            formMessage.textContent = "Veuillez remplir tous les champs.";
            formMessage.classList.remove('text-green-500');
            formMessage.classList.add('text-red-500');
            return;
        }
        
        // Validation d'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            formMessage.textContent = "Veuillez entrer une adresse email valide.";
            formMessage.classList.remove('text-green-500');
            formMessage.classList.add('text-red-500');
            return;
        }

        // Simuler l'envoi de données
        setTimeout(() => {
            formMessage.textContent = "Message envoyé avec succès ! Je vous répondrai très vite.";
            formMessage.classList.remove('text-red-500');
            formMessage.classList.add('text-green-500');
            contactForm.reset();
        }, 1000);
    });
});