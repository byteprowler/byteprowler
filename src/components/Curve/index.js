import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const anim = (variants) => ({
  initial: 'initial',
  animate: 'enter',
  exit: 'exit',
  variants
});

const SVG = ({ width, height }) => {
  const initialPath = `
    M0 300
    Q${width / 2} 0 ${width} 300
    L${width} ${height + 300}
    Q${width / 2} ${height + 600} 0 ${height + 300}
    L0 300
  `;
  const targetPath = `
    M0 300
    Q${width / 2} 0 ${width} 300
    L${width} ${height}
    Q${width / 2} ${height} 0 ${height}
    L0 300
  `;

  const curve = {
    initial: {
      d: initialPath,
    },
    enter: {
      d: targetPath,
      transition: {
        duration: 0.75,
        delay: 0.3,
        ease: [0.76, 0, 0.24, 1],
      },
    },
    exit: {
      d: initialPath,
      transition: {
        duration: 0.75,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  const slides = {
    initial: {
      top: '-300px',
    },
    enter: {
      top: '-100vh',
      transition: {
        duration: .75,
        ease: [0.76, 0, 0.24, 1],
      },
      transitionEnd: {
        top: '100vh',
      },
    },
    exit: {
      top: '-300px',
      transition: {
        duration: 0.75,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };


  return (
    <motion.svg {...anim(slides)}>
      <motion.path {...anim(curve)} fill="currentColor"></motion.path>
    </motion.svg>
  );
};

const routes = {
  '/': ".Home",
  '/about': ".About",
  '/projects': ".Projects",
  '/services': ".Services",
  '/contact': ".Contact",
}

export default function Curve({ children }) {
  const router = useRouter();
  const [dimension, setDimension] = useState({
    height: 0,
    width: 0,
  });

  useEffect(() => {
    const resize = () => {
      setDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const text = {
    initial: {
      opacity: 1,
    },
    enter: {
      opacity: 0,
      top: -100,
      transition: {
        duration: .75,
        ease: [0.76, 0, 0.24, 1],
      },
    }
  }

  return (
    <div className="page curve">
      <motion.p {...anim(text)} className='route h1'>{routes[router.route]}</motion.p>
      <div style={{ opacity: dimension.width > 0 ? 0 : 1 }} className="background"></div>
      {dimension.width > 0 && <SVG {...dimension} />}
      {children}
    </div>
  );
} 