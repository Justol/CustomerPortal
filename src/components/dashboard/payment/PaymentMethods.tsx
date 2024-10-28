import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CreditCard, Edit, Trash } from 'lucide-react';
import { PaymentMethodDialog } from './PaymentMethodDialog';

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export function PaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const handleEdit = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Accepted Payment Methods</h3>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Payment Method
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {methods.map((method) => (
          <Card key={method.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {method.type} ending in {method.last4}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expires {method.expiry}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(method)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {method.isDefault && (
              <div className="mt-4">
                <Badge variant="secondary">Default</Badge>
              </div>
            )}
          </Card>
        ))}
      </div>

      <PaymentMethodDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        method={selectedMethod}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedMethod(null);
        }}
      />
    </div>
  );
}