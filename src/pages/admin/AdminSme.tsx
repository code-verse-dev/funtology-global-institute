import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Edit, Eye, Plus, Upload } from "lucide-react";
import { smeProfiles } from "./data";

const AdminSme = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="font-heading text-lg font-bold">SME / Credential Repository</h2>
        <p className="text-sm text-muted-foreground">Admin-managed instructor/SME profiles and credentials</p>
      </div>
      <Button variant="secondary" size="sm">
        <Plus className="w-4 h-4 mr-2" />
        Add SME Profile
      </Button>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {smeProfiles.map((sme, i) => (
        <motion.div key={sme.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
          <Card className="hover:shadow-md transition-all">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {sme.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{sme.name}</h3>
                  <p className="text-sm text-secondary">{sme.role}</p>
                  <p className="text-xs text-muted-foreground">{sme.credentials}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={sme.status === "approved" ? "secondary" : "outline"} className="gap-1">
                    {sme.status === "approved" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {sme.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Credential Expiry</span>
                  <span className="font-medium">{sme.expiry}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Assigned Courses</span>
                  <span className="font-medium">{sme.courses}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <Eye className="w-3 h-3" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <Upload className="w-3 h-3" />
                  Docs
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <Edit className="w-3 h-3" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default AdminSme;
