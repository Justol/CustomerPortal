import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/lib/auth-context';

interface LoginDialogProps {
  onNavigate: (page: string) => void;
}

export function LoginDialog({ onNavigate }: LoginDialogProps) {
  const { isAuthenticated } = useAuth();

  const handleLogin = () => {
    window.location.href = 'https://mailboxandship.com/index.php/signin';
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {isAuthenticated ? (
          <Button variant="ghost" onClick={() => onNavigate('dashboard')}>
            Dashboard
          </Button>
        ) : (
          <Button variant="ghost" onClick={handleLogin}>Login</Button>
        )}
      </DialogTrigger>
    </Dialog>
  );
}