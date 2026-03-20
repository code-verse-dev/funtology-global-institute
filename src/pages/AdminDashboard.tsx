import fgiLogo from "@/assets/fgi-logo.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  GraduationCap,
  History,
  LogOut,
  MessageSquare,
  MoreVertical,
  Plus,
  Scale,
  Search,
  Settings,
  Shield,
  Trash2,
  Upload,
  User,
  UserCheck,
  Users,
  XCircle
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const adminData = { name: "Admin User", email: "admin@fgi.edu", role: "Administrator" };

const systemStats = [
  { icon: Users, label: "Total Users", value: "12,450", change: "+8.2%", color: "text-primary" },
  { icon: BookOpen, label: "Active Courses", value: "48", change: "+3", color: "text-blue-600" },
  { icon: Award, label: "Certificates Issued", value: "8,920", change: "+12.5%", color: "text-secondary" },
  { icon: DollarSign, label: "Revenue (MTD)", value: "$45,230", change: "+15.3%", color: "text-green-600" },
];

const recentUsers = [
  { id: 1, name: "Emma Watson", email: "emma@email.com", role: "Learner", status: "active", joined: "2 hours ago", courses: 3 },
  { id: 2, name: "James Park", email: "james@corp.com", role: "Organization", status: "active", joined: "5 hours ago", courses: 12 },
  { id: 3, name: "Sofia Martinez", email: "sofia@email.com", role: "Learner", status: "pending", joined: "1 day ago", courses: 0 },
  { id: 4, name: "Lisa Thompson", email: "lisa@email.com", role: "Learner", status: "suspended", joined: "3 days ago", courses: 1 },
];

const courseManagement = [
  { id: 1, title: "Professional Infection Control & Prevention", enrolled: 312, completion: 78, revenue: "$27,768", status: "published", ceHours: 4, workflow: "Published" },
  { id: 2, title: "Advanced Cosmetology Certification", enrolled: 189, completion: 65, revenue: "$28,161", status: "published", ceHours: 8, workflow: "Published" },
  { id: 3, title: "Business Management for Professionals", enrolled: 456, completion: 82, revenue: "$58,824", status: "published", ceHours: 6, workflow: "Published" },
  { id: 4, title: "Ethics & Professional Standards", enrolled: 890, completion: 91, revenue: "$43,610", status: "published", ceHours: 2, workflow: "Published" },
  { id: 5, title: "Workplace Safety & OSHA Compliance", enrolled: 0, completion: 0, revenue: "$0", status: "draft", ceHours: 4, workflow: "SME Review" },
];

const auditLog = [
  { action: "Course published", user: "Admin", details: "Ethics & Professional Standards v2.1", time: "1 hour ago", type: "course" },
  { action: "User suspended", user: "Admin", details: "Lisa Thompson - Policy violation", time: "3 hours ago", type: "user" },
  { action: "Certificate issued", user: "System", details: "FGI-2026-004521 to Emma Watson", time: "5 hours ago", type: "certificate" },
  { action: "SME credential updated", user: "Admin", details: "Dr. Mitchell - License renewed", time: "Yesterday", type: "sme" },
  { action: "Assessment updated", user: "Admin", details: "Added 10 questions to Ethics quiz", time: "2 days ago", type: "assessment" },
  { action: "Complaint resolved", user: "Admin", details: "Ticket #1023 - Payment issue", time: "3 days ago", type: "complaint" },
  { action: "Policy updated", user: "Admin", details: "Refund Policy v3.2 published", time: "4 days ago", type: "policy" },
];

const smeProfiles = [
  { id: 1, name: "Dr. Sarah Mitchell", role: "Subject Matter Expert", credentials: "PhD, RN, CIC", status: "approved", expiry: "Dec 2027", courses: 3 },
  { id: 2, name: "Prof. James Wilson", role: "Content Developer", credentials: "Ed.D., IACET Admin", status: "approved", expiry: "Aug 2026", courses: 2 },
  { id: 3, name: "Dr. Emily Chen", role: "Reviewer", credentials: "PhD Curriculum Design", status: "pending", expiry: "N/A", courses: 0 },
];

