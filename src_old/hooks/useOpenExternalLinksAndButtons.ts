import { useEffect } from 'react';

function useOpenExternalLinksAndButtons() {
  useEffect(() => {
    // Gestion des <a>
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      const url = link.getAttribute('href');
      if (url && !url.startsWith(window.location.origin)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });

    // Gestion des <button data-url="...">
    const buttons = document.querySelectorAll('button[data-url]');
    buttons.forEach(button => {
      const url = button.getAttribute('data-url');
      if (url) {
        button.onclick = () => window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  }, []);
}

export default useOpenExternalLinksAndButtons;