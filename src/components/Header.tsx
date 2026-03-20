// components/Header.tsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Calendar, Sparkles, Heart, Users, Building2, GraduationCap, PartyPopper, Phone, HelpCircle, Briefcase, Gift, MapPin, Star, Cake, ChevronRight, TreePine } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHeaderData } from '../hooks/useHeaderData';
import { usePourQuiData } from '../hooks/usePourQuiData';
import { BoutonEvenement } from '../components/BoutonEvent';
import nolimitLogoFallback from '../assets/nolimit-logo-removebg.png';

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Heart, Users, Cake, Briefcase, Star, Calendar, PartyPopper, Gift,
};

// ─── Helpers desktop nav ───────────────────────────────────────────────────────

function DesktopNavLink({
  to, isActive, primaryColor, secondaryColor, children,
}: {
  to: string; isActive: boolean; primaryColor: string; secondaryColor: string; children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const active = isActive || hovered;
  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="px-4 py-2 rounded-lg transition-all duration-200 text-sm"
      style={{
        color: active ? secondaryColor : primaryColor,
        backgroundColor: hovered ? `${secondaryColor}15` : isActive ? `${primaryColor}12` : 'transparent',
        fontWeight: isActive ? 700 : 600,
      }}
    >
      {children}
    </Link>
  );
}

