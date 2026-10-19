import React, { useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { RiGithubLine } from "react-icons/ri";
import { FiLinkedin } from "react-icons/fi";
import { 
  Send, 
  Mail, 
  FileText, 
  CheckCircle2, 
  Wifi, 
  Cpu, 
  Globe2, 
  Clock,
  ChevronRight
} from "lucide-react";
import TerminalCard from "../ui/TerminalCard";
import { siteSettings } from "../../lib/content/siteSettings";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import ResumeProtocol from "../ui/ResumeProtocol";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface ContactApiResponse {
  success?: boolean;
  message?: string;
}

const contactApiBaseUrl = process.env.NEXT_PUBLIC_CONTACT_API_URL;

function getContactEndpoint() {
  if (!contactApiBaseUrl) {
    return "/api/contact";
  }

  return `${contactApiBaseUrl.replace(/\/$/, "")}/api/contact/send/`;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeConsoleLog, setActiveConsoleLog] = useState<string>("[SYS_READY] Ready to transmit secure uplink session.");
  const [isResumeProtocolOpen, setIsResumeProtocolOpen] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear validation error if any when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const tempErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      tempErrors.name = "INTEGRITY_ERR: Name signature is required.";
    }
    
    if (!formData.email.trim()) {
      tempErrors.email = "INTEGRITY_ERR: Return signal email is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        tempErrors.email = "DECRYPT_ERR: Invalid target email protocol formatting.";
      }
    }
    
    if (!formData.subject.trim()) {
      tempErrors.subject = "INTEGRITY_ERR: Subject identifier is required.";
    }
    
    if (!formData.message.trim()) {
      tempErrors.message = "INTEGRITY_ERR: Command message payload cannot be empty.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }

    if (!validateForm()) {
      setActiveConsoleLog("[SYS_ERR] Transmission validation failed check headers. Re-verify inputs.");
      return;
    }

    setIsSubmitting(true);
    setActiveConsoleLog("[SYS_PROC] Securing transport layer tunnels... Establishing handshake.");

    try {
      const contactEndpoint = getContactEndpoint();

      // Future ProwlerLabs idea: build a private CRM/admin dashboard for leads and project inquiries.
      const response = await fetch(contactEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const resData = (await response.json().catch(() => ({}))) as ContactApiResponse;

      if (!response.ok || resData.success === false) {
        throw new Error(resData.message || "CONTACT_TRANSMISSION_FAILED");
      }

      setIsSubmitting(false);
      setSubmitSuccess(true);
      setActiveConsoleLog(
        `[SYS_SUCCESS] ${resData.message || "Transmission secure. Message received."}`
      );
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Auto-reset state message after a few seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        setActiveConsoleLog("[SYS_READY] Transmitters stabilized. Awaiting subsequent inputs.");
      }, 5000);
    } catch (err: unknown) {
      setIsSubmitting(false);
      const errorMessage = err instanceof Error ? err.message : "";
      setActiveConsoleLog(
        errorMessage === "DUPLICATE_SIGNAL: This message was already received recently."
          ? "[SYS_WARN] Duplicate transmission detected. Message already received recently."
          : "[SYS_ERR] Message could not be sent. Please try again later."
      );
    }
  };

  return (
    <section id="contact" className="py-12 md:py-24 border-t border-neon-lime/5 scroll-mt-20">
      
      {/* Section Indicator HUD */}
      <div className="flex items-center gap-2 mb-8 font-mono text-sm text-gray-300">
        <span className="text-neon-lime font-mono">[07]</span>
        <span className="tracking-widest font-semibold uppercase">UPLINK_COMMUNICATION_WIDGET</span>
        <div className="grow h-px bg-neon-lime/10"></div>
        <span className="text-[11px] text-neon-lime/40 uppercase">GATEWAY_ONLINE</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Form Section (Transmit Console) */}
        <div className="lg:col-span-7 flex flex-col">
          <TerminalCard
            title="transmission_panel.cfg"
            command="./uplink --secure-post"
            accentColor="lime"
            className="h-full flex flex-col justify-between"
          >
            <div className="flex flex-col gap-6">
              
              <div className="flex flex-col gap-1 border-b border-white/5 pb-3">
                <h3 className="text-lg font-bold text-white uppercase font-sans tracking-tight">
                  Initialize Uplink
                </h3>

                <span className="text-[11px] font-mono text-gray-300 uppercase tracking-widest">
                  /contact.transmission --channel-direct
                </span>
              </div>

              {/* Secure Input Form Block */}
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                
                {/* Responsive Dual Inputs on Desktop, Single Stack on Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">                  {/* Name field */}
                  <Input
                    id="uplink-name"
                    label="01. SENDER_IDENTITY"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={errors.name}
                    placeholder="e.g. USER_PROBE_01 [Guest]"
                    disabled={isSubmitting}
                    required
                  />                  {/* Return Email field */}
                  <Input
                    id="uplink-email"
                    label="02. RETURN_ADDRESS"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    placeholder="e.g. guest@domain-nexus.com"
                    disabled={isSubmitting}
                    required
                  />

                </div>                {/* Subject field */}
                <Input
                  id="uplink-subject"
                  label="03. ROUTE_SIGNATURE_SUBJECT"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleInputChange}
                  error={errors.subject}
                  placeholder="e.g. SECURE_INTEGRATION_INTERVIEW"
                  disabled={isSubmitting}
                  required
                />                {/* Message field */}
                <Textarea
                  id="uplink-message"
                  label="04. INTEL_TRANSMISSION_PAYLOAD"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  error={errors.message}
                  className="resize-y"
                  placeholder="Input detailed brief, system configurations, stack alignment parameters..."
                  disabled={isSubmitting}
                  required
                />                {/* Submit Trigger control */}
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  variant={isSubmitting ? "secondary" : "primary"}
                  className="w-full tracking-widest"
                >
                  <Send className={`w-4 h-4 ${isSubmitting ? "animate-pulse" : ""}`} />
                  <span className="min-w-0 wrap-break-word">{isSubmitting ? "TRANSMITTING_ENCRYPTED_SIGNAL..." : "EXECUTE_SECURE_TRANSMIT"}</span>
                </Button>

              </form>

              {/* Status Message confirmation log output */}
              {submitSuccess && (
                <div className="border border-neon-green/20 bg-neon-green/5 p-4 rounded-sm flex items-start gap-3 mt-2 font-mono text-[10.5px] leading-relaxed text-gray-300 animate-pulse">
                  <CheckCircle2 className="w-5 h-5 text-neon-green shrink-0 animate-bounce" />
                  <div className="flex flex-col">
                    <span className="text-white font-black uppercase tracking-wider">
                      TRANSMISSION SECURE
                    </span>
                    <span className="mt-0.5 text-neon-green font-bold text-[11px]">
                      Message queued successfully. A decryption handshake reply is routed to your return node address.
                    </span>
                  </div>
                </div>
              )}

            </div>

            {/* Micro console log reporting footer */}
            <div className="border-t border-white/5 mt-6 pt-3 flex items-center gap-2 font-mono text-[11px] text-gray-300 select-none">
              <span className="w-1.5 h-1.5 bg-neon-lime rounded-full"></span>
              <span className="text-neon-lime font-bold uppercase">CONSOLE_LOGGER:</span>
              <span className="min-w-0 wrap-break-word">{activeConsoleLog}</span>
            </div>
          </TerminalCard>
        </div>

        {/* Right Column: Information & Connection details */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          
          {/* Node Status Board Card */}
          <TerminalCard
            title="system_heartbeat.log"
            command="./cat uplink_status"
            accentColor="purple"
            className="grow justify-start h-auto"
          >
            <div className="flex flex-col gap-5">
              
              <div className="flex flex-col gap-1 border-b border-white/5 pb-3">
                <h3 className="text-base font-bold text-white uppercase tracking-tight">
                  UPLINK CONFIGURATION & HEARTBEAT
                </h3>
                <span className="text-[10.5px] font-mono text-gray-300 uppercase tracking-widest">
                  Active connection stats and routing parameters
                </span>
              </div>

              {/* Status Parameter Grid list */}
              <div className="flex flex-col gap-3 font-mono text-xs">
                
                {/* Status node */}
                <div className="flex flex-col gap-1 py-2 border-b border-white/5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-gray-300 font-bold uppercase flex items-center gap-1.5 label text-[11px]">
                    <Wifi className="w-4 h-4" /> System Status
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-neon-green font-bold bg-neon-green/5 border border-neon-green/15 px-2 py-0.5 rounded-sm text-[11px]">
                      ONLINE_GRID
                    </span>
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-neon-green/70 border border-neon-green animate-ping"></span>
                  </div>
                </div>

                {/* Location Node */}
                <div className="flex flex-col gap-1 py-2 border-b border-white/5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-gray-300 font-bold uppercase flex items-center gap-1.5 label text-[11px]">
                    <Globe2 className="w-4 h-4" /> Location Node
                  </span>
                  <span className="text-white font-bold tracking-wider uppercase text-[11px]">
                    Remote / UK_SECTOR_01
                  </span>
                </div>

                {/* Availability Node */}
                <div className="flex flex-col gap-1 py-2 border-b border-white/5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-gray-300 font-bold uppercase flex items-center gap-1.5 label text-[11px]">
                    <Cpu className="w-4 h-4" /> Availability
                  </span>
                  <span className="text-neon-blue font-bold tracking-tight uppercase text-[10.5px] break-words sm:text-right">
                    OPEN_TO_FRONTEND_AND_FULLSTACK
                  </span>
                </div>

                {/* Time Mode Node */}
                <div className="flex flex-col gap-1 py-2 border-b border-white/5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-gray-300 font-bold uppercase flex items-center gap-1.5 label text-[11px]">
                    <Clock className="w-4 h-4" /> Response Mode
                  </span>
                  <span className="text-white font-bold tracking-widest lowercase text-[11px]">
                    async_loop
                  </span>
                </div>

              </div>
              
              <div className="p-3 bg-neon-purple/5 border border-neon-purple/10 rounded-sm text-[11px] text-gray-300 font-mono leading-relaxed mt-2.5">
                <span className="text-white font-bold block uppercase border-b border-white/5 pb-1 mb-1.5 tracking-wider">
                  ENCRYPTION ALIGNED
                </span>
                Messages are validated before transmission. Contact details stay focused on the reply flow,
                not public analytics or exposed client-side secrets.
              </div>

            </div>
          </TerminalCard>

          {/* Social Channels Ports Selector Card */}
          <TerminalCard
            title="external_routes.pkg"
            command="./ls secure_ports_redirect"
            accentColor="blue"
            className="grow h-auto"
          >
            <div className="flex flex-col gap-4">
              
              <div className="flex flex-col gap-1 border-b border-white/5 pb-2">
                <span className="text-[11px] font-mono text-neon-blue font-bold tracking-widest uppercase">
                  ACTIVE ROUTING TARGETS (SECURE_PORTS)
                </span>
              </div>

              {/* Port Links list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-1 font-mono">
                
                {/* Port 80: Github */}
                <Link
                  href={siteSettings.githubUrl}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noopener noreferrer"
                  className="p-3 border border-white/5 bg-black/40 hover:bg-neon-lime/5 hover:border-neon-lime/30 rounded-xs flex items-center justify-between group/port transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-lime focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
                >
                  <div className="flex items-center gap-2">
                    <RiGithubLine className="w-4 h-4 text-neon-lime group-hover/port:scale-110 duration-200" />
                    <div className="flex flex-col">
                      <span className="text-[10.5px] text-white font-bold uppercase">GITHUB</span>
                      <span className="text-[10.5px] text-gray-300 font-semibold tracking-widest uppercase">PORT_080</span>
                    </div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-neon-lime transition-transform duration-200 group-hover/port:translate-x-1" aria-hidden="true" />
                </Link>

                {/* Port 443: LinkedIn */}
                <Link
                  href={siteSettings.linkedinUrl}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noopener noreferrer"
                  className="p-3 border border-white/5 bg-black/40 hover:bg-neon-blue/5 hover:border-neon-blue/30 rounded-xs flex items-center justify-between group/port transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
                >
                  <div className="flex items-center gap-2">
                    <FiLinkedin className="w-4 h-4 text-neon-blue group-hover/port:scale-110 duration-200" />
                    <div className="flex flex-col">
                      <span className="text-[10.5px] text-white font-bold uppercase">LINKEDIN</span>
                      <span className="text-[10.5px] text-gray-300 font-semibold tracking-widest uppercase">PORT_443</span>
                    </div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-neon-blue transition-transform duration-200 group-hover/port:translate-x-1" aria-hidden="true" />
                </Link>

                {/* Port 25: Email channel */}
                <a
                  href={`mailto:${siteSettings.email}`}
                  className="p-3 border border-white/5 bg-black/40 hover:bg-neon-purple/5 hover:border-neon-purple/30 rounded-xs flex items-center justify-between group/port transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-neon-purple group-hover/port:scale-110 duration-200" />
                    <div className="flex flex-col">
                      <span className="text-[10.5px] text-white font-bold uppercase">DIRECT_MAIL</span>
                      <span className="text-[10.5px] text-gray-300 font-semibold tracking-widest uppercase">PORT_025</span>
                    </div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-neon-purple transition-transform duration-200 group-hover/port:translate-x-1" aria-hidden="true" />
                </a>

                {/* Port 22: Resume/System Documentation */}
                <a
                  href={siteSettings.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsResumeProtocolOpen(true);
                    setActiveConsoleLog("[RESUME_PROTOCOL] Role-based resume packet router initialized.");
                  }}
                  className="p-3 border border-white/5 bg-black/40 hover:bg-neon-green/5 hover:border-neon-green/30 rounded-xs flex items-center justify-between group/port transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-neon-green group-hover/port:scale-110 duration-200" />
                    <div className="flex flex-col">
                      <span className="text-[10.5px] text-white font-bold uppercase">RESUME_LOG</span>
                      <span className="text-[10.5px] text-gray-300 font-semibold tracking-widest uppercase">PORT_022</span>
                    </div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-neon-green transition-transform duration-200 group-hover/port:translate-x-1" aria-hidden="true" />
                </a>

              </div>

            </div>
          </TerminalCard>

        </div>

      </div>

      <ResumeProtocol
        isOpen={isResumeProtocolOpen}
        onClose={() => setIsResumeProtocolOpen(false)}
        source="contact"
        fallbackResumeUrl={siteSettings.resumeUrl}
      />
    </section>
  );
}
