import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Award, Shield, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <div className="container-wide relative z-10">
        <motion.div
          className="bg-gradient-to-br from-primary via-primary to-navy-light rounded-3xl p-10 md:p-16 lg:p-20 text-center relative overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative Elements */}
          <motion.div 
            className="absolute top-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          
          {/* Floating Badges */}
          <motion.div
            className="absolute top-10 left-10 hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm"
            animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <Award className="w-5 h-5 text-secondary" />
            <span className="text-sm font-medium text-primary-foreground">Certified</span>
          </motion.div>
          
          <motion.div
            className="absolute bottom-10 right-10 hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm"
            animate={{ y: [0, 10, 0], rotate: [5, -5, 5] }}
            transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
          >
            <Shield className="w-5 h-5 text-secondary" />
            <span className="text-sm font-medium text-primary-foreground">Accredited</span>
          </motion.div>

          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="w-4 h-4" />
              Start Your Journey Today
            </motion.div>

            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Ready to Advance
              <span className="block text-gradient-gold mt-2">Your Career?</span>
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Join thousands of professionals earning recognized continuing education 
              credentials. Start your learning journey today with FGI.
            </p>

            {/* Benefits List */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              {["Standards-Aligned", "Interactive Learning", "Instant Certificates"].map((benefit, index) => (
                <motion.div
                  key={benefit}
                  className="flex items-center gap-2 text-primary-foreground/80"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                  <span className="text-sm font-medium">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <Button
                size="xl"
                variant="secondary"
                className="font-heading font-semibold text-lg shadow-gold hover:shadow-lg transition-all duration-300 group"
                asChild
              >
                <Link to="/register">
                  Get Started Free
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
                className="font-heading font-semibold text-lg border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link to="/courses">Browse Courses</Link>
              </Button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              className="mt-12 md:mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              {[
                { title: "CE", subtitle: "Standards-Aligned" },
                { title: "10K+", subtitle: "Certified Professionals" },
                { title: "ADA", subtitle: "Compliant Platform" },
                { title: "256-bit", subtitle: "SSL Encryption" },
              ].map((badge, index) => (
                <motion.div
                  key={badge.title}
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <p className="font-heading text-2xl md:text-3xl font-bold text-secondary">{badge.title}</p>
                  <p className="text-xs text-primary-foreground/60">{badge.subtitle}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
