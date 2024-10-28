import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useMailbox } from '@/hooks/use-mailbox';

const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const plans = [
  'Digital Mailbox - 30n',
  'Digital Mailbox - 60n',
  'Physical Mailbox - Standard',
  'Physical Mailbox - Business',
  'Physical Mailbox - Executive'
];

const planToType = {
  'Digital Mailbox - 30n': 'digital_30',
  'Digital Mailbox - 60n': 'digital_60',
  'Physical Mailbox - Standard': 'physical_standard',
  'Physical Mailbox - Business': 'physical_business',
  'Physical Mailbox - Executive': 'physical_executive',
} as const;

const freeTrialSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  companyName: z.string().optional(),
  streetAddress: z.string().min(5, 'Street address is required'),
  apartment: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Invalid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  selectedPlan: z.string().min(1, 'Please select a plan'),
  chooseLocation: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FreeTrialForm = z.infer<typeof freeTrialSchema>;

interface FreeTrialDialogProps {
  trigger?: React.ReactNode;
}

export function FreeTrialDialog({ trigger }: FreeTrialDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { signUp } = useAuth();
  const { createMailbox } = useMailbox(undefined); // We'll get the user ID after signup

  const form = useForm<FreeTrialForm>({
    resolver: zodResolver(freeTrialSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      companyName: '',
      streetAddress: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      selectedPlan: '',
      chooseLocation: false,
    },
  });

  const onSubmit = async (data: FreeTrialForm) => {
    try {
      // Sign up the user
      await signUp(data.email, data.password, {
        firstName: data.firstName,
        lastName: data.lastName,
      });

      // Create mailbox (this will be handled by the backend trigger)
      const mailboxType = planToType[data.selectedPlan as keyof typeof planToType];
      if (mailboxType) {
        await createMailbox({
          number: `MB-${Math.random().toString(36).substring(7)}`,
          type: mailboxType
        });
      }

      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });
      
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Free trial signup error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Start Free Trial</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex-1">
            <DialogTitle>Start Your Free Trial</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your details to begin your 30-day free trial
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Form fields remain the same */}
            {/* ... */}
            <Button type="submit" className="w-full">Start Free Trial</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}