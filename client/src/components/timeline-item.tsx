import { motion } from "framer-motion";

interface TimelineItemProps {
  title: string;
  company: string;
  dateRange: string;
  description: string;
  skills: string[];
  isEven: boolean;
}

export function TimelineItem({ title, company, dateRange, description, skills, isEven }: TimelineItemProps) {
  return (
    <motion.div 
      className="timeline-item relative mb-20 md:mb-24"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Timeline Dot */}
      <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary dark:bg-blue-500 z-10"></div>
      
      {/* Content */}
      <div className={`timeline-content relative md:absolute md:w-5/12 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg ${
        isEven ? 'md:right-0' : 'md:left-0'
      }`}>
        <span className="inline-block py-1 px-3 rounded-full bg-blue-100 dark:bg-blue-900 text-primary dark:text-blue-400 text-sm font-medium mb-3">
          {dateRange}
        </span>
        <h4 className="text-xl font-bold mb-2">{title}</h4>
        <h5 className="text-primary dark:text-blue-400 font-medium mb-4">{company}</h5>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span key={index} className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 rounded">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
