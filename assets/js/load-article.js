// Obtém o ID da notícia da URL
function getArticleIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Carrega a notícia do arquivo JSON
async function loadArticle() {
    const articleId = getArticleIdFromUrl();

    if (!articleId) {
        // Redireciona ou mostra uma mensagem de erro se não houver ID na URL
        document.getElementById('article-title').textContent = 'Notícia não encontrada.';
        document.getElementById('article-text').innerHTML = '<p>Por favor, selecione uma notícia válida.</p>';
        return;
    }

    try {
        const response = await fetch('assets/data/noticias.json');
        const articles = await response.json();

        // Encontra a notícia com o ID correspondente
        const article = articles.find(a => a.id == articleId);

        if (article) {
            // Preenche o template com os dados da notícia
            document.getElementById('page-title').textContent = `Revista Aura - ${article.titulo}`;
            document.getElementById('article-title').textContent = article.titulo;
            document.getElementById('article-date').textContent = `Publicado em: ${article.data}`;
            document.getElementById('article-image').src = article.imagem;
            document.getElementById('article-image').alt = article.titulo; // Atualiza o alt da imagem
            document.getElementById('article-text').innerHTML = article.texto;
        } else {
            // Caso o ID não corresponda a nenhuma notícia
            document.getElementById('article-title').textContent = 'Notícia não encontrada.';
            document.getElementById('article-text').innerHTML = '<p>A notícia que você procura não existe.</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar a notícia:', error);
        document.getElementById('article-title').textContent = 'Erro ao carregar o conteúdo.';
        document.getElementById('article-text').innerHTML = '<p>Não foi possível carregar a notícia no momento. Tente novamente mais tarde.</p>';
    }
}

// Executa a função quando a página é carregada
document.addEventListener('DOMContentLoaded', loadArticle);