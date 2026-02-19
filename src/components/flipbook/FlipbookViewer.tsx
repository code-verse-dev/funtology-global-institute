import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface FlipbookPage {
  id: number;
  title: string;
  content: string;
  image?: string;
}

interface FlipbookViewerProps {
  pages: FlipbookPage[];
  courseTitle: string;
  onComplete?: () => void;
}

const FlipbookViewer = ({ pages, courseTitle, onComplete }: FlipbookViewerProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [direction, setDirection] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const progress = ((currentPage + 1) / pages.length) * 100;

  const goToPage = (pageIndex: number, dir: number) => {
    if (pageIndex < 0 || pageIndex >= pages.length || isFlipping) return;
    setIsFlipping(true);
    setDirection(dir);
    setTimeout(() => {
      setCurrentPage(pageIndex);
      setIsFlipping(false);
      if (pageIndex === pages.length - 1 && onComplete) {
        onComplete();
      }
    }, 400);
  };

  const nextPage = () => goToPage(currentPage + 1, 1);
  const prevPage = () => goToPage(currentPage - 1, -1);

  const pageVariants = {
    enter: (dir: number) => ({
      rotateY: dir > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      rotateY: dir > 0 ? -90 : 90,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div className={`bg-card rounded-2xl border border-border shadow-xl overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-secondary" />
          <div>
            <h3 className="font-heading font-semibold text-foreground">{courseTitle}</h3>
            <p className="text-xs text-muted-foreground">
              Page {currentPage + 1} of {pages.length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom(Math.max(0.75, zoom - 0.25))}
            disabled={zoom <= 0.75}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom(Math.min(1.5, zoom + 0.25))}
            disabled={zoom >= 1.5}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-2 bg-muted/30">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Page Content */}
      <div 
        className="relative overflow-hidden"
        style={{ 
          perspective: "1500px",
          minHeight: isFullscreen ? "calc(100vh - 200px)" : "600px"
        }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="p-8 md:p-12"
            style={{ 
              transformStyle: "preserve-3d",
              transform: `scale(${zoom})`,
              transformOrigin: "top center"
            }}
          >
            {pages[currentPage].image && (
              <motion.div
                className="mb-8 rounded-xl overflow-hidden shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <img
                  src={pages[currentPage].image}
                  alt={pages[currentPage].title}
                  className="w-full h-64 md:h-80 object-cover"
                />
              </motion.div>
            )}
            
            <motion.h2
              className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {pages[currentPage].title}
            </motion.h2>
            
            <motion.div
              className="prose prose-lg max-w-none text-muted-foreground leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              dangerouslySetInnerHTML={{ __html: pages[currentPage].content }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Page Turn Effects */}
        <motion.div
          className="absolute inset-y-0 left-0 w-1/3 cursor-pointer group"
          onClick={prevPage}
          whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
        >
          {currentPage > 0 && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="p-3 bg-primary rounded-full text-primary-foreground shadow-lg">
                <ChevronLeft className="w-6 h-6" />
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          className="absolute inset-y-0 right-0 w-1/3 cursor-pointer group"
          onClick={nextPage}
          whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
        >
          {currentPage < pages.length - 1 && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="p-3 bg-secondary rounded-full text-secondary-foreground shadow-lg">
                <ChevronRight className="w-6 h-6" />
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between px-6 py-4 bg-muted/50 border-t border-border">
        <Button
          variant="outline"
          onClick={prevPage}
          disabled={currentPage === 0 || isFlipping}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <div className="flex items-center gap-2">
          {pages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index, index > currentPage ? 1 : -1)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentPage
                  ? "bg-secondary w-6"
                  : index < currentPage
                  ? "bg-secondary/50"
                  : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        <Button
          variant={currentPage === pages.length - 1 ? "secondary" : "default"}
          onClick={nextPage}
          disabled={currentPage === pages.length - 1 || isFlipping}
          className="gap-2"
        >
          {currentPage === pages.length - 1 ? "Complete" : "Next"}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default FlipbookViewer;
