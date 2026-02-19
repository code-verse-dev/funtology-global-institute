import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  CheckCircle2,
  Circle,
  Clock,
  Award,
  FileText,
  Video,
  MessageSquare,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import FlipbookViewer from "@/components/flipbook/FlipbookViewer";
import QuizComponent from "@/components/assessment/QuizComponent";
import CourseEvaluation from "@/components/assessment/CourseEvaluation";
import fgiLogo from "@/assets/fgi-logo.png";

const courseContent = {
  title: "Professional Infection Control & Prevention",
  totalModules: 6,
  completedModules: 2,
  ceHours: 4,
  modules: [
    {
      id: 1,
      title: "Introduction to Infection Control",
      lessons: [
        { id: 1, title: "What is Infection Control?", duration: "10 min", completed: true, type: "flipbook" },
        { id: 2, title: "History & Evolution", duration: "12 min", completed: true, type: "video" },
        { id: 3, title: "Key Terminology", duration: "8 min", completed: true, type: "flipbook" },
        { id: 4, title: "Module Quiz", duration: "5 min", completed: true, type: "quiz" },
      ],
      completed: true,
    },
    {
      id: 2,
      title: "Understanding Infectious Agents",
      lessons: [
        { id: 5, title: "Types of Pathogens", duration: "15 min", completed: true, type: "flipbook" },
        { id: 6, title: "Transmission Routes", duration: "12 min", completed: true, type: "flipbook" },
        { id: 7, title: "Chain of Infection", duration: "10 min", completed: false, type: "flipbook" },
        { id: 8, title: "Breaking the Chain", duration: "8 min", completed: false, type: "video" },
        { id: 9, title: "Case Studies", duration: "15 min", completed: false, type: "flipbook" },
        { id: 10, title: "Module Quiz", duration: "10 min", completed: false, type: "quiz" },
      ],
      completed: false,
    },
    {
      id: 3,
      title: "Hand Hygiene & PPE",
      lessons: [
        { id: 11, title: "Hand Hygiene Basics", duration: "10 min", completed: false, type: "flipbook" },
        { id: 12, title: "WHO Guidelines", duration: "12 min", completed: false, type: "video" },
        { id: 13, title: "PPE Selection", duration: "15 min", completed: false, type: "flipbook" },
        { id: 14, title: "Donning & Doffing", duration: "10 min", completed: false, type: "video" },
        { id: 15, title: "Module Quiz", duration: "8 min", completed: false, type: "quiz" },
      ],
      completed: false,
    },
    {
      id: 4,
      title: "Disinfection & Sterilization",
      lessons: [
        { id: 16, title: "Cleaning Principles", duration: "10 min", completed: false, type: "flipbook" },
        { id: 17, title: "Disinfection Methods", duration: "12 min", completed: false, type: "flipbook" },
        { id: 18, title: "Sterilization Techniques", duration: "15 min", completed: false, type: "video" },
        { id: 19, title: "Module Quiz", duration: "8 min", completed: false, type: "quiz" },
      ],
      completed: false,
    },
    {
      id: 5,
      title: "Compliance & Documentation",
      lessons: [
        { id: 20, title: "Regulatory Requirements", duration: "10 min", completed: false, type: "flipbook" },
        { id: 21, title: "Documentation Best Practices", duration: "12 min", completed: false, type: "flipbook" },
        { id: 22, title: "Module Quiz", duration: "5 min", completed: false, type: "quiz" },
      ],
      completed: false,
    },
    {
      id: 6,
      title: "Final Assessment & Evaluation",
      lessons: [
        { id: 23, title: "Course Review", duration: "15 min", completed: false, type: "flipbook" },
        { id: 24, title: "Final Exam", duration: "30 min", completed: false, type: "quiz" },
        { id: 25, title: "Course Evaluation", duration: "5 min", completed: false, type: "evaluation" },
      ],
      completed: false,
    },
  ],
};

