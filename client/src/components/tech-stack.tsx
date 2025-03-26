import { FaReact, FaNodeJs, FaJs, FaHtml5, FaCss3Alt, FaGithub, FaDatabase, FaAws } from "react-icons/fa";
import { motion } from "framer-motion";

export function TechStack() {
  const techItems = [
    { icon: <FaReact className="text-4xl text-blue-500 dark:text-blue-400 mb-2" />, name: "React" },
    { icon: <FaNodeJs className="text-4xl text-green-500 dark:text-green-400 mb-2" />, name: "Node.js" },
    { icon: <FaJs className="text-4xl text-yellow-500 mb-2" />, name: "JavaScript" },
    { icon: <FaHtml5 className="text-4xl text-orange-500 mb-2" />, name: "HTML5" },
    { icon: <FaCss3Alt className="text-4xl text-blue-500 mb-2" />, name: "CSS3" },
    { icon: <FaGithub className="text-4xl text-gray-700 dark:text-gray-300 mb-2" />, name: "Git" },
    { icon: <FaDatabase className="text-4xl text-purple-500 dark:text-purple-400 mb-2" />, name: "MongoDB" },
    { icon: <FaAws className="text-4xl text-orange-400 mb-2" />, name: "AWS" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="mt-24">
      <h2 className="text-2xl font-bold text-center mb-8">Tech Stack</h2>
      <motion.div 
        className="flex flex-wrap justify-center gap-8 md:gap-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {techItems.map((tech, index) => (
          <motion.div 
            key={index} 
            className="flex flex-col items-center"
            variants={itemVariants}
            transition={{ duration: 0.5 }}
          >
            {tech.icon}
            <span className="text-sm font-medium">{tech.name}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
