import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Package, Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LoginDialog } from '@/components/auth/LoginDialog';
import { SignUpDialog } from '@/components/auth/SignUpDialog';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/lib/auth-context';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  
  const navItems = [
    { name: 'Home', path: 'home' },
    { name: 'Services', path: 'services' },
    { name: 'Pricing', path: 'pricing' },
    { name: 'Blog', path: 'blog' },
    { name: 'Affiliates', path: 'affiliates' },
    { name: 'Partners', path: 'partners' },
    { name: 'Contact', path: 'contact' },
  ];

  if (isAuthenticated) {
    navItems.push({ name: 'Dashboard', path: 'dashboard' });
  }

  const handleNavigate = (path: string) => {
    onNavigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="border-b sticky top-0 bg-background z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => handleNavigate('home')}
          >
            <Package className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">MailBox & Ship</span>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="space-x-6">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.path}>
                  <NavigationMenuLink
                    className={`text-sm font-medium hover:text-primary cursor-pointer ${
                      currentPage === item.path ? 'text-primary' : ''
                    }`}
                    onClick={() => handleNavigate(item.path)}
                  >
                    {item.name}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={`text-left px-2 py-2 text-lg hover:text-primary ${
                      currentPage === item.path ? 'text-primary font-medium' : ''
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="hidden md:flex space-x-4">
              <LoginDialog onNavigate={onNavigate} />
              <SignUpDialog />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}