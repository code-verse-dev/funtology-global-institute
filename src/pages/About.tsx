import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Award,
  Target,
  Users,
  Shield,
  CheckCircle,
  GraduationCap,
  Sparkles,
  BarChart3,
  Camera,
  CalendarCheck,
  Network,
  Handshake,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Fredrick from "@/assets/Fredrick.png";
import Tequilla from "@/assets/Tequilla.png";

const team = [
  // {
  //   name: "Dr. Sarah Mitchell",
  //   role: "Founder & CEO",
  //   image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
  //   credentials: "Ph.D. in Education, MBA",
  // },
  {
    name: "Frederick",
    // role: "Director of Education",
    // image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
    image: Fredrick,
    // credentials: "Ed.D., Certified Administrator",
  },
  {
    name: "TeQuilla",
    // role: "Chief Academic Officer",
    // image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
    image: Tequilla,
    // credentials: "Ph.D. in Curriculum Design",
  },
  // {
  //   name: "Michael Roberts",
  //   role: "Director of Compliance",
  //   image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
  //   credentials: "JD, Compliance Specialist",
  // },
];

const accreditations = [
  {
    title: "Structured Learning Provider",
    description: "Designed and implemented using a consistent, quality-driven framework to deliver organized and measurable learning experiences.",
    icon: Award,
  },
  {
    title: "Quality Assurance",
    description: "Rigorous Quality Control and Continuous Improvement Processes",
    icon: Shield,
  },
  {
    title: "Industry-Focused Learning",
    description: "As we launch our programs, our commitment to quality is reflected in structured, measurable learning experiences designed to support real-world skill development.",
    icon: CheckCircle,
  },
];

const nationalImpactItems = [
  "50,000+ Students Served",
  "30+ States Reached",
  "500+ Organizations Engaged",
  "Multi-Program Career Pathways",
  "Youth & Adult Workforce Development",
  "Hands-On + Digital Learning Integration",
];

const impactOutcomeItems = [
  "Increased student confidence and self-esteem",
  "Career awareness and pathway exploration",
  "Workforce readiness and entrepreneurial thinking",
  "High engagement and program retention",
];

const programInActionItems = [
  "Active student participation",
  "Hands-on skill development",
  "Instructor-led engagement",
  "Real classroom and program environments",
];

const trustedProvenItems = [
  "Active since 2016 in school systems",
  "Trusted by district leadership",
  "Repeat program adoption",
  "Positive student engagement and outcomes",
];

const ecosystemPrograms = [
  "Funtology – Career Exploration & Creativity",
  "Barbertology – Barbering & Grooming",
  "Nailtology – Nail Technology & Design",
  "Skintology – Skincare & Wellness",
  "iFuntology: Write to Read – Literacy Development",
  "FGI (Funtology Global Institute for Career Innovation) – Ongoing Education & Professional Development Certificates",
];

const programFeatureItems = [
  "Hands-on learning kits",
  "Digital LMS platform",
  "Certification pathways",
  "Instructor training included",
  "Workforce readiness integration",
];

const complianceQualityItems = [
  // "Aligned with International Association for Continuing Education and Training standards (pending)",
  "Built on measurable learning objectives",
  "Supported by assessments and evaluations",
  "Designed for workforce and professional development",
];

const whoWeServeItems = [
  "School Districts",
  "After School Programs",
  "Non-Profit Organizations",
  "Boys & Girls Clubs, YMCA's, Military Bases",
  "Workforce Development Programs",
  "Corporations & Small Businesses",
];

const whatWeProvideItems = [
  "Full program implementation",
  "Student kits & curriculum",
  "Instructor training",
  "Virtual & in-person learning options",
  "Certification programs",
];

const whyFuntologyItems = [
  "Proven National Impact",
  "Multi-Program Career Pathways",
  "Hands-on + Digital Integration",
  "High Student Engagement",
  "Trusted by Schools Since 2016",
  "Scalable for Large Implementations",
  "Built for Workforce Readiness",
];

