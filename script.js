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
// Selecionamos TODOS os itens, incluindo os clones
const carouselItems = document.querySelectorAll('.carousel-track .caixa-noticia');
const prevButton = document.querySelector('.carousel-button.prev');
const nextButton = document.querySelector('.carousel-button.next');

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
    } else if (window.innerWidth <= 1024) {
        itemsPerView = 2;
    } else {
        itemsPerView = 3;
    }
    // Ao redimensionar, reposicionamos o carrossel no início dos itens originais
    currentIndex = itemsPerView;
    updateCarouselPosition(false); // Sem animação no resize
}

function getPositionX(event) {
    return event.clientX || (event.touches && event.touches.length > 0 ? event.touches.item(0).clientX : 0);
}

function setSliderPosition() {
    carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
}

function updateCarouselPosition(animated = true) {
    if (!carouselTrack || !carouselItems || carouselItems.length === 0) return;

    const itemWidth = carouselItems[0].offsetWidth;
    const gap = 25;
    const totalItemWidthWithGap = itemWidth + gap;

    currentTranslate = currentIndex * -totalItemWidthWithGap;

    if (animated) {
        carouselTrack.style.transition = 'transform 0.5s ease-in-out';
    } else {
        carouselTrack.style.transition = 'none'; // Remove transição para o "salto" instantâneo
    }

    setSliderPosition();
    prevTranslate = currentTranslate;
}

function checkAndLoopCarousel() {
    // Quando estamos nos clones do final, saltamos para os itens originais no início
    if (currentIndex >= carouselItems.length - itemsPerView) {
        currentIndex = itemsPerView; // Volta para o início dos itens originais
        updateCarouselPosition(false); // Salto instantâneo
    }
    // Quando estamos nos clones do início, saltamos para os itens originais no final
    else if (currentIndex <= (itemsPerView - 1)) { // Se estiver nos clones iniciais
        currentIndex = totalOriginalItems + (itemsPerView -1); // Vai para o final dos originais (contando os clones iniciais)
        updateCarouselPosition(false); // Salto instantâneo
    }
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

function nextSlide() {
    currentIndex++;
    updateCarouselPosition();
    carouselTrack.addEventListener('transitionend', checkAndLoopCarousel, { once: true });
}

function prevSlide() {
    currentIndex--;
    updateCarouselPosition();
    carouselTrack.addEventListener('transitionend', checkAndLoopCarousel, { once: true });
}

// Event Listeners
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