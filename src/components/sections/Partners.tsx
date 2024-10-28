import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

const partners = [
  {
    title: 'Prep Your Business For Funding',
    description: 'Get expert guidance on preparing your business for investment opportunities.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
    link: 'http://visionaryhub.net/',
    cta: 'Learn More',
  },
  {
    title: 'Register Your Business',
    description: 'Streamline your business registration process with professional assistance.',
    image: 'https://images.unsplash.com/photo-1568992688065-536aad8a12f6?auto=format&fit=crop&q=80',
    link: 'http://digidesigner.net/',
    cta: 'Get Started',
  },
  {
    title: 'Chat And Market Your Business',
    description: 'Connect with customers and grow your business through effective communication.',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80',
    link: 'http://uniteonline.co/',
    cta: 'Explore Now',
  },
  {
    title: 'Design With Our AI',
    description: 'Create professional designs quickly with our AI-powered tools.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80',
    link: 'http://digidesigner.net/',
    cta: 'Start Designing',
  },
];

export function Partners() {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-16">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">Our Partners</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore additional resources and services from our trusted partners to help grow your business
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center">
            OTHER INTEREST AREAS TO GROW YOUR BUSINESS
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {partners.map((partner) => (
              <Card key={partner.title} className="overflow-hidden group">
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={partner.image}
                    alt={partner.title}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-semibold mb-2">{partner.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    {partner.description}
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open(partner.link, '_blank')}
                  >
                    {partner.cta}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}