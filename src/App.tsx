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
import { useAuth } from '@/lib/auth-context';
import { CustomerDashboard } from '@/components/dashboard/CustomerDashboard';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { AuthTest } from '@/components/auth/AuthTest';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentBlogPost, setCurrentBlogPost] = useState<string | null>(null);
  const { user, userDetails } = useAuth();

  const renderDashboard = () => {
    if (!user) return null;

    // Check user role for admin access
    const isAdminRole = ['super_admin', 'admin', 'location_admin'].includes(userDetails?.role || '');
    
    if (isAdminRole) {
      return <AdminDashboard onNavigate={setCurrentPage} />;
    }
    
    return <CustomerDashboard onNavigate={setCurrentPage} />;
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'auth-test':
        return <AuthTest />;
      case 'dashboard':
        return renderDashboard();
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
  );
}

export default App;