import Curve from '@/components/Curve';
import React, { useEffect } from "react";
import { fadeIn } from '@/variants';
import SocialIcons from '@/components/SocialIcons';
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from "framer-motion";
import Link from 'next/link';

const FlipText = ({children}) => {
  return (  
    <motion.span
      initial="initial"
      whileHover="hovered"
      className="relative block overflow-hidden whitespace-nowrap text-4xl font-black uppercase sm:text-4xl md:text-6xl lg:text-7xl text-[#F13024]"
      style={{
        lineHeight: 0.85,
      }}
    >
      <div>
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: {
                y: 0,
              },
              hovered: {
                y: "-100%",
              },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0">
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: {
                y: "100%",
              },
              hovered: {
                y: 0,
              },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
    </motion.span>
  );
};

const DURATION = 0.25;
const STAGGER = 0.025;

const COLORS_TOP = ["#f0f0f0", "#00000", "#d310", "#f15090"];

export default function Index() {

const color = useMotionValue(COLORS_TOP[0]);

    useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, [color]);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  return (
      <motion.section
        style={{
        backgroundImage
      }}
      className="place-content-center min-h-screen py-32 text-center xl:text-left px-4 text-gray-200"
    >
      <div className="flex flex-col items-center">
        <motion.span
        variants={fadeIn('down', .2)}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="mb-1.5 inline-block rounded-full bg-gray-600/50 px-3 py-1.5 text-md">
          ByteProwler
        </motion.span>
        <motion.h1
        variants={fadeIn('up', .4)} 
        initial="hidden"
        animate="show"
        exit="hidden"
        className="max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight">
          Where Code Meets <FlipText>Creativity</FlipText>
        </motion.h1>
        <motion.div
        variants={fadeIn('up', .5)}
        initial="hidden"
        animate="show"
        exit="hidden">
        <SocialIcons />
        </motion.div>
        <Link href={'/projects'}>
        <motion.button
        variants={fadeIn('up', .5)}
        initial="hidden"
        animate="show"
        exit="hidden"
          style={{
            border,
            boxShadow,
          }}
          whileHover={{
            scale: 1.015,
          }}
          whileTap={{
            scale: 0.985,
          }}
          className="group z-10 flex p-4 w-fit items-center gap-1.5 rounded-full bg-gray-950/10 text-gray-50 transition-colors hover:bg-gray-950/50"
        >
          Projects
        </motion.button>
      </Link>
      </div>
    </motion.section>
  )
}