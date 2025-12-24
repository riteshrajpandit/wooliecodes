import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const Articles: React.FC = () => {
  const articles = [
    {
      id: 'react-performance',
      title: 'Optimizing React Performance: Advanced Techniques',
      excerpt: 'Learn how to identify and resolve performance bottlenecks in React applications using profiling tools and optimization strategies.',
      date: 'May 15, 2023',
      readTime: '8 min read',
      image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      mediumLink: 'https://medium.com',
      category: 'Performance'
    },
    {
      id: 'state-management',
      title: 'Modern State Management in 2023',
      excerpt: 'An exploration of current state management solutions in the React ecosystem, from Context API to Redux Toolkit and Zustand.',
      date: 'August 22, 2023',
      readTime: '10 min read',
      image: 'https://images.pexels.com/photos/5483077/pexels-photo-5483077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      mediumLink: 'https://medium.com',
      category: 'Architecture'
    },
    {
      id: 'design-systems',
      title: 'Building a Scalable Design System',
      excerpt: 'A comprehensive guide to creating, maintaining, and scaling a design system for product teams.',
      date: 'October 10, 2023',
      readTime: '12 min read',
      image: 'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      mediumLink: 'https://medium.com',
      category: 'Design'
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="py-20 md:py-32 bg-(--color-background)">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="handwritten text-(--color-primary)">Articles</span>
          </h1>
          <p className="text-(--color-text-secondary) text-lg mb-12 max-w-2xl">
            Thoughts, insights, and tutorials about frontend development and design.
            Join me as I explore the ever-evolving world of web technologies.
          </p>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {articles.map((article) => (
              <motion.article 
                key={article.id}
                variants={item}
                className="bg-(--color-paper) rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                  />
                  <div className="absolute top-4 right-4 bg-(--color-primary) text-white text-sm px-3 py-1 rounded-full">
                    {article.category}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col grow">
                  <div className="flex items-center text-(--color-text-secondary) text-sm mb-3">
                    <div className="flex items-center mr-4">
                      <Calendar size={14} className="mr-1" />
                      <span>{article.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold mb-3">{article.title}</h2>
                  <p className="text-(--color-text-secondary) mb-6 grow">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                    <a 
                      href={article.mediumLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
                    >
                      Read on Medium
                    </a>
                    
                    <Link 
                      to={`/articles/${article.id}`}
                      className="flex items-center text-(--color-primary) hover:underline font-medium"
                    >
                      <span>Read more</span>
                      <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Articles;