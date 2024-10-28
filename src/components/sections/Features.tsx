import { Card } from '@/components/ui/card';
import { Building2, Globe2, MailCheck, Clock, Shield, CreditCard } from 'lucide-react';

const features = [
  {
    icon: MailCheck,
    title: 'Digital Mail Management',
    description: 'View and manage your mail online. We scan the exterior of all mail pieces.',
  },
  {
    icon: Globe2,
    title: 'Global Shipping',
    description: 'Ship to and from anywhere in the world with competitive rates.',
  },
  {
    icon: Building2,
    title: 'Real Street Address',
    description: 'Get a permanent US address for your business or personal use.',
  },
  {
    icon: Clock,
    title: '24/7 Access',
    description: 'Access your mail and manage shipments anytime, anywhere.',
  },
  {
    icon: Shield,
    title: 'Secure Storage',
    description: 'Your mail is stored securely in our state-of-the-art facilities.',
  },
  {
    icon: CreditCard,
    title: 'Easy Billing',
    description: 'Transparent pricing with no hidden fees or surprises.',
  },
];

export function Features() {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Why Choose MailBox & Ship?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="p-4 md:p-6">
              <feature.icon className="h-10 w-10 md:h-12 md:w-12 text-primary mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm md:text-base">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}