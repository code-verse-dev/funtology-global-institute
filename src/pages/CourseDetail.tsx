import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  Award,
  Users,
  CheckCircle2,
  BookOpen,
  Video,
  FileText,
  Star,
  Play,
  ShieldCheck,
  Target,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Course data would come from API in real implementation
const courseData = {
  id: 1,
  title: "Professional Infection Control & Prevention",
  subtitle: "Master Essential Infection Control Protocols for Healthcare & Beauty Professionals",
  description: "This comprehensive course provides in-depth training on infection control protocols, sanitation procedures, and safety compliance essential for healthcare and beauty professionals. Learn to identify, prevent, and manage infectious diseases in professional settings while maintaining the highest standards of client safety.",
  category: "Healthcare",
  level: "Intermediate",
  ceHours: 4,
  price: 89,
  enrolledCount: 1250,
  rating: 4.8,
  reviewCount: 328,
  duration: "4-6 hours",
  language: "English",
  lastUpdated: "January 2024",
  image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=600&fit=crop",
  instructor: {
    name: "Dr. Sarah Mitchell",
    title: "Infection Control Specialist",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop",
    credentials: "PhD, RN, CIC",
  },
  learningObjectives: [
    "Identify and classify different types of infectious agents and their transmission routes",
    "Demonstrate proper hand hygiene techniques according to CDC guidelines",
    "Apply appropriate personal protective equipment (PPE) selection and usage",
    "Implement effective disinfection and sterilization protocols",
    "Develop and maintain infection control documentation and compliance records",
    "Respond appropriately to exposure incidents and outbreak situations",
  ],
  modules: [
    {
      title: "Introduction to Infection Control",
      lessons: 4,
      duration: "45 min",
      completed: false,
    },
    {
      title: "Understanding Infectious Agents",
      lessons: 6,
      duration: "60 min",
      completed: false,
    },
    {
      title: "Hand Hygiene & PPE",
      lessons: 5,
      duration: "50 min",
      completed: false,
    },
    {
      title: "Disinfection & Sterilization",
      lessons: 4,
      duration: "45 min",
      completed: false,
    },
    {
      title: "Compliance & Documentation",
      lessons: 3,
      duration: "30 min",
      completed: false,
    },
    {
      title: "Final Assessment",
      lessons: 1,
      duration: "30 min",
      completed: false,
    },
  ],
  includes: [
    { icon: Video, text: "4 hours of video content" },
    { icon: FileText, text: "Downloadable resources" },
    { icon: BookOpen, text: "Interactive flipbook materials" },
    { icon: Award, text: "Certificate of completion" },
    { icon: ShieldCheck, text: "Recognized CE hours" },
  ],
  requirements: [
    "Active license in healthcare or cosmetology field",
    "Basic understanding of professional hygiene practices",
    "Computer with internet access",
  ],
  reviews: [
    {
      name: "Jennifer R.",
      rating: 5,
      date: "2 weeks ago",
      comment: "Excellent course! The flipbook format made it easy to follow along, and the assessment really tested my knowledge.",
    },
    {
      name: "Marcus T.",
      rating: 5,
      date: "1 month ago",
      comment: "Very comprehensive and well-structured. I learned so much about proper infection control protocols.",
    },
    {
      name: "Linda K.",
      rating: 4,
      date: "1 month ago",
      comment: "Great content, though I wish there were more video demonstrations. Still highly recommend!",
    },
  ],
};

const CourseDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-12 md:py-20">
          <div className="container-wide">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* Course Info */}
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{courseData.category}</Badge>
                  <Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground">
                    {courseData.level}
                  </Badge>
                </div>

                <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
                  {courseData.title}
                </h1>
                <p className="text-lg text-primary-foreground/80 mb-6">
                  {courseData.subtitle}
                </p>

                <div className="flex flex-wrap items-center gap-4 mb-6 text-primary-foreground/70">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-secondary fill-secondary" />
                    <span className="font-semibold text-primary-foreground">{courseData.rating}</span>
                    <span>({courseData.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-5 h-5" />
                    <span>{courseData.enrolledCount.toLocaleString()} enrolled</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-5 h-5" />
                    <span>{courseData.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={courseData.instructor.image}
                    alt={courseData.instructor.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-secondary"
                  />
                  <div>
                    <p className="font-semibold text-primary-foreground">
                      {courseData.instructor.name}
                    </p>
                    <p className="text-sm text-primary-foreground/70">
                      {courseData.instructor.title}, {courseData.instructor.credentials}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Enrollment Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="sticky top-24 overflow-hidden shadow-2xl">
                  <div className="relative">
                    <img
                      src={courseData.image}
                      alt={courseData.title}
                      className="w-full h-48 object-cover"
                    />
                    <button className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group">
                      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-secondary-foreground ml-1" />
                      </div>
                    </button>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-foreground">${courseData.price}</span>
                      <span className="text-muted-foreground line-through">$149</span>
                      <Badge variant="secondary" className="ml-2">40% OFF</Badge>
                    </div>

                    <div className="space-y-3 mb-6">
                      <Button variant="secondary" size="lg" className="w-full font-heading font-semibold" asChild>
                        <Link to={`/courses/${id}/learn`}>
                          Enroll & Start Learning
                          <ChevronRight className="w-5 h-5 ml-1" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="lg" className="w-full" asChild>
                        <Link to="/register">Create Account to Enroll</Link>
                      </Button>
                    </div>

                    <p className="text-xs text-center text-muted-foreground mb-6">
                      30-day money-back guarantee
                    </p>

                    <div className="space-y-4">
                      <h4 className="font-heading font-semibold text-foreground">
                        This course includes:
                      </h4>
                      <ul className="space-y-3">
                        {courseData.includes.map((item, index) => (
                          <li key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                            <item.icon className="w-5 h-5 text-secondary" />
                            {item.text}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="w-5 h-5 text-secondary" />
                        <span className="font-semibold text-secondary">{courseData.ceHours} CE Hours</span>
                        <span className="text-muted-foreground">Contact Hours</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content Tabs */}
        <section className="py-12">
          <div className="container-wide">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full justify-start mb-8 bg-muted rounded-lg p-1">
                    <TabsTrigger value="overview" className="flex-1 md:flex-none">Overview</TabsTrigger>
                    {/* <TabsTrigger value="curriculum" className="flex-1 md:flex-none">Curriculum</TabsTrigger>
                    <TabsTrigger value="instructor" className="flex-1 md:flex-none">Instructor</TabsTrigger>
                    <TabsTrigger value="reviews" className="flex-1 md:flex-none">Reviews</TabsTrigger> */}
                  </TabsList>

                  <TabsContent value="overview" className="space-y-8">
                    {/* Description */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                        About This Course
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        {courseData.description}
                      </p>
                    </motion.div>

                    {/* Learning Objectives */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="bg-muted rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Target className="w-6 h-6 text-secondary" />
                        <h3 className="font-heading text-xl font-bold text-foreground">
                          Learning Objectives
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {courseData.learningObjectives.map((objective, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start gap-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                          >
                            <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">{objective}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>

                    {/* Requirements */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Lightbulb className="w-6 h-6 text-secondary" />
                        <h3 className="font-heading text-xl font-bold text-foreground">
                          Requirements
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {courseData.requirements.map((req, index) => (
                          <li key={index} className="flex items-center gap-2 text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="curriculum" className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-heading text-2xl font-bold text-foreground">
                        Course Curriculum
                      </h2>
                      <p className="text-muted-foreground">
                        {courseData.modules.length} modules • {courseData.ceHours} hours
                      </p>
                    </div>

                    {courseData.modules.map((module, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-card border border-border rounded-xl p-5 hover:shadow-md hover:border-secondary/30 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-heading font-bold text-primary">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-heading font-semibold text-foreground">
                                {module.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {module.lessons} lessons • {module.duration}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </motion.div>
                    ))}
                  </TabsContent>

                  <TabsContent value="instructor">
                    <div className="bg-card border border-border rounded-2xl p-8">
                      <div className="flex flex-col md:flex-row items-start gap-6">
                        <img
                          src={courseData.instructor.image}
                          alt={courseData.instructor.name}
                          className="w-24 h-24 rounded-full object-cover border-4 border-secondary"
                        />
                        <div>
                          <h3 className="font-heading text-2xl font-bold text-foreground mb-1">
                            {courseData.instructor.name}
                          </h3>
                          <p className="text-secondary font-medium mb-2">
                            {courseData.instructor.title}
                          </p>
                          <p className="text-muted-foreground mb-4">
                            {courseData.instructor.credentials}
                          </p>
                          <p className="text-muted-foreground leading-relaxed">
                            Dr. Mitchell has over 15 years of experience in infection control and prevention. 
                            She has trained thousands of healthcare and beauty professionals in proper 
                            infection control protocols and is a certified instructor.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews" className="space-y-6">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="text-center">
                        <p className="text-5xl font-bold text-foreground">{courseData.rating}</p>
                        <div className="flex items-center gap-1 my-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= Math.round(courseData.rating)
                                  ? "text-secondary fill-secondary"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {courseData.reviewCount} reviews
                        </p>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground w-8">{rating}★</span>
                            <Progress value={rating === 5 ? 75 : rating === 4 ? 20 : 5} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {courseData.reviews.map((review, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card border border-border rounded-xl p-6"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-semibold text-primary">
                              {review.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{review.name}</p>
                              <p className="text-xs text-muted-foreground">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? "text-secondary fill-secondary" : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </motion.div>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Sidebar - Empty on mobile, shows on desktop as card is sticky */}
              <div className="hidden lg:block" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetail;
