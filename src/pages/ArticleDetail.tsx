import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, ExternalLink } from 'lucide-react';

const ArticleDetail: React.FC = () => {
  const { id } = useParams();

  // This would typically come from an API or database
  const articles = {
    'react-performance': {
      title: 'Optimizing React Performance: Advanced Techniques',
      excerpt: 'Learn how to identify and resolve performance bottlenecks in React applications using profiling tools and optimization strategies.',
      content: `
        Performance optimization is a crucial aspect of building React applications that scale. In this comprehensive guide, we'll explore advanced techniques for identifying and resolving performance bottlenecks in your React applications.

        Understanding React's Rendering Process
        Before diving into optimization techniques, it's essential to understand how React's rendering process works. React uses a virtual DOM to efficiently update the actual DOM, but unnecessary re-renders can still impact performance.

        Key areas we'll cover:
        1. Using React Profiler
        2. Implementing useMemo and useCallback
        3. Code splitting and lazy loading
        4. State management optimization
        5. Network performance improvements

        Each of these topics deserves careful consideration when building performant React applications.
      `,
      date: 'May 15, 2023',
      readTime: '8 min read',
      image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      mediumLink: 'https://medium.com',
      category: 'Performance',
      author: {
        name: 'John Doe',
        role: 'Lead Frontend Developer',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      tags: ['React', 'Performance', 'JavaScript', 'Web Development']
    },
    'state-management': {
      title: 'Modern State Management in 2023',
      excerpt: 'An exploration of current state management solutions in the React ecosystem, from Context API to Redux Toolkit and Zustand.',
      content: `
        State management in React has evolved significantly over the years. This article explores modern approaches to managing state in React applications, comparing different solutions and their use cases.

        The Evolution of State Management
        From the early days of Redux to modern solutions like Zustand and Jotai, we've seen significant changes in how we approach state management in React applications.

        Topics covered:
        1. React Context API
        2. Redux Toolkit
        3. Zustand
        4. Jotai and Recoil
        5. When to use each solution

        Each solution has its strengths and ideal use cases, which we'll explore in detail.
      `,
      date: 'August 22, 2023',
      readTime: '10 min read',
      image: 'https://images.pexels.com/photos/5483077/pexels-photo-5483077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      mediumLink: 'https://medium.com',
      category: 'Architecture',
      author: {
        name: 'Jane Smith',
        role: 'Senior Frontend Developer',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      tags: ['React', 'State Management', 'Redux', 'JavaScript']
    },
    'design-systems': {
      title: 'Building a Scalable Design System',
      excerpt: 'A comprehensive guide to creating, maintaining, and scaling a design system for product teams.',
      content: `
        Design systems are the foundation of consistent, scalable product design. This guide explores the process of building and maintaining a design system that grows with your product.

        What Makes a Great Design System?
        A successful design system combines visual design, component architecture, and documentation to create a single source of truth for product teams.

        Key components:
        1. Visual Design Language
        2. Component Library
        3. Documentation
        4. Development Guidelines
        5. Version Control

        We'll explore each of these aspects in detail and discuss best practices for implementation.
      `,
      date: 'October 10, 2023',
      readTime: '12 min read',
      image: 'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      mediumLink: 'https://medium.com',
      category: 'Design',
      author: {
        name: 'Sarah Johnson',
        role: 'UX Engineer',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      tags: ['Design Systems', 'UI/UX', 'Frontend', 'Development']
    }
  };

  const article = articles[id as keyof typeof articles];

  if (!article) {
    return (
      <div className="py-20 md:py-32 bg-[color:var(--color-background)]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
            <Link to="/articles" className="text-[color:var(--color-primary)] hover:underline">
              Back to Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 md:py-32 bg-[color:var(--color-background)]">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <Link 
            to="/articles"
            className="inline-flex items-center text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-primary)] mb-8"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Articles
          </Link>

          <article className="bg-[color:var(--color-paper)] rounded-lg overflow-hidden shadow-xl">
            <div className="relative h-[400px]">
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center space-x-4 text-white mb-4">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {article.title}
                </h1>
                <p className="text-white/80 text-lg max-w-2xl">
                  {article.excerpt}
                </p>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                <img 
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-bold">{article.author.name}</h3>
                  <p className="text-[color:var(--color-text-secondary)] text-sm">
                    {article.author.role}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-full bg-[color:var(--color-primary)] bg-opacity-10 text-[color:var(--color-primary)] text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                {article.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-[color:var(--color-text-secondary)] mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="flex items-center justify-center">
                <a 
                  href={article.mediumLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary flex items-center"
                >
                  <ExternalLink size={20} className="mr-2" />
                  Read on Medium
                </a>
              </div>
            </div>
          </article>
        </motion.div>
      </div>
    </div>
  );
};

export default ArticleDetail;