import { Link } from "wouter";
import { BlogPost } from "@shared/schema";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Format the publication date
  const formattedDate = formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true });

  return (
    <motion.article 
      className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      variants={itemVariants}
    >
      <img 
        src={post.thumbnail}
        alt={post.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex items-center mb-4">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {formattedDate}
          </span>
          <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
          <span className="text-xs font-medium text-primary dark:text-blue-400">
            {post.category}
          </span>
        </div>
        <Link href={`/blog/${post.id}`}>
          <h3 className="text-xl font-bold mb-3 hover:text-primary dark:hover:text-blue-400 transition-colors cursor-pointer">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-600 dark:text-gray-300 mb-5">
          {post.excerpt}
        </p>
        <Link href={`/blog/${post.id}`}>
          <span className="inline-flex items-center text-primary dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium cursor-pointer">
            <span>Read More</span>
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </span>
        </Link>
      </div>
    </motion.article>
  );
}
