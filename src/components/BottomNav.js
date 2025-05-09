import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HiHome, 
  HiUser, 
  HiEnvelope, 
  HiViewColumns, 
  HiRectangleGroup, 
  HiChatBubbleBottomCenterText 
} from 'react-icons/hi2';

const botNav = [
  { name: 'Home', path: '/', icon: <HiHome />, ariaLabel: 'Home' },
  { name: 'About', path: '/about', icon: <HiUser />, ariaLabel: 'About' },
  { name: 'Projects', path: '/projects', icon: <HiViewColumns />, ariaLabel: 'Projects' },
  { name: 'Services', path: '/services', icon: <HiRectangleGroup />, ariaLabel: 'Services' },
  { name: 'Comments', path: '/testimonials', icon: <HiChatBubbleBottomCenterText />, ariaLabel: 'Testimonial' },
  { name: 'Contact', path: '/contact', icon: <HiEnvelope />, ariaLabel: 'Contact' },
];

const SlideTabs = ({ activeTab, setActiveTab }) => {
  const router = useRouter();
  const currentPath = router.pathname;
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  
  return (
    <div
      onMouseLeave={() => {
        setPosition((pv) => ({
          ...pv,
          opacity: 0,
        }));
        setActiveTab(null);
      }}
      className="fixed bottom-5 left-1/2 transform -translate-x-1/2 gap-x-2 flex border-2 transition-colors bg-white/10 backdrop-blur-sm shadow-lg rounded-full p-2 z-50"
    >
      {
          botNav.map((nav, index) => (
            <Tab key={index} setPosition={setPosition} setActiveTab={setActiveTab} index={index}>
              <Link href={nav.path}>
            <div
              aria-label={nav.ariaLabel}
              className={`flex items-center text-center rounded-full ${
                nav.path === currentPath ? 'text-accent' : ''
              } ${activeTab === index ? 'text-white' : 'text-black'}`}
            >
              <span className="text-xl">{nav.icon}</span>
              {/* <span className="md:flex hidden text-xl font-extralight">{nav.name}</span> */}
            </div>
          </Link>
        </Tab>
      ))}
      <div className="hidden md:flex">
        <AnimatedCursor position={position} />
      </div>
    </div>
  );
};

const Tab = ({ children, setPosition, setActiveTab, index }) => {
  const ref = useRef(null);

  return (
    <div
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return;
        const { width } = ref.current.getBoundingClientRect();
        const offsetLeft = ref.current.offsetLeft;

        setPosition({
          left: offsetLeft,
          width,
          opacity: 1,
        });
        setActiveTab(index);
      }}
      className="relative z-10 block cursor-pointer xl:px-2 py-3 sm:py-2 text-xs uppercase md:px-4 md:py-3 md:text-base"
    >
      {children}
    </div>
  );
};

const AnimatedCursor = ({ position }) => {
  return (
    <motion.div
      animate={{
        ...position,
      }}
      className="absolute z-0 text-center h-7 md:h-12 rounded-full bg-black"
    />
  );
};

export default function BottomNav() {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const [activeTab, setActiveTab] = useState(null);

  return (
    <div>
      <SlideTabs className="flex md:flex" position={position} setPosition={setPosition} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}