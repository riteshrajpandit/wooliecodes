import React from 'react';
import { useParams } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import Breathe478 from '../components/innovations/Breathe478';

const innovationComponents: { [key: string]: React.ComponentType } = {
  'breathe-478': Breathe478,
};

const InnovationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <NotFound />;
  }

  const InnovationComponent = innovationComponents[id];

  if (!InnovationComponent) {
    return <NotFound />;
  }

  return <InnovationComponent />;
};

export default InnovationPage;
