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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  useGetTicketsQuery,
  useGetTicketsStatsQuery,
  useUpdateTicketStatusMutation,
  type ApiTicket,
  type TicketStatus,
} from "@/redux/services/apiSlices/ticketSlice";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronLeft, ChevronRight, Clock, Loader2, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const PAGE_SIZE = 10;

const STATUS_OPTIONS: { value: TicketStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "in-progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
];

function formatTicketId(id: string) {
  if (id.length <= 10) return id;
  return `#${id.slice(-8)}`;
}

function formatUserRef(user: string | undefined) {
  if (!user) return "—";
  const s = String(user);
  return s.length > 12 ? `${s.slice(0, 6)}…${s.slice(-4)}` : s;
}

function statusBadgeVariant(status: string) {
  if (status === "resolved") return "secondary" as const;
  if (status === "in-progress") return "outline" as const;
  return "default" as const;
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

export default function AdminComplaints() {
  const [keywordInput, setKeywordInput] = useState("");
  const [query, setQuery] = useState<{ page: number; limit: number; keyword?: string }>({
    page: 1,
    limit: PAGE_SIZE,
  });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<ApiTicket | null>(null);
  const [statusDraft, setStatusDraft] = useState<TicketStatus>("open");

  const { data: listRes, isLoading, isFetching, isError, error, refetch } = useGetTicketsQuery(query);
  const { data: statsRes, isLoading: statsLoading } = useGetTicketsStatsQuery();
  const [updateStatus, { isLoading: updating }] = useUpdateTicketStatusMutation();

  const pageData = listRes?.data;
  const tickets = pageData?.docs ?? [];
  const totalPages = pageData?.totalPages ?? 1;
  const totalDocs = pageData?.totalDocs ?? 0;
  const stats = statsRes?.data;

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const onKeywordChange = (value: string) => {
    setKeywordInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQuery((q) => ({
        ...q,
        page: 1,
        keyword: value.trim() || undefined,
      }));
    }, 400);
  };

  const openTicket = (t: ApiTicket) => {
    setSelected(t);
    setStatusDraft(t.status);
    setDialogOpen(true);
  };

  const saveStatus = async () => {
    if (!selected) return;
    try {
      const res = await updateStatus({ id: selected._id, status: statusDraft }).unwrap();
      if (res.status) {
        toast.success(res.message || "Ticket updated");
        setDialogOpen(false);
        setSelected(null);
      } else {
        toast.error(res.message || "Could not update ticket");
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "message" in err.data
          ? String((err.data as { message: string }).message)
          : "Could not update ticket";
      toast.error(msg);
    }
  };

  const listErrorMessage =
    isError && error && "data" in error && error.data && typeof error.data === "object" && "message" in error.data
      ? String((error.data as { message: string }).message)
      : "Could not load tickets.";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="font-heading text-lg font-bold">Complaints &amp; Appeals</h2>
        <p className="text-sm text-muted-foreground sm:text-right max-w-md">
          Tickets are created by learners from support flows. Update status as you triage and resolve issues.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats?.totalTickets, key: "t" },
          { label: "Open", value: stats?.openTickets, key: "o" },
          { label: "In progress", value: stats?.inProgress, key: "p" },
          { label: "Resolved", value: stats?.resolved, key: "r" },
        ].map((s) => (
          <Card key={s.key}>
            <CardContent className="pt-5 pb-4">
              <p className="text-2xl font-bold text-foreground tabular-nums">
                {statsLoading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : (s.value ?? "—")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by subject…"
          className="pl-10"
          value={keywordInput}
          onChange={(e) => onKeywordChange(e.target.value)}
        />
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
              Loading tickets…
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="max-w-[200px]">Description</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                      {query.keyword ? "No tickets match your search." : "No tickets yet."}
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.map((t) => (
                    <TableRow key={t._id}>
                      <TableCell className="font-mono text-xs whitespace-nowrap" title={t._id}>
                        {formatTicketId(t._id)}
                      </TableCell>
                      <TableCell className="font-medium max-w-[220px]">
                        <span className="line-clamp-2">{t.subject}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs font-mono" title={String(t.user)}>
                        {formatUserRef(t.user)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant(t.status)} className="gap-1 whitespace-nowrap">
                          {t.status === "resolved" ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {t.status === "in-progress" ? "In progress" : t.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                        {formatDate(t.createdAt)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-[200px]">
                        <span className="line-clamp-2">{t.description?.trim() || "—"}</span>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => openTicket(t)}>
                          Manage
                        </Button>
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
            {totalDocs} ticket{totalDocs === 1 ? "" : "s"}
            {isFetching ? " · Updating…" : ""}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={query.page <= 1 || isFetching}
              onClick={() => setQuery((q) => ({ ...q, page: Math.max(1, q.page - 1) }))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span>
              Page {query.page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={query.page >= totalPages || isFetching}
              onClick={() => setQuery((q) => ({ ...q, page: q.page + 1 }))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDialogOpen(false);
            setSelected(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">Ticket</DialogTitle>
            <DialogDescription>
              {selected ? (
                <span className="font-mono text-xs break-all">{selected._id}</span>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="space-y-1">
                <Label className="text-muted-foreground">Subject</Label>
                <p className="font-medium text-foreground">{selected.subject}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">User</Label>
                <p className="font-mono text-xs break-all">{String(selected.user)}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Description</Label>
                <p className="text-foreground whitespace-pre-wrap rounded-md border border-border bg-muted/30 p-3 min-h-[80px]">
                  {selected.description?.trim() || "—"}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticket-status">Status</Label>
                <Select value={statusDraft} onValueChange={(v) => setStatusDraft(v as TicketStatus)}>
                  <SelectTrigger id="ticket-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" variant="secondary" disabled={updating || statusDraft === selected.status} onClick={saveStatus}>
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Save status"
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
