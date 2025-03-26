import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Tag, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

export default function BlogDetailPage() {
  const [, params] = useRoute("/blog/:id");
  const postId = params?.id ? parseInt(params.id) : undefined;

  // Fetch blog post details
  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: [`/api/blog-posts/${postId}`],
    enabled: !!postId,
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Blog Post</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Failed to load the blog post. Please try again later.
            </p>
            <Link href="/#blog">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        ) : post ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Link href="/#blog">
              <Button variant="ghost" className="mb-8">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  <span>{post.category}</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-12"
            >
              <img 
                src={post.thumbnail} 
                alt={post.title} 
                className="w-full h-auto rounded-xl shadow-lg object-cover"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="prose dark:prose-invert prose-lg max-w-none"
            >
              {/* Split content by paragraphs */}
              {post.content.split('\n\n').map((paragraph, index) => {
                // Check if paragraph starts with # for headings
                if (paragraph.startsWith('# ')) {
                  return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{paragraph.slice(2)}</h2>;
                } else if (paragraph.startsWith('## ')) {
                  return <h3 key={index} className="text-xl font-bold mt-6 mb-3">{paragraph.slice(3)}</h3>;
                } else if (paragraph.startsWith('### ')) {
                  return <h4 key={index} className="text-lg font-bold mt-5 mb-2">{paragraph.slice(4)}</h4>;
                } else if (paragraph.startsWith('```')) {
                  // Code block
                  const code = paragraph.slice(3, -3).trim();
                  return (
                    <pre key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
                      <code>{code}</code>
                    </pre>
                  );
                } else if (paragraph.startsWith('- ')) {
                  // Unordered list
                  const items = paragraph.split('\n').map(item => item.slice(2));
                  return (
                    <ul key={index} className="list-disc pl-6 my-4">
                      {items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  );
                } else if (paragraph.startsWith('1. ')) {
                  // Ordered list
                  const items = paragraph.split('\n').map(item => item.slice(3));
                  return (
                    <ol key={index} className="list-decimal pl-6 my-4">
                      {items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ol>
                  );
                } else if (paragraph.startsWith('> ')) {
                  // Blockquote
                  return (
                    <blockquote key={index} className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic my-4">
                      {paragraph.slice(2)}
                    </blockquote>
                  );
                } else {
                  // Regular paragraph
                  return <p key={index} className="my-4">{paragraph}</p>;
                }
              })}
            </motion.div>
            
            <hr className="my-12 border-gray-200 dark:border-gray-800" />
            
            <div className="flex justify-between items-center">
              <Link href="/#blog">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>
              
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" asChild>
                  <a 
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-twitter mr-2"></i>
                    Share on Twitter
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a 
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-linkedin mr-2"></i>
                    Share on LinkedIn
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Blog Post Not Found</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/#blog">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
