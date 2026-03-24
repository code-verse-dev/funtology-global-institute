import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Edit, FileText } from "lucide-react";

const AdminSettings = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Assessment Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Minimum Passing Score", desc: "Required score to pass", value: "70%" },
            { label: "Maximum Retakes", desc: "Allowed retakes per assessment", value: "2" },
            { label: "Retake Waiting Period", desc: "Days between attempts", value: "30 days" },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium text-sm">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
              <Badge variant="secondary">{s.value}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Platform Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Record Retention", desc: "Minimum data retention", value: "7 years" },
            { label: "Time-on-Task Tracking", desc: "Prevent auto-completion", value: "Enabled" },
            { label: "Mandatory Evaluations", desc: "Required before certificate", value: "Enabled" },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium text-sm">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
              <Badge variant={s.value === "No" ? "outline" : "secondary"}>{s.value}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Policy Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            "CE Policy Manual",
            "SME Qualification Policy",
            "Assessment Policy",
            "Complaints & Appeals Policy",
            "Accessibility Policy",
            "Records Retention Policy",
            "Ethics & Marketing Policy",
          ].map((doc) => (
            <div key={doc} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-secondary" />
                <span className="text-sm">{doc}</span>
              </div>
              <Button variant="ghost" size="sm">
                <Edit className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Security & Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Two-Factor Auth", desc: "Required for admin accounts", value: "Enabled" },
            { label: "Data Encryption", desc: "At rest and in transit", value: "AES-256" },
            { label: "Backup Schedule", desc: "Automated database backups", value: "Daily" },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium text-sm">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
              <Badge variant="secondary">{s.value}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </motion.div>
);

export default AdminSettings;
