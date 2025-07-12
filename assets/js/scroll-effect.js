document.addEventListener('DOMContentLoaded', function() {
  const articleContent = document.querySelector('.article-content');
  if (articleContent) {
    articleContent.classList.add('scroll-up');
  }
});

function revealFooterOnScroll() {
  const footer = document.querySelector('footer');
  if (!footer) return;

  const windowHeight = window.innerHeight;
  const footerTop = footer.getBoundingClientRect().top;
  const revealPoint = 200;

  if (footerTop < windowHeight - revealPoint) {
    footer.classList.add('is-visible');
  }
}

window.addEventListener('scroll', revealFooterOnScroll);
window.addEventListener('load', revealFooterOnScroll); // Adiciona essa linha para verificar no carregamento