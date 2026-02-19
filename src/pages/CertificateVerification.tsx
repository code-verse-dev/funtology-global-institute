import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Award, CheckCircle2, XCircle, Shield, Clock } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import fgiLogo from "@/assets/fgi-logo.png";

const mockCertificates: Record<string, {
  learner: string;
  course: string;
  ceHours: number;
  completionDate: string;
  certificateId: string;
  valid: boolean;
}> = {
  "FGI-2026-004521": {
    learner: "Emma Watson",
    course: "Professional Infection Control & Prevention",
    ceHours: 4,
    completionDate: "February 10, 2026",
    certificateId: "FGI-2026-004521",
    valid: true,
  },
  "FGI-2024-001234": {
    learner: "Sarah Johnson",
    course: "Business Management for Professionals",
    ceHours: 6,
    completionDate: "December 15, 2024",
    certificateId: "FGI-2024-001234",
    valid: true,
  },
};

const CertificateVerification = () => {
  const [searchId, setSearchId] = useState("");
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<(typeof mockCertificates)[string] | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setResult(mockCertificates[searchId.trim().toUpperCase()] || null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20">
        <section className="bg-gradient-hero py-16 md:py-24">
          <div className="container-wide">
            <motion.div
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                Certificate Verification
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                Verify a Certificate
              </h1>
              <p className="text-lg text-primary-foreground/80">
                Enter a certificate ID to verify its authenticity and view details.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="container-wide max-w-2xl">
            <form onSubmit={handleSearch} className="flex gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Enter Certificate ID (e.g., FGI-2026-004521)"
                  className="pl-10 h-12 text-lg"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" variant="secondary" size="lg">Verify</Button>
            </form>

            {searched && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {result ? (
                  <Card className="border-2 border-green-200 bg-green-50/50">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                        <div>
                          <h3 className="font-heading text-xl font-bold text-foreground">Certificate Verified</h3>
                          <p className="text-sm text-green-600">This certificate is authentic and valid.</p>
                        </div>
                      </div>

                      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                        <div className="flex items-center justify-center mb-4">
                          <img src={fgiLogo} alt="FGI" className="w-16 h-16" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Learner</p>
                            <p className="font-medium text-foreground">{result.learner}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Certificate ID</p>
                            <p className="font-medium text-foreground">{result.certificateId}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Course</p>
                            <p className="font-medium text-foreground">{result.course}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">CE Hours Awarded</p>
                            <p className="font-medium text-foreground">{result.ceHours} Contact Hours</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Completion Date</p>
                            <p className="font-medium text-foreground">{result.completionDate}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
                            <Badge variant="secondary" className="gap-1"><CheckCircle2 className="w-3 h-3" />Valid</Badge>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground text-center pt-4 border-t border-border">
                          Issued by Funtology Global Institute for Career Innovation. 
                          This is a professional credential, not an academic degree.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-2 border-red-200 bg-red-50/50">
                    <CardContent className="p-8 text-center">
                      <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                      <h3 className="font-heading text-xl font-bold text-foreground mb-2">Certificate Not Found</h3>
                      <p className="text-muted-foreground">
                        No certificate was found with ID "{searchId}". Please check the ID and try again.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {!searched && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center p-12 bg-muted/50 rounded-2xl">
                <Award className="w-16 h-16 text-secondary/40 mx-auto mb-4" />
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  How to Verify
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Enter the unique certificate ID found on any FGI certificate to verify its authenticity.
                  Certificate IDs follow the format: FGI-YYYY-XXXXXX
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CertificateVerification;
