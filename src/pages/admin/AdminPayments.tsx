import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Clock, CreditCard, DollarSign, Download } from "lucide-react";
import { paymentLog } from "./data";
import { useGetPaymentsQuery } from "@/redux/services/apiSlices/paymentSlice";
import { useState } from "react";
export default function AdminPayments() {
  const [paymentPage, setPaymentPage] = useState(1);
  const [paymentPagination, setPaymentPagination] = useState({ totalPages: 0, totalDocs: 0 });
  const { data: paymentsData } = useGetPaymentsQuery({ page: paymentPage, limit: 10 });
  console.log("paymentsData", paymentsData);

  return (

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "$45,230", icon: DollarSign, color: "text-green-600" },
          { label: "Transactions", value: "1,234", icon: CreditCard, color: "text-primary" },
          { label: "Refunds", value: "$890", icon: AlertTriangle, color: "text-destructive" },
          { label: "Pending", value: "$340", icon: Clock, color: "text-secondary" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
                <s.icon className={`w-8 h-8 ${s.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading">Transaction Log</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Learner</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentLog.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.id}</TableCell>
                  <TableCell>{p.learner}</TableCell>
                  <TableCell className="max-w-xs truncate">{p.course}</TableCell>
                  <TableCell className="font-medium">{p.amount}</TableCell>
                  <TableCell className="text-muted-foreground">{p.method}</TableCell>
                  <TableCell>
                    <Badge
                      variant={p.status === "completed" ? "secondary" : p.status === "pending" ? "outline" : "destructive"}
                      className="gap-1"
                    >
                      {p.status === "completed" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : p.status === "refunded" ? (
                        <AlertTriangle className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );

}