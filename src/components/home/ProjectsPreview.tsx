import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Github, ExternalLink } from 'lucide-react';

const ProjectsPreview: React.FC = () => {
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
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="py-20 md:py-32 bg-(--color-background)">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="handwritten text-(--color-primary)">Chapter 2:</span> Featured Projects
          </h2>
          <p className="text-(--color-text-secondary) max-w-2xl mx-auto text-lg">
            A showcase of my most significant work. Each project tells a story of challenges overcome and solutions created.
          </p>
        </div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project) => (
            <motion.div 
              key={project.id}
              variants={item}
              className="bg-(--color-paper) rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
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
                <p className="text-(--color-text-secondary) mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, index) => (
                    <span 
                      key={index} 
                      className="text-xs font-medium py-1 px-2 rounded-full bg-(--color-primary) text-white"
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
                      className="p-2 rounded-full bg-(--color-background) hover:bg-(--color-primary) hover:text-white transition-colors"
                      aria-label="GitHub Repository"
                    >
                      <Github size={18} />
                    </a>
                    <a 
                      href={project.live} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-(--color-background) hover:bg-(--color-primary) hover:text-white transition-colors"
                      aria-label="Live Demo"
                    >
                      <ExternalLink size={18} />
                    </a>
                  </div>
                  
                  <Link 
                    to={`/projects/${project.id}`}
                    className="flex items-center text-(--color-primary) hover:text-(--color-primary) hover:underline font-medium"
                  >
                    <span>View details</span>
                    <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-12 text-center">
          <Link to="/projects" className="btn btn-outline">
            View All Projects
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPreview;