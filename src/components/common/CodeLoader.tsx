import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CodeLoaderProps {
  onFinish: () => void;
}

const CodeLoader: React.FC<CodeLoaderProps> = ({ onFinish }) => {
  const [displayedLines, setDisplayedLines] = useState<Array<{ text: string; color: string }>>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const codeLines = [
    [
      { text: "import", color: "text-pink-500" },
      { text: " { ", color: "text-gray-200" },
      { text: "Experience", color: "text-yellow-400" },
      { text: " } ", color: "text-gray-200" },
      { text: "from", color: "text-pink-500" },
      { text: " '", color: "text-green-400" },
      { text: "life", color: "text-green-400" },
      { text: "';", color: "text-gray-200" },
    ],
    [
      { text: "import", color: "text-pink-500" },
      { text: " { ", color: "text-gray-200" },
      { text: "Passion", color: "text-yellow-400" },
      { text: " } ", color: "text-gray-200" },
      { text: "from", color: "text-pink-500" },
      { text: " '", color: "text-green-400" },
      { text: "heart", color: "text-green-400" },
      { text: "';", color: "text-gray-200" },
    ],
    [], // Empty line
    [
      { text: "function", color: "text-pink-500" },
      { text: " ", color: "text-gray-200" },
      { text: "init", color: "text-blue-400" },
      { text: "() {", color: "text-gray-200" },
    ],
    [
      { text: "  const", color: "text-pink-500" },
      { text: " portfolio", color: "text-gray-200" },
      { text: " = ", color: "text-gray-200" },
      { text: "new", color: "text-pink-500" },
      { text: " ", color: "text-gray-200" },
      { text: "DevJourney", color: "text-yellow-400" },
      { text: "();", color: "text-gray-200" },
    ],
    [
      { text: "  return", color: "text-pink-500" },
      { text: " ", color: "text-gray-200" },
      { text: "portfolio", color: "text-gray-200" },
      { text: ".", color: "text-gray-200" },
      { text: "render", color: "text-blue-400" },
      { text: "();", color: "text-gray-200" },
    ],
    [
      { text: "}", color: "text-gray-200" },
    ],
    [],
    [
      { text: ">> Build successful...", color: "text-green-500 font-bold" },
    ]
  ];

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (currentLineIndex < codeLines.length) {
      const currentLine = codeLines[currentLineIndex];
      
      // Handle empty lines
      if (currentLine.length === 0) {
        timeout = setTimeout(() => {
          setDisplayedLines(prev => [...prev, { text: "", color: "" }]);
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, 100);
        return () => clearTimeout(timeout);
      }

      // Flatten current line to get total characters
      const flatLine = currentLine.map(segment => segment.text).join('');
      
      if (currentCharIndex < flatLine.length) {
        timeout = setTimeout(() => {
          setCurrentCharIndex(prev => prev + 1);
        }, 30); // Typing speed
      } else {
        // Line finished
        timeout = setTimeout(() => {
          setDisplayedLines(prev => {
            // Reconstruct the full line with colors for the completed line
            // We store the full line structure in displayedLines state
            // But wait, displayedLines needs to store the structure, not just text
            // Let's simplify: displayedLines will store the *completed* lines
            // And we render the *current* line separately
            return prev; 
          });
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, 100); // Pause at end of line
      }
    } else {
      // All lines finished
      timeout = setTimeout(() => {
        onFinish();
      }, 800);
    }

    return () => clearTimeout(timeout);
  }, [currentLineIndex, currentCharIndex, onFinish]);

  // Helper to render the current line being typed
  const renderCurrentLine = () => {
    if (currentLineIndex >= codeLines.length) return null;
    
    const currentLine = codeLines[currentLineIndex];
    if (currentLine.length === 0) return null;

    let charCount = 0;
    const segments = [];

    for (const segment of currentLine) {
      if (charCount >= currentCharIndex) break;

      const remainingChars = currentCharIndex - charCount;
      const textToDisplay = segment.text.slice(0, remainingChars);
      
      segments.push(
        <span key={charCount} className={segment.color}>
          {textToDisplay}
        </span>
      );

      charCount += segment.text.length;
      if (charCount > currentCharIndex) break;
    }

    return segments;
  };

  return (
    <motion.div
      className="fixed inset-0 z-100 flex items-center justify-center bg-[#1e1e1e] font-mono text-sm md:text-base overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-2xl p-8 rounded-lg shadow-2xl bg-[#1e1e1e] border border-gray-800 relative">
        {/* Window Controls */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-[#2d2d2d] rounded-t-lg flex items-center px-4 space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <div className="ml-4 text-xs text-gray-400">main.tsx</div>
        </div>

        <div className="mt-6 font-fira">
          {/* Render completed lines */}
          {codeLines.slice(0, currentLineIndex).map((line, i) => (
            <div key={i} className="min-h-[1.5em] whitespace-pre flex">
              <span className="text-gray-600 mr-4 select-none w-6 text-right">{i + 1}</span>
              <div>
                {line.map((segment, sIndex) => (
                  <span key={sIndex} className={segment.color}>
                    {segment.text}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Render current typing line */}
          {currentLineIndex < codeLines.length && (
            <div className="min-h-[1.5em] whitespace-pre flex">
              <span className="text-gray-600 mr-4 select-none w-6 text-right">{currentLineIndex + 1}</span>
              <div>
                {renderCurrentLine()}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-2 h-5 bg-blue-400 align-middle ml-1"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CodeLoader;
