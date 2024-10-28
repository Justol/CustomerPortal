import { Button } from '@/components/ui/button';
import { VideoDialog } from '@/components/ui/video-dialog';

export function Hero() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6">
            Your Digital Mailbox for the Modern World
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8">
            Manage your mail and packages from anywhere. Get a permanent address, forward mail, and ship globally with ease.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto">Start Free Trial</Button>
            <VideoDialog />
          </div>
        </div>
      </div>
    </section>
  );
}