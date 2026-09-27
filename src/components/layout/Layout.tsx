import { ReactNode } from 'react';
import { Nav } from '../navigation/Nav';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="noise-overlay relative min-h-screen bg-ink text-bone">
      <Nav />

      <main>{children}</main>

      <Footer />
    </div>
  );
}
