import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { useMailbox } from '@/hooks/use-mailbox';

export function AuthTest() {
  const { user, signIn, signUp, signOut } = useAuth();
  const { mailboxes, createMailbox } = useMailbox(user?.id);
  const [loading, setLoading] = useState(false);

  const handleTestSignUp = async () => {
    try {
      setLoading(true);
      await signUp('test@example.com', 'password123', {
        firstName: 'Test',
        lastName: 'User'
      });
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSignIn = async () => {
    try {
      setLoading(true);
      await signIn('test@example.com', 'password123');
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestCreateMailbox = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      await createMailbox({
        number: `MB-${Math.random().toString(36).substring(7)}`,
        type: 'digital_30'
      });
    } catch (error) {
      console.error('Create mailbox error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Auth Test</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Current User:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Mailboxes:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(mailboxes, null, 2)}
          </pre>
        </div>

        <div className="flex flex-col gap-2">
          {!user ? (
            <>
              <Button 
                onClick={handleTestSignUp} 
                disabled={loading}
              >
                Test Sign Up
              </Button>
              <Button 
                onClick={handleTestSignIn} 
                disabled={loading}
              >
                Test Sign In
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={handleTestCreateMailbox} 
                disabled={loading}
              >
                Create Test Mailbox
              </Button>
              <Button 
                onClick={signOut} 
                variant="destructive" 
                disabled={loading}
              >
                Sign Out
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}