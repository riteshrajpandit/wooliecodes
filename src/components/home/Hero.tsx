import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <motion.div 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ opacity, scale, y }}
    >
      <div className="absolute inset-0 -z-10">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--color-primary)] from-5% via-[color:var(--color-background)] to-[color:var(--color-background)] opacity-10" />
        
        {/* Code particles (decorative) */}
        <div className="absolute inset-0 overflow-hidden opacity-5">
          <div className="absolute top-20 left-10 text-xs code">
            &lt;div className="hero"&gt;<br />
            &nbsp;&nbsp;&lt;h1&gt;Welcome&lt;/h1&gt;<br />
            &lt;/div&gt;
          </div>
          <div className="absolute top-40 right-10 text-xs code">
            const journey = () =&gt; {`{`}<br />
            &nbsp;&nbsp;return &lt;DevStory /&gt;;<br />
            {`}`}
          </div>
          <div className="absolute bottom-20 left-20 text-xs code">
            .expertise {`{`}<br />
            &nbsp;&nbsp;transform: translate(ideas, reality);<br />
            {`}`}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="handwritten text-[color:var(--color-primary)]">The Journey of</span>
            <br />
            <span>A Frontend Visionary</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-[color:var(--color-text-secondary)] mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Crafting digital experiences through code, design, and storytelling — where technology meets creativity.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/projects" className="btn btn-primary">
              Explore My Work
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Get In Touch
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <span className="text-sm mb-2 text-[color:var(--color-text-secondary)]">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ArrowDown size={20} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Hero;