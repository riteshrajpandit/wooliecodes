import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { X, Maximize2, Terminal, FileCode, Code2 } from 'lucide-react';

const CodeExperience: React.FC = () => {
  const [activeTab, setActiveTab] = useState('component');

  const tabs = [
    { id: 'component', label: 'Component.tsx', icon: <FileCode size={14} /> },
    { id: 'styles', label: 'styles.css', icon: <Code2 size={14} /> },
    { id: 'terminal', label: 'Terminal', icon: <Terminal size={14} /> },
  ];

  const codeSnippets = {
    component: `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles.css';

type CardProps = {
  title: string;
  description: string;
  image: string;
  tags: string[];
};

export const ProjectCard: React.FC<CardProps> = ({
  title,
  description,
  image,
  tags
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="project-card"
      whileHover={{ y: -10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="card-image">
        <img src={image} alt={title} />
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              className="card-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button className="view-button">
                View Project
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="card-content">
        <h3>{title}</h3>
        <p>{description}</p>
        
        <div className="card-tags">
          {tags.map(tag => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};`,
    styles: `.project-card {
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.card-image {
  height: 200px;
  position: relative;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.project-card:hover .card-image img {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(79, 70, 229, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-button {
  padding: 0.75rem 1.5rem;
  background: white;
  color: #4f46e5;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-button:hover {
  background: #f9fafb;
  transform: scale(1.05);
}

.card-content {
  padding: 1.5rem;
}

.card-content h3 {
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.card-content p {
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: #f3f4f6;
  color: #4f46e5;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}`,
    terminal: `$ npm install framer-motion
+ framer-motion@10.16.4
added 19 packages in 3.2s

$ npm run build
> build
> vite build

vite v5.0.0 building for production...
✓ 1256 modules transformed.
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-bfe6e96a.css   38.17 kB │ gzip:  7.34 kB
dist/assets/index-05e94f3b.js   525.82 kB │ gzip: 150.78 kB
✓ built in 8.55s

$ serve -s dist
Serving dist on http://localhost:3000
Connected successfully!`
  };

  return (
    <div className="py-20 md:py-32 bg-[color:var(--color-background)]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="handwritten text-[color:var(--color-primary)]">Chapter 4:</span> Coding Experience
          </h2>
          <p className="text-[color:var(--color-text-secondary)] max-w-2xl mx-auto text-lg">
            A glimpse into my development process. Clean code, modern practices, and attention to detail.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="code-editor rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="code-editor-header">
              <div className="code-editor-tabs flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`code-editor-tab ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex space-x-2">
                <button className="p-1 hover:bg-gray-700 rounded">
                  <Maximize2 size={14} />
                </button>
                <button className="p-1 hover:bg-gray-700 rounded">
                  <X size={14} />
                </button>
              </div>
            </div>
            
            <div className="relative">
              <SyntaxHighlighter
                language={activeTab === 'terminal' ? 'bash' : activeTab === 'styles' ? 'css' : 'typescript'}
                style={vscDarkPlus}
                customStyle={{ margin: 0, borderRadius: 0, maxHeight: '500px' }}
                showLineNumbers={true}
              >
                {codeSnippets[activeTab as keyof typeof codeSnippets]}
              </SyntaxHighlighter>
              
              {/* Interactive cursor effect (optional) */}
              <motion.div 
                className="absolute h-5 w-2 bg-white opacity-50"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.7, 0],
                  x: [100, 100, 100], 
                  y: activeTab === 'component' ? 250 : activeTab === 'styles' ? 150 : 80
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 1.5,
                  repeatDelay: 5
                }}
              />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 text-center text-[color:var(--color-text-secondary)]"
          >
            <p className="handwritten text-lg">Clean, maintainable code is my passion</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CodeExperience;