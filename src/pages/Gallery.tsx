import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const photos = [
    {
      id: 1,
      src: 'https://images.pexels.com/photos/1707820/pexels-photo-1707820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Nature',
      title: 'Mountain Lake'
    },
    {
      id: 2,
      src: 'https://images.pexels.com/photos/3617500/pexels-photo-3617500.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Urban',
      title: 'City Lights'
    },
    {
      id: 3,
      src: 'https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Architecture',
      title: 'Modern Building'
    },
    {
      id: 4,
      src: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Nature',
      title: 'Forest Path'
    },
    {
      id: 5,
      src: 'https://images.pexels.com/photos/1722183/pexels-photo-1722183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Urban',
      title: 'Street Art'
    },
    {
      id: 6,
      src: 'https://images.pexels.com/photos/1738434/pexels-photo-1738434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Architecture',
      title: 'Historic Building'
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <div className="py-20 md:py-32 bg-(--color-background)">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="handwritten text-(--color-primary)">Gallery</span>
          </h1>
          <p className="text-(--color-text-secondary) text-lg mb-12 max-w-2xl">
            A collection of my photography work, capturing moments and perspectives through the lens.
          </p>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                variants={item}
                className="relative group cursor-pointer"
                onClick={() => setSelectedImage(photo.src)}
              >
                <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-gray-800">
                  <img 
                    src={photo.src} 
                    alt={photo.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundColor: 'transparent' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 group-hover:to-black/40 transition-all duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-medium drop-shadow-lg">{photo.category}</p>
                    <h3 className="text-white text-lg font-bold drop-shadow-lg">{photo.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>
            <motion.img
              src={selectedImage}
              alt="Selected photo"
              className="max-w-full max-h-[90vh] object-contain"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;