document.addEventListener('DOMContentLoaded', () => {
    const bookElement = document.querySelector('.book');
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');

    // **IMPORTANTE**: Liste aqui os caminhos para as suas imagens.
    // Certifique-se de que estas imagens existem na pasta 'imagens'.
    const pages = [
        'assets/imagem/favicon.png',       // Página 0 (capa)
        'imagens/pagina1.jpg',    // Página 1
        'imagens/pagina2.jpg',    // Página 2
        'imagens/pagina3.jpg',    // Página 3
        'imagens/pagina4.jpg',    // Página 4
        'imagens/pagina5.jpg',    // Página 5
        'imagens/contracapa.jpg'  // Última página (contracapa)
    ];

    let currentPageIndex = 0; // Índice da página esquerda atual
    let totalPages = pages.length;

    // Função para criar um elemento de página
    function createPageElement(imageSrc, id) {
        const pageDiv = document.createElement('div');
        pageDiv.classList.add('page');
        pageDiv.setAttribute('data-page-id', id);

        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = `Página ${id + 1}`;
        pageDiv.appendChild(img);

        return pageDiv;
    }

    // Função para renderizar as páginas visíveis
    function renderPages() {
        // Limpa o livro
        bookElement.innerHTML = '';

        // Exibe a página atual e a próxima (se houver)
        // Página da esquerda (sempre par)
        if (currentPageIndex >= 0 && currentPageIndex < totalPages) {
            const leftPage = createPageElement(pages[currentPageIndex], currentPageIndex);
            leftPage.classList.add('page-left', 'visible');
            bookElement.appendChild(leftPage);
        }

        // Página da direita (sempre ímpar)
        if (currentPageIndex + 1 < totalPages) {
            const rightPage = createPageElement(pages[currentPageIndex + 1], currentPageIndex + 1);
            rightPage.classList.add('page-right', 'visible');
            bookElement.appendChild(rightPage);
        }

        // Habilita/desabilita botões
        prevButton.disabled = currentPageIndex <= 0;
        nextButton.disabled = currentPageIndex + 2 >= totalPages;
    }

    // Função para virar para a próxima página
    function turnPageForward() {
        if (currentPageIndex + 2 < totalPages) {
            const currentPageRight = bookElement.querySelector(`.page[data-page-id="${currentPageIndex + 1}"]`);
            if (currentPageRight) {
                currentPageRight.classList.add('flipping');
                currentPageRight.style.zIndex = 1000; // Garante que esteja acima durante a animação

                currentPageRight.addEventListener('transitionend', function handler() {
                    currentPageRight.classList.remove('flipping', 'visible');
                    currentPageRight.classList.add('flipped'); // Marca como virada para trás
                    currentPageRight.style.zIndex = 5; // Volta para z-index menor
                    currentPageIndex += 2; // Avança duas páginas

                    renderPages();
                    currentPageRight.removeEventListener('transitionend', handler);
                }, { once: true });
            }
        }
    }

    // Função para virar para a página anterior
    function turnPageBackward() {
        if (currentPageIndex > 0) {
            currentPageIndex -= 2; // Volta duas páginas

            const nextPageRightId = currentPageIndex + 1;
            const nextPageRight = bookElement.querySelector(`.page[data-page-id="${nextPageRightId}"]`);

            // Se a página que queremos desvirar já está no DOM
            if (nextPageRight && nextPageRight.classList.contains('flipped')) {
                nextPageRight.classList.remove('flipped');
                nextPageRight.classList.add('flipping');
                nextPageRight.style.zIndex = 1000; // Garante que esteja acima durante a animação

                nextPageRight.addEventListener('transitionend', function handler() {
                    nextPageRight.classList.remove('flipping');
                    nextPageRight.classList.add('visible'); // Volta a ser visível
                    nextPageRight.style.zIndex = 10; // Z-index normal
                    renderPages(); // Re-renderiza para garantir o estado correto dos botões
                    nextPageRight.removeEventListener('transitionend', handler);
                }, { once: true });
            } else {
                // Se não, apenas renderiza as páginas novas
                renderPages();
            }
        }
    }

    // Event listeners para os botões
    nextButton.addEventListener('click', turnPageForward);
    prevButton.addEventListener('click', turnPageBackward);

    // Renderiza as páginas iniciais
    renderPages();
});