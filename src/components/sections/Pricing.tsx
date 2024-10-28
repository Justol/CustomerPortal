import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const YEARLY_DISCOUNT = 0.15; // 15% discount for yearly billing

const firstRowPlans = [
  {
    name: 'Digital Mailbox - 30n',
    monthlyPrice: 9.95,
    description: 'Perfect for individuals and small businesses',
    features: [
      '30 mails in storage FREE/mo',
      'Free mail pick up (most locations)',
      'Receive Faxes for $1.75',
    ],
  },
  {
    name: 'Digital Mailbox - 60n',
    monthlyPrice: 16.95,
    description: 'Ideal for those needing more storage',
    features: [
      '60 mails in storage FREE/mo',
      'Free mail pick up (most locations)',
      'Receive Faxes for $1.75',
    ],
    popular: true,
  },
  {
    name: 'Physical Mailbox - Standard',
    monthlyPrice: 18.95,
    description: 'Great for standard physical mail needs',
    features: [
      'Key Access to Mailbox',
      '24 hr. Access to Mailbox',
      'Free mail pick up (Additional Payment)',
      'Receive Faxes for $1.75',
    ],
  },
];

const secondRowPlans = [
  {
    name: 'Physical Mailbox - Business',
    monthlyPrice: 21.95,
    description: 'Best for business needs with more mail handling',
    features: [
      'Key Access to Mailbox',
      '24 hr. Access to Mailbox',
      'Free mail pick up',
      'Receive Faxes for $1.75',
    ],
  },
  {
    name: 'Physical Mailbox - Executive',
    monthlyPrice: 24.95,
    description: 'Perfect for executives with higher mail volume',
    features: [
      'Key Access to Mailbox',
      '24 hr. Access to Mailbox',
      'Free mail pick up',
      'Receive Faxes for $1.75',
    ],
  },
];

const allPlansFeatures = [
  {
    feature: 'Local Pickup',
    details: 'FREE at most locations. Pickup upon request',
  },
  {
    feature: 'Mail Storage',
    details: 'Including mail FREE storage at 60 / month. Each additional Storage at $0.33',
  },
  {
    feature: 'Open & Scan',
    details: '1-10 Pages $2.25. Each additional page at $0.30',
  },
  {
    feature: 'Forwarding',
    details: 'Each bundle at $3.00. Shipping Fees may apply',
  },
];

export function Pricing() {
  const [isYearly, setIsYearly] = useState(true);

  const calculateYearlyPrice = (monthlyPrice: number) => {
    const yearlyPrice = monthlyPrice * 12 * (1 - YEARLY_DISCOUNT);
    return yearlyPrice;
  };

  const formatPrice = (price: number) => price.toFixed(2);

  return (
    <section className="py-12 md:py-20" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the perfect plan for your needs. All plans include our core features.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={cn("text-sm", !isYearly && "text-primary font-medium")}>Monthly</span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-primary"
            />
            <span className={cn("text-sm", isYearly && "text-primary font-medium")}>
              Yearly (Save 15%)
            </span>
          </div>
        </div>

        {/* First Row - 3 Plans */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-6 md:mb-8">
          {firstRowPlans.map((plan) => (
            <Card key={plan.name} className={`p-4 md:p-6 ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
              {plan.popular && (
                <div className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full w-fit mb-4">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-4 mb-2">
                <span className="text-3xl font-bold">
                  ${isYearly ? formatPrice(calculateYearlyPrice(plan.monthlyPrice)) : formatPrice(plan.monthlyPrice)}
                </span>
                <span className="text-muted-foreground">/{isYearly ? 'year' : 'month'}</span>
              </div>
              {isYearly && (
                <div className="text-sm text-green-500 font-medium mb-4">
                  Save 15% compared to monthly
                </div>
              )}
              <p className="text-muted-foreground mb-6">{plan.description}</p>
              <Button className="w-full mb-6" variant={plan.popular ? 'default' : 'outline'}>
                Get Started
              </Button>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Second Row - 2 Plans */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-[800px] mx-auto mb-12 md:mb-16">
          {secondRowPlans.map((plan) => (
            <Card key={plan.name} className="p-4 md:p-6">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-4 mb-2">
                <span className="text-3xl font-bold">
                  ${isYearly ? formatPrice(calculateYearlyPrice(plan.monthlyPrice)) : formatPrice(plan.monthlyPrice)}
                </span>
                <span className="text-muted-foreground">/{isYearly ? 'year' : 'month'}</span>
              </div>
              {isYearly && (
                <div className="text-sm text-green-500 font-medium mb-4">
                  Save 15% compared to monthly
                </div>
              )}
              <p className="text-muted-foreground mb-6">{plan.description}</p>
              <Button className="w-full mb-6" variant="outline">
                Get Started
              </Button>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* All Plans Features Table */}
        <div className="max-w-4xl mx-auto overflow-x-auto">
          <h3 className="text-xl md:text-2xl font-bold text-center mb-6">All Plans Include</h3>
          <Card className="min-w-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Feature</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allPlansFeatures.map((item) => (
                  <TableRow key={item.feature}>
                    <TableCell className="font-medium">{item.feature}</TableCell>
                    <TableCell>{item.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </section>
  );
}