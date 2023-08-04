import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface RotatingTextProps {
  texts: string[];
  period: 5000;
}

const RotatingText: React.FC<RotatingTextProps> = ({ texts, period }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, period);

    return () => clearInterval(interval);
  }, [texts, period]);

  return (
    <motion.span
      key={currentTextIndex} // Key to trigger animation on text change
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {texts[currentTextIndex]}
    </motion.span>
  );
};

export default RotatingText;
