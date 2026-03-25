import { motion } from "framer-motion";
import { OrganizationCoursesList } from "@/pages/organization/OrganizationCoursesList";

const LearnerCourses = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <h2 className="font-heading text-lg font-bold">My courses</h2>
    <p className="text-sm text-muted-foreground -mt-4">
      Published courses available to you. Open a course to view PDF materials and quiz content.
    </p>
    <OrganizationCoursesList variant="full" linkBase="/dashboard/courses" />
  </motion.div>
);

export default LearnerCourses;
