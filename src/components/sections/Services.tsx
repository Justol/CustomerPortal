import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Globe2, 
  MailCheck, 
  Truck, 
  ScanLine, 
  Shield, 
  Package, 
  Clock,
  FileText 
} from 'lucide-react';

const services = [
  {
    icon: MailCheck,
    title: 'Digital Mail Management',
    description: 'View and manage your mail online. We scan the exterior of all mail pieces and notify you instantly.',
    features: [
      'Real-time notifications',
      'Mail scanning services',
      'Secure online portal',
      'Mail forwarding options'
    ]
  },
  {
    icon: Building2,
    title: 'Virtual Business Address',
    description: 'Get a prestigious business address in prime locations across the United States.',
    features: [
      'Real street address',
      'Use for business registration',
      'Multiple locations available',
      'Mail receiving & forwarding'
    ]
  },
  {
    icon: Globe2,
    title: 'International Shipping',
    description: 'Ship packages worldwide with competitive rates and reliable tracking.',
    features: [
      'Global shipping network',
      'Package consolidation',
      'Real-time tracking',
      'Customs documentation'
    ]
  },
  {
    icon: ScanLine,
    title: 'Document Scanning',
    description: 'Professional scanning services for all your important documents.',
    features: [
      'High-resolution scans',
      'Secure document handling',
      'Cloud storage options',
      'Searchable PDF format'
    ]
  },
  {
    icon: Shield,
    title: 'Secure Storage',
    description: 'Safe and secure storage solutions for your mail and packages.',
    features: [
      '24/7 security',
      'Climate-controlled facility',
      'Flexible storage periods',
      'Easy retrieval process'
    ]
  },
  {
    icon: Package,
    title: 'Package Receiving',
    description: 'Accept packages from all carriers with signature and security.',
    features: [
      'All carriers accepted',
      'Package consolidation',
      'Signature service',
      'Photo notifications'
    ]
  },
  {
    icon: Clock,
    title: '24/7 Access',
    description: 'Round-the-clock access to your mail and package services.',
    features: [
      'Always available',
      'Online management',
      'Mobile app access',
      'Real-time updates'
    ]
  },
  {
    icon: FileText,
    title: 'Business Services',
    description: 'Additional services to support your business operations.',
    features: [
      'Notary services',
      'Printing & copying',
      'Registered agent service',
      'Mail merge & fulfillment'
    ]
  },
  {
    icon: Truck,
    title: 'Freight Services',
    description: 'Handle large shipments with our comprehensive freight solutions.',
    features: [
      'LTL shipping',
      'Freight forwarding',
      'Warehouse receiving',
      'Custom shipping solutions'
    ]
  }
];

export function Services() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive mail management and shipping solutions for businesses and individuals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.title} className="p-6">
              <service.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-muted-foreground mb-4">{service.description}</p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full">Learn More</Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}