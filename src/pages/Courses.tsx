import { motion } from "framer-motion";
import { Search, Filter, Clock, Award, Users, ChevronRight, Star, BookOpen, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useState } from "react";

const courses = [
  {
    id: 1,
    title: "Professional Infection Control & Prevention",
    description: "Comprehensive training on infection control protocols, sanitation procedures, and safety compliance for healthcare and beauty professionals.",
    category: "Healthcare",
    ceHours: 4,
    price: 89,
    originalPrice: 149,
    enrolledCount: 1250,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop",
    level: "Intermediate",
    featured: true,
  },
  {
    id: 2,
    title: "Advanced Cosmetology Certification",
    description: "Master advanced techniques in hair styling, skin care, and nail technology with industry-recognized certification.",
    category: "Cosmetology",
    ceHours: 8,
    price: 149,
    originalPrice: 249,
    enrolledCount: 890,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=250&fit=crop",
    level: "Advanced",
    featured: true,
  },
  {
    id: 3,
    title: "Business Management for Professionals",
    description: "Learn essential business skills including marketing, finance, and client management for career advancement.",
    category: "Business",
    ceHours: 6,
    price: 129,
    originalPrice: 199,
    enrolledCount: 2100,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop",
    level: "Beginner",
  },
  {
    id: 4,
    title: "Ethics & Professional Standards",
    description: "Understanding ethical practices, professional conduct, and regulatory compliance in your industry.",
    category: "Professional Development",
    ceHours: 2,
    price: 49,
    originalPrice: 89,
    enrolledCount: 3500,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop",
    level: "Beginner",
  },
  {
    id: 5,
    title: "Workplace Safety & OSHA Compliance",
    description: "Comprehensive training on workplace safety protocols, hazard identification, and OSHA regulations.",
    category: "Safety",
    ceHours: 4,
    price: 79,
    originalPrice: 129,
    enrolledCount: 1800,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=400&h=250&fit=crop",
    level: "Intermediate",
  },
  {
    id: 6,
    title: "Customer Service Excellence",
    description: "Develop superior customer service skills, communication techniques, and client retention strategies.",
    category: "Business",
    ceHours: 3,
    price: 69,
    originalPrice: 119,
    enrolledCount: 2800,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=400&h=250&fit=crop",
    level: "Beginner",
  },
  {
    id: 7,
    title: "Advanced Leadership & Management",
    description: "Develop essential leadership skills to drive team success and organizational growth in any industry.",
    category: "Leadership",
    ceHours: 10,
    price: 199,
    originalPrice: 349,
    enrolledCount: 756,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
    level: "Advanced",
    featured: true,
  },
  {
    id: 8,
    title: "Digital Marketing Fundamentals",
    description: "Master digital marketing strategies, social media management, and online branding techniques.",
    category: "Marketing",
    ceHours: 5,
    price: 99,
    originalPrice: 159,
    enrolledCount: 1450,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&h=250&fit=crop",
    level: "Beginner",
  },
  {
    id: 9,
    title: "Financial Planning for Professionals",
    description: "Learn to manage business finances, budgeting, and investment strategies for professional growth.",
    category: "Finance",
    ceHours: 6,
    price: 149,
    originalPrice: 229,
    enrolledCount: 980,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
    level: "Intermediate",
  },
];

const categories = ["All", "Healthcare", "Cosmetology", "Business", "Professional Development", "Safety", "Leadership", "Marketing", "Finance"];
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "All Levels" || course.level === selectedLevel;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });

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
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-secondary">
                  {courses.length}+ IACET-Accredited Courses
                </span>
              </motion.div>

              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Course Catalog
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">
                Browse our IACET-accredited continuing education courses designed to advance your career
                and earn recognized professional certifications.
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
        <section className="py-6 md:py-8 border-b border-border bg-muted/50">
          <div className="container-wide">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between">
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category, index) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedLevel === level
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
        </section>

        {/* Results Count */}
        <section className="py-4 bg-background">
          <div className="container-wide">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredCourses.length}</span> courses
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
              {selectedLevel !== "All Levels" && ` for ${selectedLevel}`}
            </p>
          </div>
        </section>

        {/* Course Grid */}
        <section className="py-8 md:py-12">
          <div className="container-wide">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-secondary/50 hover:shadow-gold transition-all duration-500"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="relative h-48 md:h-52 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <Badge className="bg-secondary text-secondary-foreground font-semibold">
                        {course.category}
                      </Badge>
                      {course.featured && (
                        <Badge className="bg-primary text-primary-foreground gap-1">
                          <Sparkles className="w-3 h-3" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <Badge className="absolute top-4 right-4 bg-background/90 text-foreground">
                      {course.level}
                    </Badge>

                    {/* CE Hours Badge */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold">
                        <Award className="w-4 h-4" />
                        {course.ceHours} CE Hours
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-1 px-2 py-1 rounded-lg bg-background/90">
                      <Star className="w-4 h-4 text-secondary fill-secondary" />
                      <span className="text-sm font-semibold">{course.rating}</span>
                    </div>
                  </div>
                  
                  <div className="p-5 md:p-6">
                    <h3 className="font-heading text-lg md:text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.ceHours}h</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.enrolledCount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>Flipbook</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-5 border-t border-border">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-foreground">${course.price}</span>
                        <span className="text-sm text-muted-foreground line-through">${course.originalPrice}</span>
                      </div>
                      <Button variant="secondary" size="sm" className="font-heading font-semibold" asChild>
                        <Link to={`/courses/${course.id}`}>
                          View Details
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                  No courses found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <Button variant="secondary" onClick={() => { setSelectedCategory("All"); setSelectedLevel("All Levels"); setSearchQuery(""); }}>
                  Clear Filters
                </Button>
              </motion.div>
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
                Join thousands of professionals who have earned IACET-accredited certifications with FGI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" className="font-heading font-semibold" asChild>
                  <Link to="/register">Get Started Today</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-heading"
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
