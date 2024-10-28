import { Card } from '@/components/ui/card';
import { ScanLine, Send, ShieldCheck, Truck } from 'lucide-react';

const steps = [
  {
    icon: ShieldCheck,
    title: 'Sign Up',
    description: 'Get your unique virtual address and activate your account instantly.',
  },
  {
    icon: ScanLine,
    title: 'Receive Mail',
    description: 'We receive and scan your mail, notifying you instantly.',
  },
  {
    icon: Send,
    title: 'Manage Online',
    description: 'View scans and decide: forward, scan, shred, or archive.',
  },
  {
    icon: Truck,
    title: 'Ship Worldwide',
    description: 'Forward mail or ship packages anywhere with our global network.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get started with your digital mailbox in four simple steps
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={step.title} className="p-6 relative">
              <div className="absolute -top-4 left-6 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <step.icon className="h-12 w-12 text-primary mb-4 mt-2" />
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}