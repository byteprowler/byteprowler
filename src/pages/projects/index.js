import Curve from '@/components/Curve'
import { useRef, useEffect } from 'react'
import { BsArrowRight } from 'react-icons/bs'
import { motion, useTransform, useScroll, useMotionTemplate, useMotionValue, animate, color } from 'framer-motion'
import { fadeIn } from '@/variants'
import Link from 'next/link'

const cards = [
  {
    url: "/tgn.png",
    title: "TGN",
    id: 1,
    link: "https://tgn-two.vercel.app/",
  },
  {
    url: "/de-clothing.png",
    title: "De-Clothing",
    id: 2,
    link: "https://de-clothing.vercel.app",
    color: "#6b21a8",
  },
  {
    url: "/j&lpowertools.png",
    title: "J&L Powertools",
    id: 3, 
    link: "https://seo-optimized.vercel.app",
  },
  {
    id: 4,
    url: "/byteprowler.png",
    title: "Portfolio",
    link: "https://byteprowler.vercel.app",
  },
  {
    id: 5,
    url: "/blank.jpg",
    title: "Project 5",
    link: "",
  },
  {
    id: 6,
    url: "/blank.jpg",
    title: "Project 6",
  },
  {
    id: 7,
    url: "/blank.jpg",
    title: "Project 7",
    link: "",
  },
];

const COLORS_TOP = ["#f0f0f0", "#00000", "#d310", "#f15090"];

const Card = ({ card }) => {
  return (
    <Link
      key={card.id}
      href={`${card.link}`}
      className="group relative h-[450px] w-[450px] rounded-lg shadow-md overflow-hidden bg-neutral-200"
    >
      <div
        style={{
          backgroundImage: `url(${card.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 z-10 grid place-content-center">
        <p className="bg-gradient-to-br from-white/20 to-white/0 p-8 text-4xl font-black uppercase group-hover:translate-x-0 translate-x-[500%] transition-all duration-300 delay-150 text-white backdrop-blur-lg">
          {card.title}
        </p>
      </div>
    </Link>
  );
};

const HorizontalScrollCarousel = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
      target: targetRef,
    });
  
    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-60%"]);
  
    return (
      <section ref={targetRef} className="relative h-[300vh]">
        <div className="sticky z-[0] top-0 flex h-screen items-center overflow-hidden">
          <motion.div style={{ x }} className="flex gap-4">
            {cards.map((card) => {
              return(
               <Card card={card} key={card.id} />
              )
            })}
          </motion.div>
        </div>
      </section>
    );
};

export default function Projects() {

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

  return (
      <motion.div
      style={{
        backgroundImage,
      }}
      className='py-36 min-h-screen text-white place-content-center px-4'>
        <div>
        <motion.h2
        variants={fadeIn('up', .4)}
        initial="hidden"
        animate="show"
        exit="hidden"
        className='h1 text-center text-white'>My Projects<span className='text-[#F13024]'>.</span></motion.h2>
        <motion.p
        variants={fadeIn('up', .5)}
        initial="hidden"
        animate="show"
        exit="hidden"
        className='text-center mb-4 max-w-[400px] mx-auto text-white'>Here are some of the projects I&apos;ve worked on, showcasing my skills in web development, design, and more. Explore my work and see what I can do for you.</motion.p>
        <motion.div
        variants={fadeIn('down', .6)}
        initial="hidden"
        animate="show"
        exit="hidden">
      <div className="flex h-48 items-center justify-center">
      <span className="font-semibold uppercase text-neutral-500 place-content-center">
           Scroll down
         </span>
       </div>
       <HorizontalScrollCarousel />
       <div className="flex h-40 items-center justify-center">
         <span className="font-semibold backdrop-blur-lg uppercase text-neutral-500">
           Sorry About the Blank Space Projects are to Be Uploaded Soon
         </span>
       </div>
     </motion.div>
        </div>
      </motion.div>
  )
}
