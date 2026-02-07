import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Instagram, Twitter, ArrowUp } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-(--color-paper) pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and brief description */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block -ml-8">
              <img 
                src="/logo/logo.svg" 
                alt="Logo" 
                className="h-40 w-auto object-contain"
                style={{ 
                  filter: 'drop-shadow(0 0 0 var(--color-paper))',
                  background: 'transparent'
                }}
              />
            </Link>
            <p className="text-(--color-text-secondary) mb-6 max-w-md">
              Exploring the intersection of code, creativity, and storytelling. Join me on this journey through technology and art.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/riteshrajpandit/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
                aria-label="GitHub"
              >
                <Github size={24} />
              </a>
              <a 
                href="https://linkedin.com/in/riteshrajpandit/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
              <a 
                href="https://x.com/riteshrajpandit/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={24} />
              </a>
              <a 
                href="https://instagram.com/riteshrajpandit/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-bold mb-4">Navigation</h3>
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="text-(--color-text-secondary) hover:text-(--color-primary) transition-colors">Home</Link>
              <Link to="/about" className="text-(--color-text-secondary) hover:text-(--color-primary) transition-colors">About</Link>
              <Link to="/projects" className="text-(--color-text-secondary) hover:text-(--color-primary) transition-colors">Projects</Link>
              <Link to="/articles" className="text-(--color-text-secondary) hover:text-(--color-primary) transition-colors">Articles</Link>
              <Link to="/gallery" className="text-(--color-text-secondary) hover:text-(--color-primary) transition-colors">Gallery</Link>
              <Link to="/contact" className="text-(--color-text-secondary) hover:text-(--color-primary) transition-colors">Contact</Link>
            </nav>
          </div>

          {/* Legal & More */}
          <div>
            <h3 className="text-lg font-bold mb-4">Legal & More</h3>
            <nav className="flex flex-col space-y-3">
              <Link to="/privacy" className="text-(--color-text-secondary) hover:text-(--color-primary) transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-(--color-text-secondary) hover:text-(--color-primary) transition-colors">Terms of Use</Link>
              <Link to="/sitemap" className="text-(--color-text-secondary) hover:text-(--color-primary) transition-colors">Sitemap</Link>
              <button 
                onClick={scrollToTop}
                className="text-left text-(--color-text-secondary) hover:text-(--color-primary) transition-colors flex items-center space-x-2"
              >
                <span>Back to Top</span>
                <ArrowUp size={16} />
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-(--color-text-secondary) border-opacity-20 mt-12 pt-8 text-center text-(--color-text-secondary)">
          <p>© {currentYear} WoolieCodes. All rights reserved.</p>
          <p className="mt-2 text-sm">
            <span className="handwritten text-base">Crafted with passion and code</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;