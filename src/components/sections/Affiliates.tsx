import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DollarSign, Users, BarChart, Gift, Shield, Award } from 'lucide-react';
import { AffiliateSignupDialog } from '@/components/auth/AffiliateSignupDialog';

interface AffiliatesProps {
  onNavigate: (page: string) => void;
}

export function Affiliates({ onNavigate }: AffiliatesProps) {
  const handleNavigate = (page: string) => {
    onNavigate(page);
  };

  const commissionTiers = [
    {
      name: 'Digital Mailbox Affiliate',
      commission: '20%',
      description: 'Earn commission on digital mailbox subscriptions',
      features: [
        'Commission on all digital mailbox plans',
        'Marketing materials provided',
        'Dedicated affiliate support',
      ],
    },
    {
      name: 'Domain Reseller',
      commission: '25%',
      description: 'Higher commissions for domain resellers',
      features: [
        'Enhanced commission rates',
        'Bulk registration discounts',
        'Priority support channel',
      ],
      popular: true,
    },
    {
      name: 'B2B / B2C Partner',
      commission: '30%',
      description: 'Maximum rewards for business partnerships',
      features: [
        'Highest commission tier',
        'Custom integration support',
        'Dedicated account manager',
      ],
    },
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: 'Competitive Commission',
      description: 'Earn up to 30% commission on all referred sales',
    },
    {
      icon: Users,
      title: 'Partner Network',
      description: 'Join our growing network of successful affiliates',
    },
    {
      icon: BarChart,
      title: 'Real-Time Analytics',
      description: 'Track your performance with detailed reporting',
    },
    {
      icon: Gift,
      title: 'Bonus Rewards',
      description: 'Earn additional rewards for high performance',
    },
    {
      icon: Shield,
      title: 'Reliable Payments',
      description: 'Monthly payments with no minimum threshold',
    },
    {
      icon: Award,
      title: 'Premium Support',
      description: 'Access to dedicated affiliate support team',
    },
  ];

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Affiliate Program
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Partner with us and earn competitive commissions while helping businesses manage their mail and shipping needs.
          </p>
          <AffiliateSignupDialog />
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="p-6">
              <benefit.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </Card>
          ))}
        </div>

        {/* Commission Tiers */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Commission Tiers</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the tier that best fits your business model
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {commissionTiers.map((tier) => (
            <Card key={tier.name} className={`p-6 ${tier.popular ? 'border-primary shadow-lg' : ''}`}>
              {tier.popular && (
                <div className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full w-fit mb-4">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
              <div className="text-3xl font-bold text-primary mb-4">
                {tier.commission}
              </div>
              <p className="text-muted-foreground mb-6">{tier.description}</p>
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <AffiliateSignupDialog />
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <p className="text-lg mb-6">
            Have questions about our affiliate program?
          </p>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => handleNavigate('contact')}
          >
            Contact Affiliate Team
          </Button>
        </div>
      </div>
    </section>
  );
}