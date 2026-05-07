import { motion } from "framer-motion";
import { Search, Filter, Clock, Award, ChevronRight, BookOpen, Sparkles, Layers, Timer, BookText } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useGetAllCoursesQuery } from "@/redux/services/apiSlices/courseSlice";
import { lessonFileUrl } from "@/pages/admin/lessonFileUrl";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=250&fit=crop&q=60";

type CatalogCourse = {
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
  readingTime?: number;
  testTime?: number;
};

function coursesFromResponse(data: unknown): CatalogCourse[] {
  if (Array.isArray(data)) return data as CatalogCourse[];
  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { docs?: unknown }).docs)
  ) {
    return (data as { docs: CatalogCourse[] }).docs;
  }
  return [];
}

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: courseData, isLoading } = useGetAllCoursesQuery();
  const coursesDocs = courseData?.data;

  const publishedCourses = useMemo(() => {
    const list = coursesFromResponse(coursesDocs);
    return [...list]
      .filter((c) => c.status === "published")
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [coursesDocs]);

  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return publishedCourses;
    return publishedCourses.filter((course) => {
      const inTitle = course.title.toLowerCase().includes(q);
      const inDesc = (course.description ?? "").toLowerCase().includes(q);
      const inObjectives = (course.learningObjectives ?? []).some((o) => o.toLowerCase().includes(q));
      return inTitle || inDesc || inObjectives;
    });
  }, [publishedCourses, searchQuery]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-16 md:py-24 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-20 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 10, repeat: Infinity }}
            />
          </div>

          <div className="container-wide relative z-10">
            <motion.div
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {!isLoading && publishedCourses.length > 0 ? (
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 mb-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-medium text-secondary">
                    {publishedCourses.length} course{publishedCourses.length !== 1 ? "s" : ""}
                  </span>
                </motion.div>
              ) : null}

              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Course Catalog
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">
              Browse Our Ongoing Education Programs Designed to Support Career Advancement, Workforce Readiness, and Professional Growth.
              </p>

              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    className="pl-12 h-14 bg-background/95 border-0 text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="secondary" className="h-14 px-8 text-lg font-heading font-semibold">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories */}
        {/* <section className="py-6 md:py-8 border-b border-border bg-muted/50">
          <div className="container-wide">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between">
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category, index) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-background text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border"
                      }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
              <div className="flex gap-2">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedLevel === level
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-background text-muted-foreground hover:bg-secondary/10 border border-border"
                      }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section> */}

        {/* Results Count */}
        <section className="py-4 bg-background">
          <div className="container-wide">
            <p className="text-muted-foreground">
              {isLoading ? (
                "Loading courses…"
              ) : (
                <>
                  {/* Showing <span className="font-semibold text-foreground">{filteredCourses.length}</span>
                  {searchQuery.trim()
                    ? ` matching “${searchQuery.trim()}”`
                    : " courses"} */}
                  15+ On-Going Education Courses Available
                </>
              )}
            </p>
          </div>
        </section>

        {/* Course Grid */}
        <section className="py-8 md:py-12">
          <div className="container-wide">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20">
                <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <p className="text-sm text-muted-foreground">Loading catalog…</p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {filteredCourses.map((course, index) => {
                    const imageSrc = lessonFileUrl(course.image) ?? FALLBACK_IMAGE;
                    const topicBadge =
                      course.learningObjectives?.[0] ?? "Professional certificate";
                    const levelLabel =
                      typeof course.level === "number" ? `Level ${course.level}` : "—";
                    const showLevel = course.level && course.level > 0;
                    const price =
                      typeof course.amount === "number" && !Number.isNaN(course.amount)
                        ? course.amount
                        : null;
                    const isFeatured = (course.sortOrder ?? 999) === 1;

                    return (
                      <motion.div
                        key={course._id}
                        className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-secondary/50 hover:shadow-gold transition-all duration-500"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -8 }}
                      >
                        <div className="relative h-48 md:h-52 overflow-hidden">
                          <img
                            src={imageSrc}
                            alt={course.title}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                          <div className="absolute top-4 left-4 flex max-w-[70%] flex-wrap gap-2">
                            {/* <Badge className="bg-secondary text-secondary-foreground font-semibold line-clamp-2 text-left whitespace-normal">
                              {topicBadge}
                            </Badge>
                            {isFeatured ? (
                              <Badge className="bg-primary text-primary-foreground gap-1 shrink-0">
                                <Sparkles className="w-3 h-3" />
                                Featured
                              </Badge>
                            ) : null} */}
                          </div>
                          {showLevel && <Badge className="absolute top-4 right-4 bg-background/90 text-foreground gap-1">
                            <Layers className="h-3 w-3" />
                            {levelLabel}
                          </Badge>}

                          {/* {typeof course.ceHours === "number" ? (
                            <div className="absolute bottom-4 left-4 flex items-center gap-2">
                              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold">
                                <Award className="w-4 h-4" />
                                {course.ceHours} CE Hours
                              </div>
                            </div>
                          ) : null} */}
                        </div>

                        <div className="p-5 md:p-6">
                          <h3 className="font-heading text-lg md:text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {course.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                            {course.description ?? ""}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 mb-5 text-sm text-muted-foreground">
                          {course.readingTime ? (
                          <span className="flex items-center gap-1">
                            <BookText className="w-3.5 h-3.5 shrink-0" aria-hidden />
                            {course.readingTime}hours
                          </span>
                        ) : null}
                        {course.testTime ? (
                          <span className="flex items-center gap-1">
                            <Timer className="w-3.5 h-3.5 shrink-0" aria-hidden />
                            {course.testTime}hours
                          </span>
                        ) : null}
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              <span>Flipbook</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-border">
                            {price !== null ? (
                              <span className="text-2xl font-bold text-foreground">${price}</span>
                            ) : (
                              <span className="text-sm text-muted-foreground">See details</span>
                            )}
                            <Button variant="secondary" size="sm" className="font-heading font-semibold" asChild>
                              <Link to={`/courses/view/${course._id}`}>
                                View Details
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {filteredCourses.length === 0 && !isLoading ? (
                  <motion.div
                    className="text-center py-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                      {publishedCourses.length === 0 ? "No published courses yet" : "No courses found"}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {publishedCourses.length === 0
                        ? "Check back soon for new programs."
                        : "Try a different search term."}
                    </p>
                    {searchQuery.trim() ? (
                      <Button variant="secondary" onClick={() => setSearchQuery("")}>
                        Clear search
                      </Button>
                    ) : null}
                  </motion.div>
                ) : null}
              </>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-primary">
          <div className="container-wide">
            <motion.div
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Advance Your Career?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Join a growing network of learners who have completed, career-focused programs through Funtology Global Institute for Career Innovation (FGI).
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" className="font-heading font-semibold" asChild>
                  <Link to="/register">Get Started Today</Link>
                </Button>
                <Button
                  size="xl"
                  variant="outline"
                  className="font-heading font-semibold text-lg border-secondary/60 text-secondary bg-transparent hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all duration-300"
                  asChild
                >
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
