import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { UPLOADS_URL } from "@/constants/api";
import {
  useGetCourseByIdQuery,
  useGetCoursesQuery,
  useUpdateCourseMutation,
  useUpdateCourseStatusMutation,
  type CourseStatus,
} from "@/redux/services/apiSlices/courseSlice";
import { motion } from "framer-motion";
import {
  BarChart3,
  Check,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  Eye,
  Loader2,
  MoreVertical,
  Scale,
  Search,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const PAGE_SIZE = 10;

const STATUS_OPTIONS: CourseStatus[] = ["published", "draft", "inactive"];

const courseImageUrl = (image?: string) => {
  if (!image) return undefined;
  const base = UPLOADS_URL.replace(/\/$/, "");
  const path = String(image).replace(/^\//, "");
  return `${base}/${path}`;
};

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
};

type EditForm = {
  title: string;
  description: string;
  ceHours: string;
  sortOrder: string;
  objectivesText: string;
};

const emptyEditForm: EditForm = {
  title: "",
  description: "",
  ceHours: "",
  sortOrder: "",
  objectivesText: "",
};

const AdminCourses = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(emptyEditForm);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword]);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetCoursesQuery({
    page: String(page),
    limit: String(PAGE_SIZE),
    keyword: debouncedKeyword || undefined,
  });

  const {
    data: previewRes,
    isLoading: previewLoading,
    isError: previewError,
  } = useGetCourseByIdQuery(previewId!, { skip: !previewId });

  const {
    data: editDetailResponse,
    isLoading: editLoading,
    isFetching: editFetching,
  } = useGetCourseByIdQuery(editId!, { skip: !editId });

  const [updateCourse, { isLoading: savingEdit }] = useUpdateCourseMutation();
  const [updateCourseStatus, { isLoading: savingStatus }] = useUpdateCourseStatusMutation();

  const paginated = data?.data;
  const courses = paginated?.docs ?? [];
  const totalPages = paginated?.totalPages ?? 1;
  const totalDocs = paginated?.totalDocs ?? 0;

  const previewCourse = previewRes?.data;
  const fetchedEditCourse = editDetailResponse?.data;
  const showEditSkeleton = Boolean(editId) && editLoading && fetchedEditCourse == null;

  useEffect(() => {
    if (!editId) {
      setEditForm(emptyEditForm);
      return;
    }
    setEditForm(emptyEditForm);
  }, [editId]);

  useEffect(() => {
    const c = editDetailResponse?.data;
    if (!editId || !c || c._id !== editId) return;
    setEditForm({
      title: c.title ?? "",
      description: c.description ?? "",
      ceHours: String(c.ceHours ?? ""),
      sortOrder: String(c.sortOrder ?? ""),
      objectivesText: (c.learningObjectives ?? []).join("\n"),
    });
  }, [editDetailResponse, editId]);

  const statusBadgeVariant = (status: string) => {
    if (status === "published") return "secondary" as const;
    if (status === "inactive") return "destructive" as const;
    return "outline" as const;
  };

  const handleStatusChange = async (id: string, status: CourseStatus) => {
    try {
      const res = await updateCourseStatus({ id, status }).unwrap();
      if (res.status) {
        toast.success(res.message || "Status updated");
      } else {
        toast.error(res.message || "Could not update status");
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "message" in err.data
          ? String((err.data as { message: string }).message)
          : "Could not update status";
      toast.error(message);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    const ceHours = Number(editForm.ceHours);
    const sortOrder = Number(editForm.sortOrder);
    if (!editForm.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!Number.isFinite(ceHours) || ceHours < 1) {
      toast.error("CE hours must be at least 1");
      return;
    }
    if (!Number.isFinite(sortOrder) || sortOrder < 1 || sortOrder > 4) {
      toast.error("Sort order must be between 1 and 4");
      return;
    }
    const learningObjectives = editForm.objectivesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      const res = await updateCourse({
        id: editId,
        body: {
          title: editForm.title.trim(),
          description: editForm.description.trim(),
          ceHours,
          sortOrder,
          learningObjectives,
        },
      }).unwrap();
      if (res.status) {
        toast.success(res.message || "Course updated");
        setEditId(null);
      } else {
        toast.error(res.message || "Could not update course");
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "message" in err.data
          ? String((err.data as { message: string }).message)
          : "Could not update course";
      toast.error(message);
    }
  };

  const closeEdit = (open: boolean) => {
    if (!open) {
      setEditId(null);
      setEditForm(emptyEditForm);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="font-heading text-lg font-bold">Course Management</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-10"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" type="button">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Course Workflow:</strong> Draft → SME Review → Admin Approval → Published. All status changes are timestamped in the audit log.
          </p>
        </CardContent>
      </Card>

      {isError && (
        <Card className="border-destructive/50">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-destructive">
              {error && "data" in error && typeof (error as { data?: { message?: string } }).data?.message === "string"
                ? (error as { data: { message: string } }).data.message
                : "Could not load courses."}
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading courses…
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sort order</TableHead>
                  <TableHead>CE hours</TableHead>
                  <TableHead>Objectives</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                      {debouncedKeyword ? "No courses match your search." : "No courses yet."}
                    </TableCell>
                  </TableRow>
                ) : (
                  courses.map((course) => (
                    <TableRow key={course._id}>
                      <TableCell className="font-medium max-w-xs">
                        <p className="truncate">{course.title}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant(course.status)}>{course.status}</Badge>
                      </TableCell>
                      <TableCell>{course.sortOrder}</TableCell>
                      <TableCell>{course.ceHours}</TableCell>
                      <TableCell>{course.learningObjectives?.length ?? 0}</TableCell>
                      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                        {formatDate(course.updatedAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Course actions">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setPreviewId(course._id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditId(course._id)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit 
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>Change status</DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                {STATUS_OPTIONS.map((st) => (
                                  <DropdownMenuItem
                                    key={st}
                                    disabled={course.status === st}
                                    onClick={() => handleStatusChange(course._id, st)}
                                  >
                                    {course.status === st ? (
                                      <Check className="w-4 h-4 mr-2 text-secondary" />
                                    ) : (
                                      <span className="w-4 h-4 mr-2 inline-block" />
                                    )}
                                    {st.charAt(0).toUpperCase() + st.slice(1)}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuItem asChild>
                              <Link to={`//courses/${course._id}/content`}>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload content
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/courses/${course._id}/question-bank`}>
                                <ClipboardList className="w-4 h-4 mr-2" />
                                Question bank
                              </Link>
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem>
                              <Scale className="w-4 h-4 mr-2" />
                              CE Hour Worksheet
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <BarChart3 className="w-4 h-4 mr-2" />
                              Analytics
                            </DropdownMenuItem> */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {!isLoading && totalDocs > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>
            {totalDocs} course{totalDocs === 1 ? "" : "s"}
            {isFetching ? " · Updating…" : ""}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={!!previewId} onOpenChange={(open) => !open && setPreviewId(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">Course preview</DialogTitle>
            <DialogDescription>Read-only details from the catalog.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {previewLoading && (
              <div className="flex items-center gap-2 text-muted-foreground py-8">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading…
              </div>
            )}
            {previewError && (
              <p className="text-sm text-destructive">Could not load this course. Close and try again.</p>
            )}
            {!previewLoading && previewCourse && (
              <>
                {courseImageUrl(previewCourse.image) ? (
                  <img
                    src={courseImageUrl(previewCourse.image)}
                    alt=""
                    className="w-full rounded-lg border border-border object-contain max-h-48"
                  />
                ) : (
                  <div className="rounded-lg border border-dashed border-border bg-muted/40 h-32 flex items-center justify-center text-sm text-muted-foreground">
                    No image
                  </div>
                )}
                <div>
                  <h3 className="font-heading text-xl font-semibold">{previewCourse.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant={statusBadgeVariant(previewCourse.status)}>{previewCourse.status}</Badge>
                    <span className="text-sm text-muted-foreground">{previewCourse.ceHours} CE hours</span>
                    <span className="text-sm text-muted-foreground">Order {previewCourse.sortOrder}</span>
                  </div>
                </div>
                {previewCourse.description ? (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Description</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{previewCourse.description}</p>
                  </div>
                ) : null}
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Learning objectives</p>
                  {(previewCourse.learningObjectives?.length ?? 0) === 0 ? (
                    <p className="text-sm text-muted-foreground">None listed</p>
                  ) : (
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {previewCourse.learningObjectives!.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Updated {formatDate(previewCourse.updatedAt)}
                  {previewCourse.createdAt ? ` · Created ${formatDate(previewCourse.createdAt)}` : ""}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {STATUS_OPTIONS.map((st) => (
                    <Button
                      key={st}
                      type="button"
                      size="sm"
                      variant={previewCourse.status === st ? "secondary" : "outline"}
                      disabled={previewCourse.status === st || savingStatus}
                      onClick={() => previewId && handleStatusChange(previewId, st)}
                    >
                      Set {st}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editId} onOpenChange={closeEdit}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">Edit course</DialogTitle>
            <DialogDescription>Update catalog fields. Image changes use upload content workflow.</DialogDescription>
          </DialogHeader>
          {showEditSkeleton ? (
            <div className="flex items-center gap-2 text-muted-foreground py-8">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading course…
            </div>
          ) : (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editForm.title}
                  onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                  required
                  disabled={savingEdit || editFetching}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-desc">Description</Label>
                <Textarea
                  id="edit-desc"
                  rows={4}
                  value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  disabled={savingEdit || editFetching}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-ce">CE hours</Label>
                  <Input
                    id="edit-ce"
                    type="number"
                    min={1}
                    value={editForm.ceHours}
                    onChange={(e) => setEditForm((f) => ({ ...f, ceHours: e.target.value }))}
                    required
                    disabled={savingEdit || editFetching}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-order">Sort order (1–4)</Label>
                  <Input
                    id="edit-order"
                    type="number"
                    min={1}
                    max={4}
                    value={editForm.sortOrder}
                    onChange={(e) => setEditForm((f) => ({ ...f, sortOrder: e.target.value }))}
                    required
                    disabled={savingEdit || editFetching}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-obj">Learning objectives (one per line)</Label>
                <Textarea
                  id="edit-obj"
                  rows={5}
                  value={editForm.objectivesText}
                  onChange={(e) => setEditForm((f) => ({ ...f, objectivesText: e.target.value }))}
                  placeholder={"One objective per line"}
                  disabled={savingEdit || editFetching}
                />
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => closeEdit(false)} disabled={savingEdit}>
                  Cancel
                </Button>
                <Button type="submit" variant="secondary" disabled={savingEdit || editFetching}>
                  {savingEdit ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AdminCourses;
