// utils/quickleRedirect.ts
/**
 * Utilitaire pour rediriger vers Quickle avec injection automatique du nombre de participants
 *
 * Quickle ne supporte pas les paramètres URL pour le nombre de participants,
 * donc on utilise une page intermédiaire qui injecte la valeur via JavaScript
 */

interface QuickleBookingData {
  parkName: string;
  activityName: string;
  participants: number;
  date?: string;
  time?: string;
}

/**
 * Génère l'URL Quickle pour une activité spécifique
 */
export function generateQuickleUrl(parkId: string, activityId: string): string {
  const quickleUrls: Record<string, Record<string, string>> = {
    'nolimit-chevry': {
      'accrobranche': 'https://nolimit-aventure.qweekle.com/shop/nolimit-aventure-chevry/accrobranche',
      'paintball': 'https://nolimit-aventure.qweekle.com/shop/nolimit-aventure-chevry/paintball',
      'tir-arc': 'https://nolimit-aventure.qweekle.com/shop/nolimit-aventure-chevry/tir-a-larc',
    },
    'nolimit-nemours': {
      'accrobranche': 'https://nolimit-aventure.qweekle.com/shop/nolimit-aventure-nemours/accrobranche',
      'paintball': 'https://nolimit-aventure.qweekle.com/shop/nolimit-aventure-nemours/paintball',
      'tyrolienne': 'https://nolimit-aventure.qweekle.com/shop/nolimit-aventure-nemours/tyrolienne-300m',
    },
    'nolimit-montargis': {
      'accrobranche': 'https://nolimit-aventure.qweekle.com/shop/nolimit-aventure-montargis/accrobranche',
      'escape-game': 'https://nolimit-aventure.qweekle.com/shop/nolimit-aventure-montargis/escape-game',
    },
    'nolimit-digny': {
      'accrobranche': 'https://nolimit-aventure.qweekle.com/shop/nolimit-aventure-digny/accrobranche',
      'paintball': 'https://nolimit-aventure.qweekle.com/shop/nolimit-aventure-digny/paintball',
    },
    'nolimit-coudray': {
      'accrobranche': 'https://nolimit-aventure.qweekle.com/shop/nolimit-aventure-le-coudray/accrobranche',
      'laser-game': 'https://nolimit-aventure.qweekle.com/shop/nolimit-aventure-le-coudray/laser-game/laser-game-session-30-mn',
    }
  };

  const baseUrl = quickleUrls[parkId]?.[activityId];
  if (!baseUrl) {
    // Fallback vers la page principale du parc
    return `https://nolimit-aventure.qweekle.com/shop/${parkId}?lang=fr`;
  }

  return `${baseUrl}?lang=fr`;
}

/**
 * Redirige vers Quickle avec injection automatique du nombre de participants
 *

 */
export function redirectToQuickleWithParticipants(
  bookingData: QuickleBookingData,
  parkId: string,
  activityIds: string[]
): void {
  const { participants } = bookingData;

  // Si une seule activité, on peut rediriger directement
  if (activityIds.length === 1) {
    const url = generateQuickleUrl(parkId, activityIds[0]);

    // Sauvegarder les données dans localStorage pour la page de redirection
    localStorage.setItem('nolimit_quickle_redirect', JSON.stringify({
      participants,
      timestamp: Date.now()
    }));

    // Ouvrir Quickle dans une nouvelle fenêtre
    const quickleWindow = window.open(url, '_blank');

    // Injecter le script après un court délai (attendre le chargement de la page)
    setTimeout(() => {
      try {
        if (quickleWindow && !quickleWindow.closed) {
          // Injecter le nombre de participants via postMessage
          quickleWindow.postMessage({
            type: 'NOLIMIT_SET_PARTICIPANTS',
            participants: participants
          }, 'https://nolimit-aventure.qweekle.com');
        }
      } catch (error) {
        console.log('Impossible d\'injecter automatiquement les participants (CORS)');
      }
    }, 2000);

  } else {
    // Plusieurs activités: rediriger vers la page principale du parc
    const baseUrl = `https://nolimit-aventure.qweekle.com/shop/${parkId}?lang=fr`;
    localStorage.setItem('nolimit_quickle_redirect', JSON.stringify({
      participants,
      activityIds,
      timestamp: Date.now()
    }));
    window.open(baseUrl, '_blank');
  }
}

/**
 * MÉTHODE 2: Créer une page intermédiaire qui fait la redirection

 */