const complaints = [
  { id: "T-1023", subject: "Payment not processed", learner: "John Smith", status: "resolved", date: "Feb 5, 2026", resolution: "Refund issued" },
  { id: "T-1024", subject: "Assessment score dispute", learner: "Maria Garcia", status: "in_review", date: "Feb 8, 2026", resolution: "" },
  { id: "T-1025", subject: "Certificate not received", learner: "David Lee", status: "open", date: "Feb 10, 2026", resolution: "" },
];

const paymentLog = [
  { id: "PAY-2026-001", learner: "Emma Watson", course: "Infection Control", amount: "$89", method: "Visa •••4521", status: "completed", date: "Feb 10, 2026" },
  { id: "PAY-2026-002", learner: "James Park", course: "Ethics (12 seats)", amount: "$948", method: "Invoice", status: "completed", date: "Feb 9, 2026" },
  { id: "PAY-2026-003", learner: "Sofia Martinez", course: "OSHA Compliance", amount: "$79", method: "MC •••8832", status: "pending", date: "Feb 8, 2026" },
  { id: "PAY-2026-004", learner: "David Lee", course: "Cosmetology", amount: "$149", method: "Visa •••1234", status: "refunded", date: "Feb 6, 2026" },
];

type AdminTab = "overview" | "users" | "courses" | "sme" | "payments" | "complaints" | "reports" | "audit" | "settings";

