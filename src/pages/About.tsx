import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Target, Users, Shield, CheckCircle, GraduationCap } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const team = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    credentials: "Ph.D. in Education, MBA",
  },
  {
    name: "James Wilson",
    role: "Director of Education",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
    credentials: "Ed.D., Certified Administrator",
  },
  {
    name: "Dr. Emily Chen",
    role: "Chief Academic Officer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
    credentials: "Ph.D. in Curriculum Design",
  },
  {
    name: "Michael Roberts",
    role: "Director of Compliance",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    credentials: "JD, Compliance Specialist",
  },
];

const accreditations = [
  {
    title: "Standards-Aligned Provider",
    description: "Designed and implemented using ANSI 1-2018 as a guiding framework while preparing to apply",
    icon: Award,
  },
  {
    title: "Quality Assurance",
    description: "Rigorous quality control and continuous improvement processes",
    icon: Shield,
  },
  {
    title: "Industry Recognition",
    description: "Courses recognized by major industry associations and employers",
    icon: CheckCircle,
  },
];

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
                Empowering professionals worldwide through quality continuing education
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section id="mission" className="py-16 md:py-24 scroll-mt-24">
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
                  Funtology Global Institute is committed to delivering high-quality, professional 
                  continuing education programs designed to enhance workforce competency, promote 
                  career advancement, and support lifelong learning.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  We believe that education should be accessible, engaging, and directly applicable 
                  to real-world professional challenges. Our courses are developed by industry experts 
                  and designed to meet the highest standards of continuing education.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-secondary mt-1" />
                    <span className="text-foreground">CE Standards-Aligned</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-secondary mt-1" />
                    <span className="text-foreground">100% Online Learning</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-secondary mt-1" />
                    <span className="text-foreground">Expert Instructors</span>
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
                The principles that guide everything we do
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
        <section id="accreditation" className="py-16 md:py-24 scroll-mt-24">
          <div className="container-wide">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                Standards & Recognition
              </h2>
              <p className="text-muted-foreground">
                Our commitment to quality is backed by recognized accreditation
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
        </section>

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
                Industry experts dedicated to your professional growth
              </p>
            </motion.div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
                  <p className="text-secondary font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.credentials}</p>
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