const flipbookPages = [
  {
    id: 1,
    title: "Chain of Infection",
    content: `
      <p>The <strong>chain of infection</strong> is a model that explains how infections spread from one host to another. Understanding this chain is crucial for implementing effective infection control measures.</p>
      <h3 class="text-xl font-bold mt-6 mb-3">The Six Links</h3>
      <p>The chain consists of six interconnected links. Breaking any link in the chain will prevent the spread of infection:</p>
      <ul class="list-disc pl-6 mt-4 space-y-2">
        <li><strong>Infectious Agent:</strong> The pathogen that causes disease (bacteria, virus, fungus, parasite)</li>
        <li><strong>Reservoir:</strong> The place where the pathogen lives and multiplies</li>
        <li><strong>Portal of Exit:</strong> How the pathogen leaves the reservoir</li>
      </ul>
    `,
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Chain of Infection (Continued)",
    content: `
      <ul class="list-disc pl-6 space-y-2">
        <li><strong>Mode of Transmission:</strong> How the pathogen is spread (direct contact, droplets, airborne, vehicle, vector)</li>
        <li><strong>Portal of Entry:</strong> How the pathogen enters a new host</li>
        <li><strong>Susceptible Host:</strong> A person who can become infected</li>
      </ul>
      <h3 class="text-xl font-bold mt-6 mb-3">Why It Matters</h3>
      <p>By understanding each link, healthcare and beauty professionals can identify opportunities to break the chain and prevent infections from spreading.</p>
      <div class="bg-secondary/10 p-4 rounded-lg mt-6">
        <p class="font-semibold text-secondary">Key Takeaway:</p>
        <p>Infection control focuses on breaking the chain at the most practical points: the mode of transmission and portal of entry.</p>
      </div>
    `,
  },
  {
    id: 3,
    title: "Breaking the Chain",
    content: `
      <p>Effective infection control requires strategic interventions at each link of the chain. Here are practical strategies:</p>
      <h3 class="text-xl font-bold mt-6 mb-3">At the Infectious Agent</h3>
      <ul class="list-disc pl-6 space-y-2">
        <li>Proper cleaning and disinfection of surfaces</li>
        <li>Sterilization of instruments</li>
        <li>Appropriate antimicrobial treatments</li>
      </ul>
      <h3 class="text-xl font-bold mt-6 mb-3">At the Reservoir</h3>
      <ul class="list-disc pl-6 space-y-2">
        <li>Environmental cleaning protocols</li>
        <li>Proper waste disposal</li>
        <li>Identifying and treating infected individuals</li>
      </ul>
    `,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop",
  },
  {
    id: 4,
    title: "Mode of Transmission",
    content: `
      <p>Understanding how pathogens spread is essential for selecting appropriate prevention measures.</p>
      <h3 class="text-xl font-bold mt-6 mb-3">Contact Transmission</h3>
      <p><strong>Direct:</strong> Physical contact between infected person and susceptible host (touching, kissing)</p>
      <p><strong>Indirect:</strong> Contact with contaminated objects (doorknobs, instruments)</p>
      <h3 class="text-xl font-bold mt-6 mb-3">Droplet Transmission</h3>
      <p>Large respiratory droplets (>5 microns) that travel short distances (<6 feet) when coughing, sneezing, or talking.</p>
      <h3 class="text-xl font-bold mt-6 mb-3">Airborne Transmission</h3>
      <p>Small particles (<5 microns) that can remain suspended in air for extended periods and travel long distances.</p>
    `,
  },
  {
    id: 5,
    title: "Knowledge Check",
    content: `
      <p>Before proceeding to the quiz, let's review the key concepts:</p>
      <div class="space-y-4 mt-6">
        <div class="bg-muted p-4 rounded-lg">
          <p class="font-semibold">✓ The chain of infection has six links</p>
        </div>
        <div class="bg-muted p-4 rounded-lg">
          <p class="font-semibold">✓ Breaking any link prevents infection spread</p>
        </div>
        <div class="bg-muted p-4 rounded-lg">
          <p class="font-semibold">✓ Mode of transmission determines prevention strategies</p>
        </div>
        <div class="bg-muted p-4 rounded-lg">
          <p class="font-semibold">✓ Hand hygiene breaks the chain at multiple points</p>
        </div>
      </div>
      <div class="mt-8 p-6 bg-secondary/10 rounded-xl text-center">
        <p class="font-heading font-bold text-lg text-secondary">Ready for the Quiz?</p>
        <p class="text-muted-foreground mt-2">Complete the following lesson to proceed to the module quiz.</p>
      </div>
    `,
  },
];

