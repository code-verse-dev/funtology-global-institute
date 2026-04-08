import { motion } from "framer-motion";
import { BookOpen, ClipboardCheck, Award, FileText, Users, Building2, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Users,
    title: "Register",
    description: "Create Your Account and Set Up Your Learner Profile with Your Credentials",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: BookOpen,
    title: "Enroll",
    description: "Browse Our Courses and Enroll via Payment.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: FileText,
    title: "Learn",
    description: "Access Course Materials in Our Immersive Interactive Digital Learning Format",
    color: "from-green-500 to-green-600",
  },
  {
    icon: ClipboardCheck,
    title: "Assess",
    description: "Complete the Assessment with Minimum 70% Score to Demonstrate Mastery",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: Award,
    title: "Certify",
    description: "Receive Your Ongoing Education Certificate Instantly Upon Successful Completion",
    color: "from-secondary to-gold-dark",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 md:py-28 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
          animate={{ scale: [1.3, 1, 1.3], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <div className="container-wide relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4" />
            Simple & Streamlined
          </motion.div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto">
          From Enrollment to Certification, Our Streamlined Process Makes Earning Your Ongoing Education Credits Straightforward and Efficient.          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-1 bg-gradient-to-r from-secondary/20 via-secondary/40 to-secondary/20">
            <motion.div
              className="h-full bg-gradient-to-r from-secondary to-gold-light"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeOut" }}
              style={{ transformOrigin: "left" }}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                {/* Icon Circle */}
                <motion.div
                  className="relative mx-auto w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-primary-foreground/10 border border-secondary/30 flex items-center justify-center mb-6 z-10 overflow-hidden"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Gradient Background on Hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                  <step.icon className="w-8 h-8 md:w-10 md:h-10 text-secondary relative z-10 group-hover:text-white transition-colors" />
                  
                  {/* Step Number */}
                  <motion.div 
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-secondary-foreground text-sm font-bold flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.2 }}
                  >
                    {index + 1}
                  </motion.div>
                </motion.div>

                <h3 className="font-heading text-xl md:text-2xl font-bold mb-3 text-primary-foreground">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-primary-foreground/70 leading-relaxed px-2">
                  {step.description}
                </p>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="md:hidden flex justify-center my-4"
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6 text-secondary rotate-90" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Organization CTA */}
        <motion.div
          className="mt-16 md:mt-24 bg-gradient-to-r from-primary-foreground/10 to-primary-foreground/5 rounded-3xl p-8 md:p-12 border border-primary-foreground/10 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Decorative */}
          <motion.div
            className="absolute -top-20 -right-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <motion.div 
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary to-gold-dark flex items-center justify-center shadow-gold"
                whileHover={{ rotate: 10 }}
              >
                <Building2 className="w-10 h-10 text-secondary-foreground" />
              </motion.div>
              <div>
                <h3 className="font-heading text-2xl md:text-3xl font-bold mb-2 text-primary-foreground">
                  Organization Accounts
                </h3>
                <p className="text-primary-foreground/70 max-w-md">
                  Bulk Enrollment, Centralized Billing, Comprehensive Progress Tracking, and Dedicated Support for Your Entire Team.
                </p>
              </div>
            </div>
            <Button
              size="lg"
              variant="secondary"
              className="font-heading font-semibold text-lg shadow-gold"
              asChild
            >
              <Link to="/register">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
