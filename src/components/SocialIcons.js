import Link from "next/link"
import { 
  RiYoutubeFill, 
  RiInstagramLine, 
  RiLinkedinLine, 
  RiLinkedinFill, 
  RiTiktokFill, 
  RiGithubFill, 
  RiWhatsappLine 
} from 'react-icons/ri'

export default function SocialIcons() {
  return (
    <div className="flex items-center gap-x-3 text-xl dark:text-white text-black py-4">
      <Link href={'https://www.youtube.com/@Algebra905'} className="text-[#FF0000] hover:text-white transition-all duration-300 overflow-hidden">
        <RiYoutubeFill />
      </Link>
      <Link href={'https://github.com/Ogojoshua905'} className="text-[#1E316D] hover:text-white transition-all duration-300 overflow-hidden">
        <RiGithubFill />
      </Link>
      <Link href={''} className="text-[#E4405F] hover:text-white transition-all duration-300 overflow-hidden">
        <RiInstagramLine />
      </Link>
      <Link href={'https://www.linkedin.com/in/ogo-joshua-9572832a4'} className="hover:text-white text-[#0077B5] transition-all duration-300 overflow-hidden">
        <RiLinkedinFill />
      </Link>
      <Link href={'https://www.tiktok.com/@algebralyrics905'} className="text-[#69C9D0] hover:text-white transition-all duration-300 overflow-hidden">
        <RiTiktokFill />
      </Link>
      <Link href={'https://wa.me/2348090583625'} className="hover:text-white text-[#25D366] transition-all duration-300">
        <RiWhatsappLine />
      </Link>
    </div>
  )
}
