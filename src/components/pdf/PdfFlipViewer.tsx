import * as React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Columns2, Download, FileText, Maximize2 } from "lucide-react";

const bundledWorkerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
const cdnWorkerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
const envWorkerSrc = import.meta.env.VITE_PDF_WORKER_SRC?.trim();

// Production servers sometimes miss a MIME mapping for .mjs. Use CDN worker in prod by default,
// and allow overriding via VITE_PDF_WORKER_SRC for custom hosting.
pdfjs.GlobalWorkerOptions.workerSrc = envWorkerSrc || (import.meta.env.PROD ? cdnWorkerSrc : bundledWorkerSrc);

export type PdfFlipViewerProps = {
  fileUrl: string;
  title?: string;
  onDownload?: () => void;
  maxPageWidth?: number;
  /** Extra class on the outer wrapper (e.g. min-height for full-page layouts) */
  className?: string;
  /** Organization: toggle PDF to use full content width (parent should widen layout) */
  showLayoutToggle?: boolean;
  layoutExpanded?: boolean;
  onLayoutExpandedChange?: (expanded: boolean) => void;
};

const FlipPage = React.forwardRef<HTMLDivElement, { pageNumber: number; width: number; height: number }>(
  ({ pageNumber, width, height }, ref) => (
    <div ref={ref} style={{ width, height, overflow: "hidden" }} className="bg-white select-none">
      <Page
        pageNumber={pageNumber}
        width={width}
        height={height}
        renderAnnotationLayer={false}
        renderTextLayer={false}
        loading=""
      />
    </div>
  ),
);
FlipPage.displayName = "FlipPage";

