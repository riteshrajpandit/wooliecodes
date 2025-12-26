import React from 'react';
import { motion } from 'framer-motion';
import Book from '../components/common/Book';

const storyPages = [
  {
    id: 1,
    title: "The First Spark",
    content: "It all began in a small room filled with curiosity and an old computer. I remember the exact moment when I wrote my first line of code — a simple 'Hello, World!' that felt like magic. The screen lit up with those words, and something inside me shifted forever. I knew then that I had found my calling."
  },
  {
    id: 2,
    title: "Late Night Adventures",
    content: "Those early days were filled with endless late nights, countless cups of coffee, and the glow of monitors in dark rooms. Every bug was a puzzle, every solution a small victory. I devoured tutorials, books, and documentation like a hungry explorer charting unknown territories."
  },
  {
    id: 3,
    title: "The Learning Curve",
    content: "There were moments of frustration, times when the code refused to cooperate and errors seemed insurmountable. But with each challenge came growth. I learned that persistence is the developer's greatest tool, and that every failure is just a lesson in disguise."
  },
  {
    id: 4,
    title: "Finding My Voice",
    content: "As my skills grew, so did my confidence. I started contributing to open-source projects, sharing my knowledge through blog posts, and helping fellow developers on their journeys. The community welcomed me with open arms, and I found a family among fellow code enthusiasts."
  },
  {
    id: 5,
    title: "Building Dreams",
    content: "Each project became a canvas for creativity. From simple websites to complex applications, I poured my heart into every line of code. The thrill of seeing an idea transform into a living, breathing digital experience never gets old."
  },
  {
    id: 6,
    title: "The Road Ahead",
    content: "Today, I continue to write new chapters in this ongoing story. Technology evolves, trends shift, but the passion remains constant. The future holds infinite possibilities, and I'm excited to explore them all, one commit at a time."
  }
];

const About: React.FC = () => {
  return (
    <div className="py-20 md:py-32 bg-(--color-background)">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
            <span className="handwritten text-(--color-primary)">About Me</span>
          </h1>
          <div className="prose prose-lg dark:prose-invert">
            <p className="text-(--color-text-secondary) text-lg mb-6 text-center">
              A passionate frontend developer with a keen eye for design and a love for creating seamless user experiences.
              With years of experience in the field, I've had the privilege of working on diverse projects that have shaped my expertise.
            </p>
          </div>
        </motion.div>

        {/* Story Book Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            <span className="handwritten text-(--color-primary)">My Story</span>
          </h2>
          <Book pages={storyPages} />
        </motion.div>
      </div>
    </div>
  );
};

export default About;