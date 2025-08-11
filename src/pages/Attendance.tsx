import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Save, CalendarIcon, Users, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Attendance = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceData, setAttendanceData] = useState({});

  const classes = [
    { id: "CS101", name: "Computer Science 101" },
    { id: "CS201", name: "Data Structures" },
    { id: "CS301", name: "Advanced Algorithms" },
    { id: "MATH201", name: "Discrete Mathematics" }
  ];

  const students = [
    { id: "ST001", name: "Alice Johnson", rollNo: "2021001" },
    { id: "ST002", name: "Bob Smith", rollNo: "2021002" },
    { id: "ST003", name: "Carol Davis", rollNo: "2021003" },
    { id: "ST004", name: "David Wilson", rollNo: "2021004" },
    { id: "ST005", name: "Emma Brown", rollNo: "2021005" },
    { id: "ST006", name: "Frank Miller", rollNo: "2021006" },
    { id: "ST007", name: "Grace Lee", rollNo: "2021007" },
    { id: "ST008", name: "Henry Zhang", rollNo: "2021008" }
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAttendanceToggle = (studentId, isPresent) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: isPresent
    }));
  };

  const saveAttendance = () => {
    console.log("Saving attendance:", {
      class: selectedClass,
      date: selectedDate,
      attendance: attendanceData
    });
    // Here you would typically save to your database
  };

  const presentCount = Object.values(attendanceData).filter(Boolean).length;
  const totalCount = filteredStudents.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mark Attendance</h1>
              <p className="text-muted-foreground">Record student attendance for classes</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/">← Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Selection Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Class</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Present:</span>
                  <Badge className="bg-green-100 text-green-800">
                    {presentCount}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total:</span>
                  <Badge variant="secondary">{totalCount}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rate:</span>
                  <Badge variant="outline">
                    {totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedClass && (
          <>
            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search students by name or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const allPresent = {};
                    filteredStudents.forEach(student => {
                      allPresent[student.id] = true;
                    });
                    setAttendanceData(allPresent);
                  }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Mark All Present
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    const allAbsent = {};
                    filteredStudents.forEach(student => {
                      allAbsent[student.id] = false;
                    });
                    setAttendanceData(allAbsent);
                  }}
                  className="flex items-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Mark All Absent
                </Button>
                
                <Button
                  onClick={saveAttendance}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Attendance
                </Button>
              </div>
            </div>

            {/* Attendance Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Student Attendance - {classes.find(c => c.id === selectedClass)?.name}
                </CardTitle>
                <CardDescription>
                  Mark attendance for {format(selectedDate, "PPPP")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Present</TableHead>
                      <TableHead className="text-center">Absent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => {
                      const isPresent = attendanceData[student.id];
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.rollNo}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>
                            {isPresent === true && (
                              <Badge className="bg-green-100 text-green-800">Present</Badge>
                            )}
                            {isPresent === false && (
                              <Badge variant="destructive">Absent</Badge>
                            )}
                            {isPresent === undefined && (
                              <Badge variant="secondary">Not Marked</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={isPresent === true}
                              onCheckedChange={() => handleAttendanceToggle(student.id, true)}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={isPresent === false}
                              onCheckedChange={() => handleAttendanceToggle(student.id, false)}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}

        {!selectedClass && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a Class</h3>
              <p className="text-muted-foreground text-center">
                Please select a class from the dropdown above to start marking attendance.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Attendance;