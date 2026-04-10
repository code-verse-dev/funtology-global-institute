import * as React from "react";
import { createPortal } from "react-dom";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Columns2,
  FileText,
  Maximize2,
  X,
} from "lucide-react";

/** CSS scale applied on click (transform-origin = click point). */
const ZOOM_SCALE = 2.25;

const bundledWorkerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
const cdnWorkerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
const envWorkerSrc = import.meta.env.VITE_PDF_WORKER_SRC?.trim();

pdfjs.GlobalWorkerOptions.workerSrc = envWorkerSrc || (import.meta.env.PROD ? cdnWorkerSrc : bundledWorkerSrc);

export type PdfFlipViewerProps = {
  fileUrl: string;
  title?: string;
  onDownload?: () => void;
  maxPageWidth?: number;
  className?: string;
  showLayoutToggle?: boolean;
  layoutExpanded?: boolean;
  onLayoutExpandedChange?: (expanded: boolean) => void;
};

/** Minimal magnifier icon (Google-Docs–style), ~18px — used as custom follow cursor. */
function MagnifierCursorGlyph({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.75" />
      <line x1="14.5" y1="14.5" x2="20" y2="20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <line x1="7" y1="10" x2="13" y2="10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity={0.45} />
      <line x1="10" y1="7" x2="10" y2="13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity={0.45} />
    </svg>
  );
}

const FlipPage = React.forwardRef<
  HTMLDivElement,
  {
    pageNumber: number;
    slotWidth: number;
    slotHeight: number;
    isSelected: boolean;
    onSelectPage: (pageNumber: number) => void;
  }
