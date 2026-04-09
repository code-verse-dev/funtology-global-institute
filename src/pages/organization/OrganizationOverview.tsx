import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BookOpen, DollarSign, Plus, Upload, Users, Award} from "lucide-react";
import { Link } from "react-router-dom";
import { orgData } from "./orgDashboardData";
import { OrganizationCoursesList } from "./OrganizationCoursesList";
import { useGetOrganizationStatsQuery } from "@/redux/services/apiSlices/learnerSlice";

const OrganizationOverview = () => {
  const { data: stats } = useGetOrganizationStatsQuery();

  const orgStats = [
    { icon: Users, label: "Total Learners", value: stats?.data?.totalLearners, color: "text-primary" },
    { icon: BookOpen, label: "Active Courses", value: stats?.data?.activeCourses, color: "text-blue-600" },
    { icon: Award, label: "Certificates Earned", value: stats?.data?.certificatesEarned, color: "text-secondary" },
    // { icon: TrendingUp, label: "Avg. Completion", value: "82%", color: "text-green-600" },
  ];
  return (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {orgStats.map((stat, index) => (
        <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
     
    </div>

    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle className="font-heading">Courses</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/organization/courses">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <OrganizationCoursesList variant="overview" />
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="secondary" className="w-full justify-start gap-2" asChild>
              <Link to="/organization/learners">
                <Plus className="w-4 h-4" />
                Add Learners
              </Link>
            </Button>
            {/* <Button variant="outline" className="w-full justify-start gap-2" type="button">
              <Upload className="w-4 h-4" />
              Import CSV
            </Button> */}
            <Button variant="outline" className="w-full justify-start gap-2" asChild>
              <Link to="/organization/courses">
                <BookOpen className="w-4 h-4" />
                Courses
              </Link>
            </Button>
            {/* <Button variant="outline" className="w-full justify-start gap-2" type="button">
              <Download className="w-4 h-4" />
              Export Reports
            </Button> */}
          </CardContent>
        </Card>

        {/* <Card className="bg-gradient-hero text-primary-foreground">
          <CardContent className="pt-6 text-center">
            <DollarSign className="w-12 h-12 text-secondary mx-auto mb-3" />
            <p className="text-2xl font-bold text-secondary">{orgData.totalSpent}</p>
            <p className="text-primary-foreground/80 text-sm">Total Investment</p>
            <p className="text-xs text-primary-foreground/50 mt-1">{orgData.plan} Plan</p>
          </CardContent>
        </Card> */}
      </div>
    </div>
  </motion.div>
)};

export default OrganizationOverview;
