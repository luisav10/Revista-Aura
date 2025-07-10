// JavaScript (script.js)
const tituloAnimadoContainer = document.querySelector('.titulo-animado');

function animarTitulo() {
    tituloAnimadoContainer.classList.add('animar-aura');
    setTimeout(() => {
        tituloAnimadoContainer.classList.remove('animar-aura');
    }, 2000);
}

setTimeout(animarTitulo, 1000);
setInterval(animarTitulo, 4000);

// Lógica do Carrossel Infinito
const carouselTrack = document.querySelector('.carousel-track');
const carouselItems = document.querySelectorAll('.carousel-track .caixa-noticia');
const prevButton = document.querySelector('.carousel-button.prev');
const nextButton = document.querySelector('.carousel-button.next');
const carouselDotsContainer = document.querySelector('.carousel-dots');
const carouselDots = document.querySelectorAll('.carousel-dots .dot');


const totalOriginalItems = 5; // O número original de caixinhas (sem os clones)
let itemsPerView = 3;
let currentIndex = itemsPerView; // Começa no índice onde os itens originais começam (após os clones do início)
let isDragging = false;
let startPosition = 0;
let currentTranslate = 0;
let prevTranslate = 0;

function updateItemsPerView() {
    if (window.innerWidth <= 768) {
        itemsPerView = 1;
        // Mostra as bolinhas em mobile
        if (carouselDotsContainer) carouselDotsContainer.style.display = 'flex';
    } else if (window.innerWidth <= 1024) {
        itemsPerView = 2;
        // Esconde as bolinhas em tablet (se não quiser que apareçam)
        if (carouselDotsContainer) carouselDotsContainer.style.display = 'none';
    } else { // Desktop
        itemsPerView = 3;
        // Esconde as bolinhas em desktop
        if (carouselDotsContainer) carouselDotsContainer.style.display = 'none';
    }
    // Ao redimensionar, reposicionamos o carrossel no início dos itens originais
    currentIndex = itemsPerView;
    updateCarouselPosition(false); // Sem animação no resize
    updateDots(); // Atualiza as bolinhas ao redimensionar
}

function getPositionX(event) {
    return event.clientX || (event.touches && event.touches.length > 0 ? event.touches.item(0).clientX : 0);
}

function setSliderPosition() {
    carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
}

function updateCarouselPosition(animated = true) {
    if (!carouselTrack || !carouselItems || carouselItems.length === 0) return;

    // A largura do item é sempre a mesma em um determinado breakpoint
    const itemWidth = carouselItems[0].offsetWidth;
    const gap = 25; // Define o gap fixo
    const totalItemWidthWithGap = itemWidth + gap;

    currentTranslate = currentIndex * -totalItemWidthWithGap;

    if (animated) {
        carouselTrack.style.transition = 'transform 0.5s ease-in-out';
    } else {
        carouselTrack.style.transition = 'none'; // Remove transição para o "salto" instantâneo
    }

    setSliderPosition();
    prevTranslate = currentTranslate;
    updateDots(); // Atualiza as bolinhas após mover o carrossel
}

function checkAndLoopCarousel() {
    // Quando estamos nos clones do final, saltamos para os itens originais no início
    if (currentIndex >= totalOriginalItems + itemsPerView) { // Ajuste para considerar os clones iniciais
        currentIndex = itemsPerView; // Volta para o início dos itens originais
        updateCarouselPosition(false); // Salto instantâneo
    }
    // Quando estamos nos clones do início, saltamos para os itens originais no final
    else if (currentIndex < itemsPerView) { // Se estiver nos clones iniciais
        currentIndex = totalOriginalItems + (itemsPerView - 1); // Vai para o final dos originais (contando os clones iniciais)
        updateCarouselPosition(false); // Salto instantâneo
    }
}

// Nova função para atualizar o estado das bolinhas
function updateDots() {
    if (!carouselDots || carouselDots.length === 0) return;

    // Calcula o índice "real" do item visível, ajustando pelos clones iniciais
    // Pega o índice atual dentro dos itens originais, fazendo loop
    const realIndex = (currentIndex - itemsPerView) % totalOriginalItems;
    // Garante que o índice real seja positivo (para casos de % com números negativos)
    const normalizedRealIndex = (realIndex + totalOriginalItems) % totalOriginalItems;


    carouselDots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === normalizedRealIndex) {
            dot.classList.add('active');
        }
    });
}


function dragStart(event) {
    if (!carouselTrack || carouselItems.length <= itemsPerView) return;
    isDragging = true;
    startPosition = getPositionX(event);
    carouselTrack.classList.add('grabbing');
    carouselTrack.style.transition = 'none'; // Remove a transição ao arrastar
}

