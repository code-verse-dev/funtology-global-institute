import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CourseLearn from "./pages/CourseLearn";
import About from "./pages/About";
import Policies from "./pages/Policies";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import RecoverPassword from "./pages/RecoverPassword";
import Register from "./pages/Register";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import LearnerCourses from "./pages/learner/LearnerCourses";
import LearnerCourseDetail from "./pages/learner/LearnerCourseDetail";
import LearnerQuizAttempt from "./pages/learner/LearnerQuizAttempt";
import AdminDashboardLayout from "./pages/AdminDashboardLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserDetail from "./pages/admin/AdminUserDetail";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminCourseContent from "./pages/admin/AdminCourseContent";
import AdminCourseQuestionBank from "./pages/admin/AdminCourseQuestionBank";
import AdminSme from "./pages/admin/AdminSme";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminReports from "./pages/admin/AdminReports";
import AdminAudit from "./pages/admin/AdminAudit";
import AdminSettings from "./pages/admin/AdminSettings";
import OrganizationDashboardLayout from "./pages/OrganizationDashboardLayout";
import OrganizationOverview from "./pages/organization/OrganizationOverview";
import OrganizationLearners from "./pages/organization/OrganizationLearners";
import OrganizationCourses from "./pages/organization/OrganizationCourses";
import OrganizationCourseDetail from "./pages/organization/OrganizationCourseDetail";
import OrganizationBilling from "./pages/organization/OrganizationBilling";
import OrganizationCertificates from "./pages/organization/OrganizationCertificates";
import OrganizationRetakeRequests from "./pages/organization/OrganizationRetakeRequests";
import CertificateVerification from "./pages/CertificateVerification";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./pages/protectedRoute";
import SubscriptionRequiredRoute from "./pages/protectedRoute/SubscriptionRequiredRoute";
import Payment from "./pages/stripePayment";
import { getBasename } from "./utils/Functions";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={getBasename()}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/courses/:id/learn" element={<CourseLearn />} />
          <Route path="/about" element={<About />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/policies/:section" element={<Policies />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/organization/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/recover-password" element={<RecoverPassword />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/payment"
            element={
              <ProtectedRoute allowedRoles={["learner", "organization"]}>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["learner"]}>
                <SubscriptionRequiredRoute>
                  <DashboardLayout />
                </SubscriptionRequiredRoute>
              </ProtectedRoute>
            }
          >
            <Route index element={
              <ProtectedRoute allowedRoles={["learner"]}>
                <DashboardHome />
              </ProtectedRoute>
            } />
            <Route path="courses" element={
              <ProtectedRoute allowedRoles={["learner"]}>
                <LearnerCourses />
              </ProtectedRoute>
            } />
            <Route path="courses/:courseId" element={
              <ProtectedRoute allowedRoles={["learner"]}>
                <LearnerCourseDetail />
              </ProtectedRoute>
            } />
            <Route path="courses/:courseId/quiz" element={
              <ProtectedRoute allowedRoles={["learner"]}>
                <LearnerQuizAttempt />
              </ProtectedRoute>
            } />
          </Route>
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminOverview />
              </ProtectedRoute>
            } />
            <Route path="users" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="users/:userId" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminUserDetail />
              </ProtectedRoute>
            } />
            <Route path="courses" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminCourses />
              </ProtectedRoute>
            } />
            <Route path="courses/:courseId/content" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminCourseContent />
              </ProtectedRoute>
            } />
            <Route path="courses/:courseId/question-bank" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminCourseQuestionBank />
              </ProtectedRoute>
            } />
            <Route path="sme" element={<AdminSme />} />
            <Route path="payments" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPayments />
              </ProtectedRoute>
            } />
            <Route path="complaints" element={<AdminComplaints />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="audit" element={<AdminAudit />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route
            path="/organization"
            element={
              <ProtectedRoute allowedRoles={["organization"]}>
                <SubscriptionRequiredRoute>
                  <OrganizationDashboardLayout />
                </SubscriptionRequiredRoute>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={
              <ProtectedRoute allowedRoles={["organization"]}>
                <SubscriptionRequiredRoute>
                  <OrganizationOverview />
                </SubscriptionRequiredRoute>
              </ProtectedRoute>
            } />
            <Route path="learners" element={
              <ProtectedRoute allowedRoles={["organization"]}>
                  <OrganizationLearners />
              </ProtectedRoute>
            } />
            <Route path="courses/:courseId" element={
              <ProtectedRoute allowedRoles={["organization"]}>
                <OrganizationCourseDetail />
              </ProtectedRoute>
            } />
            <Route path="courses" element={
              <ProtectedRoute allowedRoles={["organization"]}>
                <OrganizationCourses />
              </ProtectedRoute>
            } />
            <Route path="retake-requests" element={
              <ProtectedRoute allowedRoles={["organization"]}>
                <OrganizationRetakeRequests />
              </ProtectedRoute>
            } />
            <Route path="billing" element={
              <ProtectedRoute allowedRoles={["organization"]}>
                <OrganizationBilling />
              </ProtectedRoute>
            } />
            <Route path="certificates" element={
              <ProtectedRoute allowedRoles={["organization"]}>
                <OrganizationCertificates />
              </ProtectedRoute>
            } />
          </Route>
          <Route path="/verify" element={<CertificateVerification />} />
          <Route path="/faq" element={<Index />} />
          <Route path="/support" element={<Contact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
