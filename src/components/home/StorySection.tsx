import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const StorySection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, 100]);

  const storyItems = [
    {
      year: '2017',
      title: 'The Beginning',
      description: 'Started my journey into web development with HTML, CSS, and JavaScript. Built my first website and fell in love with creating digital experiences.',
    },
    {
      year: '2018',
      title: 'Going Professional',
      description: 'Landed my first developer role at a digital agency. Worked on a variety of projects and learned the ins and outs of professional web development.',
    },
    {
      year: '2020',
      title: 'React Revolution',
      description: 'Embraced React and modern frontend frameworks. Led the frontend team on a major e-commerce platform rebuild using React and Redux.',
    },
    {
      year: '2022',
      title: 'Leading Innovation',
      description: 'Promoted to Lead Frontend Developer. Established coding standards, mentored junior developers, and architected scalable frontend solutions.',
    },
    {
      year: '2023',
      title: 'Expanding Horizons',
      description: 'Started exploring 3D web experiences with Three.js. Published articles on frontend architecture and spoke at local tech conferences.',
    },
    {
      year: 'Now',
      title: 'The Journey Continues',
      description: 'Continuously learning and growing. Building innovative digital experiences and sharing knowledge with the community.',
    },
  ];

  return (
    <motion.div 
      ref={containerRef}
      className="relative py-20 md:py-32 bg-(--color-background)"
      style={{ opacity, y }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="handwritten text-(--color-primary)">Chapter 1:</span> My Journey
          </h2>
          <p className="text-(--color-text-secondary) max-w-2xl mx-auto text-lg">
            Every developer has a story. Here's how mine unfolded, from curious beginner to lead developer.
          </p>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-(--color-primary) bg-opacity-30" />
          
          {/* Timeline items */}
          <div className="space-y-12 md:space-y-0">
            {storyItems.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className={`relative flex flex-col ${
                  index % 2 === 0 
                    ? 'md:flex-row' 
                    : 'md:flex-row-reverse'
                } md:gap-8 md:mb-20`}
              >
                {/* Year marker */}
                <div className={`md:w-1/2 flex items-start mb-4 md:mb-0 ${
                  index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'
                }`}>
                  <div className={`bg-(--color-paper) p-4 rounded-lg shadow-md ${
                    index % 2 === 0 ? 'md:mr-6' : 'md:ml-6'
                  }`}>
                    <div className="handwritten text-3xl font-bold text-(--color-primary)">
                      {item.year}
                    </div>
                  </div>
                </div>
                
                {/* Center dot (visible on desktop) */}
                <div className="hidden md:block absolute left-1/2 top-6 transform -translate-x-1/2 w-5 h-5 rounded-full bg-(--color-primary) border-4 border-(--color-background)" />
                
                {/* Content */}
                <div className="md:w-1/2">
                  <div className="neon-border-container group relative rounded-lg">
                    <div className="relative bg-(--color-paper) p-6 rounded-lg shadow-md">
                      <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                      <p className="text-(--color-text-secondary)">{item.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StorySection;