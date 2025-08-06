// Lógica da Animação do Título
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

const totalOriginalItems = 5;
let itemsPerView = 3;
let currentIndex = itemsPerView;
let isDragging = false;
let startPosition = 0;
let currentTranslate = 0;
let prevTranslate = 0;

function updateItemsPerView() {
    if (window.innerWidth <= 768) {
        itemsPerView = 1;
        if (carouselDotsContainer) carouselDotsContainer.style.display = 'flex';
    } else if (window.innerWidth <= 1024) {
        itemsPerView = 2;
        if (carouselDotsContainer) carouselDotsContainer.style.display = 'none';
    } else { // Desktop
        itemsPerView = 3;
        if (carouselDotsContainer) carouselDotsContainer.style.display = 'none';
    }
    currentIndex = itemsPerView;
    updateCarouselPosition(false);
    updateDots();
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
        carouselTrack.style.transition = 'none';
    }

    setSliderPosition();
    prevTranslate = currentTranslate;
    updateDots();
}

function checkAndLoopCarousel() {
    if (currentIndex >= totalOriginalItems + itemsPerView) {
        currentIndex = itemsPerView;
        updateCarouselPosition(false);
    } else if (currentIndex < itemsPerView) {
        currentIndex = totalOriginalItems + (itemsPerView - 1);
        updateCarouselPosition(false);
    }
}

function updateDots() {
    if (!carouselDots || carouselDots.length === 0) return;

    const realIndex = (currentIndex - itemsPerView) % totalOriginalItems;
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
    carouselTrack.style.transition = 'none';
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

    const movedBy = currentTranslate - prevTranslate;
    const threshold = carouselItems[0].offsetWidth * 0.25;

    if (movedBy < -threshold) {
        currentIndex++;
    } else if (movedBy > threshold) {
        currentIndex--;
    }

    updateCarouselPosition();
    carouselTrack.addEventListener('transitionend', checkAndLoopCarousel, { once: true });
}

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

if (carouselDotsContainer) {
    carouselDots.forEach(dot => {
        dot.addEventListener('click', (event) => {
            const targetIndex = parseInt(event.target.dataset.index, 10);
            currentIndex = itemsPerView + targetIndex;
            updateCarouselPosition();
        });
    });
}

window.addEventListener('resize', updateItemsPerView);
window.addEventListener('load', () => {
    updateItemsPerView();
    updateCarouselPosition(false);
});
document.addEventListener('DOMContentLoaded', function() {
    const pautaForm = document.getElementById('pautaForm');
    const pautaFormWrapper = document.getElementById('pauta-form-wrapper');
    const pautaSuccessWrapper = document.getElementById('pauta-success-wrapper');
    const openPautaButton = document.getElementById('openPautaButton');
    const closePopupButton = document.querySelector('.close-popup');
    const popupOverlay = document.getElementById('popupPauta');

    openPautaButton.addEventListener('click', function(event) {
        event.preventDefault();
        popupOverlay.style.display = 'flex';
        pautaFormWrapper.style.display = 'block'; // Mostra o formulário
        pautaSuccessWrapper.style.display = 'none'; // Esconde a mensagem de sucesso
    });

    closePopupButton.addEventListener('click', function() {
        popupOverlay.style.display = 'none';
        pautaForm.reset(); // Limpa o formulário quando o pop-up é fechado
    });

    pautaForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Envia o formulário usando fetch para evitar recarregar a página
        fetch(pautaForm.action, {
            method: 'POST',
            body: new FormData(pautaForm),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Se o envio for bem-sucedido:
                // 1. Esconde o formulário
                pautaFormWrapper.style.display = 'none';
                // 2. Mostra a mensagem de sucesso
                pautaSuccessWrapper.style.display = 'block';
                // 3. Reseta o formulário para limpar os campos
                pautaForm.reset();
            } else {
                // Se houver erro, pode exibir uma mensagem de erro
                alert('Ocorreu um erro ao enviar a pauta. Por favor, tente novamente.');
            }
        })
        .catch(error => {
            alert('Ocorreu um erro ao enviar a pauta. Por favor, tente novamente.');
        });
    });
});