const quizQuestions = [
  {
    id: 1,
    question: "How many links are in the chain of infection?",
    options: ["Four", "Five", "Six", "Seven"],
    correctAnswer: 2,
    explanation: "The chain of infection consists of six interconnected links.",
  },
  {
    id: 2,
    question: "Which of the following is NOT a link in the chain of infection?",
    options: ["Reservoir", "Portal of Exit", "Vaccination", "Susceptible Host"],
    correctAnswer: 2,
    explanation: "Vaccination is a prevention strategy, not a link in the chain.",
  },
  {
    id: 3,
    question: "What is the most effective way to break the chain of infection in most healthcare settings?",
    options: ["Antibiotics", "Isolation", "Hand hygiene", "Vaccination"],
    correctAnswer: 2,
    explanation: "Hand hygiene is the single most effective measure to prevent healthcare-associated infections.",
  },
  {
    id: 4,
    question: "Droplet transmission occurs over what distance?",
    options: ["Less than 3 feet", "Less than 6 feet", "Up to 10 feet", "Any distance"],
    correctAnswer: 1,
    explanation: "Droplet transmission typically occurs within 6 feet of the infected person.",
  },
  {
    id: 5,
    question: "What distinguishes airborne transmission from droplet transmission?",
    options: [
      "Airborne particles are larger",
      "Airborne particles can travel longer distances",
      "Droplet particles are more dangerous",
      "There is no difference",
    ],
    correctAnswer: 1,
    explanation: "Airborne particles (<5 microns) remain suspended in air and travel longer distances than droplets.",
  },
  {
    id: 6,
    question: "Which of the following is an example of indirect contact transmission?",
    options: [
      "A handshake",
      "Touching a contaminated doorknob",
      "Being coughed on",
      "Breathing shared air",
    ],
    correctAnswer: 1,
    explanation: "Indirect contact involves touching contaminated objects (fomites).",
  },
  {
    id: 7,
    question: "What is the minimum passing score for this assessment?",
    options: ["50%", "60%", "70%", "80%"],
    correctAnswer: 2,
    explanation: "A minimum score of 70% is required to pass, as per IACET standards.",
  },
  {
    id: 8,
    question: "A susceptible host in the chain of infection refers to:",
    options: [
      "Any living organism",
      "A person who can become infected",
      "The pathogen itself",
      "The environment where germs live",
    ],
    correctAnswer: 1,
    explanation: "A susceptible host is a person whose immune defenses make them vulnerable to infection.",
  },
  {
    id: 9,
    question: "Which strategy targets the 'reservoir' link in the chain of infection?",
    options: [
      "Wearing gloves",
      "Environmental cleaning",
      "Hand washing",
      "Using masks",
    ],
    correctAnswer: 1,
    explanation: "Environmental cleaning targets the reservoir where pathogens live and multiply.",
  },
  {
    id: 10,
    question: "Standard Precautions should be applied to:",
    options: [
      "Only patients known to be infected",
      "Only surgical patients",
      "All patients regardless of diagnosis",
      "Only immunocompromised patients",
    ],
    correctAnswer: 2,
    explanation: "Standard Precautions apply to all patients regardless of their diagnosis or perceived risk.",
  },
];

type LearningView = "content" | "quiz" | "evaluation" | "certificate";

