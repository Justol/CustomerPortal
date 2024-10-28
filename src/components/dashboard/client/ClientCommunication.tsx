import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send, Users } from 'lucide-react';

export function ClientCommunication() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [clientGroup, setClientGroup] = useState('all');
  const { toast } = useToast();

  const handleSend = () => {
    // Implement send logic
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the selected clients.",
    });
    setSubject('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Send Communication</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={clientGroup} onValueChange={setClientGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  <SelectItem value="active">Active Clients</SelectItem>
                  <SelectItem value="inactive">Inactive Clients</SelectItem>
                  <SelectItem value="premium">Premium Plan Clients</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              Selected: {clientGroup === 'all' ? 'All Clients' : clientGroup}
            </Button>
          </div>

          <Input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[200px]"
          />

          <div className="flex justify-end">
            <Button onClick={handleSend} className="gap-2">
              <Send className="h-4 w-4" />
              Send Message
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}