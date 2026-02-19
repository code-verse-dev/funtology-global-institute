import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import fgiLogo from "@/assets/fgi-logo.png";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <motion.div
        className="text-center relative z-10 px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img src={fgiLogo} alt="FGI" className="w-20 h-20 mx-auto mb-8 opacity-80" />
        <h1 className="font-heading text-8xl md:text-9xl font-bold text-secondary mb-4">404</h1>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
          Page Not Found
        </h2>
        <p className="text-primary-foreground/70 text-lg max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="secondary" size="lg" className="gap-2" asChild>
            <Link to="/"><Home className="w-4 h-4" />Back to Home</Link>
          </Button>
          <Button variant="outline" size="lg" className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
            <Link to="/courses"><BookOpen className="w-4 h-4" />Browse Courses</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