const CourseLearn = () => {
  const { id } = useParams();
  const [currentLesson, setCurrentLesson] = useState(7);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<LearningView>("content");
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizPassed, setQuizPassed] = useState(false);

  const progress = (courseContent.completedModules / courseContent.totalModules) * 100;

  const currentLessonData = courseContent.modules.flatMap((m) => m.lessons).find((l) => l.id === currentLesson);

  const getIconForType = (type: string) => {
    switch (type) {
      case "video": return Video;
      case "quiz": return FileText;
      case "evaluation": return MessageSquare;
      default: return FileText;
    }
  };

  const handleLessonClick = (lessonId: number) => {
    setCurrentLesson(lessonId);
    const lesson = courseContent.modules.flatMap((m) => m.lessons).find((l) => l.id === lessonId);
    if (lesson?.type === "quiz") {
      setCurrentView("quiz");
    } else if (lesson?.type === "evaluation") {
      setCurrentView("evaluation");
    } else {
      setCurrentView("content");
    }
  };

  const handleQuizComplete = (score: number, passed: boolean) => {
    setQuizScore(score);
    setQuizPassed(passed);
  };

  const handleEvaluationComplete = () => {
    setCurrentView("certificate");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: 0 }}
        animate={{ x: sidebarOpen ? 0 : -320 }}
        className="fixed left-0 top-0 bottom-0 w-80 bg-card border-r border-border z-40 flex flex-col"
      >
        <div className="p-4 border-b border-border">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <img src={fgiLogo} alt="FGI" className="w-8 h-8" />
            <div>
              <h2 className="font-heading font-semibold text-foreground text-sm line-clamp-1">
                {courseContent.title}
              </h2>
              <p className="text-xs text-muted-foreground">{courseContent.ceHours} CE Hours</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Course Progress</span>
            <span className="text-sm font-semibold">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {courseContent.modules.map((module) => (
              <div key={module.id}>
                <div className="flex items-center gap-2 mb-2">
                  {module.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                  <h3 className="font-heading font-semibold text-sm text-foreground">{module.title}</h3>
                </div>
                <div className="ml-6 space-y-1">
                  {module.lessons.map((lesson) => {
                    const Icon = getIconForType(lesson.type);
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson.id)}
                        className={`w-full flex items-center gap-2 p-2 rounded-lg text-left text-sm transition-colors ${
                          currentLesson === lesson.id
                            ? "bg-secondary/20 text-secondary"
                            : lesson.completed
                            ? "text-muted-foreground hover:bg-muted"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {lesson.completed ? (
                          <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
                        ) : (
                          <Icon className="w-3 h-3 shrink-0" />
                        )}
                        <span className="flex-1 line-clamp-1">{lesson.title}</span>
                        <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all ${sidebarOpen ? "ml-80" : "ml-0"}`}>
        <header className="sticky top-0 z-30 bg-background border-b border-border">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <ChevronLeft className={`w-5 h-5 transition-transform ${!sidebarOpen && "rotate-180"}`} />
              </Button>
              <div>
                <h1 className="font-heading font-semibold text-foreground">
                  {currentLessonData?.title || "Course Content"}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {currentLessonData?.duration || "—"}
                  </span>
                  <span className="flex items-center gap-1 capitalize">
                    <BookOpen className="w-4 h-4" />
                    {currentLessonData?.type || "Content"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Ask Question</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Award className="w-4 h-4" />
                {courseContent.ceHours} CE
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Flipbook Content */}
          {currentView === "content" && (
            <FlipbookViewer
              pages={flipbookPages}
              courseTitle={courseContent.title}
              onComplete={() => console.log("Lesson completed!")}
            />
          )}

          {/* Quiz */}
          {currentView === "quiz" && (
            <QuizComponent
              questions={quizQuestions}
              courseTitle={courseContent.title}
              passingScore={70}
              maxRetakes={2}
              onComplete={handleQuizComplete}
            />
          )}

          {/* Evaluation */}
          {currentView === "evaluation" && (
            <CourseEvaluation
              courseTitle={courseContent.title}
              onComplete={handleEvaluationComplete}
            />
          )}

          {/* Certificate */}
          {currentView === "certificate" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="bg-card border-2 border-secondary rounded-2xl p-12 shadow-gold">
                <img src={fgiLogo} alt="FGI" className="w-24 h-24 mx-auto mb-6" />
                <p className="text-sm text-secondary font-medium tracking-widest uppercase mb-2">Certificate of Completion</p>
                <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
                  {courseContent.title}
                </h2>
                <div className="w-24 h-0.5 bg-secondary mx-auto my-6" />
                <p className="text-muted-foreground mb-2">This certifies that</p>
                <p className="font-heading text-2xl font-bold text-primary mb-2">Sarah Johnson</p>
                <p className="text-muted-foreground mb-6">
                  has successfully completed this course and earned
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-secondary/20 rounded-full mb-6">
                  <Award className="w-5 h-5 text-secondary" />
                  <span className="font-heading font-bold text-lg text-secondary">{courseContent.ceHours} CE Hours</span>
                </div>
                <div className="grid grid-cols-2 gap-8 mt-8 pt-8 border-t border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Completion</p>
                    <p className="font-medium text-foreground">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Certificate ID</p>
                    <p className="font-medium text-foreground">FGI-2026-{String(Math.floor(Math.random() * 100000)).padStart(6, "0")}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-8">
                  Funtology Global Institute for Career Innovation
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  This is a professional credential, not an academic degree.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                  <Button variant="secondary" size="lg" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Download PDF
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/dashboard">Back to Dashboard</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseLearn;
