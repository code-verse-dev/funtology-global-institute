import { motion } from "framer-motion";
import { OrganizationCoursesList } from "./OrganizationCoursesList";

const OrganizationCourses = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <h2 className="font-heading text-lg font-bold">Courses</h2>
    <OrganizationCoursesList variant="full" />
  </motion.div>
);

export default OrganizationCourses;
