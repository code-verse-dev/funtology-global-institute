import { motion } from "framer-motion";
import { Clock, Award, ArrowRight, Sparkles, BookOpen, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetAllCoursesQuery } from "@/redux/services/apiSlices/courseSlice";
import { lessonFileUrl } from "@/pages/admin/lessonFileUrl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=60";

type FeaturedCourseItem = {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  ceHours?: number;
  status?: string;
  sortOrder?: number;
  level?: number;
  amount?: number;
  learningObjectives?: string[];
};

function coursesFromResponse(data: unknown): FeaturedCourseItem[] {
  if (Array.isArray(data)) return data as FeaturedCourseItem[];
  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { docs?: unknown }).docs)
  ) {
    return (data as { docs: FeaturedCourseItem[] }).docs;
  }
  return [];
}

const FeaturedCourses = () => {
  const { data: coursesRes, isLoading } = useGetAllCoursesQuery();
  const featuredFour = (() => {
    const list = coursesFromResponse(coursesRes?.data);
    return [...list]
      .filter((c) => c.status === "published")
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .slice(0, 4);
  })();
  
  const user = useSelector((state: RootState) => state.user.userData);
  const isLearner = user?.role && user?.role === "learner";
  const isAdmin = user?.role && user?.role === "admin";

  return (
    <section className="py-20 md:py-28 bg-muted relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <div className="container-wide relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4" />
            Featured Programs
          </motion.div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4">
            Start Your Journey Today
          </h2>
          <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-4">
            Professional Development Certificates
          </h3>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive training program designed to build foundational and advanced career skills through structured, measurable learning experiences.
          </p>
        </motion.div>

        {/* Course Grid */}
        {isLoading ? (
          <p className="text-center text-sm text-muted-foreground py-12">Loading featured courses…</p>
        ) : featuredFour.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-12">No published courses yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredFour.map((course, index) => {
              const imageSrc = lessonFileUrl(course.image) ?? FALLBACK_IMAGE;
              const subtitle =
                typeof course.level === "number"
                  ? `Level ${course.level}`
                  : course.learningObjectives?.[0] ?? "Certificate program";
              const price =
                typeof course.amount === "number" && !Number.isNaN(course.amount)
                  ? course.amount
                  : null;

              return (
                <motion.div
                  key={course._id}
                  className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-border hover:border-secondary/30"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="relative h-44 md:h-48 overflow-hidden">
                    <img
                      src={imageSrc}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      {typeof course.ceHours === "number" ? (
                        <Badge className="bg-secondary text-secondary-foreground font-semibold shadow-lg">
                          <Award className="w-3 h-3 mr-1" />
                          {course.ceHours} CE
                        </Badge>
                      ) : null}
                      {typeof course.level === "number" ? (
                        <Badge className="bg-primary text-primary-foreground font-semibold gap-1">
                          <Layers className="w-3 h-3" />
                          L{course.level}
                        </Badge>
                      ) : null}
                    </div>

                    {price !== null ? (
                      <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-white/90 backdrop-blur-sm">
                        <span className="font-heading font-bold text-primary text-lg">${price}</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-semibold text-secondary mb-2 uppercase tracking-wider line-clamp-1">
                      {subtitle}
                    </p>
                    <h3 className="font-heading text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {course.description ?? ""}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {typeof course.ceHours === "number" ? (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {course.ceHours}h
                          </span>
                        ) : null}
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          Flipbook
                        </span>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    className="px-5 pb-5"
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                  >
                    <Button variant="secondary" size="sm" className="w-full font-heading font-semibold" asChild>
                      <Link to={isLearner ? `/dashboard/courses/${course._id}` : isAdmin ? `/admin/courses` : `/organization/courses/${course._id}`}>
                        View Course
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <motion.div
          className="text-center mt-12 md:mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Button size="lg" variant="default" className="font-heading font-semibold shadow-lg" asChild>
            <Link to="/courses">
              View All Courses
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
