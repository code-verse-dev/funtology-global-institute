import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { NONPROFIT_UPLOADS_URL, UPLOADS_URL } from "@/constants/api";
import { useNonprofitAdminMode } from "@/contexts/NonprofitAdminContext";
import {
  useGetNonprofitUserByIdQuery,
  useUpdateNonprofitUserStatusMutation,
} from "@/redux/services/apiSlices/nonprofitAdminApiSlice";
import { useGetUserByIdQuery, useUpdateUserStatusMutation, type UserStatus } from "@/redux/services/apiSlices/userSlice";
import type { ReactNode } from "react";
import { useCallback, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { formatRole, formatUserStatusLabel, userStatusBadgeVariant } from "./userDisplay";
import { useGetAdminOrganizationActiveSubscriptionQuery } from "@/redux/services/apiSlices/subscriptionSlice";
import { useGetStudentCourseOutcomesQuery } from "@/redux/services/apiSlices/quizResponseSlice";

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-3 border-b border-border last:border-0">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-foreground break-all">{value ?? "—"}</span>
  </div>
);

const AdminUserDetail = () => {
  const nonprofitAdmin = useNonprofitAdminMode();
  const adminUsersPath = nonprofitAdmin ? "/admin/nonprofit/users" : "/admin/users";
  const uploadsBase = nonprofitAdmin ? NONPROFIT_UPLOADS_URL : UPLOADS_URL;
  const pdfTargetRef = useRef<HTMLDivElement | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const { userId } = useParams<{ userId: string }>();
  const mainQ = useGetUserByIdQuery(userId!, { skip: !userId || nonprofitAdmin });
  const npQ = useGetNonprofitUserByIdQuery(userId!, { skip: !userId || !nonprofitAdmin });
  const { data, isLoading, isError, error } = nonprofitAdmin ? npQ : mainQ;

  const [updateStatusMain, { isLoading: updatingMain }] = useUpdateUserStatusMutation();
  const [updateStatusNp, { isLoading: updatingNp }] = useUpdateNonprofitUserStatusMutation();
  const isUpdating = nonprofitAdmin ? updatingNp : updatingMain;

  const user = data?.data;
  const isOrganizationUser = user?.role === "organization";

  const {
    data: quizResponseData,
    isLoading: quizResponseLoading,
    isFetching: quizResponseFetching,
    isError: quizResponseIsError,
    error: quizResponseError,
  } = useGetStudentCourseOutcomesQuery(userId!, {
    skip: !userId || nonprofitAdmin || isOrganizationUser,
  });
  const quizOutcomesData = quizResponseData?.data as
    | {
        courses?: Array<{
          courseId?: string;
          courseName?: string;
          status?: "PASS" | "FAIL" | string;
          certificateUrl?: string | null;
          latestAttemptPercentage?: number;
          latestAttemptAt?: string | null;
        }>;
        passThresholdPercent?: number;
      }
    | undefined;
  const quizOutcomeCourses = Array.isArray(quizOutcomesData?.courses) ? quizOutcomesData.courses : [];
  const quizPassThreshold =
    typeof quizOutcomesData?.passThresholdPercent === "number" ? quizOutcomesData.passThresholdPercent : 70;
  const quizResponseStatusCode =
    quizResponseError && typeof quizResponseError === "object" && "status" in quizResponseError
      ? (quizResponseError as { status?: number | string }).status
      : undefined;
  const quizResponseMessage =
    quizResponseError &&
    typeof quizResponseError === "object" &&
    "data" in quizResponseError &&
    (quizResponseError as { data?: { message?: string } }).data?.message
      ? String((quizResponseError as { data: { message: string } }).data.message)
      : "Could not load learner course outcomes.";
  const {
    data: orgSubData,
    isLoading: orgSubLoading,
    isFetching: orgSubFetching,
    isError: orgSubIsError,
    error: orgSubError,
  } = useGetAdminOrganizationActiveSubscriptionQuery(userId!, {
    skip: !userId || nonprofitAdmin || !isOrganizationUser,
  });

  const orgSubscription = orgSubData?.data as
    | {
        courseIds?: Array<{
          _id?: string;
          title?: string;
          status?: string;
          amount?: number;
          groupAmount?: number;
        }>;
      }
    | undefined;
  const purchasedCourses = Array.isArray(orgSubscription?.courseIds) ? orgSubscription.courseIds : [];
  const orgSubStatusCode =
    orgSubError && typeof orgSubError === "object" && "status" in orgSubError
      ? (orgSubError as { status?: number | string }).status
      : undefined;
  const orgSubMessage =
    orgSubError &&
    typeof orgSubError === "object" &&
    "data" in orgSubError &&
    (orgSubError as { data?: { message?: string } }).data?.message
      ? String((orgSubError as { data: { message: string } }).data.message)
      : "Could not load organization subscription.";

  const onSetStatus = async (status: UserStatus) => {
    if (!userId) return;
    try {
      const res = nonprofitAdmin
        ? await updateStatusNp({ id: userId, status }).unwrap()
        : await updateStatusMain({ id: userId, status }).unwrap();
      if (res.status) toast.success(res.message || "Status updated");
      else toast.error(res.message || "Could not update status");
    } catch {
      toast.error("Could not update status");
    }
  };

  const onDownloadPdf = useCallback(async () => {
    const target = pdfTargetRef.current;
    if (!target || isExportingPdf) return;

    try {
      setIsExportingPdf(true);
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(target, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        onclone: (doc) => {
          const exportRoot = doc.getElementById("admin-user-detail-pdf");
          if (!exportRoot) return;
          exportRoot.style.background = "#ffffff";
          exportRoot.style.padding = "12px";
          exportRoot.style.borderRadius = "12px";

          exportRoot.querySelectorAll("[data-pdf-card]").forEach((el) => {
            const node = el as HTMLElement;
            node.style.background = "#ffffff";
            node.style.boxShadow = "none";
            node.style.borderColor = "#d7d9e0";
          });
          exportRoot.querySelectorAll("[data-pdf-plain-badge]").forEach((el) => {
            const node = el as HTMLElement;
            node.style.background = "transparent";
            node.style.border = "0";
            node.style.boxShadow = "none";
            node.style.padding = "0";
            node.style.margin = "0";
            node.style.borderRadius = "0";
            node.style.minHeight = "0";
            node.style.height = "auto";
            node.style.display = "inline";
            node.style.fontSize = "12px";
            node.style.fontWeight = "600";
            node.style.lineHeight = "1.4";
            node.style.color = "#111827";
          });
          exportRoot.querySelectorAll("[data-hide-in-pdf]").forEach((el) => {
            (el as HTMLElement).style.display = "none";
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 24;
      const maxWidth = pageWidth - margin * 2;
      const renderedHeight = (canvas.height * maxWidth) / canvas.width;

      let heightLeft = renderedHeight;
      let y = margin;

      pdf.addImage(imgData, "PNG", margin, y, maxWidth, renderedHeight, undefined, "FAST");
      heightLeft -= pageHeight - margin * 2;

      while (heightLeft > 0) {
        y = y - (pageHeight - margin * 2);
        pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, y, maxWidth, renderedHeight, undefined, "FAST");
        heightLeft -= pageHeight - margin * 2;
      }

      const safeName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim().replace(/[^a-zA-Z0-9-_ ]/g, "");
      const fileName = `${safeName || "user"}-details.pdf`.replace(/\s+/g, "-").toLowerCase();
      pdf.save(fileName);
      toast.success("User details PDF downloaded.");
    } catch {
      toast.error("Could not generate PDF.");
    } finally {
      setIsExportingPdf(false);
    }
  }, [isExportingPdf, user?.firstName, user?.lastName]);

  if (!userId) {
    return (
      <div className="text-center text-muted-foreground py-12">
        Invalid user link.{" "}
        <Link to={adminUsersPath} className="text-primary underline">
          Back to users
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground gap-2">
        <Loader2 className="w-6 h-6 animate-spin" />
        Loading user…
      </div>
    );
  }

  if (isError || !user || !data?.status) {
    const msg =
      error && "data" in error && typeof (error as { data?: { message?: string } }).data?.message === "string"
        ? (error as { data: { message: string } }).data.message
        : "User could not be loaded.";
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-destructive">{msg}</p>
        <Button variant="outline" asChild>
          <Link to={adminUsersPath}>Back to users</Link>
        </Button>
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "?";
  const imageSrc = user.image ? uploadsBase + user.image : undefined;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="ghost" size="sm" className="gap-2 -ml-2" asChild>
          <Link to={adminUsersPath}>
            <ArrowLeft className="w-4 h-4" />
            Users
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="ml-auto" onClick={onDownloadPdf} disabled={isExportingPdf}>
          {isExportingPdf ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Downloading…
            </>
          ) : (
            "Download PDF"
          )}
        </Button>
      </div>
      <div id="admin-user-detail-pdf" ref={pdfTargetRef} className="space-y-6">
      <Card data-pdf-card>
        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
          <Avatar className="h-16 w-16">
            {imageSrc ? <AvatarImage src={imageSrc} alt="" /> : null}
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="font-heading text-2xl">{fullName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge data-pdf-plain-badge variant={user.role === "organization" ? "default" : "outline"}>
                {formatRole(user.role)}
              </Badge>
              <Badge data-hide-in-pdf variant={userStatusBadgeVariant(user.status)} className="gap-1 capitalize">
                {user.status === "ACTIVE" ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : user.status === "PENDING" ? (
                  <Clock className="w-3 h-3" />
                ) : (
                  <XCircle className="w-3 h-3" />
                )}
                {formatUserStatusLabel(user.status)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="space-y-0">
            <Row label="Phone" value={user.phoneNumber} />
            <Row label="Organization" value={user.organizationName} />
            <Row label="Street address" value={user.streetAddress} />
            <Row
              label="Joined"
              value={
                user.createdAt
                  ? new Date(user.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "—"
              }
            />
            <Row
              label="Last updated"
              value={
                user.updatedAt
                  ? new Date(user.updatedAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "—"
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card data-pdf-card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Account status</CardTitle>
          <p className="text-sm text-muted-foreground">Set status to active, pending, or suspended (inactive).</p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            variant={user.status === "ACTIVE" ? "secondary" : "outline"}
            size="sm"
            disabled={isUpdating || user.status === "ACTIVE"}
            onClick={() => onSetStatus("ACTIVE")}
          >
            Active
          </Button>
          <Button
            variant={user.status === "PENDING" ? "secondary" : "outline"}
            size="sm"
            disabled={isUpdating || user.status === "PENDING"}
            onClick={() => onSetStatus("PENDING")}
          >
            Pending
          </Button>
          <Button
            variant={user.status === "INACTIVE" ? "secondary" : "outline"}
            size="sm"
            disabled={isUpdating || user.status === "INACTIVE"}
            onClick={() => onSetStatus("INACTIVE")}
          >
            Suspended (inactive)
          </Button>
          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin self-center ml-2" /> : null}
        </CardContent>
      </Card>

      {isOrganizationUser ? (
        <Card data-pdf-card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Courses purchased</CardTitle>
            <p className="text-sm text-muted-foreground">
              Active subscription courses for this organization.
              {orgSubFetching && !orgSubLoading ? " Updating…" : ""}
            </p>
          </CardHeader>
          <CardContent>
            {orgSubLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading purchased courses…
              </div>
            ) : orgSubIsError && orgSubStatusCode !== 404 ? (
              <p className="text-sm text-destructive">{orgSubMessage}</p>
            ) : purchasedCourses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active purchased courses found.</p>
            ) : (
              <div className="space-y-3">
                {purchasedCourses.map((course, index) => (
                  <div
                    key={course._id ?? `${course.title ?? "course"}-${index}`}
                    className="rounded-md border border-border p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">{course.title ?? "Untitled course"}</p>
                      <Badge data-pdf-plain-badge variant="outline" className="capitalize">
                        {String(course.status ?? "unknown").toLowerCase()}
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Standard: ${Number(course.amount ?? 0).toFixed(2)} · Group: ${Number(course.groupAmount ?? 0).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card data-pdf-card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Course outcomes</CardTitle>
            <p className="text-sm text-muted-foreground">
              Latest learner result by course (pass threshold: {quizPassThreshold}%).
              {quizResponseFetching && !quizResponseLoading ? " Updating…" : ""}
            </p>
          </CardHeader>
          <CardContent>
            {quizResponseLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading course outcomes…
              </div>
            ) : quizResponseIsError && quizResponseStatusCode !== 404 ? (
              <p className="text-sm text-destructive">{quizResponseMessage}</p>
            ) : quizOutcomeCourses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No course outcomes found for this learner.</p>
            ) : (
              <div className="space-y-3">
                {quizOutcomeCourses.map((course, index) => {
                  const passed = String(course.status ?? "").toUpperCase() === "PASS";
                  const percent = Number(course.latestAttemptPercentage ?? 0);
                  return (
                    <div
                      key={course.courseId ?? `${course.courseName ?? "course-outcome"}-${index}`}
                      className="rounded-md border border-border p-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-medium text-foreground">{course.courseName ?? "Untitled course"}</p>
                        <Badge data-pdf-plain-badge variant={passed ? "default" : "secondary"} className="capitalize">
                          {passed ? "Pass" : "Fail"}
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Marks: {Number.isFinite(percent) ? `${percent.toFixed(2)}%` : "—"}
                      </div>
                      {course.latestAttemptAt ? (
                        <div className="mt-1 text-xs text-muted-foreground">
                          Latest attempt:{" "}
                          {new Date(course.latestAttemptAt).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
};

export default AdminUserDetail;
