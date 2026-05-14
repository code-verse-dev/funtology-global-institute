import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateTicketMutation,
  useGetMyTicketsQuery,
  type ApiTicket,
} from "@/redux/services/apiSlices/ticketSlice";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronLeft, ChevronRight, Clock, Loader2, MessageSquarePlus, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const PAGE_SIZE = 10;

function formatTicketId(id: string) {
  if (id.length <= 10) return id;
  return `#${id.slice(-8)}`;
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

export default function MySupportTickets() {
  const [keywordInput, setKeywordInput] = useState("");
  const [query, setQuery] = useState<{ page: number; limit: number; keyword?: string }>({
    page: 1,
    limit: PAGE_SIZE,
  });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const { data: listRes, isLoading, isFetching, isError, error, refetch } = useGetMyTicketsQuery(query);
  const [createTicket, { isLoading: creating }] = useCreateTicketMutation();

  const pageData = listRes?.data;
  const tickets = pageData?.docs ?? [];
  const totalPages = pageData?.totalPages ?? 1;
  const totalDocs = pageData?.totalDocs ?? 0;

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

  const onSubmitNew = async (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subject.trim();
    const desc = description.trim();
    if (!sub) {
      toast.error("Please enter a subject.");
      return;
    }
    try {
      const res = await createTicket({ subject: sub, description: desc || undefined }).unwrap();
      if (res.status) {
        toast.success(res.message || "Ticket submitted.");
        setSubject("");
        setDescription("");
      } else {
        toast.error(res.message || "Could not submit ticket.");
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "message" in err.data
          ? String((err.data as { message: string }).message)
          : "Could not submit ticket.";
      toast.error(msg);
    }
  };

  const listErrorMessage =
    isError && error && "data" in error && error.data && typeof error.data === "object" && "message" in error.data
      ? String((error.data as { message: string }).message)
      : "Could not load your tickets.";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Support tickets</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-xl">
          Submit a request for help or follow up on an issue. You will only see tickets tied to your account.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquarePlus className="w-5 h-5 text-primary" />
            New ticket
          </CardTitle>
          <CardDescription>Describe your issue. Our team will review and update the status here.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmitNew} className="space-y-4 max-w-2xl">
            <div className="space-y-2">
              <Label htmlFor="ticket-subject">Subject</Label>
              <Input
                id="ticket-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary"
                required
                maxLength={500}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticket-description">Details</Label>
              <Textarea
                id="ticket-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What happened? What do you need?"
                rows={5}
                className="resize-y min-h-[120px]"
              />
            </div>
            <Button type="submit" disabled={creating}>
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden />
                  Submitting…
                </>
              ) : (
                "Submit ticket"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search your tickets by subject…"
          className="pl-10"
          value={keywordInput}
          onChange={(e) => onKeywordChange(e.target.value)}
        />
      </div>

      {isError && (
        <Card className="border-destructive/50">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-destructive">{listErrorMessage}</p>
            <Button variant="outline" size="sm" type="button" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Your tickets</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground py-16">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading…
            </div>
          ) : (
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="max-w-[240px]">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                      {query.keyword ? "No tickets match your search." : "You have not submitted any tickets yet."}
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.map((t: ApiTicket) => (
                    <TableRow key={t._id}>
                      <TableCell className="font-mono text-xs whitespace-nowrap" title={t._id}>
                        {formatTicketId(t._id)}
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px]">
                        <span className="line-clamp-2">{t.subject}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant(t.status)} className="gap-1 whitespace-nowrap capitalize">
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
                      <TableCell className="text-muted-foreground text-sm max-w-[240px]">
                        <span className="line-clamp-2">{t.description?.trim() || "—"}</span>
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
              type="button"
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
              type="button"
              disabled={query.page >= totalPages || isFetching}
              onClick={() => setQuery((q) => ({ ...q, page: q.page + 1 }))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
