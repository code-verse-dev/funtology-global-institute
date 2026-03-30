import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { lessonFileUrl } from "@/pages/admin/lessonFileUrl";
import { OrganizationCoursesList } from "@/pages/organization/OrganizationCoursesList";
import { useGetMyCertificatesQuery } from "@/redux/services/apiSlices/certificateSlice";
import { useGetMyPassedCoursesQuery } from "@/redux/services/apiSlices/lessonSlice";
import type { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { useGetLearnerStatsQuery } from "@/redux/services/apiSlices/learnerSlice";

function learnerFirstName(user: Record<string, unknown> | null | undefined) {
  if (!user || typeof user !== "object") return "there";
  const first = typeof user.firstName === "string" ? user.firstName.trim() : "";
  if (first) return first;
  const email = typeof user.email === "string" ? user.email : "";
  if (email) return email.split("@")[0] ?? "there";
  return "there";
}

const userData = {
  enrolledCourses: 4,
  completedCourses: 2,
  totalCeHours: 12,
  certificates: 0,
};

const recentActivity = [
  { action: "Completed lesson", course: "Infection Control", time: "2 hours ago" },
  { action: "Started assessment", course: "Ethics & Standards", time: "Yesterday" },
  { action: "Downloaded certificate", course: "Business Management", time: "2 days ago" },
];

type LearnerCertificate = {
  _id: string;
  certificateUrl?: string;
  createdAt?: string;
  course?: { _id?: string; title?: string; image?: string } | string;
  student?: string;
  quizResponse?: string;
  lesson?: { _id?: string; type?: string; order?: number };
};

type MyCertificatesResponse = { data?: LearnerCertificate[] };
type PassedCourseItem = {
  lessonId?: string;
  passedAt?: string;
  percentage?: number;
  quizResponseId?: string;
  course?: { _id?: string; title?: string; image?: string; ceHours?: number };
};
type MyPassedCoursesResponse = { data?: { courses?: PassedCourseItem[]; passThresholdPercent?: number } };
function formatIssuedDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
}

const DashboardHome = () => {
  const location = useLocation();
  const stateTab = (location.state as { activeTab?: "courses" | "certificates" | "progress" | "passedCourses" } | null)?.activeTab;
  const [activeTab, setActiveTab] = useState<"courses" | "certificates" | "passedCourses">("courses");
  const userFromStore = useSelector((s: RootState) => s.user.userData) as Record<string, unknown> | undefined;
  const welcomeName = learnerFirstName(userFromStore);
  const { data: myCertificates, refetch } = useGetMyCertificatesQuery();
  const certificates = (myCertificates as MyCertificatesResponse | undefined)?.data ?? [];
  const { data: myPassedCourses, refetch: refetchMyPassedCourses } = useGetMyPassedCoursesQuery();
  const passedCoursesData = (myPassedCourses as MyPassedCoursesResponse | undefined)?.data;
  const passedCourses = passedCoursesData?.courses ?? [];
  const passThresholdPercent = passedCoursesData?.passThresholdPercent ?? 0;
  const { data: learnerStats } = useGetLearnerStatsQuery();
  const totalCeHours = passedCourses.reduce((acc, curr) => acc + (curr.course?.ceHours ?? 0), 0);
  useEffect(() => {
    if (!stateTab) return;
    setActiveTab(stateTab === "progress" ? "passedCourses" : stateTab);
    void refetch();
    void refetchMyPassedCourses();
  }, [stateTab, refetch, refetchMyPassedCourses]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
          Welcome back, {welcomeName}! 👋
        </h1>
        <p className="text-muted-foreground">Continue your learning journey. You&apos;re making great progress!</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: BookOpen, label: "Enrolled Courses", value: learnerStats?.data?.assignedCourses, color: "text-primary" },
          { icon: CheckCircle2, label: "Completed", value: learnerStats?.data?.passedCourses, color: "text-green-600" },
          { icon: Clock, label: "CE Hours Earned", value: totalCeHours, color: "text-secondary" },
          { icon: Award, label: "Certificates", value: learnerStats?.data?.passedCourses, color: "text-purple-600" },
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

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-2 p-1 bg-card rounded-lg border border-border">
            {[
              { id: "courses" as const, label: "My Courses", icon: BookOpen },
              { id: "certificates" as const, label: "Certificates", icon: Award },
              { id: "passedCourses" as const, label: "Passed Courses", icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
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

          {activeTab === "courses" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <OrganizationCoursesList variant="overview" linkBase="/dashboard/courses" />
              <Button variant="outline" className="w-full" asChild>
                <Link to="/courses">
                  Browse catalog
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </motion.div>
          )}

          {activeTab === "certificates" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {certificates.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-sm text-muted-foreground text-center">
                    No certificates found yet.
                  </CardContent>
                </Card>
              ) : (
                certificates.map((cert, index) => {
                  const courseTitle =
                    cert.course && typeof cert.course === "object" ? cert.course.title || "Course certificate" : "Course certificate";
                  const downloadUrl = lessonFileUrl(cert.certificateUrl);

                  return (
                    <motion.div
                      key={cert._id}
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
                                <h3 className="font-heading font-semibold text-foreground mb-1">{courseTitle}</h3>
                                <p className="text-sm text-muted-foreground">Issued: {formatIssuedDate(cert.createdAt)}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm">
                                  <span className="text-muted-foreground">ID: {cert._id}</span>
                                </div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2" asChild disabled={!downloadUrl}>
                              <a href={downloadUrl ?? "#"} target="_blank" rel="noopener noreferrer" download>
                                <Download className="w-4 h-4" />
                                Download
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}

          {activeTab === "passedCourses" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-secondary" />
                    Passed Courses
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {passedCourses.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No passed courses yet.</p>
                  ) : (
                    passedCourses.map((item, idx) => {
                      const title = item.course?.title || "Course";
                      const score = Number(item.percentage ?? 0);
                      const image = lessonFileUrl(item.course?.image);
                      return (
                        <div key={item.quizResponseId ?? item.lessonId ?? idx} className="flex items-center gap-3 rounded-lg border border-border p-3">
                          {image ? (
                            <img src={image} alt={title} className="h-12 w-16 rounded object-cover border border-border" />
                          ) : (
                            <div className="h-12 w-16 rounded border border-border bg-muted flex items-center justify-center text-xs text-muted-foreground">
                              No image
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">{title}</p>
                            <p className="text-xs text-muted-foreground">Passed on {formatIssuedDate(item.passedAt)}</p>
                          </div>
                          <Badge variant="secondary" className="whitespace-nowrap">
                            {score}% (pass {passThresholdPercent}%)
                          </Badge>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="secondary" className="w-full justify-start" asChild>
                <Link to="/dashboard/courses">
                  <BookOpen className="w-4 h-4 mr-2" />
                  My courses
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/courses">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse catalog
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("certificates")}>
                <Award className="w-4 h-4 mr-2" />
                View All Certificates
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("passedCourses")}>
                <Calendar className="w-4 h-4 mr-2" />
                View Passed Courses
              </Button>
            </CardContent>
          </Card>

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
    </>
  );
};

export default DashboardHome;





