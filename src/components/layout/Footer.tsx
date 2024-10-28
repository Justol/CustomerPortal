import { Package } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const footerLinks = {
  Product: ['Features', 'Pricing', 'Security', 'API'],
  Company: ['About', 'Careers', 'Blog', 'Press'],
  Resources: ['Documentation', 'Help Center', 'Status', 'Partners'],
  Legal: ['Privacy', 'Terms', 'Cookie Policy', 'GDPR'],
};

export function Footer({ onNavigate }: FooterProps) {
  const handleClick = (category: string, link: string) => {
    if (category === 'Resources' && link === 'Partners') {
      onNavigate('partners');
    }
  };

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">MailBox & Ship</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Modern mail management and global shipping solutions for businesses and individuals.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-3">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => handleClick(category, link)}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} MailBox & Ship. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}