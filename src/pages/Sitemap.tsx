import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sitemap: React.FC = () => {
  return (
    <div className="py-20 md:py-32 bg-[color:var(--color-background)]">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Sitemap</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Main Pages</h2>
              <ul className="space-y-2">
                <li><Link to="/" className="text-[color:var(--color-primary)] hover:underline">Home</Link></li>
                <li><Link to="/about" className="text-[color:var(--color-primary)] hover:underline">About</Link></li>
                <li><Link to="/projects" className="text-[color:var(--color-primary)] hover:underline">Projects</Link></li>
                <li><Link to="/articles" className="text-[color:var(--color-primary)] hover:underline">Articles</Link></li>
                <li><Link to="/gallery" className="text-[color:var(--color-primary)] hover:underline">Gallery</Link></li>
                <li><Link to="/contact" className="text-[color:var(--color-primary)] hover:underline">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Legal Pages</h2>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-[color:var(--color-primary)] hover:underline">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-[color:var(--color-primary)] hover:underline">Terms of Use</Link></li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Sitemap;