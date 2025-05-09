import { Orbitron } from "next/font/google";
import Link from "next/link";
import SocialIcons from "./SocialIcons";

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '500', '600', '700', '800']
})

export default function Header() {
  return (
    <header className="absolute w-full flex items-center px-16 xl:px-0 xl:h-[90px]">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-y-6 py-8">
          <Link href={'/'}>
            <svg width="200" height="35" viewBox="0 0 270 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <style>
                {`
                  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600&display=swap');
                  .custom-font {
                    font-family: 'Orbitron', sans-serif;
                    font-weight: 400;
                  }
                  .black-text {
                    fill: white;
                  }
                  .accent-text {
                    fill: #F13024;
                  }
                `}
              </style>
              <text x="15" y="24" className="custom-font black-text" fontSize="20">Byte</text>
              <text x="75" y="24" className="custom-font accent-text" fontSize="20">Prowler</text>
            </svg>
          </Link>
          <SocialIcons />
        </div>
      </div>
    </header>
  );
}
