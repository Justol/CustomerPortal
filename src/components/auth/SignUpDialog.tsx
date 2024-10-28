import { FreeTrialDialog } from './FreeTrialDialog';
import { Button } from '@/components/ui/button';

export function SignUpDialog() {
  return (
    <FreeTrialDialog trigger={<Button>Sign Up</Button>} />
  );
}