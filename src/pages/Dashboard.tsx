import fgiLogo from "@/assets/fgi-logo.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  Award,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  GraduationCap,
  LogOut,
  Play,
  Settings,
  Target,
  TrendingUp,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const userData = {
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  role: "Learner",
  enrolledCourses: 4,
  completedCourses: 2,
  totalCeHours: 12,
  certificates: 2,
};

const enrolledCourses = [
  {
    id: 1,
    title: "Professional Infection Control & Prevention",
    progress: 75,
    ceHours: 4,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop",
    nextLesson: "Hand Hygiene Techniques",
    timeRemaining: "1.5 hours left",
  },
  {
    id: 2,
    title: "Ethics & Professional Standards",
    progress: 45,
    ceHours: 2,
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop",
    nextLesson: "Regulatory Compliance",
    timeRemaining: "3 hours left",
  },
  {
    id: 3,
    title: "Workplace Safety & OSHA Compliance",
    progress: 20,
    ceHours: 4,
    image: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=400&h=250&fit=crop",
    nextLesson: "Hazard Identification",
    timeRemaining: "5 hours left",
  },
];

const certificates = [
  {
    id: 1,
    courseTitle: "Business Management for Professionals",
    issueDate: "December 15, 2024",
    ceHours: 6,
    certificateId: "FGI-2024-001234",
  },
  {
    id: 2,
    courseTitle: "Customer Service Excellence",
    issueDate: "November 28, 2024",
    ceHours: 3,
    certificateId: "FGI-2024-001156",
  },
];

const recentActivity = [
  { action: "Completed lesson", course: "Infection Control", time: "2 hours ago" },
  { action: "Started assessment", course: "Ethics & Standards", time: "Yesterday" },
  { action: "Downloaded certificate", course: "Business Management", time: "2 days ago" },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"courses" | "certificates" | "progress">("courses");

  return (
    <div className="min-h-screen bg-muted">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="container-wide">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <img src={fgiLogo} alt="FGI" className="h-10 w-10" />
              <div className="hidden sm:block">
                <p className="font-heading font-bold text-primary leading-tight">FGI</p>
                <p className="text-xs text-muted-foreground">Learning Portal</p>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={userData.avatar} alt={userData.name} />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{userData.name}</p>
                      <p className="text-xs text-muted-foreground">{userData.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" asChild>
                    <Link to="/login">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container-wide py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome back, {userData.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Continue your learning journey. You're making great progress!
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen, label: "Enrolled Courses", value: userData.enrolledCourses, color: "text-primary" },
            { icon: CheckCircle2, label: "Completed", value: userData.completedCourses, color: "text-green-600" },
            { icon: Clock, label: "CE Hours Earned", value: userData.totalCeHours, color: "text-secondary" },
            { icon: Award, label: "Certificates", value: userData.certificates, color: "text-purple-600" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Courses */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-2 p-1 bg-card rounded-lg border border-border">
              {[
                { id: "courses", label: "My Courses", icon: BookOpen },
                { id: "certificates", label: "Certificates", icon: Award },
                { id: "progress", label: "Progress", icon: TrendingUp },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "courses" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {enrolledCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all group">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative md:w-48 h-32 md:h-auto overflow-hidden">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-10 h-10 text-white" />
                          </div>
                        </div>
                        <CardContent className="flex-1 p-5">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                              {course.title}
                            </h3>
                            <Badge variant="secondary">{course.ceHours} CE</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            Next: {course.nextLesson} • {course.timeRemaining}
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium text-foreground">{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-2" />
                            </div>
                            <Button size="sm" variant="secondary" asChild>
                              <Link to={`/courses/${course.id}/learn`}>
                                Continue
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                ))}

                <Button variant="outline" className="w-full" asChild>
                  <Link to="/courses">
                    Browse More Courses
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </motion.div>
            )}

            {activeTab === "certificates" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {certificates.map((cert, index) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                              <GraduationCap className="w-6 h-6 text-secondary" />
                            </div>
                            <div>
                              <h3 className="font-heading font-semibold text-foreground mb-1">
                                {cert.courseTitle}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Issued: {cert.issueDate}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <span className="text-secondary font-medium">
                                  {cert.ceHours} CE Hours
                                </span>
                                <span className="text-muted-foreground">
                                  ID: {cert.certificateId}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === "progress" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading flex items-center gap-2">
                      <Target className="w-5 h-5 text-secondary" />
                      Your Learning Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Monthly CE Hours Goal</span>
                        <span className="font-semibold">12 / 20 hours</span>
                      </div>
                      <Progress value={60} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Courses to Complete This Month</span>
                        <span className="font-semibold">2 / 3 courses</span>
                      </div>
                      <Progress value={66} className="h-3" />
                    </div>
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Keep up the great work! You're on track to meet your learning goals this month.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Right Column - Activity & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="secondary" className="w-full justify-start" asChild>
                  <Link to="/courses">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse Courses
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("certificates")}>
                  <Award className="w-4 h-4 mr-2" />
                  View All Certificates
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("progress")}>
                  <Calendar className="w-4 h-4 mr-2" />
                  View CE Transcript
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-secondary mt-2" />
                      <div>
                        <p className="text-sm text-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.course} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

           
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
