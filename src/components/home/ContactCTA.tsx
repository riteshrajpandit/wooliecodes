import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Send } from 'lucide-react';

const ContactCTA: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
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
        <div className="max-w-5xl mx-auto bg-[color:var(--color-paper)] rounded-lg shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-6">
                <span className="handwritten text-[color:var(--color-primary)]">Let's Connect</span>
              </h2>
              <p className="text-[color:var(--color-text-secondary)] mb-8">
                Have a project in mind or just want to say hello? Send me a message and I'll get back to you as soon as possible.
              </p>
              
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
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
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800"
                    />
                  </div>
                  
                  <div className="relative">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary w-full relative overflow-hidden"
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
                  className="text-center py-8"
                >
                  <div className="text-[color:var(--color-primary)] mb-4">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-[color:var(--color-text-secondary)]">
                    Thank you for reaching out. I'll get back to you soon!
                  </p>
                </motion.div>
              )}
            </div>
            
            <div className="hidden md:block relative bg-[color:var(--color-primary)] overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 text-xs code text-white">
                  const Contact = () =&gt; {`{`}<br />
                  &nbsp;&nbsp;return &lt;Form /&gt;;<br />
                  {`}`}
                </div>
                <div className="absolute bottom-10 right-10 text-xs code text-white">
                  .send-message {`{`}<br />
                  &nbsp;&nbsp;animation: fly 1s ease-out;<br />
                  {`}`}
                </div>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center p-12">
                <div className="relative w-64 h-64">
                  {/* Paper plane illustration */}
                  <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCTA;