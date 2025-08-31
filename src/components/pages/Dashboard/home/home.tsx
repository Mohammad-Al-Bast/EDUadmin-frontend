import { useAnalytics } from "@/hooks/analytics/use-analytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Users,
  GraduationCap,
  Shield,
  UserCheck,
  UserX,
  Calendar,
  RefreshCw,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

const COLORS = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  accent: "hsl(var(--accent))",
  muted: "hsl(var(--muted))",
  blue: "#3b82f6",
  green: "#10b981",
  yellow: "#f59e0b",
  red: "#ef4444",
  purple: "#8b5cf6",
  orange: "#f97316",
};

const CHART_COLORS = [
  COLORS.blue,
  COLORS.green,
  COLORS.yellow,
  COLORS.red,
  COLORS.purple,
  COLORS.orange,
];

const HomePage = () => {
  const { summary, stats, isLoading, hasError, error, refetchAll } =
    useAnalytics();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (hasError) {
    return (
      <div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || "Failed to load dashboard data"}
            <Button
              variant="outline"
              size="sm"
              className="ml-4"
              onClick={refetchAll}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!summary) {
    return (
      <div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No dashboard data available</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <Button onClick={refetchAll} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <StatisticsCards statistics={summary.statistics} />

      {/* Recent Activity */}
      {stats && (
        <RecentActivitySection recentActivity={stats.recent_activity} />
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Students by Year */}
        <div className="overflow-hidden flex justify-center items-center">
          <ChartCard
            title="Students by Year"
            description="Distribution of students across academic years"
            icon={<GraduationCap className="h-4 w-4" />}
          >
            <StudentsByYearChart data={summary.charts.students_by_year} />
          </ChartCard>
        </div>

        {/* Students by School */}
        <div className="overflow-hidden flex justify-center items-center">
          <ChartCard
            title="Students by School"
            description="Student enrollment by school"
            icon={<GraduationCap className="h-4 w-4" />}
          >
            <StudentsBySchoolChart data={summary.charts.students_by_school} />
          </ChartCard>
        </div>

        {/* Users Verification */}
        <div className="overflow-hidden flex justify-center items-center">
          <ChartCard
            title="User Verification Status"
            description="Breakdown of verified vs unverified users"
            icon={<UserCheck className="h-4 w-4" />}
          >
            <UsersVerificationChart data={summary.charts.users_verification} />
          </ChartCard>
        </div>

        {/* Users Role */}
        <div className="overflow-hidden flex justify-center items-center">
          <ChartCard
            title="User Roles"
            description="Distribution of user roles"
            icon={<Shield className="h-4 w-4" />}
          >
            <UsersRoleChart data={summary.charts.users_role} />
          </ChartCard>
        </div>

        {/* Students by Semester */}
        <div className="overflow-hidden flex justify-center items-center">
          {stats && (
            <ChartCard
              title="Students by Semester"
              description="Student enrollment per semester"
              icon={<Calendar className="h-4 w-4" />}
            >
              <StudentsBySemesterChart
                data={stats.additional_charts.students_by_semester}
              />
            </ChartCard>
          )}
        </div>
      </div>
    </div>
  );
};

const StatisticsCards = ({ statistics }: { statistics: any }) => {
  const stats = [
    {
      title: "Total Students",
      value: statistics.students_count,
      icon: <GraduationCap className="h-4 w-4" />,
      color: COLORS.blue,
    },
    {
      title: "Total Users",
      value: statistics.total_users_count,
      icon: <Users className="h-4 w-4" />,
      color: COLORS.green,
    },
    {
      title: "Verified Users",
      value: statistics.verified_users_count,
      icon: <UserCheck className="h-4 w-4" />,
      color: COLORS.green,
    },
    {
      title: "Unverified Users",
      value: statistics.unverified_users_count,
      icon: <UserX className="h-4 w-4" />,
      color: COLORS.red,
    },
    {
      title: "Admin Users",
      value: statistics.admin_users_count,
      icon: <Shield className="h-4 w-4" />,
      color: COLORS.purple,
    },
    {
      title: "Regular Users",
      value: statistics.regular_users_count,
      icon: <Users className="h-4 w-4" />,
      color: COLORS.blue,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <div style={{ color: stat.color }}>{stat.icon}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const RecentActivitySection = ({ recentActivity }: { recentActivity: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4" />
          <span>Recent Activity</span>
        </CardTitle>
        <CardDescription>User activity over time periods</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {recentActivity.users_last_week}
            </p>
            <p className="text-sm text-muted-foreground">Users Last Week</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {recentActivity.users_last_month}
            </p>
            <p className="text-sm text-muted-foreground">Users Last Month</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ChartCard = ({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <Card className="w-full!">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className=" flex items-center justify-center">
        {children}
      </CardContent>
    </Card>
  );
};

const StudentsByYearChart = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) {
    return <EmptyChart message="No year data available" />;
  }

  const chartConfig = {
    count: {
      label: "Students",
      color: COLORS.blue,
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill={COLORS.blue} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
};

const StudentsBySchoolChart = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) {
    return <EmptyChart message="No school data available" />;
  }

  const dataWithColors = data.map((item, index) => ({
    ...item,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));

  const chartConfig = {
    count: {
      label: "Students",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <PieChart>
        <Pie
          data={dataWithColors}
          dataKey="count"
          nameKey="school"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ school, count }) => `${school}: ${count}`}
        >
          {dataWithColors.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
      </PieChart>
    </ChartContainer>
  );
};

const UsersVerificationChart = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) {
    return <EmptyChart message="No verification data available" />;
  }

  const dataWithColors = data.map((item, index) => ({
    ...item,
    fill: index === 0 ? COLORS.green : COLORS.red,
  }));

  const chartConfig = {
    value: {
      label: "Users",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <PieChart>
        <Pie
          data={dataWithColors}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ label, percentage }) => `${label}: ${percentage}%`}
        >
          {dataWithColors.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
      </PieChart>
    </ChartContainer>
  );
};

const UsersRoleChart = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) {
    return <EmptyChart message="No role data available" />;
  }

  const dataWithColors = data.map((item, index) => ({
    ...item,
    fill: index === 0 ? COLORS.purple : COLORS.blue,
  }));

  const chartConfig = {
    value: {
      label: "Users",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <PieChart>
        <Pie
          data={dataWithColors}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ label, percentage }) => `${label}: ${percentage}%`}
        >
          {dataWithColors.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
      </PieChart>
    </ChartContainer>
  );
};

const StudentsBySemesterChart = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) {
    return <EmptyChart message="No semester data available" />;
  }

  const chartConfig = {
    count: {
      label: "Students",
      color: COLORS.purple,
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="semester" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="count"
          stroke={COLORS.purple}
          strokeWidth={2}
          dot={{ fill: COLORS.purple, strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  );
};

const EmptyChart = ({ message }: { message: string }) => {
  return (
    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
      <div className="text-center">
        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
        <p>{message}</p>
      </div>
    </div>
  );
};

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Statistics Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <Skeleton className="h-8 w-16 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
            <div className="text-center">
              <Skeleton className="h-8 w-16 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
