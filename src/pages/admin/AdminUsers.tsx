import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NONPROFIT_UPLOADS_URL, UPLOADS_URL } from "@/constants/api";
import { useNonprofitAdminMode } from "@/contexts/NonprofitAdminContext";
import {
  useExportNonprofitUsersXlsxMutation,
  useGetNonprofitUsersQuery,
  useUpdateNonprofitUserStatusMutation,
} from "@/redux/services/apiSlices/nonprofitAdminApiSlice";
import {
  useExportUsersXlsxMutation,
  useGetUsersQuery,
  useUpdateUserStatusMutation,
  type UserStatus,
} from "@/redux/services/apiSlices/userSlice";
import { motion } from "framer-motion";
import {
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  Loader2,
  MoreVertical,
  Search,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { formatRole, formatUserStatusLabel, userStatusBadgeVariant } from "./userDisplay";

const PAGE_SIZE = 10;

const AdminUsers = () => {
  const nonprofitAdmin = useNonprofitAdminMode();
  const adminBase = nonprofitAdmin ? "/admin/nonprofit" : "/admin";
  const uploadsBase = nonprofitAdmin ? NONPROFIT_UPLOADS_URL : UPLOADS_URL;

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [exportUsersXlsx] = useExportUsersXlsxMutation();
  const [exportNonprofitUsersXlsx] = useExportNonprofitUsersXlsxMutation();

  const handleExport = async () => {
    const params = {
      keyword: debouncedKeyword,
      role: roleFilter === "all" ? undefined : roleFilter,
      status: statusFilter === "all" ? undefined : (statusFilter as UserStatus),
      from: fromDate || undefined,
      to: toDate || undefined,
    };
    try {
      const blob = nonprofitAdmin
        ? await exportNonprofitUsersXlsx(params).unwrap()
        : await exportUsersXlsx(params).unwrap();
  
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = url;
      link.download = "users-export.xlsx"; // 🔥 IMPORTANT: XLSX FILE
      link.click();
  
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log("Export error:", err);
    }
  };


  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword, roleFilter, statusFilter, fromDate, toDate]);

  const queryArgs = {
    page,
    limit: PAGE_SIZE,
    keyword: debouncedKeyword || undefined,
    role: roleFilter === "all" ? undefined : roleFilter,
    status: statusFilter === "all" ? undefined : (statusFilter as UserStatus),
    from: fromDate || undefined,
    to: toDate || undefined,
  };

  const mainUsers = useGetUsersQuery(queryArgs, { skip: nonprofitAdmin });
  const npUsers = useGetNonprofitUsersQuery(queryArgs, { skip: !nonprofitAdmin });

  const { data, isLoading, isFetching, isError, error, refetch } = nonprofitAdmin ? npUsers : mainUsers;

  const [updateStatusMain] = useUpdateUserStatusMutation();
  const [updateStatusNp] = useUpdateNonprofitUserStatusMutation();

  const onSetStatus = async (id: string, status: UserStatus) => {
    try {
      const res = nonprofitAdmin
        ? await updateStatusNp({ id, status }).unwrap()
        : await updateStatusMain({ id, status }).unwrap();
      if (res.status) toast.success(res.message || "Status updated");
      else toast.error(res.message || "Could not update status");
    } catch {
      toast.error("Could not update status");
    }
  };

  const paginated = data?.data;
  const users = paginated?.docs ?? [];
  const totalPages = paginated?.totalPages ?? 1;
  const totalDocs = paginated?.totalDocs ?? 0;

  const userImageSrc = (image?: string) =>
    image ? `${uploadsBase.replace(/\/$/, "")}/${String(image).replace(/^\//, "")}` : undefined;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or organization…"
            className="pl-10"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="learner">Learner</SelectItem>
                <SelectItem value="organization">Organization</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="INACTIVE">Suspended (inactive)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-filter-from">Joined from</Label>
            <Input id="user-filter-from" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="user-filter-to">Joined to</Label>
            <Input id="user-filter-to" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div> */}
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-between">
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading…" : `${totalDocs} user${totalDocs === 1 ? "" : "s"}`}
            {isFetching && !isLoading ? <Loader2 className="inline w-3 h-3 ml-2 animate-spin" /> : null}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" type="button" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export Users
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-12 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isError ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-destructive py-10">
                    {error && "data" in error && typeof (error as { data?: { message?: string } }).data?.message === "string"
                      ? (error as { data: { message: string } }).data.message
                      : "Failed to load users."}{" "}
                    <Button variant="link" className="p-0 h-auto" type="button" onClick={() => refetch()}>
                      Retry
                    </Button>
                  </TableCell>
                </TableRow>
              ) : isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin inline mr-2" />
                    Loading users…
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    No users match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => {
                  const fullName = `${user.firstName} ${user.lastName}`.trim();
                  const initials =
                    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "?";
                  const img = userImageSrc(user.image);
                  return (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar className="h-8 w-8 shrink-0">
                            {img ? <AvatarImage src={img} alt="" /> : null}
                            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{fullName}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === "organization" ? "default" : "outline"}>
                          {formatRole(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={userStatusBadgeVariant(user.status)} className="gap-1 capitalize">
                          {user.status === "ACTIVE" ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : user.status === "INACTIVE" ? (
                            <XCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {formatUserStatusLabel(user.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Open actions">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuItem asChild>
                              <Link to={`${adminBase}/users/${user._id}`} className="cursor-pointer flex items-center">
                                <Eye className="w-4 h-4 mr-2" />
                                View details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled className="cursor-not-allowed opacity-60">
                              <Award className="w-4 h-4 mr-2" />
                              Certificates
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              disabled={user.status === "ACTIVE"}
                              onClick={() => onSetStatus(user._id, "ACTIVE")}
                            >
                              Set active
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem
                              disabled={user.status === "PENDING"}
                              onClick={() => onSetStatus(user._id, "PENDING")}
                            >
                              Set pending
                            </DropdownMenuItem> */}
                            <DropdownMenuItem
                              disabled={user.status === "INACTIVE"}
                              onClick={() => onSetStatus(user._id, "INACTIVE")}
                            >
                              Suspend (inactive)
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && !isLoading && !isError ? (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            type="button"
            disabled={page <= 1 || isFetching}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            type="button"
            disabled={page >= totalPages || isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      ) : null}
    </motion.div>
  );
};

export default AdminUsers;