const sidebarNav = [
  { id: "overview" as AdminTab, label: "Overview", icon: Activity },
  { id: "users" as AdminTab, label: "User Management", icon: Users },
  { id: "courses" as AdminTab, label: "Course Management", icon: BookOpen },
  { id: "sme" as AdminTab, label: "SME Repository", icon: Briefcase },
  { id: "payments" as AdminTab, label: "Payments & Revenue", icon: DollarSign },
  { id: "complaints" as AdminTab, label: "Complaints & Appeals", icon: MessageSquare },
  { id: "reports" as AdminTab, label: "Reports & Analytics", icon: BarChart3 },
  { id: "audit" as AdminTab, label: "Audit Log", icon: History },
  { id: "settings" as AdminTab, label: "System Settings", icon: Settings },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [userSearch, setUserSearch] = useState("");

  const filteredUsers = recentUsers.filter(
    (u) => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-primary flex-col fixed inset-y-0 left-0 z-40">
        <div className="p-6 border-b border-primary-foreground/10">
          <Link to="/" className="flex items-center gap-3">
            <img src={fgiLogo} alt="FGI" className="h-10 w-10" />
            <div>
              <p className="font-heading font-bold text-primary-foreground leading-tight">FGI Admin</p>
              <p className="text-xs text-secondary">Control Panel</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id
                  ? "bg-secondary text-secondary-foreground"
                  : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-primary-foreground/10">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <Shield className="w-4 h-4 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary-foreground">{adminData.name}</p>
              <p className="text-xs text-primary-foreground/60">{adminData.role}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 bg-background border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="lg:hidden"><Link to="/"><img src={fgiLogo} alt="FGI" className="h-8 w-8" /></Link></div>
              <h1 className="font-heading text-xl font-bold text-foreground">
                {sidebarNav.find((n) => n.id === activeTab)?.label}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">7</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 rounded-full"><Avatar className="h-10 w-10"><AvatarFallback>AD</AvatarFallback></Avatar></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>{adminData.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
                  <DropdownMenuItem><Settings className="mr-2 h-4 w-4" />Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" asChild><Link to="/login"><LogOut className="mr-2 h-4 w-4" />Log out</Link></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Mobile Tab Nav */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2">
            {sidebarNav.map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === item.id ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"
                }`}>
                <item.icon className="w-3 h-3" />{item.label}
              </button>
            ))}
          </div>

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {systemStats.map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                          </div>
                          <stat.icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                        <p className="text-xs text-green-600 font-medium mt-2">{stat.change} from last month</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-heading">Recent Activity</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("audit")}>View All</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {auditLog.slice(0, 5).map((log, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                          <Activity className="w-4 h-4 text-secondary mt-1 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{log.action}</p>
                            <p className="text-xs text-muted-foreground">{log.details}</p>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{log.time}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <div className="space-y-6">
                  <Card>
                    <CardHeader><CardTitle className="font-heading text-lg">Quick Actions</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="secondary" className="w-full justify-start gap-2" onClick={() => setActiveTab("courses")}><Plus className="w-4 h-4" />Create Course</Button>
                      <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setActiveTab("users")}><UserCheck className="w-4 h-4" />Manage Users</Button>
                      <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setActiveTab("sme")}><Briefcase className="w-4 h-4" />SME Repository</Button>
                      <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setActiveTab("payments")}><DollarSign className="w-4 h-4" />View Payments</Button>
                      <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setActiveTab("reports")}><Download className="w-4 h-4" />Export Reports</Button>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-hero text-primary-foreground">
                    <CardContent className="pt-6 text-center">
                      <Shield className="w-12 h-12 text-secondary mx-auto mb-3" />
                      <p className="font-heading text-lg font-bold text-secondary">Accreditation Ready</p>
                      <p className="text-xs text-primary-foreground/70 mt-1">ANSI/IACET 1-2018 guiding framework</p>
                      <p className="text-xs text-primary-foreground/50 mt-2">All systems audit-ready</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {/* USERS */}
          {activeTab === "users" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search users..." className="pl-10" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" />Filter</Button>
                  <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export CSV</Button>
                  <Button variant="secondary" size="sm"><Plus className="w-4 h-4 mr-2" />Add User</Button>
                </div>
              </div>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>User</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Courses</TableHead><TableHead>Joined</TableHead><TableHead className="w-12"></TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                              <div><p className="font-medium text-sm">{user.name}</p><p className="text-xs text-muted-foreground">{user.email}</p></div>
                            </div>
                          </TableCell>
                          <TableCell><Badge variant={user.role === "Organization" ? "default" : "outline"}>{user.role}</Badge></TableCell>
                          <TableCell>
                            <Badge variant={user.status === "active" ? "secondary" : user.status === "pending" ? "outline" : "destructive"} className="gap-1">
                              {user.status === "active" ? <CheckCircle2 className="w-3 h-3" /> : user.status === "suspended" ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.courses}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{user.joined}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />View</DropdownMenuItem>
                                <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                                <DropdownMenuItem><Award className="w-4 h-4 mr-2" />Certificates</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Suspend</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <h2 className="font-heading text-lg font-bold">Course Management</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export</Button>
                  <Button variant="secondary" size="sm"><Plus className="w-4 h-4 mr-2" />Create Course</Button>
                </div>
              </div>
              {/* Workflow Info */}
              <Card className="bg-muted/50 border-dashed">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground"><strong>Course Workflow:</strong> Draft → SME Review → Admin Approval → Published. All status changes are timestamped in the audit log.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Course</TableHead><TableHead>Status</TableHead><TableHead>Workflow</TableHead><TableHead>CE Hours</TableHead><TableHead>Enrolled</TableHead><TableHead>Completion</TableHead><TableHead>Revenue</TableHead><TableHead className="w-12"></TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {courseManagement.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium max-w-xs"><p className="truncate">{course.title}</p></TableCell>
                          <TableCell><Badge variant={course.status === "published" ? "secondary" : "outline"}>{course.status}</Badge></TableCell>
                          <TableCell><Badge variant={course.workflow === "Published" ? "secondary" : "default"}>{course.workflow}</Badge></TableCell>
                          <TableCell>{course.ceHours}</TableCell>
                          <TableCell>{course.enrolled}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2"><Progress value={course.completion} className="h-2 w-16" /><span className="text-sm">{course.completion}%</span></div>
                          </TableCell>
                          <TableCell className="font-medium">{course.revenue}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />Preview</DropdownMenuItem>
                                <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit / Needs Analysis</DropdownMenuItem>
                                <DropdownMenuItem><Upload className="w-4 h-4 mr-2" />Upload Content</DropdownMenuItem>
                                <DropdownMenuItem><ClipboardList className="w-4 h-4 mr-2" />Question Bank</DropdownMenuItem>
                                <DropdownMenuItem><Scale className="w-4 h-4 mr-2" />CE Hour Worksheet</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem><BarChart3 className="w-4 h-4 mr-2" />Analytics</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* SME REPOSITORY */}
          {activeTab === "sme" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-lg font-bold">SME / Credential Repository</h2>
                  <p className="text-sm text-muted-foreground">Admin-managed instructor/SME profiles and credentials</p>
                </div>
                <Button variant="secondary" size="sm"><Plus className="w-4 h-4 mr-2" />Add SME Profile</Button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {smeProfiles.map((sme, i) => (
                  <motion.div key={sme.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card className="hover:shadow-md transition-all">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3 mb-4">
                          <Avatar className="h-12 w-12"><AvatarFallback>{sme.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                          <div>
                            <h3 className="font-heading font-semibold text-foreground">{sme.name}</h3>
                            <p className="text-sm text-secondary">{sme.role}</p>
                            <p className="text-xs text-muted-foreground">{sme.credentials}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <Badge variant={sme.status === "approved" ? "secondary" : "outline"} className="gap-1">
                              {sme.status === "approved" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              {sme.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Credential Expiry</span>
                            <span className="font-medium">{sme.expiry}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Assigned Courses</span>
                            <span className="font-medium">{sme.courses}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 gap-1"><Eye className="w-3 h-3" />View</Button>
                          <Button variant="outline" size="sm" className="flex-1 gap-1"><Upload className="w-3 h-3" />Docs</Button>
                          <Button variant="outline" size="sm" className="flex-1 gap-1"><Edit className="w-3 h-3" />Edit</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* PAYMENTS */}
          {activeTab === "payments" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Revenue", value: "$45,230", icon: DollarSign, color: "text-green-600" },
                  { label: "Transactions", value: "1,234", icon: CreditCard, color: "text-primary" },
                  { label: "Refunds", value: "$890", icon: AlertTriangle, color: "text-destructive" },
                  { label: "Pending", value: "$340", icon: Clock, color: "text-secondary" },
                ].map((s, i) => (
                  <Card key={s.label}><CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div><p className="text-2xl font-bold text-foreground">{s.value}</p><p className="text-sm text-muted-foreground">{s.label}</p></div>
                      <s.icon className={`w-8 h-8 ${s.color}`} />
                    </div>
                  </CardContent></Card>
                ))}
              </div>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-heading">Transaction Log</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export CSV</Button>
                    <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export PDF</Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Transaction ID</TableHead><TableHead>Learner</TableHead><TableHead>Course</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {paymentLog.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.id}</TableCell>
                          <TableCell>{p.learner}</TableCell>
                          <TableCell className="max-w-xs truncate">{p.course}</TableCell>
                          <TableCell className="font-medium">{p.amount}</TableCell>
                          <TableCell className="text-muted-foreground">{p.method}</TableCell>
                          <TableCell>
                            <Badge variant={p.status === "completed" ? "secondary" : p.status === "pending" ? "outline" : "destructive"} className="gap-1">
                              {p.status === "completed" ? <CheckCircle2 className="w-3 h-3" /> : p.status === "refunded" ? <AlertTriangle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              {p.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{p.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* COMPLAINTS */}
          {activeTab === "complaints" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold">Complaints & Appeals</h2>
                <Button variant="secondary" size="sm"><Plus className="w-4 h-4 mr-2" />New Ticket</Button>
              </div>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Ticket</TableHead><TableHead>Subject</TableHead><TableHead>Learner</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead>Resolution</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {complaints.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium">{c.id}</TableCell>
                          <TableCell>{c.subject}</TableCell>
                          <TableCell>{c.learner}</TableCell>
                          <TableCell>
                            <Badge variant={c.status === "resolved" ? "secondary" : c.status === "in_review" ? "outline" : "default"} className="gap-1">
                              {c.status === "resolved" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              {c.status.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{c.date}</TableCell>
                          <TableCell className="text-muted-foreground">{c.resolution || "—"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* REPORTS */}
          {activeTab === "reports" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "Course Completion Report", desc: "Detailed completion stats per course", icon: BookOpen },
                  { title: "CE Hour Summary", desc: "Total contact hours awarded by period", icon: Clock },
                  { title: "Assessment Analytics", desc: "Pass/fail rates and score distributions", icon: ClipboardList },
                  { title: "Certificate Issuance Log", desc: "All certificates with verification IDs", icon: Award },
                  { title: "Evaluation Summary", desc: "Course evaluation feedback and trends", icon: FileText },
                  { title: "Financial Report", desc: "Revenue, refunds, and payment history", icon: DollarSign },
                  { title: "SME Participation", desc: "SME activity and course assignments", icon: Briefcase },
                  { title: "Learner Transcript", desc: "Individual learner records and history", icon: GraduationCap },
                  { title: "Compliance Audit", desc: "Framework alignment and audit trail", icon: Shield },
                ].map((report, i) => (
                  <motion.div key={report.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="hover:shadow-md hover:border-secondary/30 transition-all cursor-pointer group">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                            <report.icon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-heading font-semibold text-foreground mb-1">{report.title}</h3>
                            <p className="text-sm text-muted-foreground">{report.desc}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm" className="gap-1"><Download className="w-3 h-3" />CSV</Button>
                          <Button variant="outline" size="sm" className="gap-1"><Download className="w-3 h-3" />PDF</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* AUDIT LOG */}
          {activeTab === "audit" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold">Full Audit Trail</h2>
                <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export Log</Button>
              </div>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Action</TableHead><TableHead>User</TableHead><TableHead>Details</TableHead><TableHead>Type</TableHead><TableHead>Timestamp</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {auditLog.map((log, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{log.action}</TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell className="text-muted-foreground max-w-xs truncate">{log.details}</TableCell>
                          <TableCell><Badge variant="outline">{log.type}</Badge></TableCell>
                          <TableCell className="text-muted-foreground">{log.time}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle className="font-heading">Assessment Configuration</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: "Minimum Passing Score", desc: "Required score to pass", value: "70%" },
                      { label: "Maximum Retakes", desc: "Allowed retakes per assessment", value: "2" },
                      { label: "Retake Waiting Period", desc: "Days between attempts", value: "30 days" },
                    ].map(s => (
                      <div key={s.label} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div><p className="font-medium text-sm">{s.label}</p><p className="text-xs text-muted-foreground">{s.desc}</p></div>
                        <Badge variant="secondary">{s.value}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="font-heading">Platform Settings</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: "Record Retention", desc: "Minimum data retention", value: "7 years" },
                      { label: "Time-on-Task Tracking", desc: "Prevent auto-completion", value: "Enabled" },
                      { label: "Mandatory Evaluations", desc: "Required before certificate", value: "Enabled" },
                      
                    ].map(s => (
                      <div key={s.label} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div><p className="font-medium text-sm">{s.label}</p><p className="text-xs text-muted-foreground">{s.desc}</p></div>
                        <Badge variant={s.value === "No" ? "outline" : "secondary"}>{s.value}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="font-heading">Policy Documents</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {["CE Policy Manual", "SME Qualification Policy", "Assessment Policy", "Complaints & Appeals Policy", "Accessibility Policy", "Records Retention Policy", "Ethics & Marketing Policy"].map((doc) => (
                      <div key={doc} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-secondary" /><span className="text-sm">{doc}</span></div>
                        <Button variant="ghost" size="sm"><Edit className="w-3 h-3" /></Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="font-heading">Security & Access</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: "Two-Factor Auth", desc: "Required for admin accounts", value: "Enabled" },
                      { label: "Data Encryption", desc: "At rest and in transit", value: "AES-256" },
                      { label: "Backup Schedule", desc: "Automated database backups", value: "Daily" },
                    ].map(s => (
                      <div key={s.label} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div><p className="font-medium text-sm">{s.label}</p><p className="text-xs text-muted-foreground">{s.desc}</p></div>
                        <Badge variant="secondary">{s.value}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
