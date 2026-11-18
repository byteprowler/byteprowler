import { profile } from "./profile";

export interface FooterLink {
  label: string;
  href: string;
}

export interface SiteSettings {
  githubUrl: string;
  linkedinUrl: string;
  lastfmUrl: string;
  anilistUrl: string;
  email: string;
  businessName: string;
  footerText: string;
  discordUrl: string;
  myanimelistUrl: string;
  supportStatus: string;
  resumeUrl: string;
  anilistUsername?: string;
  discordUserId?: string;
  footerLinks: FooterLink[];
}

// Future idea: add a static Discord-style presence card or optional Lanyard-powered presence widget.
// Do not add real Discord RPC to the public portfolio without a clear need.
export const siteSettings: SiteSettings = {
  githubUrl: "https://github.com/byteprowler",
  linkedinUrl: "https://linkedin.com/in/ogo-joshua",
  anilistUrl:  `https://anilist.co/user/${process.env.NEXT_PUBLIC_ANILIST_USERNAME}/`,
  discordUrl: `https://discord.com/users/${process.env.NEXT_PUBLIC_DISCORD_USER_ID}`,
  myanimelistUrl: `https://myanimelist.net/profile/${process.env.NEXT_PUBLIC_ANILIST_USERNAME}`,
  email: "joshuaexcellency1@gmail.com",
  businessName: "ProwlerLabs Digital Solution",
  footerText: "BYTEPROWLER_SYSTEMS",
  supportStatus: "COMMENTED_OUT",
  resumeUrl: profile.resumeUrl,
  lastfmUrl: "https://www.last.fm/user/byteprowler",
  anilistUsername: process.env.NEXT_PUBLIC_ANILIST_USERNAME,
  discordUserId: process.env.NEXT_PUBLIC_DISCORD_USER_ID,
  footerLinks: [
    { label: "GITHUB", href: "https://github.com/byteprowler" },
    { label: "LINKEDIN", href: "https://linkedin.com/in/ogo-joshua" },
    { label: "EMAIL", href: "mailto:joshuaexcellency1@gmail.com" },
    { label: "RESUME", href: profile.resumeUrl },
  ],
};
