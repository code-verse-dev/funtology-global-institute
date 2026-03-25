import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetMyPaymentsQuery } from "@/redux/services/apiSlices/paymentSlice";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Clock, Loader2 } from "lucide-react";

type PaymentDoc = Record<string, unknown>;

function formatPaymentId(id: string) {
  if (id.length <= 10) return id;
  return `#${id.slice(-8)}`;
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

function formatAmount(amount: unknown, currency?: unknown): string {
  if (amount == null) return "—";
  const n = Number(amount);
  if (Number.isNaN(n)) return "—";
  const cur = typeof currency === "string" && currency.trim() ? currency.trim().toUpperCase() : "USD";
  const major = n % 1 === 0 && n >= 100 ? n / 100 : n;
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: cur }).format(major);
  } catch {
    return `$${major.toFixed(2)}`;
  }
}

function descriptionFromPayment(p: PaymentDoc): string {
  const d =
    p.description ??
    p.type ??
    p.purpose ??
    (typeof p.metadata === "object" && p.metadata !== null && "description" in p.metadata
      ? (p.metadata as { description?: string }).description
      : undefined);
  if (typeof d === "string" && d.trim()) return d.trim();
  const course = p.course;
  if (typeof course === "object" && course !== null && "title" in course) {
    return String((course as { title?: string }).title ?? "—");
  }
  if (typeof course === "string") return course;
  return "—";
}

function statusBadgeVariant(status: string) {
  const s = status.toLowerCase();
  if (s === "succeeded" || s === "completed" || s === "paid") return "secondary" as const;
  if (s === "pending" || s === "processing" || s === "requires_action") return "outline" as const;
  return "destructive" as const;
}

const OrganizationBilling = () => {
  const { data: paymentsRes, isLoading, isError, error, refetch } = useGetMyPaymentsQuery();

  const pageData = paymentsRes?.data as { docs?: PaymentDoc[] } | undefined;
  const docs = pageData?.docs ?? [];

  const listErrorMessage =
    isError && error && "data" in error && error.data && typeof error.data === "object" && "message" in error.data
      ? String((error.data as { message: string }).message)
      : "Could not load payments.";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="font-heading text-lg font-bold">Billing history</h2>

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
              Loading payments…
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {docs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                      No payments yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  docs.map((raw) => {
                    const p = raw as PaymentDoc;
                    const id = String(p._id ?? p.id ?? "");
                    const status = String(p.status ?? p.paymentStatus ?? "—");
                    const created = typeof p.createdAt === "string" ? p.createdAt : typeof p.date === "string" ? p.date : undefined;
                    return (
                      <TableRow key={id || JSON.stringify(p)}>
                        <TableCell className="font-mono text-xs whitespace-nowrap" title={id}>
                          {id ? formatPaymentId(id) : "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm whitespace-nowrap">{formatDate(created)}</TableCell>
                        <TableCell className="text-muted-foreground max-w-[280px]">
                          <span className="line-clamp-2">{descriptionFromPayment(p)}</span>
                        </TableCell>
                        <TableCell className="font-medium tabular-nums">{formatAmount(p.totalAmount, p.currency)}</TableCell>
                        <TableCell>
                          <Badge variant={statusBadgeVariant(status)} className="gap-1 capitalize whitespace-nowrap text-green-500 bg-green-500/10 border-green-500/20">

                            <CheckCircle2 className="w-3 h-3 " />
                            Paid
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrganizationBilling;
