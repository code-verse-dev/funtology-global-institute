import { motion } from "framer-motion";
import { HelpCircle, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  // {
  //   question: "What is and why does it matter?",
  //   answer: "IACET (International Accreditors for Ongoing Education and Training) accreditation is the gold standard for ongoing education providers. It ensures our programs meet rigorous quality standards, our CE hours are recognized industry-wide, and your certifications carry legitimate professional weight.",
  // },
  {
    question: "How do I earn ongoing education credits?",
    answer: "Simply enroll in a course, complete all learning modules, pass the assessment with a minimum 70% score, and submit your course evaluation. Your CE certificate is automatically generated and available for download in your dashboard.",
  },
  {
    question: "Can my organization enroll multiple learners?",
    answer: "Yes! We offer organization accounts that allow bulk enrollment, centralized billing, progress tracking for all team members, and dedicated support. Contact us for enterprise pricing and custom solutions.",
  },
  {
    question: "What happens if I fail an assessment?",
    answer: "You can retake assessments up to 2 times. After the second failed attempt, there's a 30-day waiting period before you can reattempt. Each retake may require an additional fee depending on the course.",
  },
  {
    question: "How are course materials delivered?",
    answer: "All courses are delivered in our interactive flipbook format, making content easy to navigate and digest. You'll also have access to PDFs, videos with captions, and interactive modules depending on the course.",
  },
  {
    question: "Are your certificates recognized by employers and licensing boards?",
    answer: "Our  certificates are professionally recognized credentials. While we recommend checking with your specific licensing board for CE hour acceptance, our accreditation ensures the highest quality standards.",
  },
  {
    question: "Can I access courses on mobile devices?",
    answer: "Absolutely! Our platform is fully responsive and works seamlessly on smartphones, tablets, and desktop computers. Learn anytime, anywhere at your own pace.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards. For organizations, we also offer invoice-based billing and purchase orders. Special access codes may also be provided for sponsored enrollments.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <HelpCircle className="w-4 h-4" />
            Got Questions?
          </motion.div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our ongoing education programs,
            certification process, and platform features.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-lg data-[state=open]:border-secondary/30 transition-all duration-300"
                >
                  <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:text-primary py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-muted rounded-2xl">
            <MessageCircle className="w-10 h-10 text-secondary" />
            <div className="text-center sm:text-left">
              <p className="font-heading font-semibold text-foreground">
                Still have questions?
              </p>
              <p className="text-sm text-muted-foreground">
                Our support team is here to help you succeed.
              </p>
            </div>
            <Button variant="secondary" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
