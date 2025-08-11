import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, BookOpen, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Classes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const classes = [
    { 
      id: "CS101", 
      name: "Computer Science 101", 
      instructor: "Dr. Smith", 
      schedule: "Mon/Wed/Fri 09:00-10:00", 
      students: 50, 
      room: "Lab-A1",
      status: "active" 
    },
    { 
      id: "CS201", 
      name: "Data Structures", 
      instructor: "Prof. Johnson", 
      schedule: "Tue/Thu 11:00-12:30", 
      students: 42, 
      room: "Room-201",
      status: "active" 
    },
    { 
      id: "CS301", 
      name: "Advanced Algorithms", 
      instructor: "Dr. Davis", 
      schedule: "Mon/Wed 14:00-15:30", 
      students: 35, 
      room: "Lab-B2",
      status: "active" 
    },
    { 
      id: "MATH201", 
      name: "Discrete Mathematics", 
      instructor: "Prof. Wilson", 
      schedule: "Tue/Thu/Fri 10:00-11:00", 
      students: 45, 
      room: "Room-102",
      status: "active" 
    },
    { 
      id: "PHYS301", 
      name: "Quantum Physics", 
      instructor: "Dr. Brown", 
      schedule: "Mon/Wed 15:30-17:00", 
      students: 28, 
      room: "Lab-P1",
      status: "inactive" 
    }
  ];

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Class Management</h1>
              <p className="text-muted-foreground">Manage courses, schedules, and class information</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/">← Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classes.length}</div>
              <p className="text-xs text-muted-foreground">
                {classes.filter(c => c.status === 'active').length} active
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {classes.reduce((sum, cls) => sum + cls.students, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all classes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Class Size</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(classes.reduce((sum, cls) => sum + cls.students, 0) / classes.length)}
              </div>
              <p className="text-xs text-muted-foreground">
                Students per class
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search classes by name, code, or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Class</DialogTitle>
                <DialogDescription>
                  Create a new class with course details and schedule.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="class-id" className="text-right">
                    Class ID
                  </Label>
                  <Input id="class-id" placeholder="CS101" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="class-name" className="text-right">
                    Class Name
                  </Label>
                  <Input id="class-name" placeholder="Enter class name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="instructor" className="text-right">
                    Instructor
                  </Label>
                  <Input id="instructor" placeholder="Dr. Smith" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="schedule" className="text-right">
                    Schedule
                  </Label>
                  <Input id="schedule" placeholder="Mon/Wed/Fri 09:00-10:00" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="room" className="text-right">
                    Room
                  </Label>
                  <Input id="room" placeholder="Room-101" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Class</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Classes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Classes ({filteredClasses.length})</CardTitle>
            <CardDescription>
              Manage class schedules and information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class ID</TableHead>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.map((cls) => (
                  <TableRow key={cls.id}>
                    <TableCell className="font-medium">{cls.id}</TableCell>
                    <TableCell>{cls.name}</TableCell>
                    <TableCell>{cls.instructor}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        {cls.schedule}
                      </div>
                    </TableCell>
                    <TableCell>{cls.room}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {cls.students}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={cls.status === "active" ? "default" : "secondary"}>
                        {cls.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Classes;