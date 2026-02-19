import { motion } from "framer-motion";
import { Award, Shield, CheckCircle2 } from "lucide-react";

const partners = [
  { name: "IACET Accredited", icon: Award },
  { name: "ANSI Certified", icon: Shield },
  { name: "Industry Recognized", icon: CheckCircle2 },
];

const stats = [
  { value: "15+", label: "Years of Excellence" },
  { value: "50,000+", label: "Certificates Issued" },
  { value: "150+", label: "Corporate Partners" },
  { value: "99.5%", label: "Completion Rate" },
];

const PartnersSection = () => {
  return (
    <section className="py-16 bg-primary overflow-hidden">
      <div className="container-wide">
        {/* Trust Badges */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-8 md:gap-16 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              className="flex items-center gap-3 text-primary-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <partner.icon className="w-8 h-8 text-secondary" />
              <span className="font-heading font-semibold text-lg">{partner.name}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Animated Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <motion.p
                className="font-heading text-4xl md:text-5xl font-bold text-secondary"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                {stat.value}
              </motion.p>
              <p className="text-sm md:text-base text-primary-foreground/70 mt-2">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSection;
