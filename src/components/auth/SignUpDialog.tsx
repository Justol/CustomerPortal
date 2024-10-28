import { Button } from '@/components/ui/button';

export function SignUpDialog() {
  const handleSignUp = () => {
    window.location.href = 'https://mailboxandship.com/index.php/signin';
  };

  return (
    <Button onClick={handleSignUp}>Sign Up</Button>
  );
}