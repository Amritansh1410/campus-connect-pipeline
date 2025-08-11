import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, BookOpen, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Students",
      value: "1,234",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Classes",
      value: "45",
      change: "+3",
      icon: BookOpen,
      color: "text-green-600"
    },
    {
      title: "Today's Attendance",
      value: "89%",
      change: "+5%",
      icon: CheckCircle,
      color: "text-emerald-600"
    },
    {
      title: "This Week",
      value: "92%",
      change: "+2%",
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ];

  const recentClasses = [
    { name: "Computer Science 101", time: "09:00 AM", attendance: "45/50", status: "ongoing" },
    { name: "Mathematics 201", time: "11:00 AM", attendance: "38/42", status: "completed" },
    { name: "Physics 301", time: "02:00 PM", attendance: "0/35", status: "upcoming" },
    { name: "Chemistry 201", time: "03:30 PM", attendance: "0/40", status: "upcoming" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">College Attendance System</h1>
              <p className="text-muted-foreground">Track and manage student attendance efficiently</p>
            </div>
            <div className="flex gap-3">
              <Button asChild>
                <Link to="/attendance">Mark Attendance</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/reports">View Reports</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <IconComponent className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stat.change}</span> from last month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Classes */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Classes
              </CardTitle>
              <CardDescription>
                Schedule and attendance status for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentClasses.map((cls, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{cls.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {cls.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{cls.attendance}</p>
                      <Badge 
                        variant={cls.status === 'completed' ? 'default' : cls.status === 'ongoing' ? 'secondary' : 'outline'}
                        className="capitalize"
                      >
                        {cls.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and navigation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start" variant="ghost">
                <Link to="/students" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Manage Students
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="ghost">
                <Link to="/classes" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Manage Classes
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="ghost">
                <Link to="/attendance" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Mark Attendance
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="ghost">
                <Link to="/reports" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  View Reports
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;