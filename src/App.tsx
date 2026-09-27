import { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

import { useLenis } from '@/hooks/useLenis';

import { Loader } from '@/components/common/Loader';
import { PageTransitionProvider } from '@/components/common/PageLoader';
import { Nav } from '@/components/navigation/Nav';
import { Footer } from '@/components/layout/Footer';

import { Home } from '@/pages/Home/Home';
import { About } from '@/pages/About/About';
import { Service } from '@/pages/Services/Services';
import { Portfolio } from '@/pages/Portfolio/Portfolio';
import { Contact } from '@/pages/Contact/Contact';
import ProjectDetailPage from './pages/Portfolio/ProjectDetailPage';

function Layout() {
  return (
    <div className="noise-overlay relative min-h-screen bg-ink text-bone">
      <Nav />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

function App() {
  const [loaded, setLoaded] = useState(false);

  useLenis();

  return (
    <PageTransitionProvider>
      <Loader onComplete={() => setLoaded(true)} />

      {loaded && (
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Service />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/portfolio/:slug" element={<ProjectDetailPage />} />
          </Route>
        </Routes>
      )}
    </PageTransitionProvider>
  );
}

export default App;
