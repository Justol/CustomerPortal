import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const affiliateTypes = [
  { value: 'digital-mailbox', label: 'Digital Mailbox Provider' },
  { value: 'domain-reseller', label: 'Domain Reseller' },
  { value: 'b2b', label: 'B2B / B2B Chat' },
  { value: 'influencer', label: 'Influencer / Content Creator' },
  { value: 'technology', label: 'Technology Partner' },
  { value: 'other', label: 'Other' }
] as const;

const affiliateSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  website: z.string().url('Please enter a valid URL'),
  affiliateType: z.enum(['digital-mailbox', 'domain-reseller', 'b2b', 'influencer', 'technology', 'other']),
  monthlyTraffic: z.enum(['0-1000', '1001-5000', '5001-10000', '10001-50000', '50001+']),
  marketingChannels: z.string().min(10, 'Please describe your marketing channels'),
  experience: z.enum(['none', 'some', 'experienced']),
  additionalInfo: z.string().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

type AffiliateForm = z.infer<typeof affiliateSchema>;

export function AffiliateSignupDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<AffiliateForm>({
    resolver: zodResolver(affiliateSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      website: '',
      affiliateType: 'digital-mailbox',
      monthlyTraffic: '0-1000',
      marketingChannels: '',
      experience: 'none',
      additionalInfo: '',
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: AffiliateForm) => {
    try {
      // Here you would typically make an API call to your backend
      console.log('Affiliate application data:', data);
      
      toast({
        title: "Application submitted successfully!",
        description: "We'll review your application and get back to you soon.",
      });
      
      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">Apply Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Affiliate Program Application</DialogTitle>
          <DialogDescription>
            Join our affiliate program and start earning competitive commissions
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@company.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://your-website.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="affiliateType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Affiliate Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select affiliate type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {affiliateTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monthlyTraffic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Website Traffic</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select monthly traffic range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0-1000">0 - 1,000 visitors</SelectItem>
                      <SelectItem value="1001-5000">1,001 - 5,000 visitors</SelectItem>
                      <SelectItem value="5001-10000">5,001 - 10,000 visitors</SelectItem>
                      <SelectItem value="10001-50000">10,001 - 50,000 visitors</SelectItem>
                      <SelectItem value="50001+">50,001+ visitors</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketingChannels"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marketing Channels</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your marketing channels and strategies..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Affiliate Marketing Experience</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="none" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          No prior experience
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="some" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Some experience (1-2 years)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="experienced" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Experienced (2+ years)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional information you'd like to share..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I accept the terms and conditions of the affiliate program
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Submit Application</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}