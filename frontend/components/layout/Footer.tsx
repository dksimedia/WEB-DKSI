import Link from "next/link";
import Image from "next/image";

interface FooterProps {
  company?: {
    name: string;
    tagline: string;
    email: string;
    phone: string;
  };
  social?: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    email?: string;
  };
  branding?: {
    mainLogo: string;
  };
}

export default function Footer({ company, social, branding }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 dark:bg-gray-900 text-gray-300 py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="relative w-32 h-8">
              <Image
                src={branding?.mainLogo || "/logo/main.png"}
                alt="DKSI"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-sm text-gray-400">{company?.tagline}</p>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-400">Phone: </span>
                {company?.phone}
              </p>
              <p>
                <span className="text-gray-400">Email: </span>
                {company?.email}
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#about" className="hover:text-blue-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-blue-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#portfolio" className="hover:text-blue-400 transition-colors">
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-bold text-white mb-4">Solutions</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#solutions" className="hover:text-blue-400 transition-colors">
                  Infrastructure
                </Link>
              </li>
              <li>
                <Link href="#solutions" className="hover:text-blue-400 transition-colors">
                  Education
                </Link>
              </li>
              <li>
                <Link href="#solutions" className="hover:text-blue-400 transition-colors">
                  Innovation
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-white mb-4">Connect</h4>
            <div className="flex gap-4">
              {social?.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  <i className="ri-linkedin-box-line text-2xl" />
                </a>
              )}
              {social?.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  <i className="ri-instagram-line text-2xl" />
                </a>
              )}
              {social?.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  <i className="ri-twitter-x-line text-2xl" />
                </a>
              )}
              {social?.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  <i className="ri-facebook-circle-line text-2xl" />
                </a>
              )}
              {social?.youtube && (
                <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  <i className="ri-youtube-line text-2xl" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
            <p>&copy; {currentYear} PT Duakawan Sistem Integrator. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <Link href="#" className="hover:text-gray-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-gray-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
