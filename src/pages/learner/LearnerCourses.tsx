import { motion } from "framer-motion";
import { OrganizationCoursesList } from "@/pages/organization/OrganizationCoursesList";

const LearnerCourses = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <h2 className="font-heading text-lg font-bold">My Courses</h2>
    <p className="text-sm text-muted-foreground -mt-4">
      Published Courses Available to You. Open a Course to View PDF Materials and Quiz Content.
    </p>
    <OrganizationCoursesList variant="full" linkBase="/dashboard/courses" />
  </motion.div>
);

export default LearnerCourses;
