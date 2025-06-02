import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Send, Mail, Phone, MapPin, Linkedin, Github, Twitter } from 'lucide-react';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const planeControls = useAnimation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Animate paper plane
    await planeControls.start({
      x: [0, -100, -500],
      y: [0, -50, -100],
      opacity: [1, 1, 0],
      scale: [1, 1, 0.5],
      transition: { duration: 1.5, ease: "easeInOut" }
    });
    
    setSubmitted(true);
    setIsSubmitting(false);
  };
  
  return (
    <div className="py-20 md:py-32 bg-[color:var(--color-background)]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="handwritten text-[color:var(--color-primary)]">Let's Connect</span>
            </h1>
            <p className="text-[color:var(--color-text-secondary)] max-w-2xl mx-auto text-lg">
              Have a project in mind or just want to say hello? I'd love to hear from you. Fill out the form below or reach out through one of the provided channels.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              <div className="bg-[color:var(--color-paper)] p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-[color:var(--color-primary)] bg-opacity-10 p-3 rounded-full mr-4">
                      <Mail size={20} className="text-[color:var(--color-primary)]" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <a href="mailto:contact@devjourney.com" className="text-[color:var(--color-primary)] hover:underline">
                        contact@devjourney.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[color:var(--color-primary)] bg-opacity-10 p-3 rounded-full mr-4">
                      <Phone size={20} className="text-[color:var(--color-primary)]" />
                    </div>
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <a href="tel:+11234567890" className="text-[color:var(--color-primary)] hover:underline">
                        +1 (123) 456-7890
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[color:var(--color-primary)] bg-opacity-10 p-3 rounded-full mr-4">
                      <MapPin size={20} className="text-[color:var(--color-primary)]" />
                    </div>
                    <div>
                      <h3 className="font-medium">Location</h3>
                      <p className="text-[color:var(--color-text-secondary)]">San Francisco, CA</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium mb-4">Connect with me</h3>
                  <div className="flex space-x-4">
                    <a 
                      href="https://linkedin.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-[color:var(--color-background)] p-3 rounded-full hover:bg-[color:var(--color-primary)] hover:text-white transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={18} />
                    </a>
                    <a 
                      href="https://github.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-[color:var(--color-background)] p-3 rounded-full hover:bg-[color:var(--color-primary)] hover:text-white transition-colors"
                      aria-label="GitHub"
                    >
                      <Github size={18} />
                    </a>
                    <a 
                      href="https://twitter.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-[color:var(--color-background)] p-3 rounded-full hover:bg-[color:var(--color-primary)] hover:text-white transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter size={18} />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="bg-[color:var(--color-paper)] p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Office Hours</h2>
                <p className="text-[color:var(--color-text-secondary)] mb-4">
                  I'm available for meetings and calls during the following hours:
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 5:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium">By appointment</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-3"
            >
              <div className="bg-[color:var(--color-paper)] p-6 md:p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-[color:var(--color-text-secondary)] mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[color:var(--color-text-secondary)] mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-[color:var(--color-text-secondary)] mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-[color:var(--color-text-secondary)] mb-1">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800"
                      />
                    </div>
                    
                    <div className="relative">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary relative overflow-hidden"
                      >
                        <span className={`flex items-center justify-center transition-opacity ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                          <span>Send Message</span>
                          <Send size={16} className="ml-2" />
                        </span>
                        
                        {isSubmitting && (
                          <motion.div 
                            className="absolute inset-0 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <motion.div 
                              animate={planeControls}
                              className="transform rotate-0"
                            >
                              <Send size={24} className="text-white" />
                            </motion.div>
                          </motion.div>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <div className="text-[color:var(--color-primary)] mb-6">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Message Sent Successfully!</h3>
                    <p className="text-[color:var(--color-text-secondary)] text-lg mb-6">
                      Thank you for reaching out. I'll get back to you as soon as possible.
                    </p>
                    <div className="handwritten text-lg text-[color:var(--color-primary)]">
                      Looking forward to connecting!
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;