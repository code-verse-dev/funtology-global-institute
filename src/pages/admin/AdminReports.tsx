import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Briefcase,
  ClipboardList,
  Clock,
  DollarSign,
  Download,
  FileText,
  GraduationCap,
  Shield,
} from "lucide-react";

const AdminReports = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { title: "Course Completion Report", desc: "Detailed completion stats per course", icon: BookOpen },
        { title: "CE Hour Summary", desc: "Total contact hours awarded by period", icon: Clock },
        { title: "Assessment Analytics", desc: "Pass/fail rates and score distributions", icon: ClipboardList },
        { title: "Certificate Issuance Log", desc: "All certificates with verification IDs", icon: Award },
        { title: "Evaluation Summary", desc: "Course evaluation feedback and trends", icon: FileText },
        { title: "Financial Report", desc: "Revenue, refunds, and payment history", icon: DollarSign },
        { title: "SME Participation", desc: "SME activity and course assignments", icon: Briefcase },
        { title: "Learner Transcript", desc: "Individual learner records and history", icon: GraduationCap },
        { title: "Compliance Audit", desc: "Framework alignment and audit trail", icon: Shield },
      ].map((report, i) => (
        <motion.div key={report.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card className="hover:shadow-md hover:border-secondary/30 transition-all cursor-pointer group">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <report.icon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-foreground mb-1">{report.title}</h3>
                  <p className="text-sm text-muted-foreground">{report.desc}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="w-3 h-3" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="w-3 h-3" />
                  PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default AdminReports;
