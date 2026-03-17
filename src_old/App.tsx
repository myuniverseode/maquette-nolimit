import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// COMPONENTS
import { ScrollToTop } from './components/ScrollToTop';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// PAGES GLOBALES
import { HomePage } from './pages/HomePage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { ActivityDetailPage } from './pages/ActivityDetailPage';
import { BookingPage } from './pages/BookingPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';

import { ParkActualitesListPage } from './pages/ParkActualitesListPage';
import { ActuArticlePage } from './pages/ActuArticlePage';
import { ActualitesListPage } from './pages/ActualitesListPage';

import useOpenExternalLinksAndButtons from './hooks/useOpenExternalLinksAndButtons';


import { PourQuiDuoPage } from './pages/pourqui/PourQuiDuoPage';
import { PourQuiFamillePage } from './pages/pourqui/PourQuiFamillePage';
import { PourQuiEnfantPage } from './pages/pourqui/PourQuiEnfantPage';
import { PourQuiEntreprisePage } from './pages/pourqui/PourQuiEntreprisePage';

import { BlogPreparerPage } from './pages/BlogPreparerPage';
import { BlogArticlePage } from './pages/BlogArticlePage';

import { GroupeCorporatePage } from './pages/groupes/GroupeCorporatePage';
import { GroupeEnfantsPage } from './pages/groupes/GroupeEnfantsPage';
import { GroupeAdultesPage } from './pages/groupes/GroupeAdultesPage';
import { GroupeFamillePage } from './pages/groupes/GroupeFamillePage';
import { GroupesPage } from './pages/groupes/GroupesPage';



// ABOUT (multi-pages)
import { AboutPage } from './pages/AboutPage';
import { AboutHistorePage } from './pages/AboutHistorePage';
import { AboutValuesPage } from './pages/AboutValuesPage';
import { AboutParksPage } from './pages/AboutParksPage';
import { AboutJobsPage } from './pages/AboutJobsPage';
import { AboutNewsPage } from './pages/AboutNewsPage';
import { AboutPartnersPage } from './pages/AboutPartnersPage';

// PARKS (mini-sites)
import { ParkLayout } from './parks/ParkLayout';


import './styles/globals.css';

function App() {
    useOpenExternalLinksAndButtons();
  return (
    <Router>
      <ScrollToTop />

      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1">
          <Routes>

            {/* ── GLOBAL ── */}
            <Route path="/" element={<HomePage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/activity/:id" element={<ActivityDetailPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
         

            {/* ── ABOUT (hub + sous-pages) ── */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about/histoire" element={<AboutHistorePage />} />
            <Route path="/about/valeurs" element={<AboutValuesPage />} />
            <Route path="/about/parcs" element={<AboutParksPage />} />
            <Route path="/about/emplois" element={<AboutJobsPage />} />
            <Route path="/about/actualites" element={<AboutNewsPage />} />
            <Route path="/about/partenaires" element={<AboutPartnersPage />} />

            <Route path="/pour-qui/duo" element={<PourQuiDuoPage />} />
            <Route path="/pour-qui/famille" element={<PourQuiFamillePage />} />
            <Route path="/pour-qui/enfant" element={<PourQuiEnfantPage />} />
            <Route path="/pour-qui/entreprise" element={<PourQuiEntreprisePage />} />

            {/* ── BLOG ── */}
           <Route path="/blog" element={<BlogPreparerPage />} />
          <Route path="/blog/:slug" element={<BlogArticlePage />} />

          <Route path="/groups" element={<GroupesPage />} />
          <Route path="/groups/corporate" element={<GroupeCorporatePage />} />
          <Route path="/groups/kids" element={<GroupeEnfantsPage />} />
          <Route path="/groups/adults" element={<GroupeAdultesPage />} />
          <Route path="/groups/family" element={<GroupeFamillePage />} />

            {/* ── ACTUALITÉS PARC — en dehors du ParkLayout ── */}
          <Route path="/parks/:parkId/actualites" element={<ParkActualitesListPage />} />
          <Route path="/parks/:parkId/actualites/:slug" element={<ActuArticlePage />} />

          <Route path="/actualites" element={<ActualitesListPage />} />
          <Route path="/actualites/:slug" element={<ActuArticlePage />} />



          {/* ── PARKS (mini-sites imbriqués) ── */}
          <Route path="/parks/:parkId" element={<ParkLayout />}>
           
          </Route>
            {/* ── LEGAL ── */}
            <Route path="/legal"   element={<LegalPage title="Mentions légales" />} />
            <Route path="/privacy" element={<LegalPage title="Politique de confidentialité" />} />
            <Route path="/terms"   element={<LegalPage title="Conditions générales de vente" />} />

          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

// ── Page légale générique ──
function LegalPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-md">
          <h1 className="text-green-800 mb-6">{title}</h1>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              Cette page contient les informations légales de NoLimit Aventure.
            </p>
            <p className="text-gray-600">
              Dans un environnement de production, cette page contiendrait les mentions légales complètes,
              la politique de confidentialité ou les conditions générales de vente selon le cas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;