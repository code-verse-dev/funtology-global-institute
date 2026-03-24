import {
  Award,
  BookOpen,
  DollarSign,
  Users,
} from "lucide-react";

export const adminData = { name: "Admin User", email: "admin@fgi.edu", role: "Administrator" };

export const systemStats = [
  { icon: Users, label: "Total Users", value: "12,450", change: "+8.2%", color: "text-primary" },
  { icon: BookOpen, label: "Active Courses", value: "48", change: "+3", color: "text-blue-600" },
  { icon: Award, label: "Certificates Issued", value: "8,920", change: "+12.5%", color: "text-secondary" },
  { icon: DollarSign, label: "Revenue (MTD)", value: "$45,230", change: "+15.3%", color: "text-green-600" },
];

export const recentUsers = [
  { id: 1, name: "Emma Watson", email: "emma@email.com", role: "Learner", status: "active", joined: "2 hours ago", courses: 3 },
  { id: 2, name: "James Park", email: "james@corp.com", role: "Organization", status: "active", joined: "5 hours ago", courses: 12 },
  { id: 3, name: "Sofia Martinez", email: "sofia@email.com", role: "Learner", status: "pending", joined: "1 day ago", courses: 0 },
  { id: 4, name: "Lisa Thompson", email: "lisa@email.com", role: "Learner", status: "suspended", joined: "3 days ago", courses: 1 },
];

export const auditLog = [
  { action: "Course published", user: "Admin", details: "Ethics & Professional Standards v2.1", time: "1 hour ago", type: "course" },
  { action: "User suspended", user: "Admin", details: "Lisa Thompson - Policy violation", time: "3 hours ago", type: "user" },
  { action: "Certificate issued", user: "System", details: "FGI-2026-004521 to Emma Watson", time: "5 hours ago", type: "certificate" },
  { action: "SME credential updated", user: "Admin", details: "Dr. Mitchell - License renewed", time: "Yesterday", type: "sme" },
  { action: "Assessment updated", user: "Admin", details: "Added 10 questions to Ethics quiz", time: "2 days ago", type: "assessment" },
  { action: "Complaint resolved", user: "Admin", details: "Ticket #1023 - Payment issue", time: "3 days ago", type: "complaint" },
  { action: "Policy updated", user: "Admin", details: "Refund Policy v3.2 published", time: "4 days ago", type: "policy" },
];

export const smeProfiles = [
  { id: 1, name: "Dr. Sarah Mitchell", role: "Subject Matter Expert", credentials: "PhD, RN, CIC", status: "approved", expiry: "Dec 2027", courses: 3 },
  { id: 2, name: "Prof. James Wilson", role: "Content Developer", credentials: "Ed.D., IACET Admin", status: "approved", expiry: "Aug 2026", courses: 2 },
  { id: 3, name: "Dr. Emily Chen", role: "Reviewer", credentials: "PhD Curriculum Design", status: "pending", expiry: "N/A", courses: 0 },
];

export const complaints = [
  { id: "T-1023", subject: "Payment not processed", learner: "John Smith", status: "resolved", date: "Feb 5, 2026", resolution: "Refund issued" },
  { id: "T-1024", subject: "Assessment score dispute", learner: "Maria Garcia", status: "in_review", date: "Feb 8, 2026", resolution: "" },
  { id: "T-1025", subject: "Certificate not received", learner: "David Lee", status: "open", date: "Feb 10, 2026", resolution: "" },
];

export const paymentLog = [
  { id: "PAY-2026-001", learner: "Emma Watson", course: "Infection Control", amount: "$89", method: "Visa •••4521", status: "completed", date: "Feb 10, 2026" },
  { id: "PAY-2026-002", learner: "James Park", course: "Ethics (12 seats)", amount: "$948", method: "Invoice", status: "completed", date: "Feb 9, 2026" },
  { id: "PAY-2026-003", learner: "Sofia Martinez", course: "OSHA Compliance", amount: "$79", method: "MC •••8832", status: "pending", date: "Feb 8, 2026" },
  { id: "PAY-2026-004", learner: "David Lee", course: "Cosmetology", amount: "$149", method: "Visa •••1234", status: "refunded", date: "Feb 6, 2026" },
];