function DesktopMegaButton({
  isMenuOpen, primaryColor, secondaryColor, children, onMouseEnter, onMouseLeave,
}: {
  isMenuOpen: boolean; primaryColor: string; secondaryColor: string; children: React.ReactNode;
  onMouseEnter?: () => void; onMouseLeave?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const active = isMenuOpen || hovered;
  return (
    <button
      onMouseEnter={() => { setHovered(true); onMouseEnter?.(); }}
      onMouseLeave={() => { setHovered(false); onMouseLeave?.(); }}
      className="flex items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 text-sm"
      style={{
        color: active ? secondaryColor : primaryColor,
        backgroundColor: active ? `${secondaryColor}15` : 'transparent',
        fontWeight: isMenuOpen ? 700 : 600,
      }}
    >
      {children}
    </button>
  );
}

// ─── Composant principal ───────────────────────────────────────────────────────

export function Header() {
  const { data: headerData, loading, error } = useHeaderData();
  const { data: pourQuiData } = usePourQuiData();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState<string | null>(null);
  const [megaMenuPosition, setMegaMenuPosition] = useState<'left' | 'center' | 'right'>('center');
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveMobileSubmenu(null);
  }, [location.pathname]);

  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white h-20 flex items-center justify-center border-b">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </header>
    );
  }

  if (error || !headerData) {
    console.warn('⚠️ Impossible de charger les données WordPress');
    return <DefaultHeader />;
  }

  const { logo, primaryColor, secondaryColor, greenColor, ctaText, ctaUrl, showParkSelector, menuItems, parks } = headerData;

  const mobileMenuBg = greenColor || '#1B5E20';
  const mobileMenuBgDark = '#0D3B13';
  const isActive = (path: string) => location.pathname === path;

  // ─── Fonction pour déterminer la valeur du select en fonction de l'URL ───
  const getCurrentParkValue = () => {
    const currentPath = location.pathname;
    
    // Si on est sur la page d'accueil, retourner "Tous les parcs"
    if (currentPath === '/') {
      return '';
    }
    
    // Vérifier si l'URL correspond à un parc spécifique
    const currentPark = parks?.find(park => currentPath.startsWith(park.url));
    
    // Retourner l'URL du parc si trouvé, sinon "Tous les parcs"
    return currentPark ? currentPark.url : '';
  };

  const handleMegaMenuOpen = (menuId: string, event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const mid = rect.left + rect.width / 2;
    const w = window.innerWidth;
    setMegaMenuPosition(mid < w * 0.33 ? 'left' : mid > w * 0.67 ? 'right' : 'center');
    setActiveMegaMenu(menuId);
  };

  const toggleMobileSubmenu = (id: string) =>
    setActiveMobileSubmenu(activeMobileSubmenu === id ? null : id);

  const renderMegaMenuContent = (type: string) => {
    switch (type) {
      case 'discover': return <MegaMenuDiscover primaryColor={primaryColor} secondaryColor={secondaryColor} />;
      case 'audience': return <MegaMenuAudience pourQuiData={pourQuiData} primaryColor={primaryColor} secondaryColor={secondaryColor} />;
      case 'groups':   return <MegaMenuGroups primaryColor={primaryColor} secondaryColor={secondaryColor} />;
      case 'prepare':  return <MegaMenuPrepare primaryColor={primaryColor} secondaryColor={secondaryColor} />;
      default:         return <MegaMenuDiscover primaryColor={primaryColor} secondaryColor={secondaryColor} />;
    }
  };

  const renderMobileMegaMenuContent = (type: string, onClose: () => void) => {
    switch (type) {
      case 'discover': return <MobileMegaMenuDiscover onClose={onClose} />;
      case 'audience': return <MobileMegaMenuAudience onClose={onClose} pourQuiData={pourQuiData} />;
      case 'groups':   return <MobileMegaMenuGroups onClose={onClose} />;
      case 'prepare':  return <MobileMegaMenuPrepare onClose={onClose} />;
      default:         return <MobileMegaMenuDiscover onClose={onClose} />;
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200/60 shadow-sm"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center group relative z-[60] shrink-0 mr-2 xl:mr-4">
              <motion.img
                src={logo?.url || nolimitLogoFallback}
                alt={logo?.alt || 'NoLimit Aventure'}
                className="h-10 xl:h-12 w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
            </Link>

            {/* ── Navigation Desktop ── */}
            <nav className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => {
                if (item.type === 'simple') {
                  return (
                    <DesktopNavLink
                      key={item.id}
                      to={item.url || '/'}
                      isActive={isActive(item.url || '/')}
                      primaryColor={primaryColor}
                      secondaryColor={secondaryColor}
                    >
                      {item.label}
                    </DesktopNavLink>
                  );
                }

                if (item.type === 'megamenu') {
                  const isActiveMenu = activeMegaMenu === item.id.toString();
                  return (
                    <div
                      key={item.id}
                      className="relative"
                      onMouseEnter={(e) => handleMegaMenuOpen(item.id.toString(), e)}
                      onMouseLeave={() => setActiveMegaMenu(null)}
                    >
                      <DesktopMegaButton
                        isMenuOpen={isActiveMenu}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                      >
                        {item.label}
                        <motion.span
                          animate={{ rotate: isActiveMenu ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="inline-flex"
                        >
                          <ChevronDown className="size-4" />
                        </motion.span>
                      </DesktopMegaButton>

                      <AnimatePresence>
                        {isActiveMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.97 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            className="absolute top-full pt-4 z-50"
                            style={{
                              left: megaMenuPosition === 'left' ? '0' : megaMenuPosition === 'center' ? '50%' : 'auto',
                              right: megaMenuPosition === 'right' ? '0' : 'auto',
                              transform: megaMenuPosition === 'center' ? 'translateX(-50%)' : 'none',
                              minWidth: '800px',
                              maxWidth: '90vw',
                            }}
                          >
                            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                              <div className="h-1" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }} />
                              {renderMegaMenuContent(item.megaMenuType || 'discover')}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return null;
              })}
            </nav>

            {/* ── CTA Desktop ── */}
            <div className="hidden lg:flex items-center gap-3">
              {showParkSelector && parks?.length > 0 && (
                <select
                  className="px-4 py-2.5 border-2 rounded-xl text-sm font-medium hover:shadow-md focus:outline-none transition-all cursor-pointer bg-white"
                  style={{ borderColor: primaryColor, color: primaryColor }}
                  value={getCurrentParkValue()}
                  onChange={(e) => {
                    const url = e.target.value;
                    if (url) {
                      navigate(url);
                    } else {
                      navigate('/');
                    }
                  }}
                >
                  <option value="">📍 Tous les parcs</option>
                  {parks.map((park) => (
                    <option key={park.id} value={park.url}>
                      {park.emoji} {park.location}
                    </option>
                  ))}
                </select>
              )}

              {/* ── Bouton Événement — séparateur + pill verte ── */}
              <div className="flex items-center gap-3">
                <div className="w-px h-6 bg-gray-200" />
                <BoutonEvenement
                  variant="green"
                  size="md"
                  label="Votre événement"
                  href="/evenements"
                />
              </div>

              {/* ── Bouton Réserver principal ── */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={ctaUrl}
                  className="relative flex items-center gap-2 px-6 py-3 text-white rounded-full font-bold shadow-lg overflow-hidden"
                  style={{ backgroundColor: secondaryColor }}
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '200%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <Calendar className="size-4 relative z-10" />
                  <span className="relative z-10">{ctaText}</span>
                </Link>
              </motion.div>
            </div>

            {/* ── Mobile : Bouton + Hamburger ── */}
            <div className="lg:hidden flex items-center gap-2 relative z-[60]">
              <AnimatePresence>
                {!isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={ctaUrl}
                      className="flex items-center gap-1.5 px-4 py-2.5 text-white rounded-full font-bold text-sm shadow-md"
                      style={{ backgroundColor: secondaryColor }}
                    >
                      <Calendar className="size-4" />
                      <span>{ctaText}</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                onClick={() => { setIsMenuOpen(!isMenuOpen); if (isMenuOpen) setActiveMobileSubmenu(null); }}
                className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
                style={{ backgroundColor: isMenuOpen ? 'rgba(255,255,255,0.15)' : mobileMenuBg }}
                aria-label="Toggle menu"
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <X className="size-6 text-white" />
                    </motion.div>
                  ) : (
                    <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Menu className="size-6 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════ MENU MOBILE FULLSCREEN ═══════════════════ */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 lg:hidden"
            style={{ background: `linear-gradient(160deg, ${mobileMenuBg} 0%, ${mobileMenuBgDark} 100%)` }}
          >
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)` }} />

            <div className="flex items-center justify-between h-20 px-4 relative z-10">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <motion.img src={logo?.url || nolimitLogoFallback} alt={logo?.alt || 'NoLimit Aventure'} className="h-12" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.4 }} />
              </Link>
              <motion.button onClick={() => { setIsMenuOpen(false); setActiveMobileSubmenu(null); }} className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors" whileTap={{ scale: 0.9 }} initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} transition={{ delay: 0.15, duration: 0.3 }}>
                <X className="size-6 text-white" />
              </motion.button>
            </div>

            <div className="overflow-y-auto h-[calc(100vh-5rem)] px-4 pb-32 relative z-10">
              <nav className="space-y-1 pt-2">
                {menuItems.map((item, index) => {
                  if (item.type === 'simple') {
                    return (
                      <motion.div key={item.id} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + index * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}>
                        <Link to={item.url || '/'} onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between py-4 px-3 rounded-xl transition-all" style={{ backgroundColor: isActive(item.url || '/') ? 'rgba(255,255,255,0.12)' : 'transparent' }}>
                          <span className="text-white text-xl font-bold tracking-wide">{item.label}</span>
                          {isActive(item.url || '/') && <motion.div className="w-2 h-2 rounded-full bg-white" layoutId="activeIndicator" />}
                        </Link>
                        <div className="h-px bg-white/10 mx-3" />
                      </motion.div>
                    );
                  }
                  if (item.type === 'megamenu') {
                    const isOpen = activeMobileSubmenu === item.id.toString();
                    return (
                      <motion.div key={item.id} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + index * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}>
                        <button onClick={() => toggleMobileSubmenu(item.id.toString())} className="flex items-center justify-between w-full py-4 px-3 rounded-xl transition-all" style={{ backgroundColor: isOpen ? 'rgba(255,255,255,0.12)' : 'transparent' }}>
                          <span className="text-white text-xl font-bold tracking-wide">{item.label}</span>
                          <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.3 }}>
                            <ChevronRight className="size-5 text-white/70" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto', transition: { height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }, opacity: { duration: 0.3, delay: 0.1 } } }} exit={{ opacity: 0, height: 0, transition: { height: { duration: 0.3 }, opacity: { duration: 0.15 } } }} className="overflow-hidden">
                              <div className="ml-3 mr-1 mb-2 rounded-2xl bg-white/8 border border-white/10 overflow-hidden backdrop-blur-sm">
                                {renderMobileMegaMenuContent(item.megaMenuType || 'discover', () => setIsMenuOpen(false))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <div className="h-px bg-white/10 mx-3" />
                      </motion.div>
                    );
                  }
                  return null;
                })}
              </nav>

              {showParkSelector && parks?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + menuItems.length * 0.06 + 0.1, duration: 0.5 }} className="mt-6 px-3">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="size-5 text-white/70" />
                    <span className="text-white/70 text-sm font-semibold uppercase tracking-wider">Nos parcs</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {parks.map((park, i) => (
                      <motion.button key={park.id} onClick={() => { navigate(park.url); setIsMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/8 border border-white/10 hover:bg-white/15 transition-all text-left group" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
                        <span className="text-lg">{park.emoji}</span>
                        <span className="text-white font-semibold text-sm">{park.location}</span>
                        <ChevronRight className="size-4 text-white/40 ml-auto group-hover:text-white/70 group-hover:translate-x-0.5 transition-all" />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div className="flex items-center justify-center gap-3 mt-8 mb-4" initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 0.7, duration: 0.6 }}>
                <div className="h-px flex-1 bg-white/30" />
                <TreePine className="size-5 text-white" />
                <div className="h-px flex-1 bg-white/30" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay desktop mega menus */}
      <AnimatePresence>
        {activeMegaMenu && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveMegaMenu(null)} className="fixed inset-0 bg-black/20 z-40 backdrop-blur-[2px]" style={{ top: '80px' }} />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface PourQuiDataType {
  title: string;
  subtitle: string;
  cards: Array<{ title: string; description: string; image: string; link: string; color: string; iconName: string }>;
}

// ─── Mega menus Desktop ───────────────────────────────────────────────────────

function MegaMenuDiscover({ primaryColor, secondaryColor }: { primaryColor: string; secondaryColor: string }) {
  const links = [
    { to: '/about', icon: Sparkles, label: 'Notre Histoire', desc: 'Découvrez nos origines' },
    { to: '/about/valeurs', icon: Heart, label: 'Nos Valeurs', desc: 'Notre ADN et engagement' },
    { to: '/about/parcs', icon: MapPin, label: 'Nos Parcs', desc: '5 destinations uniques' },
    { to: '/about/emplois', icon: Briefcase, label: 'Nos Emplois', desc: "Rejoignez l'aventure" },
    { to: '/about/actualites', icon: Sparkles, label: 'Actualités', desc: 'Les dernières news' },
    { to: '/about/partenaires', icon: Users, label: 'Nos Partenaires', desc: 'Ils nous font confiance' },
  ];
  return (
    <div className="grid grid-cols-3 gap-6 p-8">
      <div className="col-span-1 relative h-64 rounded-2xl overflow-hidden group">
        <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop" alt="NoLimit Aventure" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
          <div className="text-white">
            <h3 className="font-black text-2xl mb-2">Qui sommes-nous ?</h3>
            <p className="text-sm text-white/90">Passion, aventure et dépassement de soi</p>
          </div>
        </div>
      </div>
      <div className="col-span-2 grid grid-cols-2 gap-3">
        {links.map((link, index) => (
          <motion.div key={link.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}>
            <Link
              to={link.to}
              className="flex items-start gap-4 p-4 rounded-xl transition-all group border-2 border-transparent"
              onMouseEnter={e => { e.currentTarget.style.borderColor = secondaryColor; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <motion.div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}12` }} whileHover={{ scale: 1.1, rotate: 5 }}>
                <link.icon className="size-6" style={{ color: primaryColor }} />
              </motion.div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 mb-1 group-hover:translate-x-1 transition-transform">{link.label}</div>
                <div className="text-sm text-gray-500">{link.desc}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MegaMenuAudience({ pourQuiData, primaryColor, secondaryColor }: { pourQuiData: PourQuiDataType; primaryColor: string; secondaryColor: string }) {
  const cards = pourQuiData?.cards || [];
  return (
    <div className="p-8">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-black mb-2" style={{ color: primaryColor }}>{pourQuiData?.title || "C'est pour qui ?"}</h3>
        <p className="text-gray-500">{pourQuiData?.subtitle || 'Une aventure pour tous'}</p>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {cards.map((card, index) => {
          const IconComponent = iconMap[card.iconName] || Star;
          return (
            <motion.div key={card.link} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}>
              <Link to={card.link} className="block rounded-2xl overflow-hidden hover:shadow-xl transition-all group relative h-48">
                <div className="absolute inset-0"><img src={card.image} alt={card.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <motion.div className="mb-3 p-3 rounded-full" style={{ backgroundColor: `${card.color}30` }} whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <IconComponent className="size-6" style={{ color: card.color }} />
                  </motion.div>
                  <div className="font-bold text-white mb-1">{card.title}</div>
                  <div className="text-xs text-white/80 line-clamp-2">{card.description}</div>
                </div>
                <div className="absolute inset-0 border-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ borderColor: card.color }} />
              </Link>
            </motion.div>
          );
        })}
      </div>
      <div className="pt-6 border-t" style={{ borderColor: `${primaryColor}20` }}>
        <Link to="/evenements" className="flex items-center justify-between w-full px-6 py-4 rounded-xl font-bold hover:shadow-xl transition-all text-white group" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>
          <div className="flex items-center gap-4">
            <motion.div className="p-3 rounded-full bg-white/20" whileHover={{ scale: 1.1, rotate: 360 }} transition={{ duration: 0.6 }}>
              <Calendar className="size-6 text-white" />
            </motion.div>
            <div className="text-left">
              <div className="text-lg font-black">Votre événement</div>
              <div className="text-sm font-normal opacity-90">Anniversaire • EVG • EVJF • Team Building • Soirée privée</div>
            </div>
          </div>
          <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} className="text-2xl">→</motion.span>
        </Link>
      </div>
      <div className="mt-4">
        <Link to="/devis" className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-bold transition-all hover:shadow-lg" style={{ color: primaryColor, border: `2px solid ${primaryColor}` }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = `${primaryColor}10`; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
        >
          <Phone className="size-5" />
          Demander un devis personnalisé
        </Link>
      </div>
    </div>
  );
}

function MegaMenuGroups({ primaryColor, secondaryColor }: { primaryColor: string; secondaryColor: string }) {
  const groupTypes = [
    { to: '/groups/corporate', icon: Building2, label: 'Entreprises', desc: 'Team-building & séminaires', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop' },
    { to: '/groups/kids', icon: GraduationCap, label: 'Enfants', desc: 'Écoles & anniversaires', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=300&h=200&fit=crop' },
    { to: '/groups/adults', icon: PartyPopper, label: 'Adultes', desc: 'EVG, EVF & fêtes', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&h=200&fit=crop' },
    { to: '/groups/family', icon: Users, label: 'Grandes familles', desc: 'Réunions de famille', image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=300&h=200&fit=crop' },
  ];
  return (
    <div className="p-8">
      <div className="grid grid-cols-2 gap-4 mb-6">
        {groupTypes.map((type, index) => (
          <motion.div key={type.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, type: 'spring' }}>
            <Link to={type.to} className="group block rounded-2xl overflow-hidden hover:shadow-2xl transition-all border-2 border-transparent"
              onMouseEnter={e => { e.currentTarget.style.borderColor = secondaryColor; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; }}
            >
              <div className="relative h-40 overflow-hidden">
                <img src={type.image} alt={type.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center gap-2 mb-2"><type.icon className="size-6" /><span className="font-black text-xl">{type.label}</span></div>
                  <div className="text-sm text-white/90">{type.desc}</div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Link to="/groups/cse" className="px-4 py-3 rounded-xl font-bold hover:shadow-lg transition-all text-center text-white" style={{ backgroundColor: primaryColor }}>CSE & Comités</Link>
        <Link to="/groups/quote" className="px-4 py-3 rounded-xl font-bold hover:shadow-lg transition-all text-center text-white" style={{ backgroundColor: secondaryColor }}>Demander un devis</Link>
      </div>
    </div>
  );
}

function MegaMenuPrepare({ primaryColor, secondaryColor }: { primaryColor: string; secondaryColor: string }) {
  const tips = [
    { to: '/blog/good-day', icon: '✨', label: 'Passer une bonne journée', desc: 'Tous nos conseils' },
    { to: '/blog/typical-day', icon: '⏰', label: 'Une journée type', desc: 'Programme et timing' },
    { to: '/blog/fitness', icon: '💪', label: 'Niveau sportif requis', desc: 'Accessible à tous' },
    { to: '/blog/booking', icon: '📅', label: 'Dois-je réserver ?', desc: 'Conseils de réservation' },
    { to: '/blog/weather', icon: '🌤️', label: 'Météo défavorable', desc: 'Que faire en cas de pluie ?' },
    { to: '/blog/pets', icon: '🐕', label: 'Animaux de compagnie', desc: 'Règles et conditions' },
  ];
  return (
    <div className="p-8">
      <div className="mb-6">
        <h3 className="text-2xl font-black mb-2 text-gray-900">Préparez votre visite</h3>
        <p className="text-gray-500">Toutes les réponses à vos questions</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {tips.map((tip, index) => (
          <motion.div key={tip.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04, type: 'spring' }}>
            <Link to={tip.to} className="block p-5 rounded-2xl border-2 border-transparent hover:shadow-lg transition-all group"
              onMouseEnter={e => { e.currentTarget.style.borderColor = secondaryColor; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; }}
            >
              <motion.div className="text-4xl mb-3" whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: 'spring', stiffness: 300 }}>{tip.icon}</motion.div>
              <div className="font-bold text-sm mb-1 text-gray-900">{tip.label}</div>
              <div className="text-xs text-gray-500">{tip.desc}</div>
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t" style={{ borderColor: `${primaryColor}20` }}>
        <Link to="/blog" className="flex items-center justify-center gap-2 font-bold transition-colors hover:opacity-80" style={{ color: primaryColor }}>
          <HelpCircle className="size-5" />
          Voir toutes les questions fréquentes
        </Link>
      </div>
    </div>
  );
}

// ─── Sous-menus mobiles ───────────────────────────────────────────────────────

function MobileMegaMenuDiscover({ onClose }: { onClose: () => void }) {
  const links = [
    { to: '/about', icon: Sparkles, label: 'Notre Histoire', desc: 'Découvrez nos origines' },
    { to: '/about/valeurs', icon: Heart, label: 'Nos Valeurs', desc: 'Notre ADN et engagement' },
    { to: '/about/parcs', icon: MapPin, label: 'Nos Parcs', desc: '5 destinations uniques' },
    { to: '/about/emplois', icon: Briefcase, label: 'Nos Emplois', desc: "Rejoignez l'aventure" },
    { to: '/about/actualites', icon: Sparkles, label: 'Actualités', desc: 'Les dernières news' },
    { to: '/about/partenaires', icon: Users, label: 'Nos Partenaires', desc: 'Ils nous font confiance' },
  ];
  return (
    <div className="divide-y divide-white/10">
      {links.map((link, i) => (
        <motion.div key={link.to} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04, duration: 0.3 }}>
          <Link to={link.to} onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-white/8 transition-colors group">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors"><link.icon className="size-4 text-white/80" /></div>
            <div><div className="font-semibold text-sm text-white">{link.label}</div><div className="text-xs text-white/50">{link.desc}</div></div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

function MobileMegaMenuAudience({ onClose, pourQuiData }: { onClose: () => void; pourQuiData: PourQuiDataType }) {
  const cards = pourQuiData?.cards || [];
  return (
    <div className="divide-y divide-white/10">
      {cards.map((card, i) => {
        const IconComponent = iconMap[card.iconName] || Star;
        return (
          <motion.div key={card.link} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04, duration: 0.3 }}>
            <Link to={card.link} onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-white/8 transition-colors group">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${card.color}25` }}><IconComponent className="size-4" style={{ color: card.color }} /></div>
              <div><div className="font-semibold text-sm text-white">{card.title}</div><div className="text-xs text-white/50 line-clamp-1">{card.description}</div></div>
            </Link>
          </motion.div>
        );
      })}
      <Link to="/evenements" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-white/8 transition-colors">
        <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0"><Calendar className="size-4 text-white/80" /></div>
        <div><div className="font-semibold text-sm text-white">Votre événement</div><div className="text-xs text-white/50">Anniversaire • EVG • EVJF • Team Building</div></div>
      </Link>
      <Link to="/devis" onClick={onClose} className="flex items-center gap-2 px-4 py-3 font-semibold text-sm text-white/80 hover:text-white hover:bg-white/8 transition-all"><Phone className="size-4" />Demander un devis personnalisé</Link>
    </div>
  );
}

function MobileMegaMenuGroups({ onClose }: { onClose: () => void }) {
  const groupTypes = [
    { to: '/groups/corporate', icon: Building2, label: 'Entreprises', desc: 'Team-building & séminaires' },
    { to: '/groups/kids', icon: GraduationCap, label: 'Enfants', desc: 'Écoles & anniversaires' },
    { to: '/groups/adults', icon: PartyPopper, label: 'Adultes', desc: 'EVG, EVF & fêtes' },
    { to: '/groups/family', icon: Users, label: 'Grandes familles', desc: 'Réunions de famille' },
  ];
  return (
    <div className="divide-y divide-white/10">
      {groupTypes.map((type, i) => (
        <motion.div key={type.to} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04, duration: 0.3 }}>
          <Link to={type.to} onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-white/8 transition-colors group">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors"><type.icon className="size-4 text-white/80" /></div>
            <div><div className="font-semibold text-sm text-white">{type.label}</div><div className="text-xs text-white/50">{type.desc}</div></div>
          </Link>
        </motion.div>
      ))}
      <Link to="/groups/cse" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-white/8 transition-colors">
        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0"><Briefcase className="size-4 text-white/80" /></div>
        <div><div className="font-semibold text-sm text-white">CSE & Comités</div><div className="text-xs text-white/50">Avantages entreprise</div></div>
      </Link>
      <Link to="/groups/quote" onClick={onClose} className="flex items-center gap-2 px-4 py-3 font-semibold text-sm text-white/80 hover:text-white hover:bg-white/8 transition-all"><Phone className="size-4" />Demander un devis groupe</Link>
    </div>
  );
}

function MobileMegaMenuPrepare({ onClose }: { onClose: () => void }) {
  const tips = [
    { to: '/blog/good-day', icon: '✨', label: 'Passer une bonne journée', desc: 'Tous nos conseils' },
    { to: '/blog/typical-day', icon: '⏰', label: 'Une journée type', desc: 'Programme et timing' },
    { to: '/blog/fitness', icon: '💪', label: 'Niveau sportif requis', desc: 'Accessible à tous' },
    { to: '/blog/booking', icon: '📅', label: 'Dois-je réserver ?', desc: 'Conseils de réservation' },
    { to: '/blog/weather', icon: '🌤️', label: 'Météo défavorable', desc: 'Que faire en cas de pluie ?' },
    { to: '/blog/pets', icon: '🐕', label: 'Animaux de compagnie', desc: 'Règles et conditions' },
  ];
  return (
    <div className="divide-y divide-white/10">
      {tips.map((tip, i) => (
        <motion.div key={tip.to} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04, duration: 0.3 }}>
          <Link to={tip.to} onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-white/8 transition-colors">
            <span className="text-xl w-9 text-center">{tip.icon}</span>
            <div><div className="font-semibold text-sm text-white">{tip.label}</div><div className="text-xs text-white/50">{tip.desc}</div></div>
          </Link>
        </motion.div>
      ))}
      <Link to="/blog" onClick={onClose} className="flex items-center gap-2 px-4 py-3 font-semibold text-sm text-white/80 hover:text-white hover:bg-white/8 transition-all"><HelpCircle className="size-4" />Voir toutes les questions fréquentes</Link>
    </div>
  );
}

// ─── Header fallback ──────────────────────────────────────────────────────────

function DefaultHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200/60 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="relative z-[60]">
              <img src={nolimitLogoFallback} alt="NoLimit Aventure" className="h-12 w-auto" />
            </Link>
            <nav className="hidden lg:flex items-center gap-1">
              {[{ to: '/', label: 'Accueil' }, { to: '/activities', label: 'Activités' }, { to: '/contact', label: 'Contact' }].map(link => (
                <DesktopNavLink key={link.to} to={link.to} isActive={isActive(link.to)} primaryColor="#357600" secondaryColor="#eb700f">{link.label}</DesktopNavLink>
              ))}
            </nav>
            <div className="hidden lg:flex items-center gap-3">
              <div className="w-px h-6 bg-gray-200" />
              <BoutonEvenement variant="green" size="sm" label="Votre événement" href="/evenements" />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/booking" className="flex items-center gap-2 px-6 py-3 text-white rounded-full font-bold shadow-lg bg-[#eb700f]">
                  <Calendar className="size-4" /><span>Réserver</span>
                </Link>
              </motion.div>
            </div>
            <div className="lg:hidden flex items-center gap-2 relative z-[60]">
              <AnimatePresence>
                {!isMenuOpen && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                    <Link to="/booking" className="flex items-center gap-1.5 px-4 py-2.5 text-white rounded-full font-bold text-sm bg-[#eb700f]"><Calendar className="size-4" /><span>Réserver</span></Link>
                  </motion.div>
                )}
              </AnimatePresence>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-12 h-12 rounded-full flex items-center justify-center transition-all" style={{ backgroundColor: isMenuOpen ? 'rgba(255,255,255,0.15)' : '#1B5E20' }}>
                {isMenuOpen ? <X className="size-6 text-white" /> : <Menu className="size-6 text-white" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="fixed inset-0 z-50 lg:hidden" style={{ background: 'linear-gradient(160deg, #1B5E20 0%, #0D3B13 100%)' }}>
            <div className="flex items-center justify-between h-20 px-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)}><img src={nolimitLogoFallback} alt="NoLimit" className="h-12 w-auto brightness-0 invert" /></Link>
              <button onClick={() => setIsMenuOpen(false)} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"><X className="size-6 text-white" /></button>
            </div>
            <div className="px-4 py-8 space-y-2">
              {[{ to: '/', label: 'Accueil' }, { to: '/activities', label: 'Activités' }, { to: '/contact', label: 'Contact' }].map((link, i) => (
                <motion.div key={link.to} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}>
                  <Link to={link.to} onClick={() => setIsMenuOpen(false)} className="block py-4 px-3 text-white text-xl font-bold tracking-wide rounded-xl" style={{ backgroundColor: isActive(link.to) ? 'rgba(255,255,255,0.12)' : 'transparent' }}>{link.label}</Link>
                  <div className="h-px bg-white/10 mx-3" />
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="pt-8 px-3 flex flex-col gap-3">
                <Link to="/evenements" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-3 w-full py-3.5 rounded-2xl font-bold text-base text-white border border-white/20 bg-white/10">
                  <PartyPopper className="size-5" /><span>Votre événement</span>
                </Link>
                <Link to="/booking" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black text-lg text-white bg-[#eb700f] shadow-2xl"><Calendar className="size-5" /><span>Réserver</span></Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}