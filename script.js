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
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona o overlay do pop-up
    const popupOverlay = document.getElementById('popupPauta');
    // Seleciona o botão de fechar dentro do pop-up
    const closePopupButton = popupOverlay.querySelector('.close-popup');
    // Seleciona o input de arquivo
    const fileInput = document.getElementById('arquivoPauta');
    // Seleciona o span para exibir o nome do arquivo
    const fileNameDisplay = document.getElementById('file-name-display');

    // **IMPORTANTE**: Você precisa de um botão ou link no seu HTML para abrir o pop-up.
    // Certifique-se de que este elemento tenha o ID 'openPautaButton' (ou ajuste o ID abaixo).
    const openPautaButton = document.getElementById('openPautaButton');

    // Função para abrir o pop-up
    function openPopup() {
        popupOverlay.classList.add('active');
        // Opcional: Adiciona uma classe ao body para evitar rolagem de fundo
        document.body.style.overflow = 'hidden';
    }

    // Função para fechar o pop-up
    function closePopup() {
        popupOverlay.classList.remove('active');
        // Opcional: Remove a classe do body para restaurar a rolagem
        document.body.style.overflow = '';
    }

    // Event listener para abrir o pop-up (se o botão existir)
    if (openPautaButton) {
        openPautaButton.addEventListener('click', openPopup);
    }

    // Event listener para fechar o pop-up pelo botão X
    closePopupButton.addEventListener('click', closePopup);

    // Event listener para fechar o pop-up clicando fora do conteúdo (no overlay)
    popupOverlay.addEventListener('click', (event) => {
        if (event.target === popupOverlay) {
            closePopup();
        }
    });

    // Event listener para exibir o nome do arquivo selecionado
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            fileNameDisplay.textContent = fileInput.files[0].name;
        } else {
            fileNameDisplay.textContent = 'Nenhum arquivo selecionado';
        }
    });
});
         // Script específico para a página de notícias e calendário 
         document.addEventListener('DOMContentLoaded', () => { 
             // Reativa a animação de rolagem para esta página 
             const sectionsToAnimate = document.querySelectorAll('.animate-on-scroll'); 
             const observerOptions = { 
                 root: null, 
                 rootMargin: '0px', 
                 threshold: 0.2 
             }; 
             const observer = new IntersectionObserver((entries, observer) => { 
                 entries.forEach(entry => { 
                     if (entry.isIntersecting) { 
                         entry.target.classList.add('is-visible'); 
                         observer.unobserve(entry.target); 
                     } 
                 }); 
             }, observerOptions); 
             sectionsToAnimate.forEach(section => { 
                 observer.observe(section); 
             }); 

             // Lógica para o menu hambúrguer, se o script principal não for carregado 
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

                 const sidebarLinks = document.querySelectorAll('.sidebar-link'); 
                 sidebarLinks.forEach(link => { 
                     link.addEventListener('click', () => { 
                         sidebarMenu.classList.remove('active'); 
                     }); 
                 }); 
             } 

             // Lógica do calendário 
             const searchDateButton = document.getElementById('searchDateButton'); 
             const calendarPopup = document.getElementById('calendarPopup'); 
             const currentMonthYear = document.getElementById('currentMonthYear'); 
             const calendarGrid = document.getElementById('calendarGrid'); 
             const prevMonthButton = document.getElementById('prevMonth'); 
             const nextMonthButton = document.getElementById('nextMonth'); 
             const yearSelect = document.getElementById('yearSelect'); 
             const monthSelect = document.getElementById('monthSelect'); 
             const selectDateButton = document.getElementById('selectDateButton'); 

             let currentViewDate = new Date(); // Mês e ano atualmente exibidos no calendário 

             function toggleCalendar() { 
                 calendarPopup.classList.toggle('active'); 
             } 

             function generateCalendar(year, month) { 
                 calendarGrid.innerHTML = ''; // Limpa os dias anteriores 
                 const firstDayOfMonth = new Date(year, month, 1); 
                 const lastDayOfMonth = new Date(year, month + 1, 0); 
                 const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Domingo, 1 = Segunda... 

                 currentMonthYear.textContent = `${firstDayOfMonth.toLocaleString('pt-br', { month: 'long' })} ${year}`; 
                 yearSelect.value = year; 
                 monthSelect.value = month; 

                 // Preenche dias vazios no início do mês 
                 for (let i = 0; i < firstDayOfWeek; i++) { 
                     const emptyDay = document.createElement('div'); 
                     emptyDay.classList.add('empty-day'); 
                     calendarGrid.appendChild(emptyDay); 
                 } 

                 // Preenche os dias do mês 
                 for (let day = 1; day <= lastDayOfMonth.getDate(); day++) { 
                     const dayElement = document.createElement('div'); 
                     dayElement.classList.add('calendar-day'); 
                     dayElement.textContent = day; 
                     dayElement.dataset.date = new Date(year, month, day).toISOString().split('T')[0]; 
                     dayElement.addEventListener('click', () => { 
                         // Remove 'selected' de todos os dias 
                         document.querySelectorAll('.calendar-day.selected').forEach(d => d.classList.remove('selected')); 
                         // Adiciona 'selected' ao dia clicado 
                         dayElement.classList.add('selected'); 
                     }); 
                     calendarGrid.appendChild(dayElement); 
                 } 
             } 

             function setupYearSelect() { 
                 const currentYear = new Date().getFullYear(); 
                 for (let i = currentYear - 10; i <= currentYear + 5; i++) { 
                     const option = document.createElement('option'); 
                     option.value = i; 
                     option.textContent = i; 
                     yearSelect.appendChild(option); 
                 } 
                 yearSelect.value = currentYear; 
             } 

             searchDateButton.addEventListener('click', toggleCalendar); 

             prevMonthButton.addEventListener('click', () => { 
                 currentViewDate.setMonth(currentViewDate.getMonth() - 1); 
                 generateCalendar(currentViewDate.getFullYear(), currentViewDate.getMonth()); 
             }); 

             nextMonthButton.addEventListener('click', () => { 
                 currentViewDate.setMonth(currentViewDate.getMonth() + 1); 
                 generateCalendar(currentViewDate.getFullYear(), currentViewDate.getMonth()); 
             }); 

             yearSelect.addEventListener('change', (event) => { 
                 currentViewDate.setFullYear(parseInt(event.target.value)); 
                 generateCalendar(currentViewDate.getFullYear(), currentViewDate.getMonth()); 
             }); 

             monthSelect.addEventListener('change', (event) => { 
                 currentViewDate.setMonth(parseInt(event.target.value)); 
                 generateCalendar(currentViewDate.getFullYear(), currentViewDate.getMonth()); 
             }); 

             selectDateButton.addEventListener('click', () => { 
                 const selectedDay = document.querySelector('.calendar-day.selected'); 
                 if (selectedDay) { 
                     const date = selectedDay.dataset.date; 
                     alert(`Data selecionada: ${date}. Aqui você buscaria as notícias dessa data.`); 
                     toggleCalendar(); // Fecha o calendário após a seleção 
                 } else { 
                     alert('Por favor, selecione um dia.'); 
                 } 
             }); 

             setupYearSelect(); 
             generateCalendar(currentViewDate.getFullYear(), currentViewDate.getMonth()); 

             // Fechar o calendário ao clicar fora 
             document.addEventListener('click', (event) => { 
                 if (!calendarPopup.contains(event.target) && !searchDateButton.contains(event.target) && calendarPopup.classList.contains('active')) { 
                     calendarPopup.classList.remove('active'); 
                 } 
             }); 
         });