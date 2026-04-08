import { motion } from "framer-motion";
import { Quote, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const testimonials = [
  {
    id: 1,
    category: "Student Experience",
    name: "JonLyn Forest",
    role: "Student Participant",
    content:
      "Funtology has been more than a cosmetology program for me. It taught me diligence, accountability, and perseverance. Before joining, I felt like I was just going through life without direction, but this program gave me purpose. It helped me discover my confidence and passion. I looked forward to attending every day because it made me feel empowered and inspired. I will forever be grateful for what this program has instilled in me.",
  },
  {
    id: 2,
    category: "Community Perspective",
    name: "Tosha Smith",
    role: "Parent/Supporter",
    content:
      "iFuntology is a fun, kid-friendly, creative, and innovative way to teach children how to express themselves. This program unlocks passions that many students don’t even realize they have. It makes learning exciting again and inspires brighter futures.",
  },
  {
    id: 3,
    category: "Instructor Impact",
    name: "Salena Dowdy",
    role: "Supporter",
    content:
      "TeQuilla is one of the best instructors I’ve ever had. She teaches exactly what students need to know and more. She is patient, kind, and truly wants the best for her students.",
  },
  {
    id: 4,
    category: "Institutional Validation",
    name: "Deena Sams",
    role: "Director of Afterschool & Community Affairs – Newton County Schools",
    content:
      "Our afterschool program began using Funtology in 2016, and we continue to use it today. The program provides the education and hands-on experiences we seek for our students. They absolutely love it, especially the makeup and nail components. I highly recommend this program to any organization looking to offer enrichment in science, art, and entrepreneurship.",
  },
];

const Testimonials = () => {
  return (
    <section className="relative overflow-hidden bg-muted py-20 md:py-28">
      <motion.div
        className="absolute right-0 top-0 h-96 w-96 rounded-full bg-secondary/5 blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="container-wide relative z-10">
        <motion.div
          className="mb-12 text-center md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-2 text-sm font-medium text-secondary"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Voices & partners
          </motion.div>
          <h2 className="mb-4 font-heading text-4xl font-bold text-primary md:text-5xl lg:text-6xl">
            What Participants & Partners Are Saying
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Student Experiences, Family Perspectives, Instructor Impact, and Institutional Partners Who Trust Funtology in Their Programs.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.id}
              className="group relative rounded-2xl border border-border bg-card p-6 shadow-lg transition-all duration-300 hover:border-secondary/30 hover:shadow-xl md:p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <div className="absolute right-6 top-6">
                <Quote className="h-8 w-8 text-secondary/20 transition-colors group-hover:text-secondary/40" aria-hidden />
              </div>

              <Badge variant="secondary" className="mb-4 font-medium">
                {testimonial.category}
              </Badge>

              <blockquote className="mb-6 text-foreground/90 leading-relaxed">
                <span className="text-secondary/80">“</span>
                {testimonial.content}
                <span className="text-secondary/80">”</span>
              </blockquote>

              <footer className="border-t border-border pt-4">
                <p className="font-heading font-semibold text-foreground">{testimonial.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{testimonial.role}</p>
              </footer>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