>(({ pageNumber, slotWidth, slotHeight, isSelected, onSelectPage }, ref) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [origin, setOrigin] = React.useState("50% 50%");
  const [scale, setScale] = React.useState(1);

  const [cursorPos, setCursorPos] = React.useState<{ x: number; y: number } | null>(null);
  const [hoveringSlot, setHoveringSlot] = React.useState(false);

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [ref],
  );

  React.useEffect(() => {
    if (!isSelected) {
      setIsZoomed(false);
      setScale(1);
      setOrigin("50% 50%");
      setCursorPos(null);
      setHoveringSlot(false);
    }
  }, [isSelected]);

  const showMagnifierCursor =
    isSelected && !isZoomed && hoveringSlot && typeof document !== "undefined";

  const onMouseMoveSlot = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelected || isZoomed) return;
    setCursorPos({ x: e.clientX, y: e.clientY });
  }, [isSelected, isZoomed]);

  const onMouseEnterSlot = React.useCallback(() => {
    if (isSelected && !isZoomed) setHoveringSlot(true);
  }, [isSelected, isZoomed]);

  const onMouseLeaveSlot = React.useCallback(() => {
    setHoveringSlot(false);
    setCursorPos(null);
  }, []);

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (!isSelected) {
        onSelectPage(pageNumber);
        return;
      }
      if (isZoomed) {
        setScale(1);
        setIsZoomed(false);
        setOrigin("50% 50%");
        return;
      }
      const el = contentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const ox = e.clientX - rect.left;
      const oy = e.clientY - rect.top;
      setOrigin(`${ox}px ${oy}px`);
      setScale(ZOOM_SCALE);
      setIsZoomed(true);
    },
    [isSelected, isZoomed, onSelectPage, pageNumber],
  );

  React.useEffect(() => {
    if (!isZoomed || !isSelected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setScale(1);
        setIsZoomed(false);
        setOrigin("50% 50%");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isZoomed, isSelected]);

  const slotCursorClass =
    isSelected && !isZoomed ? "cursor-none" : isZoomed ? "cursor-zoom-out" : "cursor-pointer";

  const magnifierPortal =
    showMagnifierCursor && cursorPos
      ? createPortal(
          <div
            className="pointer-events-none fixed z-[9999] text-foreground drop-shadow-sm"
            style={{
              left: cursorPos.x,
              top: cursorPos.y,
              transform: "translate(4px, 4px)",
            }}
            aria-hidden
          >
            <MagnifierCursorGlyph />
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      {magnifierPortal}
      <div
        ref={setRefs}
        role="button"
        tabIndex={0}
        aria-label={`Page ${pageNumber}${
          isSelected ? (isZoomed ? ", zoomed — click to reset" : ", selected — click to zoom in") : ""
        }`}
        aria-pressed={isSelected}
        onClick={handleClick}
        onMouseMove={onMouseMoveSlot}
        onMouseEnter={onMouseEnterSlot}
        onMouseLeave={onMouseLeaveSlot}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectPage(pageNumber);
          }
        }}
        style={{
          width: slotWidth,
          height: slotHeight,
          overflow: "hidden",
          position: "relative",
        }}
        className={`bg-white select-none outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset ${slotCursorClass} ${
          isSelected ? "ring-2 ring-primary ring-inset" : ""
        }`}
      >
        <div
          ref={contentRef}
          style={{
            width: slotWidth,
            transform: `scale(${scale})`,
            transformOrigin: origin,
            transition: "transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)",
            willChange: "transform",
          }}
        >
          {isZoomed ? (
            <div
              style={{
                width: slotWidth,
                height: slotHeight,
                overflow: "hidden",
              }}
            >
              {/*
                Render the page at ZOOM_SCALE × width, then scale down by 1/ZOOM_SCALE so the
                layout stays slot-sized while the canvas has enough pixels; outer scale(ZOOM_SCALE)
                then magnifies without upscaling a low-res bitmap (avoids blurry text).
              */}
              <div
                style={{
                  width: slotWidth * ZOOM_SCALE,
                  transform: `scale(${1 / ZOOM_SCALE})`,
                  transformOrigin: "top left",
                }}
              >
                <Page
                  pageNumber={pageNumber}
                  width={slotWidth * ZOOM_SCALE}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  loading=""
                />
              </div>
            </div>
          ) : (
            <Page
              pageNumber={pageNumber}
              width={slotWidth}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              loading=""
            />
          )}
        </div>
      </div>
    </>
  );
});
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
  const [fileData, setFileData] = React.useState<ArrayBuffer | null>(null);
  const [fetchError, setFetchError] = React.useState(false);
  const [selectedPage, setSelectedPage] = React.useState<number | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setLoadError(false);
    setFetchError(false);
    setIsLoading(true);
    setNumPages(0);
    setCurrentPage(0);
    setFileData(null);
    setSelectedPage(null);

    const isDirect = fileUrl.startsWith("blob:") || fileUrl.startsWith("data:");
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

  const basePageWidth = pageWidth > 0 ? Math.max(100, pageWidth) : 0;
  const basePageHeight = pageHeight > 0 ? Math.max(140, pageHeight) : 0;

  const clearPageSelection = React.useCallback(() => {
    setSelectedPage(null);
  }, []);

  const onSelectPage = React.useCallback((pageNumber: number) => {
    setSelectedPage((prev) => {
      if (prev === pageNumber) return prev;
      return pageNumber;
    });
  }, []);

  React.useEffect(() => {
    if (selectedPage !== null && selectedPage > numPages) {
      setSelectedPage(null);
    }
  }, [numPages, selectedPage]);

  const baseFlipMaxHeight = layoutExpanded ? 900 : 640;
  const flipMaxHeight = Math.max(baseFlipMaxHeight, basePageHeight);

  const flipNext = React.useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext();
  }, []);

  const flipPrev = React.useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev();
  }, []);

  const isFirstSpread = currentPage === 0;
  const isLastSpread = currentPage >= numPages - 2;

  const totalSpreads = numPages > 0 ? Math.ceil(numPages / 2) : 0;
  const currentSpread = Math.ceil((currentPage + 1) / 2);

  const directUrl = fileUrl.startsWith("blob:") || fileUrl.startsWith("data:") ? fileUrl : null;
  const readyFile: string | ArrayBuffer | null = directUrl ?? fileData;

  React.useEffect(() => {
    if (numPages <= 0 || isLoading) return;

    const isEditableTarget = (target: EventTarget | null) => {
      if (!target || !(target instanceof HTMLElement)) return false;
      const el = target;
      if (el.isContentEditable) return true;
      const tag = el.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      return Boolean(el.closest("input, textarea, select, [contenteditable='true']"));
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if (e.defaultPrevented) return;
      if (isEditableTarget(e.target)) return;

      if (e.key === "ArrowLeft" && !isFirstSpread) {
        e.preventDefault();
        flipPrev();
      } else if (e.key === "ArrowRight" && !isLastSpread) {
        e.preventDefault();
        flipNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [numPages, isLoading, isFirstSpread, isLastSpread, flipPrev, flipNext]);

  return (
    <div className={`flex w-full flex-col overflow-hidden ${className}`}>
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-muted/80 border-b border-border">
        <div className="flex items-center gap-2 text-foreground min-w-0">
          <FileText className="h-4 w-4 shrink-0 text-primary" />
          <span className="text-sm font-medium truncate">{title ?? "PDF document"}</span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-2 ml-2 shrink-0">
          {numPages > 0 ? (
            <span className="text-xs text-muted-foreground tabular-nums">
              {currentSpread} / {totalSpreads}
            </span>
          ) : null}
          {numPages > 0 && !isLoading && selectedPage !== null ? (
            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2 py-0.5 shadow-sm">
              <MagnifierCursorGlyph className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="text-xs font-medium text-foreground">Page {selectedPage}</span>
              <span className="text-[10px] text-muted-foreground hidden sm:inline">Click page to zoom · again to reset</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                onClick={clearPageSelection}
                aria-label="Clear page selection"
                title="Clear selection"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : null}
          {numPages > 0 && !isLoading && selectedPage === null ? (
            <span className="text-xs text-muted-foreground hidden sm:inline max-w-[14rem] truncate" title="Tip">
              Click a page to select, then click again to zoom
            </span>
          ) : null}
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
        className="relative flex w-full min-h-0 flex-1 items-center justify-center overflow-hidden bg-muted"
        style={{
          minHeight: basePageHeight > 0 ? Math.min(basePageHeight + 48, 820) : 400,
          maxHeight: layoutExpanded ? "min(92vh, 960px)" : "min(85vh, 820px)",
        }}
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
            {numPages > 0 && basePageWidth > 0 && basePageHeight > 0 ? (
              <div className="flex max-h-full max-w-full items-center justify-center overflow-hidden py-2 drop-shadow-2xl">
                <HTMLFlipBook
                  ref={bookRef}
                  width={basePageWidth}
                  height={basePageHeight}
                  className=""
                  style={{}}
                  size="fixed"
                  minWidth={100}
                  maxWidth={Math.max(maxPageWidth, basePageWidth)}
                  minHeight={140}
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
                  useMouseEvents={false}
                  swipeDistance={30}
                  showPageCorners={false}
                  disableFlipByClick
                  onFlip={(e: { data: number }) => setCurrentPage(e.data)}
                >
                  {Array.from({ length: numPages }, (_, i) => (
                    <FlipPage
                      key={i}
                      pageNumber={i + 1}
                      slotWidth={basePageWidth}
                      slotHeight={basePageHeight}
                      isSelected={selectedPage === i + 1}
                      onSelectPage={onSelectPage}
                    />
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
