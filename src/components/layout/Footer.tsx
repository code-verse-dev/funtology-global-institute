import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram } from "lucide-react";
import fgiLogo from "@/assets/fgi-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/courses" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const policies = [
    { label: "Terms of Service", href: "/policies" },
    { label: "Privacy Policy", href: "/policies" },
    { label: "Refund Policy", href: "/policies" },
    { label: "Accessibility", href: "/policies" },
    { label: "Complaints & Appeals", href: "/policies" },
  ];

  const resources = [
    { label: "Student Portal", href: "/login" },
    { label: "Organization Portal", href: "/login" },
    // { label: "Verify Certificate", href: "/verify" },
    // { label: "FAQ", href: "/#faq" },
    // { label: "Contact", href: "/contact" },
    { label: "Policies", href: "/policies" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img
                src={fgiLogo}
                alt="FGI Logo"
                className="h-28 w-28 object-contain"
              />
              <div>
                <p className="font-heading font-bold text-lg text-primary-foreground leading-tight">
                  Funtology Global
                </p>
                <p className="font-heading text-sm text-secondary leading-tight">
                  Institute
                </p>
              </div>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              Advancing Levels. Elevating Futures. Mastering Innovation and Ongoing Education for Career Excellence
            </p>
            <div className="flex gap-4">
              {/* <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-secondary hover:text-primary transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-secondary hover:text-primary transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a> */}
              <a
                href="https://www.instagram.com/invites/contact/?igsh=7p0xd4gzanzm&utm_content=htmlpeo"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-secondary hover:text-primary transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/share/18MbReEkXY/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-secondary hover:text-primary transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg text-secondary mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-secondary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-heading font-semibold text-lg text-secondary mb-6">
              Resources
            </h4>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-secondary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-lg text-secondary mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-secondary mt-0.5" />
                <a
                  href="mailto:info@funtologyglobal.com"
                  className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                >
                  Info@FuntologyGlobalInstitute.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-secondary mt-0.5" />
                <a
                  href="tel:+17062888082"
                  className="text-primary-foreground/70 hover:text-secondary transition-colors"
                >
                  +1 (706) 288-8082
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary mt-0.5" />
                <span className="text-primary-foreground/70">
                  P.O. Box 5481
                  <br />
                  Augusta, Georgia 30916
                </span>
              </li>
            </ul>

            {/* <div className="mt-6 pt-6 border-t border-primary-foreground/10">
              <h5 className="font-heading font-semibold text-sm text-secondary mb-2">
                Resources
              </h5>
              <ul className="space-y-2">
                {resources.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div> */}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-wide py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/60 text-center md:text-left">
            © {currentYear} Funtology Global Institute for Career Innovation. All rights reserved.
          </p>
          <p className="text-xs text-primary-foreground/50 text-center md:text-right">
            Certificates Issued are Non-Academic Professional Credentials.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
