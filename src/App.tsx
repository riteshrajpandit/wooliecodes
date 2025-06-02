import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './context/ThemeContext';
import { motion } from 'framer-motion';
import CustomCursor from './components/common/CustomCursor';
import '@fontsource/urbanist/400.css';
import '@fontsource/urbanist/500.css';
import '@fontsource/urbanist/700.css';
import '@fontsource/fira-code/400.css';
import '@fontsource/fira-code/500.css';
import '@fontsource/caveat/400.css';
import '@fontsource/caveat/700.css';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="app-container"
        >
          <CustomCursor />
          <AppRoutes />
        </motion.div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;