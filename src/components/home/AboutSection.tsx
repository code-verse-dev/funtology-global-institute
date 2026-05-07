import { motion } from "framer-motion";
import { CheckCircle, Target, Shield, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const benefits = [
  // "Designed using ANSI/IACET 1-2018 as a guiding framework",
  "Time-tracked learning for compliance verification",
  "Automated certificate generation upon completion",
  "7-year learner record retention",
  // "ADA-compliant accessible learning platform",
  "Comprehensive course evaluations for continuous improvement",
];

const AboutSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-4">
              About FGI
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
              Excellence in Ongoing Education
            </h2>
            <p className="text-md text-muted-foreground leading-relaxed mb-8">
            Empowering individuals and professionals through standards-based education that delivers measurable learning outcomes and verifiable professional credentials            </p>

            {/* Benefits List */}
            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            <Button size="lg" variant="default" className="font-heading font-semibold" asChild>
              <Link to="/about">Learn More About Us</Link>
            </Button>
          </motion.div>

          {/* Visual Grid */}
          <motion.div
            className="grid grid-cols-2 gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Card 1 */}
            <motion.div
              className="bg-primary rounded-2xl p-6 text-primary-foreground"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Target className="w-10 h-10 text-secondary mb-4" />
              <h3 className="font-heading text-xl font-semibold mb-2">Our Mission</h3>
              <p className="text-sm text-primary-foreground/80">
                Empowering Professionals with Measurable Skills and Recognized Credentials.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              className="bg-secondary rounded-2xl p-6 text-primary mt-8"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Shield className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-heading text-xl font-semibold mb-2">Standards-Aligned</h3>
              <p className="text-sm text-primary/80">
                Our Programs are Thoughtfully Designed to Align with Industry Best Practices, Ensuring High-Quality, Engaging, and Impactful Learning Experiences for Every Participant.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              className="bg-muted rounded-2xl p-6 text-foreground"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Award className="w-10 h-10 text-secondary mb-4" />
              <h3 className="font-heading text-xl font-semibold mb-2">Certified</h3>
              <p className="text-sm text-muted-foreground">
                Earn Professional Certificates Upon Successful Course Completion.
              </p>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              className="bg-gradient-to-br from-primary to-navy-light rounded-2xl p-6 text-primary-foreground mt-8"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                {/* <div>
                  <p className="font-heading text-3xl font-bold text-secondary">10,000+</p>
                  <p className="text-sm text-primary-foreground/70">CE Hours Awarded</p>
                </div> */}
                <div>
                  <p className="font-heading text-3xl font-bold text-secondary">450+</p>
                  <p className="text-sm text-primary-foreground/70">Partner Organizations</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
