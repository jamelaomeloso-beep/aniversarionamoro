// Navegação suave
document.querySelectorAll("a[href^=\"#\"]").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

// Efeito de scroll no header (esconder/mostrar)
let lastScrollTop = 0;
window.addEventListener("scroll", function() {
    const header = document.querySelector("header");
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        // Scrolling down
        header.classList.add("hidden");
    } else {
        // Scrolling up
        header.classList.remove("hidden");
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling

    // Adicionar/remover classe 'scrolled' para efeito de fundo
    if (window.scrollY > 100) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

// Animação de entrada dos elementos e contagem de números
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";

            // Animação de contagem para números
            if (entry.target.classList.contains("number-item")) {
                const numberSpan = entry.target.querySelector(".number");
                const targetNumber = parseInt(numberSpan.dataset.target);
                let currentNumber = 0;
                const duration = 2000; // 2 segundos
                const increment = targetNumber / (duration / 10); // A cada 10ms

                const timer = setInterval(() => {
                    currentNumber += increment;
                    if (currentNumber >= targetNumber) {
                        currentNumber = targetNumber;
                        clearInterval(timer);
                    }
                    numberSpan.textContent = Math.floor(currentNumber);
                }, 10);
            }
            observer.unobserve(entry.target); // Parar de observar após a animação
        }
    });
}, observerOptions);

// Aplicar animação aos elementos quando a página carregar
document.addEventListener("DOMContentLoaded", function() {
    const animatedElements = document.querySelectorAll(
        ".feature-item, .step, .faq-item, .testimonial-card, .objection-item, .price-box, .number-item"
    );
    animatedElements.forEach(element => {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(element);
    });

    // Animação inicial para hero-content e hero-image
    const heroContent = document.querySelector(".hero-content");
    const heroImage = document.querySelector(".hero-image");
    if (heroContent) {
        heroContent.style.opacity = "1";
        heroContent.style.transform = "translateY(0)";
    }
    if (heroImage) {
        heroImage.style.opacity = "1";
        heroImage.style.transform = "translateX(0)";
    }

    // Carrossel de Depoimentos tipo Instagram (sem setas, arrastável)
    const carouselTrack = document.querySelector(".carousel-track");
    const testimonialCards = document.querySelectorAll(".testimonial-card");
    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    function updateCarousel() {
        const cardWidth = testimonialCards[0].offsetWidth + 20; // Largura do card + gap
        carouselTrack.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
    }

    // Touch events para mobile
    carouselTrack.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        carouselTrack.style.cursor = "grabbing";
    });

    carouselTrack.addEventListener("touchmove", (e) => {
        if (!isDragging) return;
        e.preventDefault();
        currentX = e.touches[0].clientX;
        const diffX = currentX - startX;
        const cardWidth = testimonialCards[0].offsetWidth + 20;
        carouselTrack.style.transform = `translateX(${-currentIndex * cardWidth + diffX}px)`;
    });

    carouselTrack.addEventListener("touchend", (e) => {
        if (!isDragging) return;
        isDragging = false;
        carouselTrack.style.cursor = "grab";
        
        const diffX = currentX - startX;
        const threshold = 50; // Mínimo de movimento para trocar de slide
        
        if (diffX > threshold && currentIndex > 0) {
            currentIndex--;
        } else if (diffX < -threshold && currentIndex < testimonialCards.length - 1) {
            currentIndex++;
        }
        
        updateCarousel();
    });

    // Mouse events para desktop
    carouselTrack.addEventListener("mousedown", (e) => {
        startX = e.clientX;
        isDragging = true;
        carouselTrack.style.cursor = "grabbing";
        e.preventDefault();
    });

    carouselTrack.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        e.preventDefault();
        currentX = e.clientX;
        const diffX = currentX - startX;
        const cardWidth = testimonialCards[0].offsetWidth + 20;
        carouselTrack.style.transform = `translateX(${-currentIndex * cardWidth + diffX}px)`;
    });

    carouselTrack.addEventListener("mouseup", (e) => {
        if (!isDragging) return;
        isDragging = false;
        carouselTrack.style.cursor = "grab";
        
        const diffX = currentX - startX;
        const threshold = 50; // Mínimo de movimento para trocar de slide
        
        if (diffX > threshold && currentIndex > 0) {
            currentIndex--;
        } else if (diffX < -threshold && currentIndex < testimonialCards.length - 1) {
            currentIndex++;
        }
        
        updateCarousel();
    });

    carouselTrack.addEventListener("mouseleave", () => {
        if (isDragging) {
            isDragging = false;
            carouselTrack.style.cursor = "grab";
            updateCarousel();
        }
    });

    // Ajustar carrossel ao redimensionar a janela
    window.addEventListener("resize", updateCarousel);

    // Inicializar carrossel
    updateCarousel();

    // Auto-play opcional (comentado para não interferir com a interação do usuário)
    setInterval(() => {
        currentIndex = (currentIndex < testimonialCards.length - 1) ? currentIndex + 1 : 0;
        updateCarousel();
     }, 5000);
     
    // Menu Hambúrguer
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const nav = document.querySelector("nav");

    hamburgerMenu.addEventListener("click", () => {
        nav.classList.toggle("active");
    });

    // Fechar menu ao clicar em um item (mobile)
    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            if (nav.classList.contains("active")) {
                nav.classList.remove("active");
            }
        });
    });
    
});

// Efeito de hover nos botões (mantido para exemplo, CSS já faz a maioria)
document.querySelectorAll(".btn-primary").forEach(button => {
    button.addEventListener("mouseenter", function() {
        this.style.transform = "translateY(-2px) scale(1.05)";
    });
    
    button.addEventListener("mouseleave", function() {
        this.style.transform = "translateY(0) scale(1)";
    });
});