const aboutImagery = {
  workforce: {
    src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&h=1100&fit=crop&q=80",
    alt: "Learners collaborating on projects in an educational setting",
  },
  trusted: {
    src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&h=700&fit=crop&q=80",
    alt: "School hallway and learning environment representing long-term district partnerships",
  },
  ecosystem: {
    src: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=900&h=1100&fit=crop&q=80",
    alt: "Professional beauty and wellness tools representing career pathway programs",
  },
  compliance: {
    src: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=900&h=700&fit=crop&q=80",
    alt: "Focused study and assessment materials on a desk",
  },
  partnership: {
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&h=700&fit=crop&q=80",
    alt: "Professionals collaborating in a partnership meeting",
  },
  whyBanner: {
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1400&h=560&fit=crop&q=80",
    alt: "Diverse team celebrating collaborative success",
  },
} as const;

function AboutPhoto({
  src,
  alt,
  className = "",
  aspectClassName = "aspect-[4/3]",
}: {
  src: string;
  alt: string;
  className?: string;
  aspectClassName?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`overflow-hidden rounded-2xl border border-border bg-muted shadow-gold ${aspectClassName} ${className}`}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" decoding="async" />
    </motion.div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 text-muted-foreground">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-secondary" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const About = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-16 md:py-24">
          <div className="container-wide">
            <motion.div
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                About Funtology Global Institute
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80">
                Empowering Professionals Worldwide through Quality Ongoing Education
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section id="mission" className="scroll-mt-24 py-16 md:py-24">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-8 h-8 text-secondary" />
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                    Our Mission
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  Funtology Global Institute is committed to delivering high-quality, ongoing education programs designed to enhance workforce competency, promote career advancement, and support lifelong learning
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  We believe that education should be accessible, engaging, and directly applicable to real-world professional challenges. Our courses are developed by industry experts and designed to meet the highest standards of individuals continuing their education.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-secondary mt-1" />
                    <span className="text-foreground">Ongoing Education Standards-Aligned</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-secondary mt-1" />
                    <span className="text-foreground">100% Online Learning</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-secondary mt-1" />
                    <span className="text-foreground">Designed for Individuals & Group Sessions</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-secondary mt-1" />
                    <span className="text-foreground">Immediate Certification</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                  alt="Team collaboration"
                  className="rounded-2xl shadow-gold"
                />
                <div className="absolute -bottom-6 -left-6 bg-secondary text-secondary-foreground p-6 rounded-xl shadow-lg">
                  <p className="font-heading text-4xl font-bold">10K+</p>
                  <p className="text-sm">Professionals Certified</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Master Vetting & Funding Portfolio — workforce narrative */}
        <section id="workforce-readiness" className="scroll-mt-24 border-b border-border bg-muted/20 py-16 md:py-24">
          <div className="container-wide">
            <motion.p
              className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-secondary"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Master Vetting &amp; Funding Portfolio
            </motion.p>
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <motion.div
                className="order-2 lg:order-1"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
              >
                <h2 className="mb-6 font-heading text-3xl font-bold text-foreground md:text-4xl">
                  Transforming Education Into Workforce Readiness
                </h2>
                <p className="mb-4 text-lg text-muted-foreground">
                  Funtology is a nationally implemented career exploration and workforce development system designed to equip youth and adults with real-world skills in beauty, wellness, entrepreneurship, and professional development.
                </p>
                <p className="text-lg text-muted-foreground">
                  Serving 50,000+ students across 30+ states and nearly 500 organizations, Funtology delivers engaging, hands-on learning experiences that build confidence, creativity, and career pathways.
                </p>
                <blockquote className="mt-8 border-l-4 border-secondary pl-6 font-heading text-xl italic text-foreground md:text-2xl">
                  “Where Creativity Meets Career Building.”
                </blockquote>
              </motion.div>
              <div className="order-1 lg:order-2">
                <AboutPhoto
                  src={aboutImagery.workforce.src}
                  alt={aboutImagery.workforce.alt}
                  aspectClassName="aspect-[4/5] w-full max-w-md mx-auto lg:max-w-none lg:mx-0"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="impact" className="scroll-mt-24 py-16 md:py-24">
          <div className="container-wide">
            <motion.div
              className="mb-10 flex items-center gap-3"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <BarChart3 className="h-8 w-8 text-secondary" aria-hidden />
              <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">Proven National Reach &amp; Measurable Impact</h2>
            </motion.div>
            <div className="grid gap-12 lg:grid-cols-2">
              <motion.div initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">Reach</h3>
                <BulletList items={nationalImpactItems} />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">Outcomes</h3>
                <BulletList items={impactOutcomeItems} />
              </motion.div>
            </div>
          </div>
        </section>

        <section id="program-in-action" className="scroll-mt-24 bg-muted/30 py-16 md:py-24">
          <div className="container-wide">
            <motion.div
              className="mb-10 text-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/15 px-4 py-2 text-sm font-medium text-secondary">
                <Camera className="h-4 w-4" aria-hidden />
                Program in Action
              </div>
              <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">Visual Proof</h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Funtology is Not Theoretical—It is Actively Implemented in Schools, Organizations, and Training Environments.
              </p>
            </motion.div>
            <motion.div
              className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">What viewers see</h3>
              <BulletList items={programInActionItems} />
            </motion.div>
          </div>
        </section>

        <section id="trusted-proven" className="scroll-mt-24 py-16 md:py-24">
          <div className="container-wide">
            <motion.div
              className="mb-10 flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <CalendarCheck className="h-8 w-8 text-secondary" aria-hidden />
              <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">Trusted &amp; Proven</h2>
            </motion.div>
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
              <div>
                <motion.p className="mb-6 max-w-2xl text-lg text-muted-foreground" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                  Long-Term Program Implementation
                </motion.p>
                <motion.div className="max-w-xl" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <BulletList items={trustedProvenItems} />
                </motion.div>
              </div>
              <AboutPhoto src={aboutImagery.trusted.src} alt={aboutImagery.trusted.alt} aspectClassName="aspect-[4/3]" />
            </div>
          </div>
        </section>

        <section id="program-ecosystem" className="scroll-mt-24 bg-muted/30 py-16 md:py-24">
          <div className="container-wide">
            <motion.div
              className="mb-10 flex items-center gap-3"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Network className="h-8 w-8 text-secondary" aria-hidden />
              <div>
                <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">Program Ecosystem</h2>
                <p className="mt-2 text-muted-foreground">Comprehensive Career Pathways</p>
              </div>
            </motion.div>
            <p className="mb-8 text-lg text-muted-foreground">Funtology Offers a Full Ecosystem of Programs:</p>
            <div className="grid items-start gap-12 lg:grid-cols-12">
              <motion.ul
                className="space-y-4 lg:col-span-5"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {ecosystemPrograms.map((line) => (
                  <li key={line} className="flex gap-3 rounded-xl border border-border bg-card p-4 text-foreground shadow-sm">
                    <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-secondary" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </motion.ul>
              <div className="lg:col-span-4">
                <AboutPhoto
                  src={aboutImagery.ecosystem.src}
                  alt={aboutImagery.ecosystem.alt}
                  aspectClassName="aspect-[3/4] max-w-sm mx-auto lg:mx-0 lg:max-w-none"
                />
              </div>
              <motion.div
                className="lg:col-span-3"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 }}
              >
                <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">Program features</h3>
                <BulletList items={programFeatureItems} />
              </motion.div>
            </div>
          </div>
        </section>

        <section id="compliance-quality" className="scroll-mt-24 py-16 md:py-24">
          <div className="container-wide">
            <motion.div
              className="mb-10 flex items-center gap-3"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Shield className="h-8 w-8 text-secondary" aria-hidden />
              <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">Compliance &amp; Quality</h2>
            </motion.div>
            <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-14">
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                {/* <h3 className="mb-2 font-heading text-xl font-semibold text-foreground">Standards-Aligned Education</h3>
                <p className="mb-6 text-muted-foreground">
                  Funtology Global Institute for Career Innovation is committed to delivering structured, measurable learning experiences.
                </p> */}
                <p className="mb-4 font-medium text-foreground">Our Programs Are:</p>
                <BulletList items={complianceQualityItems} />
                <blockquote className="mt-10 rounded-2xl border border-secondary/30 bg-secondary/5 p-6 font-medium leading-relaxed text-foreground">
                  “Our Commitment to Quality is Aligned with Continuing Educational Standards to Ensure Structured, Measurable Learning Experiences.”
                </blockquote>
              </motion.div>
              <AboutPhoto src={aboutImagery.compliance.src} alt={aboutImagery.compliance.alt} aspectClassName="aspect-[4/3] lg:sticky lg:top-28" />
            </div>
          </div>
        </section>

        <section id="partnerships" className="scroll-mt-24 bg-muted/30 py-16 md:py-24">
          <div className="container-wide">
            <motion.div
              className="mb-10 flex items-center gap-3"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Handshake className="h-8 w-8 text-secondary" aria-hidden />
              <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">Partnership Opportunities</h2>
            </motion.div>
            <div className="grid items-start gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <AboutPhoto src={aboutImagery.partnership.src} alt={aboutImagery.partnership.alt} aspectClassName="aspect-[4/5] max-w-md mx-auto lg:mx-0" />
              </div>
              <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7">
                <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h3 className="mb-4 font-heading text-xl font-semibold text-foreground">Who We Serve</h3>
                  <BulletList items={whoWeServeItems} />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}>
                  <h3 className="mb-4 font-heading text-xl font-semibold text-foreground">What We Provide</h3>
                  <BulletList items={whatWeProvideItems} />
                </motion.div>What Sets Us Apart?
              </div>
            </div>
          </div>
        </section>

        <section id="why-funtology" className="scroll-mt-24 py-16 md:py-24">
          <div className="container-wide">
            <motion.div
              className="mb-10 text-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">Why Funtology</h2>
              <p className="mt-2 text-muted-foreground">What sets us apart?</p>
            </motion.div>
            <motion.div
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {whyFuntologyItems.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-5 shadow-sm"
                >
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-secondary" aria-hidden />
                  <span className="font-medium text-foreground">{item}</span>
                </div>
              ))}
            </motion.div>
            <motion.div
              className="mt-14 overflow-hidden rounded-2xl border border-border shadow-gold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <img
                src={aboutImagery.whyBanner.src}
                alt={aboutImagery.whyBanner.alt}
                className="h-52 w-full object-cover sm:h-60 md:h-72"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/30">
          <div className="container-wide">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Core Values
              </h2>
              <p className="text-muted-foreground">
                The Principles that Guide Everything We Do
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: GraduationCap, title: "Excellence", description: "We maintain the highest standards in educational content and delivery" },
                { icon: Users, title: "Accessibility", description: "Quality education should be available to all professionals" },
                { icon: Shield, title: "Integrity", description: "We uphold ethical practices in all our operations" },
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  className="text-center p-8 bg-card rounded-2xl border border-border"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Accreditation Section */}
        {/* <section id="accreditation" className="py-16 md:py-24 scroll-mt-24">
          <div className="container-wide">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Standards & Quality
              </h2>
              <p className="text-muted-foreground">
              Our commitment to quality is demonstrated through a structured learning designed to deliver clear, measurable outcomes.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {accreditations.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="p-8 bg-gradient-hero rounded-2xl text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 mb-6">
                    <item.icon className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-primary-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-primary-foreground/80">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Team Section */}
        <section id="team" className="py-16 md:py-24 bg-muted/30 scroll-mt-24">
          <div className="container-wide">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                Meet Our Team
              </h2>
              <p className="text-muted-foreground">
                Industry Experts Dedicated to Your Professional Growth
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  className="text-center group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative mb-6 overflow-hidden rounded-2xl">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-1">
                    {member.name}
                  </h3>
                  {/* <p className="text-secondary font-medium mb-2">{member.role}</p> */}
                  {/* <p className="text-sm text-muted-foreground">{member.credentials}</p> */}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
