import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Hero from '../components/home/Hero';
import StorySection from '../components/home/StorySection';
import ProjectsPreview from '../components/home/ProjectsPreview';
import ArticlesPreview from '../components/home/ArticlesPreview';
import CodeExperience from '../components/home/CodeExperience';
import ContactCTA from '../components/home/ContactCTA';
import CodeLoader from '../components/common/CodeLoader';

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we've already shown the loader this session
    const hasLoaded = sessionStorage.getItem('hasLoadedHome');
    if (hasLoaded) {
      setIsLoading(false);
    }
  }, []);

  const handleFinishLoading = () => {
    setIsLoading(false);
    sessionStorage.setItem('hasLoadedHome', 'true');
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {isLoading && <CodeLoader onFinish={handleFinishLoading} />}
      </AnimatePresence>
      
      {!isLoading && (
        <>
          <Hero />
          <StorySection />
          <ProjectsPreview />
          <ArticlesPreview />
          <CodeExperience />
          <ContactCTA />
        </>
      )}
    </div>
  );
};

export default Home;