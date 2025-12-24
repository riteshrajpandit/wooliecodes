import React from 'react';
import { motion } from 'framer-motion';

const TermsOfUse: React.FC = () => {
  return (
    <div className="py-20 md:py-32 bg-(--color-background)">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Use</h1>
          <div className="prose prose-lg dark:prose-invert">
            <p className="text-(--color-text-secondary) text-lg">
              By accessing this website, you agree to be bound by these Terms of Use and all applicable laws and regulations.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfUse;