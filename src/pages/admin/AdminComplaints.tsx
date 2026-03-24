import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Plus } from "lucide-react";
import { complaints } from "./data";

const AdminComplaints = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="font-heading text-lg font-bold">Complaints & Appeals</h2>
      <Button variant="secondary" size="sm">
        <Plus className="w-4 h-4 mr-2" />
        New Ticket
      </Button>
    </div>
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Learner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Resolution</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.id}</TableCell>
                <TableCell>{c.subject}</TableCell>
                <TableCell>{c.learner}</TableCell>
                <TableCell>
                  <Badge variant={c.status === "resolved" ? "secondary" : c.status === "in_review" ? "outline" : "default"} className="gap-1">
                    {c.status === "resolved" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {c.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{c.date}</TableCell>
                <TableCell className="text-muted-foreground">{c.resolution || "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </motion.div>
);

export default AdminComplaints;
