import { motion } from "framer-motion";
import { Clock, Users, Award, ArrowRight, Sparkles, Star, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const featuredCourses = [
  {
    id: 1,
    title: "Professional Infection Control & Prevention",
    description: "Comprehensive training on infection control protocols and sanitation procedures.",
    audience: "Healthcare & Beauty",
    ceHours: 4,
    enrolled: 1250,
    price: 89,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=60",
    featured: true,
    badge: "Most Popular",
  },
  {
    id: 2,
    title: "Advanced Leadership & Management",
    description: "Develop essential leadership skills to drive team success and organizational growth.",
    audience: "Managers & Leaders",
    ceHours: 10,
    enrolled: 756,
    price: 199,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60",
    featured: true,
    badge: "New",
  },
  {
    id: 3,
    title: "Business Management Essentials",
    description: "Master the core principles of effective business and financial management.",
    audience: "Professionals",
    ceHours: 6,
    enrolled: 2100,
    price: 129,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: 4,
    title: "Ethics & Professional Standards",
    description: "Understanding ethical practices and regulatory compliance in your industry.",
    audience: "All Professionals",
    ceHours: 2,
    enrolled: 3500,
    price: 49,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop&q=60",
    badge: "Best Value",
  },
];

const FeaturedCourses = () => {
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
            Explore Our Courses
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
           Programs designed to advance your professional skills 
            and earn recognized continuing education credits.
          </p>
        </motion.div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-border hover:border-secondary/30"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              {/* Image */}
              <div className="relative h-44 md:h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <Badge className="bg-secondary text-secondary-foreground font-semibold shadow-lg">
                    <Award className="w-3 h-3 mr-1" />
                    {course.ceHours} CE
                  </Badge>
                  {course.badge && (
                    <Badge className="bg-primary text-primary-foreground font-semibold">
                      {course.badge}
                    </Badge>
                  )}
                </div>

                {/* Rating */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm">
                  <Star className="w-4 h-4 text-secondary fill-secondary" />
                  <span className="text-sm font-semibold text-white">{course.rating}</span>
                </div>

                {/* Price */}
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-white/90 backdrop-blur-sm">
                  <span className="font-heading font-bold text-primary text-lg">${course.price}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-xs font-semibold text-secondary mb-2 uppercase tracking-wider">
                  {course.audience}
                </p>
                <h3 className="font-heading text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {course.ceHours}h
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {course.enrolled.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      Flipbook
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover CTA */}
              <motion.div
                className="px-5 pb-5"
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
              >
                <Button variant="secondary" size="sm" className="w-full font-heading font-semibold" asChild>
                  <Link to={`/courses/${course.id}`}>
                    View Course
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </div>

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