export function createQuickleRedirectPage(
  bookingData: QuickleBookingData,
  parkId: string,
  activityId: string
): string {
  const { participants } = bookingData;
  const quickleUrl = generateQuickleUrl(parkId, activityId);

  // Créer le HTML d'une page intermédiaire
  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redirection vers Quickle...</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #357600 0%, #2d6100 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .container {
      text-align: center;
      max-width: 500px;
      padding: 40px;
    }
    .logo {
      font-size: 48px;
      font-weight: 900;
      margin-bottom: 20px;
    }
    .message {
      font-size: 24px;
      margin-bottom: 30px;
    }
    .info {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 30px;
    }
    .spinner {
      display: inline-block;
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top-color: #eb700f;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .note {
      font-size: 14px;
      opacity: 0.8;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">🌳 NoLimit Aventure</div>
    <div class="message">Redirection vers Quickle...</div>
    <div class="info">
      <p><strong>Nombre de participants:</strong> ${participants}</p>
      <p><strong>Parc:</strong> ${bookingData.parkName}</p>
      <p><strong>Activité:</strong> ${bookingData.activityName}</p>
    </div>
    <div class="spinner"></div>
    <div class="note">
      Vous allez être redirigé dans quelques secondes.<br>
      Le nombre de participants sera automatiquement sélectionné.
    </div>
  </div>

  <script>
    // Redirection après 2 secondes
    setTimeout(() => {
      // Sauvegarder les données dans sessionStorage (accessible depuis le même domaine)
      sessionStorage.setItem('nolimit_participants', '${participants}');

      // Rediriger vers Quickle
      window.location.href = '${quickleUrl}';
    }, 2000);

    // Script d'injection (si on reste sur le même domaine)
    // Note: Cela ne fonctionnera que si Quickle est sur votre domaine
    window.addEventListener('load', () => {
      setTimeout(() => {
        const qtyInput = document.querySelector('input[name="qty"]');
        if (qtyInput) {
          qtyInput.value = '${participants}';
          qtyInput.dispatchEvent(new Event('change', { bubbles: true }));
          qtyInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, 1000);
    });
  </script>
</body>
</html>
  `;

  // Créer un blob et un URL
  const blob = new Blob([html], { type: 'text/html' });
  const blobUrl = URL.createObjectURL(blob);

  return blobUrl;
}

/**
 * MÉTHODE 3: Utiliser une iframe cachée pour pré-charger et modifier
 * (Plus complexe mais plus fiable)
 */
export function redirectViaIframe(
  bookingData: QuickleBookingData,
  parkId: string,
  activityId: string
): void {
  const { participants } = bookingData;
  const quickleUrl = generateQuickleUrl(parkId, activityId);

  // Créer une iframe cachée
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = quickleUrl;
  document.body.appendChild(iframe);

  // Attendre le chargement de l'iframe
  iframe.onload = () => {
    try {
      // Essayer d'accéder au contenu de l'iframe (ne fonctionne que si même domaine)
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        // Trouver le champ quantity et le modifier
        const qtyInput = iframeDoc.querySelector('input[name="qty"]') as HTMLInputElement;
        if (qtyInput) {
          qtyInput.value = participants.toString();
          qtyInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Rediriger vers l'URL de l'iframe
        setTimeout(() => {
          window.location.href = iframe.src;
          document.body.removeChild(iframe);
        }, 500);
      } else {
        // CORS bloque l'accès, utiliser la redirection simple
        console.warn('CORS bloque l\'injection. Redirection simple...');
        window.open(quickleUrl, '_blank');
        document.body.removeChild(iframe);
      }
    } catch (error) {
      // CORS error, utiliser la redirection simple
      console.error('Erreur CORS:', error);
      window.open(quickleUrl, '_blank');
      document.body.removeChild(iframe);
    }
  };
}

/**
 * MÉTHODE 4 (RECOMMANDÉE): Extension navigateur ou script utilisateur
 *
 * Créer un bookmarklet que le client peut ajouter à ses favoris:
 */
export function generateBookmarklet(participants: number): string {
  const code = `
javascript:(function(){
  const qtyInput = document.querySelector('input[name="qty"]');
  if (qtyInput) {
    qtyInput.value = '${participants}';
    qtyInput.min = '${participants}';
    qtyInput.dispatchEvent(new Event('change', { bubbles: true }));
    qtyInput.dispatchEvent(new Event('input', { bubbles: true }));
    alert('Nombre de participants défini sur ${participants}');
  } else {
    alert('Champ quantity non trouvé');
  }
})();
  `.trim().replace(/\s+/g, ' ');

  return code;
}

/**
 * MÉTHODE 5 (LA PLUS SIMPLE): Instructions à l'utilisateur
 */
export function getQuickleInstructions(participants: number): string {
  return `
Une fois sur la page Quickle:
1. Recherchez le champ "Nombre de participants"
2. Saisissez: ${participants}
3. Continuez la réservation

Nous avons pré-sélectionné ${participants} participants pour vous faciliter la tâche.
  `.trim();
}
