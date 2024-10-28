import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface TaskProcessorProps {
  id: string;
  label: string;
  icon: LucideIcon;
}

export function TaskProcessor({ id, label, icon: Icon }: TaskProcessorProps) {
  const handleTaskClick = () => {
    // Implement task processing logic here
    console.log(`Processing task: ${id}`);
  };

  return (
    <Button
      variant="outline"
      className="h-24 flex flex-col items-center justify-center gap-2"
      onClick={handleTaskClick}
    >
      <Icon className="h-6 w-6" />
      <span>{label}</span>
    </Button>
  );
}