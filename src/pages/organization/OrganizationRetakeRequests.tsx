import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  useApproveRetakeRequestMutation,
  useGetRetakeRequestsQuery,
  useRejectRetakeRequestMutation,
} from "@/redux/services/apiSlices/retakeSlice";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

type RetakeRequest = {
  _id?: string;
  retakeLevel?: number;
  status?: string;
  createdAt?: string;
  learner?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    department?: string;
    _id?: string;
  } | null;
  courseTitle?: string;
  retakeAmountUsd?: number;
  
  lesson?: {
    type?: string;
    order?: number;
    _id?: string;
  } | null;

};

type RetakePage = {
  docs: RetakeRequest[];
  page: number;
  totalPages: number;
  totalDocs: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
};

type StatusTab = "PENDING" | "APPROVED" | "REJECTED" | "PAID";

const STATUS_TABS: StatusTab[] = ["PENDING", "APPROVED", "REJECTED", "PAID"];

function asPage(data: unknown): RetakePage {
  if (data && typeof data === "object" && "docs" in data) {
    const d = data as Partial<RetakePage>;
    return {
      docs: Array.isArray(d.docs) ? d.docs : [],
      page: Number(d.page ?? 1),
      totalPages: Number(d.totalPages ?? 1),
      totalDocs: Number(d.totalDocs ?? 0),
      hasNextPage: Boolean(d.hasNextPage),
      hasPrevPage: Boolean(d.hasPrevPage),
      limit: Number(d.limit ?? 10),
    };
  }
  if (Array.isArray(data)) {
    return {
      docs: data as RetakeRequest[],
      page: 1,
      totalPages: 1,
      totalDocs: data.length,
      hasNextPage: false,
      hasPrevPage: false,
      limit: 10,
    };
  }
  return { docs: [], page: 1, totalPages: 1, totalDocs: 0, hasNextPage: false, hasPrevPage: false, limit: 10 };
}

function learnerName(r: RetakeRequest): string {
  const l = r.learner;
  if (!l) return "—";
  const n = [l.firstName, l.lastName].filter(Boolean).join(" ").trim();
  return n || l.email || "—";
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

const OrganizationRetakeRequests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState<StatusTab>("PENDING");
  const [page, setPage] = useState(1);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<RetakeRequest | null>(null);
  const limit = 10;
  const mappedStatus = tab === "PAID" ? "FULFILLED" : tab;
  const { data, isLoading, isFetching, isError, error, refetch } = useGetRetakeRequestsQuery({
    page,
    limit,
    status: mappedStatus,
  });
  const [approveRetakeRequest, { isLoading: approving }] = useApproveRetakeRequestMutation();
  const [rejectRetakeRequest, { isLoading: rejecting }] = useRejectRetakeRequestMutation();
  const pageData = asPage(data?.data);
  const requests = pageData.docs;
  const actionLoading = approving || rejecting;

  useEffect(() => {
    const paid = (location.state as { retakePaid?: boolean } | null)?.retakePaid;
    if (!paid) return;
    void refetch();
    navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate, refetch]);

  const listErrorMessage =
    isError && error && "data" in error && error.data && typeof error.data === "object" && "message" in error.data
      ? String((error.data as { message: string }).message)
      : "Could not load retake requests.";

  const onApprove = async (requestId?: string) => {
    if (!requestId) return;
    try {
      const res = await approveRetakeRequest({ requestId }).unwrap();
      if (res?.status) toast.success(res?.message || "Retake request approved.");
      else toast.error(res?.message || "Could not approve request.");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "message" in err.data
          ? String((err.data as { message: string }).message)
          : "Could not approve request.";
      toast.error(msg);
    }
  };

  const onReject = async (requestId?: string) => {
    if (!requestId) return;
    try {
      const res = await rejectRetakeRequest({ requestId }).unwrap();
      if (res?.status) toast.success(res?.message || "Retake request rejected.");
      else toast.error(res?.message || "Could not reject request.");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "message" in err.data
          ? String((err.data as { message: string }).message)
          : "Could not reject request.";
      toast.error(msg);
    }
  };

  const onMakePayment = (request: RetakeRequest) => {
    setPaymentRequest(request);
    setPaymentDialogOpen(true);
  };

  const onContinuePayment = () => {
    if (!paymentRequest?.lesson?._id || !paymentRequest?.learner?._id || !paymentRequest?.retakeAmountUsd) {
      toast.error("Missing payment details for this request.");
      return;
    }
    navigate("/payment", {
      state: {
        type: "QUIZ_RETAKE",
        total: paymentRequest.retakeAmountUsd,
        lessonId: paymentRequest.lesson._id,
        learnerId: paymentRequest.learner._id,
        from: location.pathname,
      },
    });
    setPaymentDialogOpen(false);
    setPaymentRequest(null);
  };




  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="font-heading text-lg font-bold">Quiz retake requests</h2>
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((s) => (
          <Button
            key={s}
            type="button"
            variant={tab === s ? "secondary" : "outline"}
            onClick={() => {
              setTab(s);
              setPage(1);
            }}
          >
            {s}
          </Button>
        ))}
      </div>

      {isError && (
        <Card className="border-destructive/50">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-destructive">{listErrorMessage}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground py-16">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading retake requests...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Learner</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Retake level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested at</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                      No retake requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((r) => (
                    <TableRow key={r._id ?? `${r.learner?.email ?? "x"}-${r.createdAt ?? "t"}`}>
                      <TableCell className="font-medium">{learnerName(r)}</TableCell>
                      <TableCell className="text-muted-foreground">{r.learner?.email ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{r.courseTitle ?? "—"}</TableCell>
                      <TableCell>{r.retakeLevel ?? "—"}</TableCell>
                      <TableCell>{r.status ?? "PENDING"}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(r.createdAt)}</TableCell>
                      <TableCell>
                        {tab === "PENDING" ? (
                          <div className="flex gap-2">
                            <Button size="sm" variant="secondary" disabled={actionLoading} onClick={() => onApprove(r._id)}>
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" disabled={actionLoading} onClick={() => onReject(r._id)}>
                              Reject
                            </Button>
                          </div>
                        ) : tab === "APPROVED" ? (
                          <Button size="sm" variant="outline" onClick={() => onMakePayment(r)}>
                            Make payment
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>
          {pageData.totalDocs} request{pageData.totalDocs === 1 ? "" : "s"}
          {isFetching ? " · Updating..." : ""}
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!pageData.hasPrevPage || isFetching}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span>
            Page {pageData.page} of {pageData.totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!pageData.hasNextPage || isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Confirm retake payment</DialogTitle>
            <DialogDescription>
              Continue to payment for this approved retake request?
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md border border-border bg-muted/30 p-3 text-sm">
            <p className="text-muted-foreground">Amount to pay</p>
            <p className="text-lg font-semibold text-foreground">
              ${Number(paymentRequest?.retakeAmountUsd ?? 0).toFixed(2)} USD
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="secondary" onClick={onContinuePayment}>
              Continue to pay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default OrganizationRetakeRequests;