function dragMove(event) {
    if (!isDragging || !carouselTrack || carouselItems.length <= itemsPerView) return;
    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startPosition;
    setSliderPosition();
}

function dragEnd() {
    if (!isDragging || !carouselTrack || carouselItems.length <= itemsPerView) return;
    isDragging = false;
    carouselTrack.classList.remove('grabbing');
    // Não adicionamos a transição de volta aqui, ela é adicionada no updateCarouselPosition

    const movedBy = currentTranslate - prevTranslate;
    const threshold = carouselItems[0].offsetWidth * 0.25; // 25% da largura do item

    if (movedBy < -threshold) { // Arrastou para a esquerda (próximo item)
        currentIndex++;
    } else if (movedBy > threshold) { // Arrastou para a direita (item anterior)
        currentIndex--;
    }

    updateCarouselPosition();
    // Após a animação, verifica se precisa fazer o loop
    carouselTrack.addEventListener('transitionend', checkAndLoopCarousel, { once: true });
}

// Funções para avançar e voltar com os botões
function prevSlide() {
    currentIndex--;
    updateCarouselPosition();
    carouselTrack.addEventListener('transitionend', checkAndLoopCarousel, { once: true });
}

function nextSlide() {
    currentIndex++;
    updateCarouselPosition();
    carouselTrack.addEventListener('transitionend', checkAndLoopCarousel, { once: true });
}

// Event Listeners para os botões do carrossel
if (prevButton) {
    prevButton.addEventListener('click', prevSlide);
}
if (nextButton) {
    nextButton.addEventListener('click', nextSlide);
}


if (carouselTrack) {
    carouselTrack.addEventListener('mousedown', dragStart);
    carouselTrack.addEventListener('mousemove', dragMove);
    window.addEventListener('mouseup', dragEnd);

    carouselTrack.addEventListener('touchstart', dragStart);
    carouselTrack.addEventListener('touchmove', dragMove);
    window.addEventListener('touchend', dragEnd);
}

// Adiciona listener para cliques nas bolinhas
if (carouselDotsContainer) {
    carouselDots.forEach(dot => {
        dot.addEventListener('click', (event) => {
            const targetIndex = parseInt(event.target.dataset.index, 10);
            // Ajusta o currentIndex para ir para o item original correto
            // Se itemsPerView for 3, o primeiro item original está no índice 3
            // (0,1,2 são clones; 3,4,5 são originais 0,1,2)
            currentIndex = itemsPerView + targetIndex;
            updateCarouselPosition();
        });
    });
}


window.addEventListener('resize', updateItemsPerView);
window.addEventListener('load', () => {
    updateItemsPerView(); // Configura itemsPerView e currentIndex inicial
    updateCarouselPosition(false); // Posição inicial sem animação
});

// Simulação de link para a página da notícia
const caixasNoticia = document.querySelectorAll('.caixa-noticia:not(.clone)'); // Ignora os clones para a simulação de clique
caixasNoticia.forEach(caixa => {
    caixa.addEventListener('click', () => {
        alert('Você clicou em uma notícia!');
    });
});

// --- Animações de Rolagem (Scroll Animations) ---

const observerOptions = {
    root: null, // Observa a viewport
    rootMargin: '0px',
    threshold: 0.2 // A animação dispara quando 20% do elemento está visível
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Para de observar depois de animar uma vez
        }
    });
}, observerOptions);

// Observar as seções que devem animar
const sectionsToAnimate = document.querySelectorAll('.animate-on-scroll');
sectionsToAnimate.forEach(section => {
    observer.observe(section);
});

// Aumenta a área de clique dos botões sociais
const socialButtons = document.querySelectorAll('.social-button');
socialButtons.forEach(button => {
    button.addEventListener('click', function(event) {
        // Se o clique não foi diretamente no ícone, propague para o link
        if (event.target === this) {
            window.open(this.href, this.target);
        }
    });
});

// --- Lógica do Menu Hamburguer ---
const hamburgerButton = document.querySelector('.hamburger-menu');
const closeMenuButton = document.querySelector('.close-menu');
const sidebarMenu = document.querySelector('.sidebar-menu');

if (hamburgerButton && sidebarMenu && closeMenuButton) {
    hamburgerButton.addEventListener('click', () => {
        sidebarMenu.classList.add('active');
    });

    closeMenuButton.addEventListener('click', () => {
        sidebarMenu.classList.remove('active');
    });

    // Fechar menu ao clicar em um link
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            sidebarMenu.classList.remove('active');
        });
    });
}