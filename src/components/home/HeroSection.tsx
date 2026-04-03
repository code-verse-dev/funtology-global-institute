import { motion } from "framer-motion";
import { ArrowRight, Award, BookOpen, Users, Play, Sparkles, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const heroFeatures = [
  {
    title: "Interactive Digital Learning Format",
    subheading: "Engaging, hands-on instruction combining theory, application, and real-world scenarios",
  },
  {
    title: "Earn Documented Learning Hours",
    subheading: "Structured instructional time aligned with measurable learning objectives",
  },
  {
    title: "Get Certified",
    subheading: "Receive a certificate upon successful completion (minimum 70% passing score)",
  },
  {
    title: "Explore Career Pathways",
    subheading: "Funtology • Barbertology • Nailtology • Skintology • Entrepreneurship",
  },
  {
    title: "Advance Your Learning Journey",
    subheading: "Flexible, scalable programs for individuals, groups, and organizations",
  },
] as const;

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/15 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -30, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(43 65% 59%) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(43 65% 59%) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="container-wide relative z-10 pt-28 md:pt-32 pb-16 md:pb-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <Award className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">
              Funtology Global Institute for Career Innovation (FGI) 
              </span>
              <Sparkles className="w-4 h-4 text-secondary" />
            </motion.div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
              Advance Your
              <motion.span 
                className="block text-gradient-gold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Professional Career
              </motion.span>
            </h1>

            <motion.p 
              className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {/* Elevate your expertise with standards-aligned ongoing education programs. 
              Earn recognized certifications that advance your career and demonstrate mastery. */}
              Elevate your expertise, ongoing education programs designed to support career readiness, workforce development, and professional growth.
              <br />
              <br />
              Earn recognized certifications that validate skill development, strengthen resumes, and demonstrate mastery of essential career competencies.
            </motion.p>

            {/* Feature List */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-8 max-w-2xl mx-auto lg:mx-0 justify-items-center lg:justify-items-stretch"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {heroFeatures.map(({ title, subheading }, index) => (
                <motion.div
                  key={title}
                  className="flex items-start gap-3 text-left w-full max-w-sm sm:max-w-none"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-semibold text-primary-foreground leading-snug">{title}</p>
                    <p className="text-xs font-normal text-primary-foreground/60 leading-relaxed">{subheading}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button 
                size="xl" 
                variant="secondary" 
                className="font-heading font-semibold text-lg shadow-gold hover:shadow-lg transition-all duration-300 group"
                asChild
              >
                <Link to="/courses">
                  Explore Courses
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Link>
              </Button>
              <Button 
                size="xl" 
                variant="outline" 
                className="font-heading font-semibold text-lg border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground group"
                asChild
              >
                <Link to="/about">
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Learn More
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-4 md:gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {[
                // { value: "10K+", label: "Certified Professionals" },
                { value: "50+", label: "Courses Available" },
                { value: "98%", label: "Satisfaction Rate" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  className="text-center lg:text-left"
                >
                  <motion.p 
                    className="font-heading text-3xl md:text-4xl font-bold text-secondary"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-xs md:text-sm text-primary-foreground/60">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Main Card */}
            <div className="relative">
              <motion.div
                className="bg-card/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-border/50"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <motion.div 
                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-gold-dark flex items-center justify-center shadow-lg"
                    whileHover={{ rotate: 10 }}
                  >
                    <BookOpen className="w-7 h-7 text-secondary-foreground" />
                  </motion.div>
                  <div>
                    <p className="font-heading font-bold text-foreground text-lg">Featured Course</p>
                    {/* <p className="text-sm text-muted-foreground">Start your journey today</p> */}
                  </div>
                </div>
                
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  Start Your Journey Today
                </h3>
                <p className="text-muted-foreground mb-6">
                A comprehensive training program designed with standards-aligned on-going education hours to build measurable skills that support career advancement.
                </p>

                {/* Progress Preview */}
                <div className="bg-muted rounded-lg p-4 mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Course Progress</span>
                    <span className="font-semibold text-secondary">75%</span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-secondary to-gold-light rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">2,340 enrolled</span>
                  </div>
                  {/* <div className="flex items-center gap-1">
                    <Award className="w-5 h-5 text-secondary" />
                    <span className="text-sm font-bold text-secondary">40 CE Hours</span>
                  </div> */}
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-6 -right-6 bg-gradient-to-br from-secondary to-gold-dark text-secondary-foreground rounded-xl p-4 shadow-gold"
                animate={{ rotate: [0, 5, 0, -5, 0], y: [0, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Award className="w-8 h-8" />
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-card rounded-xl p-4 shadow-xl border border-border"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="w-3 h-3 rounded-full bg-green-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-sm font-medium text-foreground">Certificate Issued</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute top-1/2 -right-8 bg-primary text-primary-foreground rounded-xl p-3 shadow-lg"
                animate={{ x: [0, 5, 0], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <span className="text-xs font-medium">New Course!</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-secondary"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
