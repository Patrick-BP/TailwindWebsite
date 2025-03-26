import { useQuery } from "@tanstack/react-query";
import { BlogCard } from "@/components/blog-card";
import { BlogPost } from "@shared/schema";
import { motion } from "framer-motion";

export function BlogSection() {
  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  return (
    <section id="blog" className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical Blog</h2>
          <div className="w-24 h-1 bg-primary dark:bg-blue-400 mx-auto mb-8"></div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            I write about web development, technology trends, and my experiences as a developer.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg h-96 animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {blogPosts && blogPosts.length > 0 ? (
              blogPosts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">
                  No blog posts found. Check back later!
                </h3>
              </div>
            )}
          </motion.div>
        )}
        
        {blogPosts && blogPosts.length > 3 && (
          <div className="text-center mt-12">
            <a href="#" className="inline-flex items-center text-primary dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              <span>View All Articles</span>
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
