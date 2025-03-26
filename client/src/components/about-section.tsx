import { useQuery } from "@tanstack/react-query";
import { Profile } from "@shared/schema";
import { TimelineItem } from "@/components/timeline-item";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export function AboutSection() {
  const { data: profile } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  const { data: timelineEntries } = useQuery({
    queryKey: ["/api/timeline-entries"],
  });

  const { observerRef } = useScrollAnimation();

  // Use placeholder bio if profile is not yet loaded
  const bio = profile?.bio || "I'm a passionate Full-Stack Developer with over 5 years of experience building web applications that deliver exceptional user experiences. My journey in technology began when I built my first website at the age of 15, and I've been hooked ever since.";
  const bioLines = bio.split('\n\n');

  // Use placeholder skills if profile is not yet loaded
  const skills = profile?.skills || {
    "Frontend Development": 90,
    "Backend Development": 85,
    "UI/UX Design": 75,
    "DevOps": 70,
    "Database Management": 80,
    "Cloud Services": 75
  };

  return (
    <section id="about" className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <div className="w-24 h-1 bg-primary dark:bg-blue-400 mx-auto"></div>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          <div className="w-full lg:w-1/2">
            <h3 className="text-2xl font-bold mb-6">Who I Am</h3>
            {bioLines.map((paragraph, index) => (
              <p 
                key={index} 
                className="text-gray-600 dark:text-gray-300 mb-4 last:mb-0"
              >
                {paragraph}
              </p>
            ))}
          </div>
          
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Skill bars */}
              {Object.entries(skills).map(([skill, percentage]) => (
                <div key={skill} className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{skill}</span>
                    <span className="text-sm font-medium text-primary dark:text-blue-400">{percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary dark:bg-blue-500 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Interactive Timeline */}
        <div className="mt-20" ref={observerRef}>
          <h3 className="text-2xl font-bold text-center mb-16">My Journey</h3>
          
          <div className="relative min-h-[1500px] md:min-h-[1800px]">
            {/* Timeline Center Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-300 dark:bg-gray-700 md:block hidden"></div>
            <div className="absolute left-8 md:left-auto top-0 h-full w-1 bg-gray-300 dark:bg-gray-700 md:hidden"></div>
            
            {/* Timeline Items */}
            {timelineEntries ? (
              [...timelineEntries]
                .sort((a, b) => a.order - b.order)
                .map((entry, index) => (
                  <TimelineItem
                    key={entry.id}
                    title={entry.title}
                    company={entry.company}
                    dateRange={entry.dateRange}
                    description={entry.description}
                    skills={entry.skills}
                    isEven={index % 2 === 1}
                  />
                ))
            ) : (
              // Placeholder timeline items if data is not yet loaded
              Array(4).fill(null).map((_, index) => (
                <TimelineItem
                  key={index}
                  title={index === 0 ? "Senior Full-Stack Developer" : 
                         index === 1 ? "Full-Stack Developer" :
                         index === 2 ? "Frontend Developer" : "Computer Science Degree"}
                  company={index === 0 ? "TechCorp Inc." : 
                           index === 1 ? "InnovateSoft" :
                           index === 2 ? "WebSolutions LLC" : "Tech University"}
                  dateRange={index === 0 ? "2021 - Present" : 
                             index === 1 ? "2018 - 2021" :
                             index === 2 ? "2016 - 2018" : "2012 - 2016"}
                  description={index === 0 ? "Leading a team of developers building enterprise-level applications. Responsible for architecture decisions, code reviews, and implementing best practices." :
                              index === 1 ? "Developed and maintained multiple client projects. Worked on the entire stack from frontend UI to backend API development and database management." :
                              index === 2 ? "Focused on creating responsive, user-friendly interfaces. Collaborated closely with designers and backend developers to implement features." :
                              "Bachelor's degree in Computer Science with focus on software engineering and web technologies. Graduated with honors."}
                  skills={index === 0 ? ["React", "Node.js", "MongoDB", "AWS"] :
                          index === 1 ? ["React", "Express", "PostgreSQL", "Docker"] :
                          index === 2 ? ["JavaScript", "HTML/CSS", "jQuery", "SASS"] :
                          ["Algorithms", "Data Structures", "Web Dev"]}
                  isEven={index % 2 === 1}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
