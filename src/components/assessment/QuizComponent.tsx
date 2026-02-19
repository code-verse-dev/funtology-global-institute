import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Clock, Award, ArrowRight, RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizComponentProps {
  questions: Question[];
  courseTitle: string;
  passingScore?: number;
  maxRetakes?: number;
  onComplete: (score: number, passed: boolean) => void;
}

const QuizComponent = ({
  questions,
  courseTitle,
  passingScore = 70,
  maxRetakes = 2,
  onComplete,
}: QuizComponentProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleSelectAnswer = (optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswer(optionIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const correctCount = answers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
    const score = Math.round((correctCount / questions.length) * 100);
    setShowResult(true);
    onComplete(score, score >= passingScore);
  };

  const score = submitted
    ? Math.round(
        (answers.reduce((acc, answer, index) => acc + (answer === questions[index].correctAnswer ? 1 : 0), 0) /
          questions.length) *
          100
      )
    : 0;
  const passed = score >= passingScore;
  const answeredCount = answers.filter((a) => a !== null).length;

  if (showResult) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
        <Card className="overflow-hidden">
          <div className={`p-8 text-center ${passed ? "bg-green-50" : "bg-red-50"}`}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              {passed ? (
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
              ) : (
                <XCircle className="w-20 h-20 text-destructive mx-auto mb-4" />
              )}
            </motion.div>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
              {passed ? "Congratulations! 🎉" : "Assessment Not Passed"}
            </h2>
            <p className="text-muted-foreground mb-4">
              {passed
                ? "You've successfully passed the assessment."
                : `You need ${passingScore}% to pass. You can retake up to ${maxRetakes} times.`}
            </p>
          </div>

          <CardContent className="p-8">
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-muted rounded-xl">
                <p className="text-3xl font-bold text-foreground">{score}%</p>
                <p className="text-sm text-muted-foreground">Your Score</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-xl">
                <p className="text-3xl font-bold text-foreground">{passingScore}%</p>
                <p className="text-sm text-muted-foreground">Passing Score</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-xl">
                <p className="text-3xl font-bold text-foreground">
                  {answers.reduce((acc, a, i) => acc + (a === questions[i].correctAnswer ? 1 : 0), 0)}/{questions.length}
                </p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
            </div>

            {/* Question Review */}
            <h3 className="font-heading font-semibold text-lg mb-4">Question Review</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {questions.map((q, index) => {
                const isCorrect = answers[index] === q.correctAnswer;
                return (
                  <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}`}>
                    <div className="flex items-start gap-3">
                      {isCorrect ? <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" /> : <XCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />}
                      <div>
                        <p className="font-medium text-sm text-foreground">{q.question}</p>
                        {!isCorrect && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Correct: {q.options[q.correctAnswer]} — {q.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex gap-3">
              {passed ? (
                <Button variant="secondary" size="lg" className="w-full gap-2">
                  <Award className="w-5 h-5" />
                  Continue to Evaluation
                </Button>
              ) : (
                <Button variant="outline" size="lg" className="w-full gap-2">
                  <RotateCcw className="w-5 h-5" />
                  Retake Assessment
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading text-xl font-bold text-foreground">Course Assessment</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>No time limit</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-muted-foreground">{answeredCount} answered</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => { setCurrentQuestion(index); setSelectedAnswer(answers[index]); }}
            className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
              index === currentQuestion
                ? "bg-primary text-primary-foreground"
                : answers[index] !== null
                ? "bg-secondary text-secondary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-6">
            <CardContent className="p-6 md:p-8">
              <p className="font-heading text-lg md:text-xl font-semibold text-foreground mb-6">
                {questions[currentQuestion].question}
              </p>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedAnswer === index
                        ? "border-secondary bg-secondary/10"
                        : "border-border hover:border-secondary/50 hover:bg-muted/50"
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                          selectedAnswer === index
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-foreground">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handlePrev} disabled={currentQuestion === 0}>
          Previous
        </Button>

        <div className="flex gap-3">
          {currentQuestion === questions.length - 1 ? (
            <Button
              variant="secondary"
              onClick={handleSubmit}
              disabled={answeredCount < questions.length}
              className="gap-2"
            >
              Submit Assessment
              <Award className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="default" onClick={handleNext} className="gap-2">
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {answeredCount < questions.length && currentQuestion === questions.length - 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center gap-2 p-3 bg-secondary/10 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-secondary shrink-0" />
          <p className="text-sm text-muted-foreground">
            Please answer all {questions.length - answeredCount} remaining question(s) before submitting.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default QuizComponent;
