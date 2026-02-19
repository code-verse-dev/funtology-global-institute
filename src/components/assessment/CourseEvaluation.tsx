import { useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, Award, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CourseEvaluationProps {
  courseTitle: string;
  onComplete: () => void;
}

const evaluationCategories = [
  { id: "relevance", label: "Course Relevance", description: "How relevant was the course content to your professional needs?" },
  { id: "clarity", label: "Content Clarity", description: "How clear and well-organized was the course material?" },
  { id: "effectiveness", label: "Instructor Effectiveness", description: "How effective was the instruction and course delivery?" },
  { id: "satisfaction", label: "Overall Satisfaction", description: "How satisfied are you with the overall course experience?" },
];

const CourseEvaluation = ({ courseTitle, onComplete }: CourseEvaluationProps) => {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [hoveredRating, setHoveredRating] = useState<Record<string, number>>({});
  const [suggestions, setSuggestions] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleRate = (categoryId: string, rating: number) => {
    setRatings({ ...ratings, [categoryId]: rating });
  };

  const allRated = evaluationCategories.every((cat) => ratings[cat.id]);

  const handleSubmit = () => {
    if (!allRated) return;
    setSubmitted(true);
    setTimeout(onComplete, 2000);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center p-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }}>
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
        </motion.div>
        <h2 className="font-heading text-3xl font-bold text-foreground mb-3">Thank You!</h2>
        <p className="text-muted-foreground mb-6">
          Your evaluation has been submitted. Your feedback helps us continuously improve our courses.
        </p>
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-secondary/20 rounded-full">
          <Award className="w-5 h-5 text-secondary" />
          <span className="font-medium text-secondary">Your certificate is being generated...</span>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-4">
          <MessageSquare className="w-4 h-4" />
          Mandatory Evaluation
        </div>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">Course Evaluation</h2>
        <p className="text-muted-foreground">
          Please rate your experience with <strong>{courseTitle}</strong>. This evaluation is required before your certificate can be issued.
        </p>
      </motion.div>

      <div className="space-y-4">
        {evaluationCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`transition-all ${ratings[category.id] ? "border-secondary/30" : ""}`}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">{category.label}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRate(category.id, star)}
                        onMouseEnter={() => setHoveredRating({ ...hoveredRating, [category.id]: star })}
                        onMouseLeave={() => setHoveredRating({ ...hoveredRating, [category.id]: 0 })}
                        className="p-1 transition-transform hover:scale-110"
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            star <= (hoveredRating[category.id] || ratings[category.id] || 0)
                              ? "text-secondary fill-secondary"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardContent className="p-6">
              <Label htmlFor="suggestions" className="font-heading font-semibold text-foreground mb-2 block">
                Suggestions for Improvement
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Share any additional feedback or suggestions to help us improve (optional).
              </p>
              <Textarea
                id="suggestions"
                placeholder="Your feedback is valuable to us..."
                rows={4}
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div className="mt-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <Button variant="secondary" size="lg" onClick={handleSubmit} disabled={!allRated} className="gap-2 min-w-48">
          <Award className="w-5 h-5" />
          Submit Evaluation
        </Button>
        {!allRated && (
          <p className="text-sm text-muted-foreground mt-3">
            Please rate all {evaluationCategories.length - Object.keys(ratings).length} remaining categories.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default CourseEvaluation;
