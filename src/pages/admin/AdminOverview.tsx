import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Activity, Award, BookOpen, Briefcase, DollarSign, Download, Plus, Shield, UserCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useGetAdminStatsQuery } from "@/redux/services/apiSlices/userSlice";
import { useGetAdminNotificationsQuery } from "@/redux/services/apiSlices/notificationSlice";

function formatTotalRevenue(value: unknown): string {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseFloat(value)
        : Number.NaN;
  if (Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

const AdminOverview = () => {
  const { data: adminStats } = useGetAdminStatsQuery();
  const { data: notificationsData, isLoading: notificationsLoading } = useGetAdminNotificationsQuery({
    limit: 5,
  });

  const recentNotifications =
    (notificationsData?.data?.notifications?.docs as Array<{
      _id: string;
      title?: string;
      content?: string;
      createdAt?: string;
    }> | undefined) ?? [];
  return (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* {systemStats.map((stat, i) => (
        <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <p className="text-xs text-green-600 font-medium mt-2">{stat.change} from last month</p>
            </CardContent>
          </Card>
        </motion.div>
      ))} */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay:  0 * 0.1 }}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{adminStats?.data?.totalUsers}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
                <Users className={`w-8 h-8 text-primary`} />
              </div>
              {/* <p className="text-xs text-green-600 font-medium mt-2">+8.2% from last month</p> */}
            </CardContent>
          </Card>
        </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay:  0 * 0.1 }}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{adminStats?.data?.totalActiveCourses}</p>
                  <p className="text-sm text-muted-foreground">Total Active Courses</p>
                </div>
                <BookOpen className={`w-8 h-8 text-primary`} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay:  0 * 0.1 }}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{adminStats?.data?.totalCertificatesIssued}</p>
                  <p className="text-sm text-muted-foreground">Certificates Issued</p>
                </div>
                <Award className={`w-8 h-8 text-primary`} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay:  0 * 0.1 }}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">
                    ${formatTotalRevenue(adminStats?.data?.totalRevenue)}
                  </p>
                  <p className="text-sm text-muted-foreground">Revenue (MTD)</p>
                </div>
                <DollarSign className={`w-8 h-8 text-primary`} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
    </div>
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading">Recent Activity</CardTitle>
          {/* <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/notifications">View All</Link>
          </Button> */}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notificationsLoading ? (
              <p className="text-sm text-muted-foreground py-6 text-center">Loading activity…</p>
            ) : recentNotifications.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No notifications yet.</p>
            ) : (
              recentNotifications.slice(0, 5).map((n) => (
                <div key={n._id} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <Activity className="w-4 h-4 text-secondary mt-1 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{n.title ?? "Notification"}</p>
                    {n.content ? (
                      <p className="text-xs text-muted-foreground line-clamp-2">{n.content}</p>
                    ) : null}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                    {n.createdAt
                      ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })
                      : "—"}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="secondary" className="w-full justify-start gap-2" asChild>
              <Link to="/admin/courses">
                <Plus className="w-4 h-4" />
                Manage Courses
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" asChild>
              <Link to="/admin/users">
                <UserCheck className="w-4 h-4" />
                Manage Users
              </Link>
            </Button>
            {/* <Button variant="outline" className="w-full justify-start gap-2" asChild>
              <Link to="/admin/sme">
                <Briefcase className="w-4 h-4" />
                SME Repository
              </Link>
            </Button> */}
            <Button variant="outline" className="w-full justify-start gap-2" asChild>
              <Link to="/admin/payments">
                <DollarSign className="w-4 h-4" />
                View Payments
              </Link>
            </Button>
            {/* <Button variant="outline" className="w-full justify-start gap-2" asChild>
              <Link to="/admin/reports">
                <Download className="w-4 h-4" />
                Export Reports
              </Link>
            </Button> */}
          </CardContent>
        </Card>
        {/* <Card className="bg-gradient-hero text-primary-foreground">
          <CardContent className="pt-6 text-center">
            <Shield className="w-12 h-12 text-secondary mx-auto mb-3" />
            <p className="font-heading text-lg font-bold text-secondary">Accreditation Ready</p>
            <p className="text-xs text-primary-foreground/70 mt-1">ANSI/IACET 1-2018 guiding framework</p>
            <p className="text-xs text-primary-foreground/50 mt-2">All systems audit-ready</p>
          </CardContent>
        </Card> */}
      </div>
    </div>
  </motion.div>
  );
};


export default AdminOverview;