export default function PdfFlipViewer({
  fileUrl,
  title,
  onDownload,
  maxPageWidth = 440,
  className = "",
  showLayoutToggle = false,
  layoutExpanded = false,
  onLayoutExpandedChange,
}: PdfFlipViewerProps) {
  const [numPages, setNumPages] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState(false);
  const [pageWidth, setPageWidth] = React.useState(0);
  /** In-memory PDF bytes so we load with credentials (cookies) and avoid worker cross-origin quirks */
  const [fileData, setFileData] = React.useState<ArrayBuffer | null>(null);
  const [fetchError, setFetchError] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    setLoadError(false);
    setFetchError(false);
    setIsLoading(true);
    setNumPages(0);
    setCurrentPage(0);
    setFileData(null);

    const isDirect =
      fileUrl.startsWith("blob:") || fileUrl.startsWith("data:");

    if (isDirect) {
      setFileData(null);
      return () => {
        cancelled = true;
      };
    }

    (async () => {
      try {
        const res = await fetch(fileUrl, { credentials: "include", mode: "cors" });
        if (!res.ok) throw new Error(String(res.status));
        const buf = await res.arrayBuffer();
        if (cancelled) return;
        setFileData(buf);
      } catch {
        if (!cancelled) {
          setFetchError(true);
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fileUrl]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = React.useRef<any>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const available = containerRef.current.clientWidth;
      const w = Math.max(Math.floor((available - 40) / 2), 200);
      setPageWidth(Math.min(w, maxPageWidth));
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [maxPageWidth, fileUrl, fileData]);

  const pageHeight = pageWidth > 0 ? Math.round(pageWidth * 1.414) : 0;
  const flipMaxHeight = layoutExpanded ? 900 : 640;

  const flipNext = () => bookRef.current?.pageFlip()?.flipNext();
  const flipPrev = () => bookRef.current?.pageFlip()?.flipPrev();

  const isFirstSpread = currentPage === 0;
  const isLastSpread = currentPage >= numPages - 2;

  const totalSpreads = numPages > 0 ? Math.ceil(numPages / 2) : 0;
  const currentSpread = Math.ceil((currentPage + 1) / 2);

  const directUrl =
    fileUrl.startsWith("blob:") || fileUrl.startsWith("data:") ? fileUrl : null;
  const readyFile: string | ArrayBuffer | null = directUrl ?? fileData;

  return (
    <div className={`flex flex-col w-full overflow-hidden ${className}`}>
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-muted/80 border-b border-border">
        <div className="flex items-center gap-2 text-foreground min-w-0">
          <FileText className="h-4 w-4 shrink-0 text-primary" />
          <span className="text-sm font-medium truncate">{title ?? "PDF document"}</span>
        </div>
        <div className="flex items-center gap-2 ml-2 shrink-0">
          {numPages > 0 ? (
            <span className="text-xs text-muted-foreground tabular-nums">
              {currentSpread} / {totalSpreads}
            </span>
          ) : null}
          {/* {onDownload ? (
            <Button size="sm" variant="outline" className="h-7 text-xs rounded-full gap-1" type="button" onClick={onDownload}>
              <Download className="h-3 w-3" />
              Download
            </Button>
          ) : null} */}
          {showLayoutToggle && onLayoutExpandedChange ? (
            <Button
              size="sm"
              variant={layoutExpanded ? "secondary" : "default"}
              className="h-7 text-xs rounded-full gap-1"
              type="button"
              onClick={() => onLayoutExpandedChange(!layoutExpanded)}
            >
              {layoutExpanded ? (
                <>
                  <Columns2 className="h-3 w-3" />
                  Split view
                </>
              ) : (
                <>
                  <Maximize2 className="h-3 w-3" />
                  Full width
                </>
              )}
            </Button>
          ) : null}
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full bg-muted flex items-center justify-center"
        style={{ minHeight: pageHeight > 0 ? pageHeight + 48 : 400 }}
      >
        {isLoading && !loadError && !fetchError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-muted">
            <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-sm text-muted-foreground">Loading PDF…</p>
          </div>
        ) : null}

        {loadError || fetchError ? (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-muted px-4">
            <p className="text-sm text-destructive text-center">Failed to load PDF.</p>
          </div>
        ) : null}

        {numPages > 0 && !isLoading ? (
          <>
            <button
              type="button"
              onClick={flipPrev}
              disabled={isFirstSpread}
              aria-label="Previous page"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 flex items-center justify-center rounded-full bg-card border border-border shadow-md hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
            <button
              type="button"
              onClick={flipNext}
              disabled={isLastSpread}
              aria-label="Next page"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 flex items-center justify-center rounded-full bg-card border border-border shadow-md hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          </>
        ) : null}

        {readyFile ? (
          <Document
            file={readyFile}
            onLoadSuccess={({ numPages: n }) => {
              setNumPages(n);
              setIsLoading(false);
              setLoadError(false);
            }}
            onLoadError={() => {
              setLoadError(true);
              setIsLoading(false);
            }}
            loading=""
          >
            {numPages > 0 && pageWidth > 0 && pageHeight > 0 ? (
              <div className="py-6 drop-shadow-2xl">
                <HTMLFlipBook
                  ref={bookRef}
                  width={pageWidth}
                  height={pageHeight}
                  className=""
                  style={{}}
                  size="fixed"
                  minWidth={200}
                  maxWidth={maxPageWidth}
                  minHeight={280}
                  maxHeight={flipMaxHeight}
                  startPage={0}
                  drawShadow
                  flippingTime={650}
                  usePortrait={false}
                  startZIndex={10}
                  autoSize={false}
                  maxShadowOpacity={0.5}
                  showCover={false}
                  mobileScrollSupport
                  clickEventForward
                  useMouseEvents
                  swipeDistance={30}
                  showPageCorners
                  disableFlipByClick={false}
                  onFlip={(e: { data: number }) => setCurrentPage(e.data)}
                >
                  {Array.from({ length: numPages }, (_, i) => (
                    <FlipPage key={i} pageNumber={i + 1} width={pageWidth} height={pageHeight} />
                  ))}
                </HTMLFlipBook>
              </div>
            ) : null}
          </Document>
        ) : null}
      </div>

      {numPages > 0 && !isLoading ? (
        <div className="flex items-center justify-center gap-4 px-4 py-3 bg-card border-t border-border">
          <Button variant="outline" size="sm" className="rounded-full gap-1 h-8" type="button" disabled={isFirstSpread} onClick={flipPrev}>
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>

          <span className="text-xs text-muted-foreground font-medium tabular-nums">
            Pages {currentPage + 1}
            {currentPage + 1 < numPages ? `–${Math.min(currentPage + 2, numPages)}` : ""} of {numPages}
          </span>

          <Button variant="outline" size="sm" className="rounded-full gap-1 h-8" type="button" disabled={isLastSpread} onClick={flipNext}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}


