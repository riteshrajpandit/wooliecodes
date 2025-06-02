import React from 'react';
import Hero from '../components/home/Hero';
import StorySection from '../components/home/StorySection';
import ProjectsPreview from '../components/home/ProjectsPreview';
import ArticlesPreview from '../components/home/ArticlesPreview';
import CodeExperience from '../components/home/CodeExperience';
import ContactCTA from '../components/home/ContactCTA';

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <StorySection />
      <ProjectsPreview />
      <ArticlesPreview />
      <CodeExperience />
      <ContactCTA />
    </div>
  );
};

export default Home;