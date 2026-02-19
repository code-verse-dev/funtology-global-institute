import { motion } from "framer-motion";
import { FileText, Shield, RefreshCw, Accessibility, AlertCircle, Clock, Scale } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const policies = [
  {
    id: "terms",
    icon: FileText,
    title: "Terms of Service",
    content: `By accessing and using the Funtology Global Institute (FGI) platform, you agree to be bound by these Terms of Service. 

Our platform provides continuing education courses, assessments, and certification services. Users must be at least 18 years of age or have parental consent to use our services.

You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Course materials are protected by copyright and may not be reproduced or distributed without authorization.

FGI reserves the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the modified terms.`,
  },
  {
    id: "privacy",
    icon: Shield,
    title: "Privacy Policy",
    content: `Funtology Global Institute is committed to protecting your privacy and personal information.

Information We Collect:
• Personal identification information (name, email, phone)
• Payment information (processed securely through third-party providers)
• Learning progress and assessment data
• Course completion records

How We Use Your Information:
• To provide and improve our educational services
• To process payments and issue certificates
• To communicate about your courses and account
• To comply with accreditation requirements

We retain learner records for a minimum of 7 years as required by IACET standards. Your information is never sold to third parties.`,
  },
  {
    id: "refund",
    icon: RefreshCw,
    title: "Refund Policy",
    content: `FGI offers the following refund policy for course purchases:

Full Refund (100%):
• Within 24 hours of purchase if no course content has been accessed

Partial Refund (50%):
• Within 7 days of purchase if less than 25% of course content has been completed

No Refund:
• After 7 days from purchase date
• If more than 25% of course content has been accessed
• After an assessment attempt has been made

Exam Retake Fees:
• Retake fees are non-refundable

To request a refund, contact support@fgi.edu with your order details.`,
  },
  {
    id: "accessibility",
    icon: Accessibility,
    title: "Accessibility Policy",
    content: `Funtology Global Institute is committed to ensuring our educational platform is accessible to all learners, including those with disabilities.

Our Commitment:
• ADA-compliant website and learning portal design
• Screen reader compatible course materials
• Keyboard navigation support throughout the platform
• Captioned videos for all video content
• Alternative text for images and graphics

Requesting Accommodations:
If you require specific accommodations to access our courses, please contact our accessibility coordinator at accessibility@fgi.edu. We will work with you to provide reasonable accommodations that meet your needs.

All accommodation requests are documented and maintained as part of your learner record.`,
  },
  {
    id: "complaints",
    icon: AlertCircle,
    title: "Complaints & Appeals Policy",
    content: `FGI takes all complaints and appeals seriously and is committed to fair resolution.

Filing a Complaint:
1. Submit your complaint in writing to complaints@fgi.edu
2. Include your name, contact information, and detailed description
3. Provide any supporting documentation

Review Process:
• Acknowledgment within 2 business days
• Initial review completed within 10 business days
• Written response with findings and resolution

Appeals:
If you disagree with an assessment result or decision:
1. Submit appeal within 14 days of the decision
2. Include grounds for appeal and supporting evidence
3. Appeals are reviewed by an independent committee
4. Final decision communicated within 21 days

All complaints and appeals are documented and used for continuous improvement.`,
  },
  {
    id: "records",
    icon: Clock,
    title: "Records Retention Policy",
    content: `In alignment with CE best practices, FGI maintains comprehensive learner records.

Records Maintained:
• Learner identification and contact information
• Course enrollment and completion dates
• Assessment scores and attempts
• CE hours earned
• Certificates issued
• Evaluation submissions
• Accommodation requests and documentation

Retention Period:
All learner records are retained for a minimum of 7 years from the date of course completion.

Accessing Your Records:
Learners may request a copy of their records or official transcripts by contacting records@fgi.edu. Requests are processed within 5 business days.

Record Security:
All records are encrypted and stored in secure, HIPAA-compliant cloud infrastructure.`,
  },
  {
    id: "ethics",
    icon: Scale,
    title: "Ethics & Marketing Standards",
    content: `FGI adheres to the highest ethical standards in all operations.

Marketing Standards:
• All marketing materials accurately represent course content and outcomes
• CE hours advertised match actual instructional time
• No misleading claims about job placement or salary increases
• Clear distinction between professional certificates and academic degrees

Academic Integrity:
• Learners must complete their own assessments
• Sharing assessment content or answers is prohibited
• Plagiarism in any form is not tolerated
• Violations may result in certificate revocation

Certificate Clarification:
Certificates issued by FGI represent completion of continuing education programs. These certificates are professional credentials and are not equivalent to academic degrees or diplomas from accredited colleges or universities.

IACET Compliance:
FGI has designed and implemented its programs using ANSI/IACET 1-2018 as a guiding framework while preparing to apply for accreditation.`,
  },
];

const Policies = () => {
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
                Policies & Compliance
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80">
                Our commitment to transparency, accessibility, and ethical practices
              </p>
            </motion.div>
          </div>
        </section>

        {/* Policies Section */}
        <section className="py-16 md:py-24">
          <div className="container-wide max-w-4xl">
            <Accordion type="single" collapsible className="space-y-4">
              {policies.map((policy, index) => (
                <motion.div
                  key={policy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AccordionItem
                    value={policy.id}
                    className="bg-card border border-border rounded-xl px-6 overflow-hidden"
                  >
                    <AccordionTrigger className="hover:no-underline py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <policy.icon className="w-6 h-6 text-primary" />
                        </div>
                        <span className="font-heading text-xl font-bold text-foreground text-left">
                          {policy.title}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="pl-16 pr-4">
                        <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                          {policy.content}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>

            {/* Contact for Questions */}
            <motion.div
              className="mt-12 p-8 bg-muted/50 rounded-2xl text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                Have Questions About Our Policies?
              </h3>
              <p className="text-muted-foreground mb-4">
                Our compliance team is here to help clarify any policy questions.
              </p>
              <a
                href="mailto:compliance@fgi.edu"
                className="text-primary font-semibold hover:underline"
              >
                compliance@fgi.edu
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Policies;
