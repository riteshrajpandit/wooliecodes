import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Calendar, ArrowLeft } from 'lucide-react';

const ProjectDetail: React.FC = () => {
  const { id } = useParams();

  // This would typically come from an API or database
  const projects = {
    'ecommerce-platform': {
      title: 'E-Commerce Platform',
      description: 'A modern, responsive e-commerce platform built with React, Redux, and Node.js. Features include product filtering, cart management, and payment processing.',
      fullDescription: `
        This e-commerce platform represents a comprehensive solution for modern online retail. Built with scalability and user experience in mind, it incorporates the latest web technologies and best practices in e-commerce development.

        The platform features a responsive design that works seamlessly across all devices, from mobile phones to desktop computers. The user interface is intuitive and engaging, with smooth animations and transitions that enhance the shopping experience.
      `,
      image: 'https://images.pexels.com/photos/6956903/pexels-photo-6956903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      technologies: ['React', 'Redux', 'Node.js', 'Express', 'MongoDB'],
      features: [
        'Advanced product filtering and search',
        'Real-time cart management',
        'Secure payment processing',
        'User authentication and profiles',
        'Order tracking and history',
        'Admin dashboard for inventory management'
      ],
      challenges: [
        'Implementing real-time inventory updates',
        'Optimizing performance for large product catalogs',
        'Ensuring secure payment processing',
        'Building a responsive and accessible interface'
      ],
      github: 'https://github.com',
      live: 'https://demo.com',
      date: 'October 2023',
      role: 'Lead Frontend Developer',
      duration: '6 months'
    },
    'dashboard-analytics': {
      title: 'Dashboard Analytics',
      description: 'An interactive dashboard for visualizing complex data sets. Includes customizable charts, data filtering, and export capabilities.',
      fullDescription: `
        The Dashboard Analytics project is a sophisticated data visualization platform that transforms complex datasets into actionable insights. It provides users with powerful tools to analyze and understand their data through interactive charts and customizable views.

        The dashboard is built with performance in mind, handling large datasets smoothly while maintaining responsive interactions. It features real-time updates and allows users to customize their view preferences.
      `,
      image: 'https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      technologies: ['React', 'D3.js', 'TypeScript', 'Firebase'],
      features: [
        'Interactive data visualizations',
        'Custom chart configurations',
        'Data export functionality',
        'Real-time updates',
        'Responsive design',
        'Dark mode support'
      ],
      challenges: [
        'Optimizing performance with large datasets',
        'Creating intuitive chart interactions',
        'Implementing responsive visualizations',
        'Managing complex state updates'
      ],
      github: 'https://github.com',
      live: 'https://demo.com',
      date: 'July 2023',
      role: 'Frontend Developer',
      duration: '4 months'
    },
    'portfolio-generator': {
      title: 'Portfolio Generator',
      description: 'A tool that helps developers create beautiful portfolios without writing code. Features drag-and-drop interface and customizable templates.',
      fullDescription: `
        The Portfolio Generator is an innovative tool that democratizes portfolio creation for developers. It provides a user-friendly interface for creating professional portfolios without requiring extensive coding knowledge.

        The application features a drag-and-drop interface, real-time preview, and a variety of customizable templates. Users can easily showcase their projects, skills, and experience in a polished, professional format.
      `,
      image: 'https://images.pexels.com/photos/4050290/pexels-photo-4050290.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      technologies: ['Vue.js', 'Tailwind CSS', 'Supabase'],
      features: [
        'Drag-and-drop interface',
        'Customizable templates',
        'Real-time preview',
        'Export to HTML/CSS',
        'Project showcase section',
        'Contact form integration'
      ],
      challenges: [
        'Creating a smooth drag-and-drop experience',
        'Implementing real-time preview rendering',
        'Managing complex state transitions',
        'Optimizing template customization'
      ],
      github: 'https://github.com',
      live: 'https://demo.com',
      date: 'May 2023',
      role: 'Full Stack Developer',
      duration: '3 months'
    }
  };

  const project = projects[id as keyof typeof projects];

  if (!project) {
    return (
      <div className="py-20 md:py-32 bg-(--color-background)">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
            <Link to="/projects" className="text-(--color-primary) hover:underline">
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 md:py-32 bg-(--color-background)">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <Link 
            to="/projects"
            className="inline-flex items-center text-(--color-text-secondary) hover:text-(--color-primary) mb-8"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Projects
          </Link>

          <div className="bg-(--color-paper) rounded-lg overflow-hidden shadow-xl">
            <div className="relative h-[400px]">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center text-white mb-4">
                  <Calendar size={16} className="mr-2" />
                  <span>{project.date}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {project.title}
                </h1>
                <p className="text-white/80 text-lg max-w-2xl">
                  {project.description}
                </p>
              </div>
            </div>

            <div className="p-8">
              <div className="flex flex-wrap gap-3 mb-8">
                {project.technologies.map((tech, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-full bg-(--color-primary) bg-opacity-10 text-(--color-primary) text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
                <p className="text-(--color-text-secondary)">
                  {project.fullDescription}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Key Features</h3>
                    <ul className="space-y-2">
                      {project.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-(--color-text-secondary)">
                          <span className="w-2 h-2 rounded-full bg-(--color-primary) mr-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4">Technical Challenges</h3>
                    <ul className="space-y-2">
                      {project.challenges.map((challenge, index) => (
                        <li key={index} className="flex items-center text-(--color-text-secondary)">
                          <span className="w-2 h-2 rounded-full bg-(--color-accent) mr-3" />
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
                  <div className="bg-(--color-background) p-4 rounded-lg">
                    <h4 className="text-sm text-(--color-text-secondary)">Role</h4>
                    <p className="font-bold">{project.role}</p>
                  </div>
                  <div className="bg-(--color-background) p-4 rounded-lg">
                    <h4 className="text-sm text-(--color-text-secondary)">Duration</h4>
                    <p className="font-bold">{project.duration}</p>
                  </div>
                  <div className="bg-(--color-background) p-4 rounded-lg">
                    <h4 className="text-sm text-(--color-text-secondary)">Completed</h4>
                    <p className="font-bold">{project.date}</p>
                  </div>
                  <div className="bg-(--color-background) p-4 rounded-lg">
                    <h4 className="text-sm text-(--color-text-secondary)">Tech Stack</h4>
                    <p className="font-bold">{project.technologies.length} Technologies</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4">
                <a 
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline flex items-center"
                >
                  <Github size={20} className="mr-2" />
                  View Source
                </a>
                <a 
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary flex items-center"
                >
                  <ExternalLink size={20} className="mr-2" />
                  Live Demo
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetail;