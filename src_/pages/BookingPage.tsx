// pages/BookingPage.tsx
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, Users, Clock, MapPin, CreditCard, CheckCircle, ChevronRight, ExternalLink, Loader, Star, Copy } from 'lucide-react';

export function BookingPage() {
  const location = useLocation();

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [participants, setParticipants] = useState(2);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [isRedirecting, setIsRedirecting] = useState(false);

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  // Generate next 30 days for calendar
  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  // URL fixe pour le test
  const QUICKLE_URL = 'https://nolimit-aventure.qweekle.com/shop/nolimit-aventure-montargis/escape-game-outdoor/lecole-des-sorciers?lang=fr';

  // Function to format date to French format (DD/MM/YYYY)
  const formatFrenchDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    // Étape 4: Ouvrir la page d'instructions
    if (selectedDate) {
      setIsRedirecting(true);
      
      const formattedDate = formatFrenchDate(selectedDate);
      
      // Créer le script bookmarklet proprement
      const dateEsc = formattedDate.replace(/'/g, "\\'");
      const timeEsc = selectedTime.replace(/'/g, "\\'");
      
      const bookmarkletCode = '(function(){' +
        'var date=\'' + dateEsc + '\';' +
        'var qty=' + participants + ';' +
        'var time=\'' + timeEsc + '\';' +
        'setTimeout(function(){' +
          'var dateInput=document.querySelector(\'input[name="start_at"]\');' +
          'if(dateInput){' +
            'dateInput.value=date;' +
            'dateInput.dispatchEvent(new Event(\'input\',{bubbles:true}));' +
            'dateInput.dispatchEvent(new Event(\'change\',{bubbles:true}));' +
          '}' +
          'var qtyInput=document.querySelector(\'input[name="qty"]\');' +
          'if(qtyInput){' +
            'qtyInput.value=qty;' +
            'qtyInput.min=qty;' +
            'qtyInput.setAttribute(\'min\',qty);' +
            'qtyInput.dispatchEvent(new Event(\'input\',{bubbles:true}));' +
            'qtyInput.dispatchEvent(new Event(\'change\',{bubbles:true}));' +
          '}' +
          'if(time){' +
            'var timeSelect=document.querySelector(\'select[name="time"]\');' +
            'if(timeSelect){' +
              'for(var i=0;i<timeSelect.options.length;i++){' +
                'if(timeSelect.options[i].text.includes(time)){' +
                  'timeSelect.value=timeSelect.options[i].value;' +
                  'timeSelect.dispatchEvent(new Event(\'change\',{bubbles:true}));' +
                  'break;' +
                '}' +
              '}' +
            '}' +
          '}' +
          'alert(\'✅ NoLimit Aventure\\n\\nValeurs injectées !\\n\\nDate: \'+date+\'\\nParticipants: \'+qty+(time?\'\\nHeure: \'+time:\'\'));' +
        '},500);' +
      '})();';

      const bookmarkletUrl = 'javascript:' + encodeURIComponent(bookmarkletCode);
      
      // Construire le HTML avec concaténation pour éviter les problèmes d'échappement
      let instructionPage = '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">';
      instructionPage += '<meta name="viewport" content="width=device-width,initial-scale=1.0">';
      instructionPage += '<title>Finaliser sur Quickle - NoLimit Aventure</title>';
      instructionPage += '<style>';
      instructionPage += '*{margin:0;padding:0;box-sizing:border-box}';
      instructionPage += 'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:linear-gradient(135deg,#FF6B35 0%,#F7931E 100%);min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}';
      instructionPage += '.container{background:white;border-radius:24px;padding:48px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);max-width:700px;width:100%;animation:fadeIn 0.6s ease}';
      instructionPage += '@keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}';
      instructionPage += '.logo{text-align:center;margin-bottom:32px}';
      instructionPage += '.logo-text{font-size:32px;font-weight:800;background:linear-gradient(135deg,#FF6B35 0%,#F7931E 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:8px}';
      instructionPage += '.logo-subtitle{color:#64748b;font-size:14px}';
      instructionPage += '.step{display:flex;gap:20px;margin-bottom:24px;padding:24px;background:#f8fafc;border-radius:16px;border-left:4px solid #FF6B35}';
      instructionPage += '.step-number{width:48px;height:48px;background:linear-gradient(135deg,#FF6B35 0%,#F7931E 100%);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:20px;flex-shrink:0}';
      instructionPage += '.step-content{flex:1}';
      instructionPage += '.step-title{font-size:18px;font-weight:700;color:#1e293b;margin-bottom:8px}';
      instructionPage += '.step-description{color:#64748b;line-height:1.6;margin-bottom:12px}';
      instructionPage += '.value-box{background:white;border:2px solid #e2e8f0;border-radius:12px;padding:16px;margin-top:12px;display:flex;justify-content:space-between;align-items:center}';
      instructionPage += '.value-label{color:#64748b;font-size:13px;font-weight:500}';
      instructionPage += '.value-data{font-size:18px;font-weight:700;color:#1e293b}';
      instructionPage += '.copy-btn{background:#FF6B35;color:white;border:none;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer}';
      instructionPage += '.copy-btn:hover{background:#F7931E}';
      instructionPage += '.copy-btn.copied{background:#10b981}';
      instructionPage += '.main-btn{display:block;width:100%;background:linear-gradient(135deg,#FF6B35 0%,#F7931E 100%);color:white;border:none;padding:20px;border-radius:16px;font-size:18px;font-weight:700;cursor:pointer;margin-top:32px}';
      instructionPage += '.info-box{background:#eff6ff;border:2px solid #93c5fd;border-radius:16px;padding:20px;margin-top:24px}';
      instructionPage += '.info-title{color:#1e40af;font-weight:700;margin-bottom:8px}';
      instructionPage += '.info-text{color:#1e40af;line-height:1.6;font-size:14px}';
      instructionPage += '.bookmarklet-box{background:linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%);border:3px solid #86efac;border-radius:16px;padding:24px;margin-top:24px}';
      instructionPage += '.bookmarklet-title{color:#15803d;font-weight:700;margin-bottom:12px;font-size:20px}';
      instructionPage += '.bookmarklet-btn{display:flex;align-items:center;justify-content:center;gap:10px;background:#22c55e;color:white;padding:16px 32px;border-radius:12px;font-weight:700;cursor:pointer;border:none;font-size:16px;width:100%;margin-top:16px}';
      instructionPage += '.bookmarklet-instructions{color:#15803d;font-size:14px;line-height:1.8;background:white;padding:16px;border-radius:12px;margin-top:16px;border:2px solid #bbf7d0;display:none}';
      instructionPage += '.bookmarklet-instructions.show{display:block}';
      instructionPage += '.bookmarklet-instructions ol{margin-left:20px;margin-top:8px}';
      instructionPage += 'kbd{background:#1e293b;color:white;padding:4px 8px;border-radius:4px;font-family:monospace;font-weight:bold;font-size:12px}';
      instructionPage += '.code-box{background:#1e293b;color:#e2e8f0;padding:16px;border-radius:12px;font-family:monospace;font-size:11px;margin-top:16px;overflow-x:auto;max-height:150px;overflow-y:auto;word-break:break-all;display:none}';
      instructionPage += '.code-box.show{display:block}';
      instructionPage += '.toggle-btn{background:#64748b;color:white;border:none;padding:8px 16px;border-radius:8px;font-size:12px;cursor:pointer;margin-top:12px}';
      instructionPage += '</style></head><body><div class="container">';
      instructionPage += '<div class="logo"><div class="logo-text">NoLimit Aventure</div><div class="logo-subtitle">Finalisation de votre réservation</div></div>';
      
      instructionPage += '<div class="step"><div class="step-number">1</div><div class="step-content">';
      instructionPage += '<div class="step-title">📅 Sélectionnez la date sur Quickle</div>';
      instructionPage += '<div class="step-description">Cliquez sur le champ date et entrez cette valeur :</div>';
      instructionPage += '<div class="value-box"><div><div class="value-label">Date à saisir</div>';
      instructionPage += '<div class="value-data" id="dateValue">' + formattedDate + '</div></div>';
      instructionPage += '<button class="copy-btn" onclick="copyValue(\'dateValue\',this)">📋 Copier</button></div></div></div>';
      
      instructionPage += '<div class="step"><div class="step-number">2</div><div class="step-content">';
      instructionPage += '<div class="step-title">👥 Indiquez le nombre de participants</div>';
      instructionPage += '<div class="step-description">Dans le champ "Nombre de participants", saisissez :</div>';
      instructionPage += '<div class="value-box"><div><div class="value-label">Participants</div>';
      instructionPage += '<div class="value-data" id="qtyValue">' + participants + '</div></div>';
      instructionPage += '<button class="copy-btn" onclick="copyValue(\'qtyValue\',this)">📋 Copier</button></div></div></div>';
      
      if (selectedTime) {
        instructionPage += '<div class="step"><div class="step-number">3</div><div class="step-content">';
        instructionPage += '<div class="step-title">⏰ Sélectionnez l\'horaire</div>';
        instructionPage += '<div class="step-description">Choisissez l\'horaire souhaité :</div>';
        instructionPage += '<div class="value-box"><div><div class="value-label">Horaire</div>';
        instructionPage += '<div class="value-data" id="timeValue">' + selectedTime + '</div></div>';
        instructionPage += '<button class="copy-btn" onclick="copyValue(\'timeValue\',this)">📋 Copier</button></div></div></div>';
      }
      
      instructionPage += '<div class="step"><div class="step-number">' + (selectedTime ? '4' : '3') + '</div><div class="step-content">';
      instructionPage += '<div class="step-title">✅ Finalisez votre réservation</div>';
      instructionPage += '<div class="step-description">Vérifiez les informations et procédez au paiement sur Quickle</div></div></div>';
      
      instructionPage += '<button class="main-btn" onclick="openQuickle()">🚀 Ouvrir Quickle et commencer</button>';
      
      instructionPage += '<div class="bookmarklet-box"><div class="bookmarklet-title">⚡ Remplissage automatique (Mode Expert)</div>';
      instructionPage += '<button class="bookmarklet-btn" onclick="showInstructions()">⭐ Instructions pour le favori Auto-Fill</button>';
      instructionPage += '<div class="bookmarklet-instructions" id="instructions">';
      instructionPage += '<strong>📌 Comment créer le favori :</strong><ol>';
      instructionPage += '<li>Cliquez sur "Copier le code" ci-dessous</li>';
      instructionPage += '<li>Créez un nouveau favori (Ctrl+D ou Cmd+D sur cette page)</li>';
      instructionPage += '<li>Donnez-lui le nom : <strong>"NoLimit Auto-Fill"</strong></li>';
      instructionPage += '<li>Dans le champ URL, <strong>supprimez tout</strong> et <strong>collez le code copié</strong></li>';
      instructionPage += '<li>Enregistrez le favori</li>';
      instructionPage += '<li>Sur Quickle, cliquez sur ce favori pour auto-remplir !</li></ol></div>';
      instructionPage += '<button class="toggle-btn" onclick="toggleCode()">👨‍💻 Afficher/Copier le code</button>';
      instructionPage += '<div class="code-box" id="codeBox">' + bookmarkletUrl.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div></div>';
      
      instructionPage += '<div class="info-box"><div class="info-title">💡 Méthode simple (Recommandée)</div>';
      instructionPage += '<div class="info-text">Utilisez les boutons "📋 Copier" ci-dessus pour copier automatiquement les valeurs, puis collez-les dans Quickle.</div></div>';
      
      instructionPage += '</div><script>';
      instructionPage += 'var QUICKLE_URL="' + QUICKLE_URL + '";';
      instructionPage += 'var BOOKMARKLET_URL="' + bookmarkletUrl.replace(/"/g, '\\"') + '";';
      instructionPage += 'function copyValue(id,btn){';
      instructionPage += 'var el=document.getElementById(id);';
      instructionPage += 'var txt=el.textContent;';
      instructionPage += 'if(navigator.clipboard){';
      instructionPage += 'navigator.clipboard.writeText(txt).then(function(){';
      instructionPage += 'var orig=btn.textContent;btn.textContent="✅ Copié !";btn.classList.add("copied");';
      instructionPage += 'setTimeout(function(){btn.textContent=orig;btn.classList.remove("copied")},2000);';
      instructionPage += '});}else{';
      instructionPage += 'var ta=document.createElement("textarea");ta.value=txt;ta.style.position="fixed";ta.style.left="-999999px";';
      instructionPage += 'document.body.appendChild(ta);ta.select();';
      instructionPage += 'try{document.execCommand("copy");var orig=btn.textContent;btn.textContent="✅ Copié !";';
      instructionPage += 'setTimeout(function(){btn.textContent=orig},2000);}catch(e){}';
      instructionPage += 'document.body.removeChild(ta);}}';
      instructionPage += 'function openQuickle(){window.open(QUICKLE_URL,"_blank");}';
      instructionPage += 'function showInstructions(){document.getElementById("instructions").classList.add("show");}';
      instructionPage += 'function toggleCode(){';
      instructionPage += 'var box=document.getElementById("codeBox");';
      instructionPage += 'if(box.classList.contains("show")){box.classList.remove("show");}else{';
      instructionPage += 'box.classList.add("show");';
      instructionPage += 'if(navigator.clipboard){navigator.clipboard.writeText(BOOKMARKLET_URL).then(function(){';
      instructionPage += 'alert("✅ Code copié !\\n\\n1. Créez un favori (Ctrl+D)\\n2. Dans URL, supprimez tout et collez\\n3. Enregistrez !");';
      instructionPage += '});}}}';
      instructionPage += 'setTimeout(function(){openQuickle()},2000);';
      instructionPage += '</script></body></html>';
      
      // Ouvrir dans un nouvel onglet
      const newWindow = window.open('', '_blank', 'width=700,height=900');
      if (newWindow) {
        newWindow.document.write(instructionPage);
        newWindow.document.close();
      } else {
        alert('⚠️ Veuillez autoriser les fenêtres popup pour cette fonctionnalité.');
      }
      
      setIsRedirecting(false);
    }
  };

  const handleQuickleDirect = () => {
    window.open(QUICKLE_URL, '_blank');
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {['Participants', 'Date & Heure', 'Informations', 'Quickle'].map((label, index) => (
                <div key={label} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step > index + 1
                        ? 'bg-green-600 text-white'
                        : step === index + 1
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {step > index + 1 ? <CheckCircle className="size-5" /> : index + 1}
                  </div>
                  <span className={`ml-2 hidden md:block ${step === index + 1 ? 'text-gray-900' : 'text-gray-500'}`}>
                    {label}
                  </span>
                  {index < 3 && (
                    <ChevronRight className="size-5 text-gray-400 mx-2 hidden md:block" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-md">
                
                {/* En-tête */}
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Réservation Quickle</h1>
                  <p className="text-gray-600">
                    Escape Game "L'École des Sorciers" • Parc de Montargis
                  </p>
                </div>

                {/* Step 1: Participants */}
                {step === 1 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Nombre de participants</h2>
                      <div className="bg-blue-50 rounded-xl p-6 mb-6">
                        <div className="flex items-center justify-center gap-8">
                          <button
                            type="button"
                            onClick={() => setParticipants(Math.max(1, participants - 1))}
                            className="w-16 h-16 bg-white border-2 border-blue-200 hover:border-blue-400 rounded-xl transition-all text-3xl font-bold text-blue-600 hover:text-blue-800 hover:shadow-lg"
                          >
                            -
                          </button>
                          <div className="text-center">
                            <div className="text-5xl font-bold text-gray-900 mb-2">{participants}</div>
                            <div className="text-gray-600">personne{participants > 1 ? 's' : ''}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setParticipants(participants + 1)}
                            className="w-16 h-16 bg-white border-2 border-blue-200 hover:border-blue-400 rounded-xl transition-all text-3xl font-bold text-blue-600 hover:text-blue-800 hover:shadow-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Injection Quickle :</span> Cette valeur sera transmise à Quickle
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Date & Time */}
                {step === 2 && (
                  <div className="space-y-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Sélectionnez la date</h2>
                    
                    <div>
                      <div className="grid grid-cols-4 md:grid-cols-7 gap-3 max-h-96 overflow-y-auto p-2">
                        {availableDates.map((date) => {
                          const dateObj = new Date(date);
                          const day = dateObj.getDate();
                          const month = dateObj.toLocaleDateString('fr-FR', { month: 'short' });
                          const weekday = dateObj.toLocaleDateString('fr-FR', { weekday: 'short' });
                          const isToday = date === new Date().toISOString().split('T')[0];
                          
                          return (
                            <button
                              key={date}
                              type="button"
                              onClick={() => setSelectedDate(date)}
                              className={`p-4 rounded-xl text-center transition-all ${
                                selectedDate === date
                                  ? 'bg-green-600 text-white shadow-lg transform scale-105'
                                  : isToday
                                  ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <div className="text-xs font-medium mb-1">{weekday}</div>
                              <div className="text-2xl font-bold mb-1">{day}</div>
                              <div className="text-xs">{month}</div>
                              {isToday && (
                                <div className="text-[10px] mt-1 bg-blue-100 text-blue-600 rounded px-1">Aujourd'hui</div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      
                      {selectedDate && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-green-800">Date sélectionnée :</p>
                              <p className="text-lg text-gray-900">{formatFrenchDate(selectedDate)}</p>
                            </div>
                            <CheckCircle className="size-8 text-green-600" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Horaire (optionnel)</h3>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`px-4 py-3 rounded-xl transition-all font-medium ${
                              selectedTime === time
                                ? 'bg-orange-600 text-white shadow-lg'
                                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Information (optional) */}
                {step === 3 && (
                  <div className="space-y-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Vos informations (facultatif)</h2>
                    <p className="text-gray-600 mb-6">
                      Ces informations pourront être utiles lors de votre réservation sur Quickle.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 mb-2 font-medium">Prénom</label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Jean"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2 font-medium">Nom</label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Dupont"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="jean.dupont@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">Téléphone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="06 12 34 56 78"
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Quickle Redirect */}
                {step === 4 && (
                  <div className="space-y-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Finalisation sur Quickle</h2>
                    
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-8 mb-6">
                      <div className="flex items-center gap-6 mb-6">
                        <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <ExternalLink className="size-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-green-800 mb-2">Instructions étape par étape</h3>
                          <p className="text-green-700">
                            Une fenêtre s'ouvrira avec des instructions claires pour compléter votre réservation sur Quickle.
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white rounded-xl p-4 border border-green-100">
                          <div className="text-sm text-gray-600 mb-1">Date</div>
                          <div className="text-lg font-semibold text-gray-900">{formatFrenchDate(selectedDate)}</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-green-100">
                          <div className="text-sm text-gray-600 mb-1">Participants</div>
                          <div className="text-lg font-semibold text-gray-900">{participants} personne{participants > 1 ? 's' : ''}</div>
                        </div>
                      </div>
                    </div>

                    {isRedirecting ? (
                      <div className="text-center py-12">
                        <Loader className="size-12 text-green-600 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">Ouverture...</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <button
                          type="submit"
                          className="w-full py-5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all hover:shadow-xl font-bold text-lg flex items-center justify-center gap-4 shadow-lg"
                        >
                          <ExternalLink className="size-6" />
                          Continuer vers Quickle
                        </button>
                        
                        <button
                          type="button"
                          onClick={handleQuickleDirect}
                          className="w-full py-4 bg-white border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-colors font-medium"
                        >
                          Ouvrir Quickle manuellement
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                {step < 4 && (
                  <div className="flex gap-4 mt-12">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="flex-1 px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-medium"
                      >
                        ← Retour
                      </button>
                    )}
                    <button
                      type="submit"
                      className={`flex-1 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all hover:shadow-lg font-medium ${
                        (step === 2 && !selectedDate)
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                      disabled={step === 2 && !selectedDate}
                    >
                      {step === 3 ? 'Continuer vers Quickle' : 'Continuer →'}
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Récapitulatif</h3>
                
                <div className="space-y-6 mb-8">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Activité</div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 font-bold">🎯</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">École des Sorciers</div>
                        <div className="text-sm text-gray-600">Escape Game • Montargis</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Date</div>
                      <div className="font-medium text-gray-900">
                        {selectedDate ? formatFrenchDate(selectedDate) : 'Non sélectionnée'}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Participants</div>
                      <div className="flex items-center gap-2">
                        <Users className="size-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{participants}</span>
                      </div>
                    </div>
                    
                    {selectedTime && (
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Horaire</div>
                        <div className="flex items-center gap-2">
                          <Clock className="size-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{selectedTime}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="size-5 text-green-600" />
                      <span className="font-medium text-green-800">Process simplifié</span>
                    </div>
                    <div className="text-sm text-green-700">
                      Instructions claires avec boutons "Copier"
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}