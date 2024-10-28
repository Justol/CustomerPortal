import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Pricing } from '@/components/sections/Pricing';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTA } from '@/components/sections/CTA';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { Services } from '@/components/sections/Services';
import { Contact } from '@/components/sections/Contact';
import { Affiliates } from '@/components/sections/Affiliates';
import { Partners } from '@/components/sections/Partners';
import { Blog } from '@/components/sections/Blog';
import { BlogPost } from '@/components/sections/BlogPost';
import { AuthProvider } from '@/lib/auth-context';
import { Dashboard } from '@/components/sections/Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentBlogPost, setCurrentBlogPost] = useState<string | null>(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'services':
        return <Services />;
      case 'contact':
        return <Contact />;
      case 'pricing':
        return <Pricing />;
      case 'affiliates':
        return <Affiliates onNavigate={setCurrentPage} />;
      case 'partners':
        return <Partners />;
      case 'blog':
        return currentBlogPost ? (
          <BlogPost 
            postId={currentBlogPost} 
            onBack={() => setCurrentBlogPost(null)} 
          />
        ) : (
          <Blog onPostClick={(postId) => setCurrentBlogPost(postId)} />
        );
      default:
        return (
          <>
            <Hero />
            <Features />
            <HowItWorks />
            <Pricing />
            <Testimonials />
            <CTA />
          </>
        );
    }
  };

  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen bg-background">
          <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
          <main>
            {renderPage()}
          </main>
          <Footer onNavigate={setCurrentPage} />
        </div>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;