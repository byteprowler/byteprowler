import { 
  FaAccessibleIcon, 
  FaLaptop 
} from "react-icons/fa";
import {
  RxPencil2,
  RxDesktop,
  RxReader,
  RxRocket,
  RxArrowTopRight,
  RxGlobe,
  RxHome,
  RxGear,
  RxLaptop,
} from "react-icons/rx";
import { 
  useEffect ,
  useRef
} from "react";
import { AiOutlineMobile } from "react-icons/ai";
import {
  BsTools, 
  BsLaptop 
} from "react-icons/bs"
import {IoMdColorPalette, IoMdSearch} from 'react-icons/io'
import {
  motion, 
  animate,
  useMotionValue,
  useMotionTemplate
 } from "framer-motion"
import { fadeIn } from "@/variants"

const serviceData = [
  {
    icon: <RxGlobe />,
    title: 'Website Design and Development',
    description: 'Create stunning, responsive websites that look great on any device, tailored to meet your business needs.',
  },
  {
    icon: <IoMdColorPalette />,
    title: 'UI/UX Design',
    description: 'Design intuitive and engaging user interfaces that provide an exceptional user experience through thoughtful research and testing.',
  },
  {
    icon: <RxDesktop />,
    title: 'Web App Development',
    description: 'Build dynamic and interactive web applications that offer seamless performance and integrate smoothly with backend services.',
  },
  {
    icon: <RxReader />,
    title: 'Copywriting',
    description: 'Craft compelling and persuasive content that engages your audience, enhances your brand voice, and drives conversions.',
  },
  {
    icon: <IoMdSearch />,
    title: 'SEO Optimization',
    description: 'Improve your website’s search engine rankings through effective keyword research, on-page and technical SEO, and quality content creation.',
  },
  {
    icon: <RxRocket />,
    title: 'Performance Optimization',
    description: 'Enhance website speed and performance through comprehensive audits and optimizations to ensure fast loading times and smooth user experience.',
  },
  {
    icon: <AiOutlineMobile />,
    title: 'Responsive Design',
    description: 'Ensure your website is fully responsive and mobile-friendly, providing an optimal viewing experience across all devices.',
  },
  {
    icon: <RxHome />,
    title: 'Landing Page Design',
    description: 'Develop high-converting landing pages optimized for marketing campaigns to drive user engagement and conversions.',
  },
  {
    icon: <RxPencil2 />,
    title: 'HTML/CSS Development',
    description: 'Convert design mockups into clean, efficient HTML and CSS code, ensuring your website is visually appealing and functional.',
  },
  {
    icon: <RxGear />,
    title: 'JavaScript Development',
    description: 'Convert design mockups into clean, efficient HTML and CSS code, ensuring your website is visually appealing and functional.',
  },
  {
    icon: <BsTools />,
    title: 'Website Maintenance',
    description: 'Provide ongoing website maintenance and support, including regular updates, security checks, and bug fixes to keep your site running smoothly.',
  },
  {
    icon: <FaAccessibleIcon />,
    title: 'Accessibility Optimization',
    description: 'Ensure your website meets accessibility standards, making it usable for everyone, including people with disabilities. ',
  },
  
  {
    icon: <RxLaptop />,
    title: 'Freelance',
    description: 'Flexible and professional freelance web development services tailored to meet the specific needs and timelines of your projects.',
  },
];

const COLORS_TOP = ["#f0f0f0", "#00000", "#d310", "#f15090"];

export default function Services() {

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
      backgroundImage
    }}
     className="min-h-screen">
      <div className="py-36">
        <h1 className="h1 text-center text-white">Our Services<span className="text-3xl text-accent">.</span></h1>
        <motion.p
          variants={fadeIn('up', 0.4)}
          initial='hidden'
          animate='show'
          exit='hidden'
          className=' mb-4 max-w-[400px] mx-auto text-center text-white'>We offer a variety of services to meet your needs, including web development, UI/UX design, and more. Let&apos;s work together to bring your ideas to life.</motion.p>
          <div className="grid mx-auto max-w-7xl grid-flow-dense grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-10 mt-10">
          {
            serviceData.map((service, index) => (
            <motion.div
              key={index}
              variants={fadeIn('up', 0.2 + index * 0.1)}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="p-6 bg-white/10 rounded-lg shadow-lg text-center text-white"
            >
              <div className="text-4xl mb-4">
                {service.icon}
              </div>
              <h2 className="text-xl font-semibold mb-2 text-accent">{service.title}</h2>
              <p className="text-base text-white">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
