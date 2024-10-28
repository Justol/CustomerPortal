import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { blogPosts } from '@/lib/blog-data';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BlogPostProps {
  postId: string;
  onBack: () => void;
}

export function BlogPost({ postId, onBack }: BlogPostProps) {
  const post = blogPosts.find(p => p.id === postId);
  const relatedPosts = blogPosts
    .filter(p => p.id !== postId && p.category === post?.category)
    .slice(0, 2);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!post) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Button onClick={onBack} variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Button>
        </div>
      </section>
    );
  }

  return (
    <article className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Button onClick={onBack} variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share this article</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                {post.category}
              </Badge>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </div>
            </div>

            {post.content.map((section, index) => (
              <div key={index} className="mb-8">
                {section.subheading && (
                  <h2 className="text-2xl font-bold mb-4">{section.subheading}</h2>
                )}
                {section.paragraphs.map((paragraph, pIndex) => (
                  <p key={pIndex} className="mb-4 text-muted-foreground">{paragraph}</p>
                ))}
              </div>
            ))}
          </div>

          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card
                    key={relatedPost.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
                    onClick={() => onBack()}
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{relatedPost.title}</h3>
                      <p className="text-sm text-muted-foreground">{relatedPost.excerpt}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}