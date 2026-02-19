import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users, BookOpen, Award, TrendingUp, Download, Upload, Bell, Settings, User, LogOut,
  Plus, CheckCircle2, XCircle, Clock, Search, Building2, DollarSign, FileText, ChevronRight,
  GraduationCap, BarChart3, CreditCard, Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import fgiLogo from "@/assets/fgi-logo.png";

const orgData = {
  name: "Acme Healthcare Corp",
  admin: "Jennifer Adams",
  email: "jadams@acmehealthcare.com",
  plan: "Enterprise",
  totalLearners: 52,
  activeCourses: 6,
  completedCerts: 38,
  totalSpent: "$12,450",
};

const orgStats = [
  { icon: Users, label: "Total Learners", value: orgData.totalLearners, color: "text-primary" },
  { icon: BookOpen, label: "Active Courses", value: orgData.activeCourses, color: "text-blue-600" },
  { icon: Award, label: "Certificates Earned", value: orgData.completedCerts, color: "text-secondary" },
  { icon: TrendingUp, label: "Avg. Completion", value: "82%", color: "text-green-600" },
];

const learners = [
  { id: 1, name: "Maria Garcia", email: "maria@acme.com", department: "Nursing", courses: 3, completed: 2, progress: 85, status: "active" },
  { id: 2, name: "John Smith", email: "john@acme.com", department: "Lab", courses: 2, completed: 1, progress: 60, status: "active" },
  { id: 3, name: "Aisha Patel", email: "aisha@acme.com", department: "Admin", courses: 4, completed: 4, progress: 100, status: "completed" },
  { id: 4, name: "David Lee", email: "david@acme.com", department: "Nursing", courses: 2, completed: 0, progress: 15, status: "active" },
  { id: 5, name: "Sarah Wilson", email: "sarah@acme.com", department: "Lab", courses: 1, completed: 0, progress: 0, status: "invited" },
];

const assignedCourses = [
  { id: 1, title: "Professional Infection Control", assigned: 45, completed: 32, avgScore: 84, ceHours: 4 },
  { id: 2, title: "Ethics & Professional Standards", assigned: 52, completed: 38, avgScore: 91, ceHours: 2 },
  { id: 3, title: "Workplace Safety & OSHA", assigned: 30, completed: 18, avgScore: 78, ceHours: 4 },
];

const billing = [
  { id: "INV-2026-001", date: "Feb 1, 2026", amount: "$4,680", courses: "15 seats × Infection Control", status: "paid" },
  { id: "INV-2026-002", date: "Jan 15, 2026", amount: "$2,548", courses: "52 seats × Ethics", status: "paid" },
  { id: "INV-2025-015", date: "Dec 20, 2025", amount: "$5,222", courses: "30 seats × OSHA + Safety", status: "paid" },
];

type OrgTab = "overview" | "learners" | "courses" | "billing" | "certificates";

