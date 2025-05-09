import { 
  BsArrowRight 
} from 'react-icons/bs';
import React, { useEffect } from "react";
import { 
  FiArrowRight, 
  FiBatteryCharging, 
  FiWifi 
} from "react-icons/fi";
import {
  useMotionTemplate,
  useMotionValue,
  motion, 
  animate,
} from "framer-motion";
import { fadeIn } from '@/variants';
import Link from 'next/link';

const Phone = () => {
  return (
    <div
    style={{
      transformStyle: 'preserve-3d',
      transform: "rotateY(-30deg) rotateX(15deg)" 
    }} 
    className="rounded-[24px] bg-gradient-to-bl from-[#f15090] to-[#d31]">
      <motion.div
      initial={{
        transform: "translateZ(8px) translateY(-2px)",
      }}
      animate={{
        transform: "translateZ(32px) translateY(-8px)",
      }}
      transition={{
        repeat: Infinity,
        repeatType: "mirror",
        duration: 2,
        ease: "easeInOut",
      }}
      className='relative h-96 w-56 rounded-[24px] border-2 border-b-4 border-r-4 border-white border-l-neutral-200 border-t-neutral-200 bg-neutral-900 p-1 pl-[3px] pt-[3px]'>
        <HeaderBar />
        <Screen />
      </motion.div>
    </div>
  )
}

const HeaderBar = () => {
  return (
    <>
      <div className='absolute left-[50%] top-2.5 z-10 h-2 w-16 -translate-x-[50%] rounded-md bg-neutral-900'>
      </div>
      <div className='absolute right-4 top-2 z-10 flex gap-2'>
        <FiWifi className='text-[#f15090]' />
        <FiBatteryCharging className='text-[#f15090]' />
      </div>
    </>
  )
}

const Screen = () => {
  return(
    <div className='relative z-10 grid h-full w-full place-content-center overflow-hidden rounded-[20px] bg-white'>
      <svg
        width="50"
        height="39"
        viewBox="0 0 50 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-[#f15090]"
      >
        <path
          d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
          stopColor="#000000"
        ></path>
        <path
          d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
          stopColor="#000000"
        ></path>
      </svg>

      <button className='absolute bottom-4 left-4 right-4 z-10 rounded-lg border-[1px] bg-white py-2 text-sm font-medium text-[#f15090] backdrop-blur'>
      Contact
      </button>

      <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#f15090] to-[#d31]" />
      {/* <div className="absolute -bottom-72 left-[50%] h-96 w-96 -translate-x-[50%] rounded-full bg-violet-500" /> */}
    </div>
  )
}
const COLORS_TOP = ["#f0f0f0", "#00000", "#d310", "#f15090"];

export default function Contact() {

const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, [color]);

const backgroundImage = useMotionTemplate`radial-gradient(100% 100% at 50% 0%, #020617 50%, ${color})`;

  return (
    <div className="bg-secondary/30">
      <motion.div
      style={{
        backgroundImage,
      }}
      className='grid min-h-screen place-content-center overflow-hidden bg-gray-950 text-gray-200'>
      <div className="mx-auto py-32 lg:px-0 sm:px-4 xl:text-left justify-center h-full w-full max-w-[700px]">
        <motion.h2 
        variants={fadeIn('up', 0.2)}
        initial='hidden'
        animate='show'
        exit='hidden'
        className="h2 mb-10 md:block hidden text-center">Contact Me<span className='text-[#F13024]'>.</span></motion.h2>
        <div className='container flex flex-col items-center mx-auto xl:flex-row px-2 gap-x-2 py-10'>
        <motion.section
        variants={fadeIn('down', 0.5)}
        initial='hidden' 
        animate='show'
        exit='hidden'
        className='grid p-12'>
        <Phone />
        </motion.section>
        <motion.h2 
        variants={fadeIn('up', 0.2)}
        initial='hidden'
        animate='show'
        exit='hidden'
        className="h2 mb-10 block md:hidden text-center">Contact Me<span className='text-[#F13024]'>.</span></motion.h2>
        <motion.form
           variants={fadeIn('up', 0.4)}
           initial='hidden'
           animate='show'
           exit='hidden'
          className=' flex-1 flex flex-col gap-6 w-full mx-auto'>
            <div className='flex gap-x-6 w-full'> 
              <input type='text' placeholder='name' className='input'/>
              <input type='text' placeholder='address' className='input'/>
            </div>
              <input type=' text' placeholder='email' className='input lowercase'/>
              <textarea placeholder='message' className=' textarea'></textarea>
              <Link href="mailto:youremail@example.com?subject=Let's%20Talk&body=Hi%20there%2C%20I%20would%20like%20to%20talk%20about..." 
              className=' btn rounded-full border border-white/50 max-w-[170px] px-8 transition-all duration-300 flex items-center justify-center overflow-hiwdden hover:border-[#F13024] group'>
                <span className=' group-hover:-translate-y-[120%] group-hover:opacity-0 transition-all duration-500 '>Let&apos;s talk</span>
                <BsArrowRight className='-translate-x-[120%] opacity-0 group-hover:flex group-hover:-translate-x-0 group-hover:opacity-100 transition-all duration-300 absolute text-[22px]' />
              </Link>
        </motion.form>
        </div>
      </div>
      </motion.div>
    </div>
  );
}
