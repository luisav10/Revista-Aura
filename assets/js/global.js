// Lógica de Animações de Rolagem (Scroll Animations)
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

// Lógica do Menu Hamburguer
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

// Lógica do Pop-up de Envio de Pauta
document.addEventListener('DOMContentLoaded', () => {
    const popupOverlay = document.getElementById('popupPauta');
    const closePopupButton = popupOverlay.querySelector('.close-popup');
    const fileInput = document.getElementById('arquivoPauta');
    const fileNameDisplay = document.getElementById('file-name-display');
    const openPautaButton = document.getElementById('openPautaButton');

    function openPopup() {
        popupOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closePopup() {
        popupOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (openPautaButton) {
        openPautaButton.addEventListener('click', openPopup);
    }

    closePopupButton.addEventListener('click', closePopup);

    popupOverlay.addEventListener('click', (event) => {
        if (event.target === popupOverlay) {
            closePopup();
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            fileNameDisplay.textContent = fileInput.files[0].name;
        } else {
            fileNameDisplay.textContent = 'Nenhum arquivo selecionado';
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // Seletor para o botão que abre o pop-up no header
    const openPautaButton = document.getElementById('openPautaButton');
    // Seletor para o botão que abre o pop-up na sidebar
    const sidebarPautaLink = document.querySelector('.sidebar-menu a[href="#"]');
    const popupOverlay = document.getElementById('popupPauta');
    const closePopupButtons = document.querySelectorAll('.close-popup');
    const sidebarMenu = document.querySelector('.sidebar-menu');

    // Função para abrir o pop-up
    const openPopup = (event) => {
        event.preventDefault();
        popupOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evita rolagem do body quando o pop-up está aberto
        // Fecha o menu lateral se estiver aberto
        sidebarMenu.classList.remove('active');
    };

    // Adiciona o evento de clique ao botão do header
    if (openPautaButton) {
        openPautaButton.addEventListener('click', openPopup);
    }

    // Adiciona o evento de clique ao link da sidebar
    if (sidebarPautaLink) {
        sidebarPautaLink.addEventListener('click', openPopup);
    }

    // Adiciona evento de clique para fechar o pop-up
    closePopupButtons.forEach(button => {
        button.addEventListener('click', () => {
            popupOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restaura a rolagem do body
        });
    });

    // Fecha o pop-up ao clicar fora dele
    popupOverlay.addEventListener('click', (event) => {
        if (event.target === popupOverlay) {
            popupOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // --- CÓDIGO EXISTENTE PARA ABRIR E FECHAR O MENU HAMBÚRGUER ---
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const closeMenuButton = document.querySelector('.close-menu');

    hamburgerMenu.addEventListener('click', () => {
        sidebarMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeMenuButton.addEventListener('click', () => {
        sidebarMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});