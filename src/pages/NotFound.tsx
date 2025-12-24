import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-background)">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="mb-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block"
            >
              <div className="text-[120px] font-bold leading-none">
                <span className="text-(--color-primary)">4</span>
                <span className="text-(--color-accent)">0</span>
                <span className="text-(--color-primary)">4</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-6">Page Not Found</h1>
              <p className="text-(--color-text-secondary) text-lg mb-8 max-w-lg mx-auto">
                The page you're looking for doesn't exist or has been moved. Don't worry, even the best developers get lost in their code sometimes.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/" className="btn btn-primary">
                  <Home size={18} className="mr-2" />
                  Back to Home
                </Link>
                <button 
                  onClick={() => window.history.back()}
                  className="btn btn-outline"
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Go Back
                </button>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-16"
          >
            <div className="p-6 bg-(--color-paper) rounded-lg shadow-md inline-block">
              <p className="handwritten text-(--color-primary) text-xl">
                The journey continues elsewhere...
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;