import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { CheckCircle, FileText, Scale, Shield, Users } from "lucide-react";
import { useEffect } from "react";

const policies = [
  // 1
  {
    id: "governance",
    icon: Shield, // 🏛️ GraduationCap/Building/Shield (Lucide: Shield)
    title: "Educational Governance Policy",
    content: `Funtology Global Institute for Career Innovation (FGI) maintains a structured educational governance system designed to ensure the integrity, quality, and accountability of all ongoing education and professional development programs offered through the institute.

FGI leadership is responsible for the oversight, development, and continuous improvement of educational programs delivered through the FGI Learning Management System (LMS). Governance authority is maintained through the Executive Administration of FGI and its designated Academic Leadership Team.

The Academic Leadership Team is responsible for:
• Establishing curriculum standards
• Approving course design and instructional frameworks
• Ensuring alignment with workforce development and professional learning standards
• Monitoring the quality and effectiveness of instructional programs
• Overseeing learner assessment processes
• Maintaining compliance with applicable ongoing education standards including our guidelines

All educational programs are developed and reviewed through documented instructional design processes. Policies governing course development, evaluation, and learner achievement are maintained and reviewed periodically to ensure continuous improvement.

FGI ensures that all educational decisions are made in alignment with the institute's mission to provide comprehensive career readiness, professional development, and workforce advancement opportunities.`
  },
  // 2
  {
    id: "instructor-qualification",
    icon: FileText, // UserCheck/Award/BadgeCheck (Lucide: FileText as placeholder)
    title: "Instructor Qualification Policy",
    content: `Funtology Global Institute for Career Innovation (FGI) ensures that all individuals involved in the development or delivery of educational programs possess appropriate qualifications, experience, and subject matter expertise relevant to the learning objectives of the program.

FGI recognizes instructors, facilitators, and subject matter experts as essential contributors to the quality of its ongoing education programs.

Instructor qualifications may include one or more of the following:
• Demonstrated professional experience in the relevant field
• Academic credentials related to the subject area
• Industry certifications or licensure where applicable
• Documented professional accomplishments or leadership experience
• Proven expertise in workforce development, education, or professional training

Subject Matter Experts (SMEs) may be engaged to assist with curriculum development, program design, and instructional review. FGI maintains documentation verifying instructor qualifications and ensures instructors are familiar with course objectives, assessment procedures, and instructional expectations.

All instructors and SMEs must adhere to FGI institutional policies and ethical standards.`
  },
  // 3
  {
    id: "conflict-of-interest",
    icon: Scale, // ⚖️ Scale/Balance/AlertTriangle (Lucide: Scale)
    title: "Conflict of Interest Policy",
    content: `Funtology Global Institute for Career Innovation (FGI) is committed to maintaining objectivity, fairness, and transparency in the development and delivery of its educational programs.

Individuals involved in program governance, curriculum development, instructional delivery, or evaluation must disclose any potential conflicts of interest that could influence educational decisions or outcomes.

A conflict of interest may exist when an individual's personal, professional, or financial interests could compromise the impartiality of educational content, assessment processes, or program administration.

All instructors, staff members, and subject matter experts are expected to:
• Disclose potential conflicts of interest
• Avoid situations that could compromise professional judgment
• Maintain impartiality in all educational activities

FGI leadership will review disclosed conflicts and take appropriate actions to ensure educational integrity is maintained.`
  },
  // 4
  {
    id: "ethics",
    icon: CheckCircle, // ✅ CheckCircle/Star/ShieldCheck (Lucide: CheckCircle)
    title: "Ethical Standards Policy",
    content: `Funtology Global Institute for Career Innovation (FGI) upholds the highest ethical standards in all educational activities. FGI is committed to providing an educational environment that reflects integrity, professionalism, respect, and accountability.

All instructors, staff members, and participants are expected to conduct themselves in accordance with ethical principles including:
• Honesty and transparency in educational practices
• Respect for diverse perspectives and experiences
• Fair and unbiased assessment of learner performance
• Protection of intellectual property and academic integrity
• Professional conduct in all communications and instructional activities

FGI prohibits any form of academic dishonesty, misrepresentation, or unethical conduct in educational programming. Violations of ethical standards may result in corrective actions including removal from educational programs or institutional disciplinary review.`
  },
  // 5
  {
    id: "non-discrimination",
    icon: Users, // Users/Globe/Heart (Lucide: Users)
    title: "Non-Discrimination Policy",
    content: `Funtology Global Institute for Career Innovation (FGI) is committed to providing equal access to educational opportunities for all learners.

FGI does not discriminate on the basis of race, color, national origin, ethnicity, religion, gender, gender identity, sexual orientation, age, disability, socioeconomic status, or any other protected characteristic in the administration of its educational programs, policies, or activities.

FGI strives to create an inclusive and respectful learning environment where individuals from diverse backgrounds are welcomed and supported. All participants in FGI programs are expected to contribute to an atmosphere of mutual respect and professional conduct.`
  },
  // 6
  {
    id: "privacy-data-protection",
    icon: Shield, // Lock/ShieldLock/EyeOff (Lucide: Shield as closest match)
    title: "Privacy & Data Protection Policy",
    content: `Funtology Global Institute for Career Innovation (FGI) recognizes the importance of protecting learner information and maintaining the confidentiality of personal and educational records.

FGI collects and maintains learner data solely for the purpose of administering educational programs, tracking course participation, and issuing certificates of completion.

The FGI Learning Management System (LMS) maintains secure digital records of:
• Learner registration information
• Course participation
• Assessment results
• Certificate issuance records

FGI implements reasonable administrative, technical, and security measures to safeguard personal information from unauthorized access, misuse, or disclosure. Learner records are maintained in accordance with institutional policies governing data retention and educational documentation.

FGI does not sell or distribute learner information to third parties except where required by law or necessary to support educational services.`
  },
  // 7
  {
    id: "On-going Education Hours-administration",
    icon: FileText, // GraduationCap/Award/BookOpen (Lucide: FileText as placeholder)
    title: "On-going Education Hours Administration Policy",
    content: `Policy Statement
Funtology Global Institute for Career Innovation (FGI) administers Ongoing Education Units (On-going Education Hourss) in accordance with the guidelines established by the International Accreditors for Ongoing Education and Training. FGI maintains structured procedures to ensure that On-going Education Hourss are awarded only for verified participation in organized ongoing education and training activities that meet defined learning objectives and completion requirements.

All On-going Education Hours-bearing programs offered through the FGI Learning Management System (LMS) follow documented policies for course design, instructional delivery, learner participation, and assessment.

On-going Education Hours Definition
A Ongoing Education Unit is a nationally recognized measure used to quantify participation in structured ongoing education and professional development programs. One (1) On-going Education Hours represents ten (10) contact hours of participation in an organized ongoing education experience under responsible sponsorship, capable direction, and qualified instruction.

FGI awards On-going Education Hourss only for programs that include:
• Clearly defined learning objectives
• Organized instructional content
• Measurable learning outcomes
• Participant verification of completion
• Documented program evaluation procedures

On-going Education Hourss are awarded solely for educational activities that support professional growth, workforce development, leadership advancement, or career readiness.

Contact Hour Definition
A contact hour is defined as sixty (60) minutes of active participation in a structured learning activity.

Contact hours may include:
• Instructional reading
• Multimedia learning modules
• Guided educational content
• Structured training activities
• Verified participation in course instruction

Contact hours do NOT include:
• Breaks
• Meals
• Unstructured discussion
• Unrelated activities

FGI calculates instructional time based on the actual time required to complete the learning activities and instructional materials within each course module.

On-going Education Hours Calculation Formula
FGI calculates On-going Education Hourss using the standard formula recognized by our standards:
10 Contact Hours = 1.0 On-going Education Hours
The On-going Education Hours value assigned to a program is determined by the total number of verified instructional contact hours required for course completion.

On-going Education Hours Structure for FGI Certification Levels — TABLE:
[[On-going Education Hours_TABLE]]

Completion Requirements
To receive On-going Education Hours credit, participants must:
• Complete all required course modules
• Participate in the full instructional content of the course
• Successfully pass the required course assessment
• Achieve the minimum passing score established for the program
Learners who successfully meet all completion requirements will receive:
• A certificate of completion
• The On-going Education Hours value awarded for the program
• A unique certificate number for verification
Completion records are maintained within the FGI Learning Management System for documentation and transcript purposes.

On-going Education Hours Recordkeeping
FGI maintains secure digital records documenting:
• Learner registration
• Course participation
• Assessment results
• On-going Education Hours credits awarded
• Certificate issuance
These records are retained within the FGI Learning Management System in accordance with institutional recordkeeping policies. Learners may request verification of On-going Education Hours completion or program participation as needed for professional or educational purposes.

Policy Review
This On-going Education Hours Administration Policy is reviewed periodically by the FGI Academic Leadership Team to ensure continued alignment with professional ongoing education standards and applicable accreditation guidelines. FGI remains committed to maintaining high standards in ongoing education delivery, learner assessment, and professional development training.
`
  },
  // 8
  {
    id: "needs-analysis",
    icon: FileText, // Search/BarChart/ClipboardList (Lucide: FileText as placeholder)
    title: "Needs Analysis Policy",
    content: `Funtology Global Institute for Career Innovation (FGI) conducts a formal Needs Analysis process to ensure that all ongoing education and professional development programs are designed to address identified learning needs, workforce demands, and industry competency gaps.

FGI uses a structured needs assessment methodology to determine the educational and professional development requirements of its target audiences, including youth, emerging professionals, entrepreneurs, workforce participants, and industry practitioners.

Purpose of Needs Analysis — The process aims to:
• Identify gaps in knowledge, skills, or professional competencies
• Determine workforce readiness requirements within targeted industries
• Support development of relevant ongoing education programs
• Align training with professional and career advancement pathways
• Ensure learning objectives are based on measurable workforce needs

Sources of Needs Assessment Data
FGI collects workforce and educational needs data from multiple sources including:
• Workforce development research and labor market trends
• Employer and industry feedback
• Educational institutions and youth development organizations
• Small business and entrepreneurship communities
• Professional associations and industry leaders
• Participant feedback from prior programs
• Program evaluation results

Needs Analysis Process — Steps:
Step 1: Identification of Target Audience
Determining the learner group and professional sector served by the educational program.
Step 2: Workforce Skill Gap Analysis
Evaluating current workforce requirements and identifying gaps between existing competencies and desired performance outcomes.
Step 3: Stakeholder Consultation
Collecting input from industry partners, educators, employers, and program participants.
Step 4: Data Review and Documentation
Reviewing workforce data, research findings, and stakeholder feedback to identify priority learning needs.
Step 5: Program Development Alignment
Designing courses and certification programs that address the identified needs through measurable learning objectives and structured training activities.

Continuous Improvement
Needs analysis is an ongoing process at FGI. The institute regularly reviews program outcomes and learner feedback to identify new training opportunities and ensure educational programs remain relevant and effective.`
  },
  // 9
  {
    id: "course-development-process",
    icon: FileText, // ClipboardEdit/Layers/BookOpen (Lucide: FileText as placeholder)
    title: "Course Development Process",
    content: `Funtology Global Institute for Career Innovation (FGI) utilizes a structured course
development framework to ensure all programs are intentionally designed to deliver clear
learning objectives, support workforce development, and produce measurable learning
outcomes.

FGI follows a systematic instructional design process to maintain consistency, quality, and
effectiveness across all digital learning programs.

Course Development Stages:
1. Analysis
FGI defines the purpose of each course by identifying the learning needs of the target
audience. This includes assessing skill gaps, understanding learner characteristics,
establishing intended outcomes, and aligning content with the appropriate certification levels.
2. Design
FGI develops the instructional structure of the course by establishing learning objectives,
identifying key competencies, organizing content sequence, determining assessment methods,
and defining instructional time and learning hour values.
3. Development
FGI creates course materials and learning resources, including structured content, digital
modules, and assessments designed to support knowledge acquisition and learner comprehension.
4. Implementation
Courses are delivered through the FGI Learning Management System, where learners access
materials, progress through content, complete assessments, and receive certification upon
successful completion.  
5. Evaluation
FGI conducts ongoing evaluations to ensure course effectiveness and continuous
improvement. This includes reviewing learner feedback, analyzing assessment performance
and monitoring completion data.`
  },
  // 10
  {
    id: "learning-objective-guidelines",
    icon: FileText, // PenLine/Target/CheckSquare (Lucide: FileText as placeholder)
    title: "Learning Objective Writing Guidelines",
    content: `FGI develops learning objectives that clearly describe what learners will know or be able to do upon completion of a course or instructional module.

All learning objectives developed by FGI must:
• Clearly state the expected learner outcome
• Describe observable or measurable behavior
• Align with course competencies
• Support the intended level of instruction

Structure of Learning Objectives:
Action Verb + Knowledge or Skill + Context or Application

Example: Learners will be able to identify key principles of professional communication in workplace environments.`
  },
  // 11
  {
    id: "competency-framework",
    icon: FileText, // Trophy/Star/Layers (Lucide: FileText as placeholder)
    title: "Competency Framework",
    content: `The FGI Competency Framework defines the core knowledge, skills, and abilities learners are expected to demonstrate upon completion of ongoing education programs. Competencies provide the foundation for curriculum development, learning objectives, and assessment design.

Core Competency Areas:
Professional Communication
Ability to communicate effectively in professional and workplace environments.
Leadership and Collaboration
Demonstrating leadership potential, teamwork, and collaborative problem-solving.
Career Development and Workforce Readiness
Understanding career pathways, professional expectations, and workplace behavior.
Digital Professionalism
Demonstrating responsible and effective use of digital communication and online tools.
Entrepreneurship and Innovation
Understanding the principles of business development, creative thinking, and problem-solving.
Ethical and Professional Responsibility
Demonstrating integrity, accountability, and ethical decision-making in professional environments.`
  },
  // 12
  {
    id: "assessment-alignment-framework",
    icon: FileText, // BarChart2/ClipboardCheck/FileCheck (Lucide: FileText as placeholder)
    title: "Assessment Alignment Framework",
    content: `FGI ensures that all learner assessments are aligned with established learning objectives and competency requirements. Assessments are designed to measure whether learners have successfully achieved the intended learning outcomes of the course.

Assessment Design Principles:
• Alignment with course learning objectives
• Measurement of competency attainment
• Consistency in evaluation standards
• Clarity in assessment instructions
• Objective scoring methods

Assessment Methods:
• Multiple-choice examinations
• Knowledge verification quizzes
• Competency-based evaluations
• Scenario-based questions

To successfully complete an FGI course, learners must meet the minimum passing standard established for the program. Passing criteria are clearly communicated to learners prior to beginning course assessments. Assessment results are recorded within the FGI Learning Management System.`
  },
  // 13
  {
    id: "lms-system-overview",
    icon: FileText, // Monitor/Server/DatabaseZap (Lucide: FileText as placeholder)
    title: "LMS System Overview & Security",
    content: `Funtology Global Institute for Career Innovation (FGI) delivers its ongoing education programs through a secure web-based Learning Management System (LMS). The LMS serves as the primary platform for administering educational programs, managing learner participation, delivering instructional content, conducting assessments, and issuing certificates of completion.

LMS Core Functions:
• Learner registration and enrollment
• Course content delivery
• Structured learning modules
• Learner progress tracking
• Assessment administration
• On-going Education Hours documentation
• Certificate generation and issuance
• Transcript recordkeeping

LMS Security
FGI is committed to maintaining the security, integrity, and confidentiality of all learner and institutional data stored within the LMS.

Security Measures include:
• Secure login credentials
• Encrypted data transmission
• Controlled user permissions
• Restricted administrative access
• Monitoring of system activity

User Authentication
FGI requires all learners and system administrators to authenticate their identity before accessing educational resources within the LMS.

Authentication Procedures:
• Individual account creation
• Unique username and password credentials
• Secure login access to the LMS

Learners are responsible for maintaining the confidentiality of their login credentials. Unauthorized account sharing is prohibited.

Learning Progress Tracking
The FGI LMS maintains automated tracking of learner participation and course progress to verify completion of instructional requirements.

The LMS tracks:
• Course enrollment status
• Module completion
• Time spent within course materials
• Assessment participation
• Examination results

Testing Security Controls
FGI maintains structured testing security procedures to ensure that course assessments accurately measure learner knowledge and competency.

Security controls for assessments include:
• Randomized test questions
• Limited testing attempts
• Controlled test environments within the LMS
• Time limitations on examinations
• Automated scoring systems

Certificate Automation System
Upon successful completion of course requirements, the FGI LMS automatically generates certificates verifying program completion.

FGI certificates include:
• Learner name
• Program title
• Certificate number
• Completion date
• On-going Education Hours value awarded
• Issuing institution

Data Backup
FGI maintains data backup procedures to protect educational records from loss or system failure. Backup procedures include regular automated system backups, secure storage of backup files, and system recovery procedures in the event of technical disruption.

System Maintenance
FGI conducts routine maintenance of the LMS to ensure optimal performance, security, and reliability. Maintenance activities include software updates, security updates, performance monitoring, system optimization, and technical troubleshooting. Users are notified in advance whenever possible.`
  },
  // 14
  {
    id: "program-evaluation-policy",
    icon: FileText, // TrendingUp/LineChart/Activity (Lucide: FileText as placeholder)
    title: "Program Evaluation Policy",
    content: `Funtology Global Institute for Career Innovation (FGI) maintains a structured program evaluation process designed to assess the effectiveness, relevance, and quality of its ongoing education programs.

Evaluation Objectives — FGI seeks to:
• Measure learner satisfaction
• Determine achievement of learning objectives
• Evaluate instructional quality
• Assess assessment effectiveness
• Identify opportunities for program improvement

Learner Feedback Survey
FGI collects feedback from learners who complete educational programs. Sample survey questions include:
• The course learning objectives were clearly explained.
• The course content was relevant to my professional or educational development.
• The instructional materials were easy to understand.
• The course structure helped me learn effectively.
• The assessment accurately measured my understanding of the course material.
• The time required to complete the course was appropriate.
• I would recommend this course to others.
• Overall, I am satisfied with the quality of this program.

Open Response Questions:
• What was the most valuable part of this course?
• What improvements would you recommend for this course?

Course Effectiveness Review Process
FGI regularly reviews course effectiveness using the following indicators:
• Learner completion rates
• Assessment results and pass rates
• Learner feedback survey responses
• Participant engagement levels
• Relevance of instructional content

Annual Program Review
FGI conducts an annual review of its ongoing education programs examining: learner participation trends, course completion rates, assessment performance data, participant feedback, and workforce development alignment.

Annual review findings may lead to:
• Course content updates
• Revisions to instructional materials
• Improvements in assessment design
• Adjustments to learning objectives
• Development of new educational programs

Continuous Improvement
FGI supports continuous improvement through regular program evaluations, analysis of learner feedback, review of course completion and assessment data, consultation with industry stakeholders, and updates to instructional content. FGI leadership oversees continuous improvement efforts and ensures evaluation findings lead to meaningful enhancements in educational program quality.`
  },
  // Accordion 15 — Marketing Compliance Policy
  {
    id: "marketing-compliance-policy",
    icon: FileText, // Megaphone/Broadcast/FileText (Lucide: FileText as placeholder)
    title: "Marketing Compliance Policy",
    content: `FGI leadership reviews all marketing materials related to educational programs prior to
publication to ensure accuracy, consistency, and compliance.

FGI is committed to providing clear and accurate information and avoids any misleading or
exaggerated statements about educational outcomes, certifications, or career advancement.

All marketing materials must accurately describe:
• Course titles and descriptions
• Program objectives and learning outcomes
• On-going Education Hours values associated with courses
• Program completion requirements
• Certification documentation issued by FGI

This policy applies to all marketing channels:
• Institutional websites
• Social media platforms
• Email communications
• Brochures and printed materials
• Advertisements and promotional campaigns
• Presentations or public announcements regarding educational programs

FGI leadership reviews all marketing materials related to educational programs prior to publication to ensure accuracy, consistency, and compliance.
FGI is committed to providing clear and accurate information and avoids any misleading or exaggerated statements about educational outcomes, certifications, or career advancement.

Policy Review
This Marketing Compliance Policy is periodically reviewed by the FGI Team to ensure continued quality standards and evolving educational best practices.`
  },
  // Accordion 16 — Institutional Overview & Standards
  {
    id: "institutional-overview-standards",
    icon: FileText, // Building2/University/Info (Lucide: FileText as placeholder)
    title: "Institutional Overview & Standards",
    content: `Funtology Global Institute for Career Innovation (FGI) is a professional development and ongoing education institute committed to advancing career readiness, leadership development, workforce training, and entrepreneurial education.

FGI delivers structured educational programs through a web-based Learning Management System (LMS) that supports learners in developing professional competencies relevant to modern workforce environments.

Organizational Governance
FGI maintains an educational governance structure responsible for overseeing the design, delivery, and evaluation of ongoing education programs.

The Academic Leadership Team is responsible for:
• Program oversight
• Curriculum development
• Instructional quality assurance
• Evaluation of program effectiveness
• Policy review and compliance

Instructional Design:
• Analysis
• Design
• Development
• Implementation
• Evaluation

Assessment Methods:
• Multiple-choice examinations
• Competency-based evaluation questions

Commitment to Quality
FGI is committed to delivering high-quality ongoing education programs that support professional advancement and workforce development. Through structured governance, systematic instructional design, and continuous program evaluation, FGI ensures that educational offerings meet established standards of quality and effectiveness.`
  },
  //   {
  //     id: "instructor-qualification",
  //     icon: FileText, // UserCheck/Award/BadgeCheck (Lucide: FileText as placeholder)
  //     title: "Instructor Qualification Policy",
  //     content: `Funtology Global Institute for Career Innovation (FGI) ensures that all individuals involved in the development or delivery of educational programs possess appropriate qualifications, experience, and subject matter expertise relevant to the learning objectives of the program.

  // FGI recognizes instructors, facilitators, and subject matter experts as essential contributors to the quality of its ongoing education programs.

  // Instructor qualifications may include one or more of the following:
  // • Demonstrated professional experience in the relevant field
  // • Academic credentials related to the subject area
  // • Industry certifications or licensure where applicable
  // • Documented professional accomplishments or leadership experience
  // • Proven expertise in workforce development, education, or professional training

  // Subject Matter Experts (SMEs) may be engaged to assist with curriculum development, program design, and instructional review. FGI maintains documentation verifying instructor qualifications and ensures instructors are familiar with course objectives, assessment procedures, and instructional expectations.

  // All instructors and SMEs must adhere to FGI institutional policies and ethical standards.`,
  //   },
  //   {
  //     id: "conflict-of-interest",
  //     icon: Scale, // ⚖️ Scale/Balance/AlertTriangle (Lucide: Scale)
  //     title: "Conflict of Interest Policy",
  //     content: `Funtology Global Institute for Career Innovation (FGI) is committed to maintaining objectivity, fairness, and transparency in the development and delivery of its educational programs.

  // Individuals involved in program governance, curriculum development, instructional delivery, or evaluation must disclose any potential conflicts of interest that could influence educational decisions or outcomes.

  // A conflict of interest may exist when an individual's personal, professional, or financial interests could compromise the impartiality of educational content, assessment processes, or program administration.

  // All instructors, staff members, and subject matter experts are expected to:
  // • Disclose potential conflicts of interest
  // • Avoid situations that could compromise professional judgment
  // • Maintain impartiality in all educational activities

  // FGI leadership will review disclosed conflicts and take appropriate actions to ensure educational integrity is maintained.`,
  //   },
  //   {
  //     id: "ethics",
  //     icon: CheckCircle, // ✅ CheckCircle/Star/ShieldCheck (Lucide: CheckCircle)
  //     title: "Ethical Standards Policy",
  //     content: `Funtology Global Institute for Career Innovation (FGI) upholds the highest ethical standards in all educational activities. FGI is committed to providing an educational environment that reflects integrity, professionalism, respect, and accountability.

  // All instructors, staff members, and participants are expected to conduct themselves in accordance with ethical principles including:
  // • Honesty and transparency in educational practices
  // • Respect for diverse perspectives and experiences
  // • Fair and unbiased assessment of learner performance
  // • Protection of intellectual property and academic integrity
  // • Professional conduct in all communications and instructional activities

  // FGI prohibits any form of academic dishonesty, misrepresentation, or unethical conduct in educational programming. Violations of ethical standards may result in corrective actions including removal from educational programs or institutional disciplinary review.`,
  //   },
  //   {
  //     id: "non-discrimination",
  //     icon: Users, // Users/Globe/Heart (Lucide: Users)
  //     title: "Non-Discrimination Policy",
  //     content: `Funtology Global Institute for Career Innovation (FGI) is committed to providing equal access to educational opportunities for all learners.

  // FGI does not discriminate on the basis of race, color, national origin, ethnicity, religion, gender, gender identity, sexual orientation, age, disability, socioeconomic status, or any other protected characteristic in the administration of its educational programs, policies, or activities.

  // FGI strives to create an inclusive and respectful learning environment where individuals from diverse backgrounds are welcomed and supported. All participants in FGI programs are expected to contribute to an atmosphere of mutual respect and professional conduct.`,
  //   },
  //   {
  //     id: "privacy-data-protection",
  //     icon: Shield, // Lock/ShieldLock/EyeOff (Lucide: Shield as closest match)
  //     title: "Privacy & Data Protection Policy",
  //     content: `Funtology Global Institute for Career Innovation (FGI) recognizes the importance of protecting learner information and maintaining the confidentiality of personal and educational records.

  // FGI collects and maintains learner data solely for the purpose of administering educational programs, tracking course participation, and issuing certificates of completion.

  // The FGI Learning Management System (LMS) maintains secure digital records of:
  // • Learner registration information
  // • Course participation
  // • Assessment results
  // • Certificate issuance records

  // FGI implements reasonable administrative, technical, and security measures to safeguard personal information from unauthorized access, misuse, or disclosure. Learner records are maintained in accordance with institutional policies governing data retention and educational documentation.

  // FGI does not sell or distribute learner information to third parties except where required by law or necessary to support educational services.`,
  //   },
  //   {
  //     id: "On-going Education Hours-administration",
  //     icon: FileText, // GraduationCap/Award/BookOpen (Lucide: FileText as placeholder)
  //     title: "On-going Education Hours Administration Policy",
  //     content: `Policy Statement
  // Funtology Global Institute for Career Innovation (FGI) administers Ongoing Education Units (On-going Education Hourss) in accordance with the guidelines established by the International Accreditors for Ongoing Education and Training. FGI maintains structured procedures to ensure that On-going Education Hourss are awarded only for verified participation in organized ongoing education and training activities that meet defined learning objectives and completion requirements.

  // All On-going Education Hours-bearing programs offered through the FGI Learning Management System (LMS) follow documented policies for course design, instructional delivery, learner participation, and assessment.

  // On-going Education Hours Definition
  // A Ongoing Education Unit is a nationally recognized measure used to quantify participation in structured ongoing education and professional development programs. One (1) On-going Education Hours represents ten (10) contact hours of participation in an organized ongoing education experience under responsible sponsorship, capable direction, and qualified instruction.

  // FGI awards On-going Education Hourss only for programs that include:
  // • Clearly defined learning objectives
  // • Organized instructional content
  // • Measurable learning outcomes
  // • Participant verification of completion
  // • Documented program evaluation procedures

  // On-going Education Hourss are awarded solely for educational activities that support professional growth, workforce development, leadership advancement, or career readiness.

  // Contact Hour Definition
  // A contact hour is defined as sixty (60) minutes of active participation in a structured learning activity.

  // Contact hours may include:
  // • Instructional reading
  // • Multimedia learning modules
  // • Guided educational content
  // • Structured training activities
  // • Verified participation in course instruction

  // Contact hours do NOT include:
  // • Breaks
  // • Meals
  // • Unstructured discussion
  // • Unrelated activities

  // FGI calculates instructional time based on the actual time required to complete the learning activities and instructional materials within each course module.

  // On-going Education Hours Calculation Formula
  // FGI calculates On-going Education Hourss using the standard formula recognized by our standards:
  // 10 Contact Hours = 1.0 On-going Education Hours
  // The On-going Education Hours value assigned to a program is determined by the total number of verified instructional contact hours required for course completion.

  // On-going Education Hours Structure for FGI Certification Levels — TABLE:
  // [[On-going Education Hours_TABLE]]

  // Completion Requirements
  // To receive On-going Education Hours credit, participants must:
  // • Complete all required course modules
  // • Participate in the full instructional content of the course
  // • Successfully pass the required course assessment
  // • Achieve the minimum passing score established for the program
  // Learners who successfully meet all completion requirements will receive:
  // • A certificate of completion
  // • The On-going Education Hours value awarded for the program
  // • A unique certificate number for verification
  // Completion records are maintained within the FGI Learning Management System for documentation and transcript purposes.

  // On-going Education Hours Recordkeeping
  // FGI maintains secure digital records documenting:
  // • Learner registration
  // • Course participation
  // • Assessment results
  // • On-going Education Hours credits awarded
  // • Certificate issuance
  // These records are retained within the FGI Learning Management System in accordance with institutional recordkeeping policies. Learners may request verification of On-going Education Hours completion or program participation as needed for professional or educational purposes.

  // Policy Review
  // This On-going Education Hours Administration Policy is reviewed periodically by the FGI Academic Leadership Team to ensure continued alignment with professional ongoing education standards and applicable accreditation guidelines. FGI remains committed to maintaining high standards in ongoing education delivery, learner assessment, and professional development training.
  // `,
  //   },
];

