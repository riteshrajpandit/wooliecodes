import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <div className="py-20 md:py-32 bg-[color:var(--color-background)]">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="handwritten text-[color:var(--color-primary)]">About Me</span>
          </h1>
          <div className="prose prose-lg dark:prose-invert">
            <p className="text-[color:var(--color-text-secondary)] text-lg mb-6">
              A passionate frontend developer with a keen eye for design and a love for creating seamless user experiences.
              With years of experience in the field, I've had the privilege of working on diverse projects that have shaped my expertise.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;