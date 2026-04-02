import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Clock, CreditCard, DollarSign, Download, Search } from "lucide-react";
import { useGetPaymentsQuery } from "@/redux/services/apiSlices/paymentSlice";
import { useEffect, useMemo, useState } from "react";

type PaymentUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
};

type PaymentDoc = {
  chargeId?: string;
  createdAt?: string;
  updatedAt?: string;
  isPaid?: boolean;
  subscription?: string;
  totalAmount?: number;
  type?: string;
  user?: PaymentUser;
};

function formatUsd(amount: unknown): string {
  const n = typeof amount === "number" ? amount : Number(amount);
  if (Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function learnerDisplayName(user: PaymentUser | undefined): string {
  if (!user) return "—";
  const parts = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  if (parts) return parts;
  return user.email ?? "—";
}

export default function AdminPayments() {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedKeyword(keyword.trim()), 350);
    return () => window.clearTimeout(t);
  }, [keyword]);

  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword]);

  const queryArg = useMemo(
    () => ({
      page,
      limit: 10,
      ...(debouncedKeyword ? { keyword: debouncedKeyword } : {}),
    }),
    [page, debouncedKeyword],
  );

  const { data: paymentsData, isLoading, isFetching } = useGetPaymentsQuery(queryArg);

  const paginated = paymentsData?.data;
  const docs: PaymentDoc[] = Array.isArray(paginated?.docs) ? paginated.docs : [];
  const totalDocs = typeof paginated?.totalDocs === "number" ? paginated.totalDocs : 0;
  const totalPages = typeof paginated?.totalPages === "number" ? paginated.totalPages : 0;
  const hasNextPage = Boolean(paginated?.hasNextPage);
  const hasPrevPage = Boolean(paginated?.hasPrevPage);

  const pageSum = docs.reduce((sum, d) => sum + (Number(d.totalAmount) || 0), 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "Total transactions",
            value: isLoading ? "…" : String(totalDocs),
            icon: DollarSign,
            color: "text-green-600",
          },
          {
            label: "On this page",
            value: isLoading ? "…" : String(docs.length),
            icon: CreditCard,
            color: "text-primary",
          },
          {
            label: "Page amount (sum)",
            value: isLoading ? "…" : formatUsd(pageSum),
            icon: CreditCard,
            color: "text-secondary",
          },
          {
            label: "Pending / other",
            value: "—",
            icon: Clock,
            color: "text-muted-foreground",
          },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
                <s.icon className={`h-8 w-8 ${s.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div> */}

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="font-heading">Transaction log</CardTitle>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name…"
                className="pl-9"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                aria-label="Search payments by user name"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" type="button">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" type="button">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative min-h-[120px]">
            {(isLoading || isFetching) && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
                <p className="text-sm text-muted-foreground">Loading payments…</p>
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Charge / payment ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>User Type</TableHead>
                  <TableHead>Type / reference</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {docs.length === 0 && !isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No payments found
                      {debouncedKeyword ? ` for “${debouncedKeyword}”.` : "."}
                    </TableCell>
                  </TableRow>
                ) : (
                  docs.map((p, idx) => {
                    const id = p.chargeId ?? `row-${idx}`;
                    const paid = Boolean(p.isPaid);
                    const statusLabel = paid ? "completed" : "pending";
                    const created = p.createdAt ? new Date(p.createdAt).toLocaleString() : "—";
                    const refLabel = [p.type].filter(Boolean).join(" · ") || "—";
                    const type = refLabel === 'SUBSCRIPTION' ? 'Course Fees' : 'Quiz Retake';

                    return (
                      <TableRow key={id}>
                        <TableCell className="max-w-[160px] truncate font-mono text-xs font-medium">
                          {p.chargeId ?? "—"}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{learnerDisplayName(p.user)}</div>
                          {p.user?.email ? (
                            <div className="text-xs text-muted-foreground">{p.user.email}</div>
                          ) : null}
                        </TableCell>
                        <TableCell>{p.user?.role}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-muted-foreground" title={type}>
                          {type}
                        </TableCell>
                        <TableCell className="font-medium">{formatUsd(p.totalAmount)}</TableCell>
                        <TableCell className="text-muted-foreground">Stripe</TableCell>
                        <TableCell>
                          <Badge
                            variant={paid ? "secondary" : "outline"}
                            className="gap-1 capitalize"
                          >
                            {paid ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                            {statusLabel}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{created}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 0 ? (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 sm:flex-row">
              <p className="text-sm text-muted-foreground">
                Page <span className="font-medium text-foreground">{page}</span> of{" "}
                <span className="font-medium text-foreground">{totalPages}</span>
                <span className="mx-2">·</span>
                <span className="font-medium text-foreground">{totalDocs}</span> total
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!hasPrevPage || isLoading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!hasNextPage || isLoading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}
