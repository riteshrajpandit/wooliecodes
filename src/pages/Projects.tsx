import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, ExternalLink } from 'lucide-react';

const Projects: React.FC = () => {
  const projects = [
    {
      id: 'ecommerce-platform',
      title: 'E-Commerce Platform',
      description: 'A modern, responsive e-commerce platform built with React, Redux, and Node.js. Features include product filtering, cart management, and payment processing.',
      image: 'https://images.pexels.com/photos/6956903/pexels-photo-6956903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      technologies: ['React', 'Redux', 'Node.js', 'Express', 'MongoDB'],
      github: 'https://github.com',
      live: 'https://demo.com',
    },
    {
      id: 'dashboard-analytics',
      title: 'Dashboard Analytics',
      description: 'An interactive dashboard for visualizing complex data sets. Includes customizable charts, data filtering, and export capabilities.',
      image: 'https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      technologies: ['React', 'D3.js', 'TypeScript', 'Firebase'],
      github: 'https://github.com',
      live: 'https://demo.com',
    },
    {
      id: 'portfolio-generator',
      title: 'Portfolio Generator',
      description: 'A tool that helps developers create beautiful portfolios without writing code. Features drag-and-drop interface and customizable templates.',
      image: 'https://images.pexels.com/photos/4050290/pexels-photo-4050290.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      technologies: ['Vue.js', 'Tailwind CSS', 'Supabase'],
      github: 'https://github.com',
      live: 'https://demo.com',
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
    <div className="py-20 md:py-32 bg-[color:var(--color-background)]">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="handwritten text-[color:var(--color-primary)]">My Projects</span>
          </h1>
          <p className="text-[color:var(--color-text-secondary)] text-lg mb-12 max-w-2xl">
            A collection of my most significant work and contributions to the world of web development.
            Each project represents a unique challenge and solution.
          </p>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project) => (
              <motion.div 
                key={project.id}
                variants={item}
                className="bg-[color:var(--color-paper)] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-[color:var(--color-text-secondary)] mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech, index) => (
                      <span 
                        key={index} 
                        className="text-xs font-medium py-1 px-2 rounded-full bg-[color:var(--color-primary)] bg-opacity-10 text-[color:var(--color-primary)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-3">
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-[color:var(--color-background)] hover:bg-[color:var(--color-primary)] hover:text-white transition-colors"
                      >
                        <Github size={18} />
                      </a>
                      <a 
                        href={project.live} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-[color:var(--color-background)] hover:bg-[color:var(--color-primary)] hover:text-white transition-colors"
                      >
                        <ExternalLink size={18} />
                      </a>
                    </div>
                    
                    <Link 
                      to={`/projects/${project.id}`}
                      className="text-[color:var(--color-primary)] hover:underline font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Projects;