import { Award, BookOpen, TrendingUp, Users } from "lucide-react";

export const orgData = {
  name: "Acme Healthcare Corp",
  admin: "Jennifer Adams",
  email: "jadams@acmehealthcare.com",
  plan: "Enterprise",
  totalLearners: 52,
  activeCourses: 6,
  completedCerts: 38,
  totalSpent: "$12,450",
};

export const orgStats = [
  { icon: Users, label: "Total Learners", value: orgData.totalLearners, color: "text-primary" },
  { icon: BookOpen, label: "Active Courses", value: orgData.activeCourses, color: "text-blue-600" },
  { icon: Award, label: "Certificates Earned", value: orgData.completedCerts, color: "text-secondary" },
  // { icon: TrendingUp, label: "Avg. Completion", value: "82%", color: "text-green-600" },
];
