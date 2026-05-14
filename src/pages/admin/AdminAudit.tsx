import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { auditLog } from "./data";

const AdminAudit = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="font-heading text-lg font-bold">Full Audit Trail</h2>
      <Button variant="outline" size="sm">
        <Download className="w-4 h-4 mr-2" />
        Export Log
      </Button>
    </div>
    <Card>
      <CardContent className="p-0">
        <Table className="min-w-[640px]">
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLog.map((log, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{log.action}</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">{log.details}</TableCell>
                <TableCell>
                  <Badge variant="outline">{log.type}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{log.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </motion.div>
);

export default AdminAudit;