const OrganizationDashboard = () => {
  const [activeTab, setActiveTab] = useState<OrgTab>("overview");
  const [learnerSearch, setLearnerSearch] = useState("");

  const filteredLearners = learners.filter((l) =>
    l.name.toLowerCase().includes(learnerSearch.toLowerCase()) ||
    l.email.toLowerCase().includes(learnerSearch.toLowerCase()) ||
    l.department.toLowerCase().includes(learnerSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-muted">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-primary">
        <div className="container-wide">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <img src={fgiLogo} alt="FGI" className="h-10 w-10" />
              <div className="hidden sm:block">
                <p className="font-heading font-bold text-primary-foreground leading-tight">FGI</p>
                <p className="text-xs text-secondary">Organization Portal</p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="hidden sm:flex gap-1">
                <Building2 className="w-3 h-3" />
                {orgData.name}
              </Badge>
              <Button variant="ghost" size="icon" className="text-primary-foreground relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-secondary-foreground text-xs rounded-full flex items-center justify-center">3</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-secondary">
                      <AvatarFallback>JA</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">{orgData.admin}</p>
                    <p className="text-xs text-muted-foreground">{orgData.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
                  <DropdownMenuItem><Settings className="mr-2 h-4 w-4" />Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" asChild>
                    <Link to="/login"><LogOut className="mr-2 h-4 w-4" />Log out</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container-wide py-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Organization Dashboard</h1>
          <p className="text-muted-foreground">Manage your team's learning progress and certifications.</p>
        </motion.div>

        {/* Tab Nav */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {[
            { id: "overview" as OrgTab, label: "Overview", icon: BarChart3 },
            { id: "learners" as OrgTab, label: "Learners", icon: Users },
            { id: "courses" as OrgTab, label: "Courses", icon: BookOpen },
            { id: "billing" as OrgTab, label: "Billing", icon: CreditCard },
            { id: "certificates" as OrgTab, label: "Certificates", icon: Award },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border hover:border-primary/30"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {orgStats.map((stat, index) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
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

            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-heading">Course Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assignedCourses.map((course) => (
                    <div key={course.id} className="p-4 bg-muted rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-heading font-semibold text-sm">{course.title}</h4>
                        <Badge variant="secondary">{course.ceHours} CE</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                        <span>{course.completed}/{course.assigned} completed</span>
                        <span>Avg. Score: {course.avgScore}%</span>
                      </div>
                      <Progress value={(course.completed / course.assigned) * 100} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader><CardTitle className="font-heading text-lg">Quick Actions</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="secondary" className="w-full justify-start gap-2"><Plus className="w-4 h-4" />Add Learners</Button>
                    <Button variant="outline" className="w-full justify-start gap-2"><Upload className="w-4 h-4" />Import CSV</Button>
                    <Button variant="outline" className="w-full justify-start gap-2"><BookOpen className="w-4 h-4" />Assign Courses</Button>
                    <Button variant="outline" className="w-full justify-start gap-2"><Download className="w-4 h-4" />Export Reports</Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-hero text-primary-foreground">
                  <CardContent className="pt-6 text-center">
                    <DollarSign className="w-12 h-12 text-secondary mx-auto mb-3" />
                    <p className="text-2xl font-bold text-secondary">{orgData.totalSpent}</p>
                    <p className="text-primary-foreground/80 text-sm">Total Investment</p>
                    <p className="text-xs text-primary-foreground/50 mt-1">{orgData.plan} Plan</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}

        {/* LEARNERS */}
        {activeTab === "learners" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search learners..." className="pl-10" value={learnerSearch} onChange={(e) => setLearnerSearch(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><Upload className="w-4 h-4 mr-2" />Import CSV</Button>
                <Button variant="outline" size="sm"><Mail className="w-4 h-4 mr-2" />Invite</Button>
                <Button variant="secondary" size="sm"><Plus className="w-4 h-4 mr-2" />Add Learner</Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Learner</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Courses</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLearners.map((learner) => (
                      <TableRow key={learner.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{learner.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                            <div>
                              <p className="font-medium text-sm">{learner.name}</p>
                              <p className="text-xs text-muted-foreground">{learner.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{learner.department}</TableCell>
                        <TableCell>{learner.completed}/{learner.courses}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={learner.progress} className="h-2 w-16" />
                            <span className="text-sm">{learner.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={learner.status === "completed" ? "secondary" : learner.status === "active" ? "outline" : "default"} className="gap-1">
                            {learner.status === "completed" ? <CheckCircle2 className="w-3 h-3" /> : learner.status === "active" ? <Clock className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                            {learner.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* COURSES */}
        {activeTab === "courses" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold">Assigned Courses</h2>
              <Button variant="secondary" size="sm"><Plus className="w-4 h-4 mr-2" />Assign New Course</Button>
            </div>
            {assignedCourses.map((course, index) => (
              <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-heading font-semibold text-foreground mb-1">{course.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span>{course.assigned} assigned</span>
                          <span>{course.completed} completed</span>
                          <span>Avg. {course.avgScore}%</span>
                          <span>{course.ceHours} CE Hours</span>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Completion</span>
                            <span className="font-medium">{Math.round((course.completed / course.assigned) * 100)}%</span>
                          </div>
                          <Progress value={(course.completed / course.assigned) * 100} className="h-2" />
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View Details<ChevronRight className="w-4 h-4 ml-1" /></Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* BILLING */}
        {activeTab === "billing" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold">Billing History</h2>
              <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Download All</Button>
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billing.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-medium">{inv.id}</TableCell>
                        <TableCell>{inv.date}</TableCell>
                        <TableCell className="text-muted-foreground">{inv.courses}</TableCell>
                        <TableCell className="font-medium">{inv.amount}</TableCell>
                        <TableCell><Badge variant="secondary" className="gap-1"><CheckCircle2 className="w-3 h-3" />{inv.status}</Badge></TableCell>
                        <TableCell><Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* CERTIFICATES */}
        {activeTab === "certificates" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold">Team Certificates</h2>
              <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export All</Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {learners.filter(l => l.status === "completed" || l.completed > 0).map((learner, index) => (
                <motion.div key={learner.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Card className="hover:shadow-md transition-all">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-10 w-10"><AvatarFallback>{learner.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                        <div>
                          <p className="font-medium text-sm">{learner.name}</p>
                          <p className="text-xs text-muted-foreground">{learner.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <GraduationCap className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-medium">{learner.completed} Certificate{learner.completed !== 1 ? "s" : ""}</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full gap-2"><Download className="w-4 h-4" />Download All</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default OrganizationDashboard;
