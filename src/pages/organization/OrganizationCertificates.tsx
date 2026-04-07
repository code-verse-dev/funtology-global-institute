import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { lessonFileUrl } from "@/pages/admin/lessonFileUrl";
import {
  useGetOrganizationCertificatesQuery,
  type OrganizationLearnerCertificate,
} from "@/redux/services/apiSlices/certificateSlice";
import { motion } from "framer-motion";
import { Download, GraduationCap, Loader2 } from "lucide-react";

function certificatesListFromResponse(data: unknown): OrganizationLearnerCertificate[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as OrganizationLearnerCertificate[];
  if (typeof data === "object" && data !== null && "docs" in data) {
    const docs = (data as { docs?: OrganizationLearnerCertificate[] }).docs;
    return Array.isArray(docs) ? docs : [];
  }
  return [];
}

function studentDisplayName(cert: OrganizationLearnerCertificate): string {
  const s = cert.student;
  if (s && typeof s === "object") {
    const n = [s.firstName, s.lastName].filter(Boolean).join(" ").trim();
    return n || s.email || "Learner";
  }
  return "Learner";
}

function studentInitials(cert: OrganizationLearnerCertificate): string {
  const s = cert.student;
  if (s && typeof s === "object") {
    const parts = [s.firstName, s.lastName].filter(Boolean) as string[];
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
    if (parts.length === 1) return parts[0][0].toUpperCase();
    const e = s.email;
    if (e && e.length >= 2) return e.slice(0, 2).toUpperCase();
  }
  return "?";
}


function courseTitle(cert: OrganizationLearnerCertificate): string {
  const c = cert.course;
  if (c && typeof c === "object" && c.title) return c.title;
  return "Course";
}

function formatIssued(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString(undefined, { dateStyle: "medium" });
}

const OrganizationCertificates = () => {
  const { data: certificatesRes, isLoading, isError, error, refetch } = useGetOrganizationCertificatesQuery();

  const myCertificatesData = certificatesListFromResponse(certificatesRes?.data);

  const listErrorMessage =
    isError && error && "data" in error && error.data && typeof error.data === "object" && "message" in error.data
      ? String((error.data as { message: string }).message)
      : "Could not load certificates.";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="font-heading text-lg font-bold">Team certificates</h2>
      <p className="text-sm text-muted-foreground max-w-2xl">
        Certificates earned by learners in your organization. Download each PDF using the button on the card.
      </p>

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

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 text-muted-foreground py-16">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading certificates…
        </div>
      ) : myCertificatesData.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">No certificates yet.</CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myCertificatesData.map((cert, index) => {
            const href = lessonFileUrl(cert.certificateUrl);
            return (
              <motion.div
                key={cert._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-all h-full flex flex-col">
                  <CardContent className="pt-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{studentInitials(cert)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{studentDisplayName(cert)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 mb-2">
                      <GraduationCap className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{courseTitle(cert)}</p>
                        <p className="text-xs text-muted-foreground mt-1">Issued {formatIssued(cert.createdAt)}</p>
                      </div>
                    </div>
                    <div className="mt-auto pt-4">
                      {href ? (
                        <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                          <a href={href} target="_blank" rel="noopener noreferrer" download>
                            <Download className="w-4 h-4" />
                            Download certificate
                          </a>
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="w-full" disabled>
                          File unavailable
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default OrganizationCertificates;
