import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Camera, Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';

const mailSchema = z.object({
  sender: z.string().min(2, 'Sender is required'),
  recipient: z.string().min(2, 'Recipient is required'),
  mailbox_id: z.string().uuid('Invalid mailbox ID'),
});

type MailForm = z.infer<typeof mailSchema>;

interface NewMailFormProps {
  onSuccess: () => void;
}

export function NewMailForm({ onSuccess }: NewMailFormProps) {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<MailForm>({
    resolver: zodResolver(mailSchema),
    defaultValues: {
      sender: '',
      recipient: '',
      mailbox_id: '', // This should be populated with the actual mailbox ID
    },
  });

  const handleImageCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Implement camera capture logic here
      // This is just a placeholder for the actual implementation
      console.log('Camera stream:', stream);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Unable to access camera",
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const onSubmit = async (data: MailForm) => {
    try {
      setLoading(true);

      // Upload image if exists
      let scanned_url = null;
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('mail-scans')
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('mail-scans')
          .getPublicUrl(fileName);

        scanned_url = publicUrl;
      }

      // Create mail record
      const { error } = await supabase
        .from('mail')
        .insert({
          ...data,
          scanned_url,
          status: 'received',
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Mail has been successfully added",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="p-6 space-y-6">
        <h3 className="text-lg font-semibold">Mail Details</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="sender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sender</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter sender name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter recipient name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Adding..." : "Add Mail"}
            </Button>
          </form>
        </Form>
      </Card>

      <Card className="p-6 space-y-6">
        <h3 className="text-lg font-semibold">Mail Image</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button
              type="button"
              onClick={handleImageCapture}
              className="flex-1 gap-2"
            >
              <Camera className="h-4 w-4" />
              Capture
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="h-4 w-4" />
              Upload
            </Button>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {previewUrl && (
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={previewUrl}
                alt="Mail preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}