const Policies = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
                Our Commitment to Transparency, Accessibility, and Ethical Practices
              </p>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-3 text-white mt-2">
                Have Questions About Our Policies?
              </h2>
              <p className="text-lg md:text-xl text-primary-foreground/80">
                Our Compliance Team is Here to Help Clarify Any Policy Questions.
                <br />
                <a
                  href="mailto:info@funtologyglobalinstitute.com"
                  className="font-medium text-secondary underline underline-offset-4 hover:text-primary-foreground"
                >
                  Info@FuntologyGlobalInstitute.com
                </a>
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
                        {policy.id === "On-going Education Hours-administration" ? (
                          <>
                            <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                              {policy.content.split("[[On-going Education Hours_TABLE]]")[0]}
                            </div>
                            <div className="overflow-x-auto mt-4 mb-6">
                              <table className="min-w-full border border-gray-300 text-sm">
                                <thead>
                                  <tr className="bg-primary text-primary-foreground">
                                    <th className="px-4 py-2 text-left">Program Level</th>
                                    <th className="px-4 py-2 text-left">Contact Hours</th>
                                    <th className="px-4 py-2 text-left">On-going Education Hourss Awarded</th>
                                    <th className="px-4 py-2 text-left">Price</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-muted/50">
                                  <tr>
                                    <td className="px-4 py-2">Level 1 – Career Foundations</td>
                                    <td className="px-4 py-2">10 hours</td>
                                    <td className="px-4 py-2">1.0 On-going Education Hours</td>
                                    <td className="px-4 py-2">$25</td>
                                  </tr>
                                  <tr>
                                    <td className="px-4 py-2">Level 2 – Professional Advancement</td>
                                    <td className="px-4 py-2">30 hours</td>
                                    <td className="px-4 py-2">3.0 On-going Education Hours</td>
                                    <td className="px-4 py-2">$49</td>
                                  </tr>
                                  <tr>
                                    <td className="px-4 py-2">Level 3 – Career Leadership</td>
                                    <td className="px-4 py-2">30 hours</td>
                                    <td className="px-4 py-2">3.0 On-going Education Hours</td>
                                    <td className="px-4 py-2">$59</td>
                                  </tr>
                                  <tr>
                                    <td className="px-4 py-2">Level 4 – Executive Strategy</td>
                                    <td className="px-4 py-2">40 hours</td>
                                    <td className="px-4 py-2">4.0 On-going Education Hours</td>
                                    <td className="px-4 py-2">$69</td>
                                  </tr>
                                  <tr>
                                    <td className="px-4 py-2">Level 5 – Fellowship of Distinction</td>
                                    <td className="px-4 py-2">50 hours</td>
                                    <td className="px-4 py-2">5.0 On-going Education Hours</td>
                                    <td className="px-4 py-2">$79</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                              {policy.content.split("[[On-going Education Hours_TABLE]]")[1]}
                            </div>
                          </>
                        ) : (
                          <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                            {policy.content}
                          </div>
                        )}
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
                Our Compliance Team is Here to Help Clarify Any Policy Questions.
              </p>
              <a
                href="mailto:info@funtologyglobalinstitute.com"
                className="text-primary font-semibold hover:underline"
              >
                Info@FuntologyGlobalInstitute.com
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
