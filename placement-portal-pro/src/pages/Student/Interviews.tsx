
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

// Mock interview data
const mockInterviews = [
  {
    id: "1",
    company: "TechCorp",
    position: "Software Developer",
    date: new Date(2023, 4, 20, 10, 0),
    duration: "45 minutes",
    mode: "Online",
    link: "https://meet.google.com/abc-def-ghi",
    status: "upcoming"
  },
  {
    id: "2",
    company: "WebWorks",
    position: "Frontend Developer",
    date: new Date(2023, 4, 25, 14, 30),
    duration: "60 minutes",
    mode: "In-person",
    location: "Company Campus",
    status: "upcoming"
  },
  {
    id: "3",
    company: "DataMinds",
    position: "Data Analyst",
    date: new Date(2023, 4, 15, 11, 0),
    duration: "45 minutes",
    mode: "Online",
    link: "https://zoom.us/j/123456789",
    status: "completed"
  }
];

const StudentInterviews = () => {
  const [interviews, setInterviews] = useState(mockInterviews);
  
  const upcomingInterviews = interviews.filter(interview => interview.status === "upcoming");
  const completedInterviews = interviews.filter(interview => interview.status === "completed");

  return (
    <DashboardLayout requiredRole="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Interviews</h1>
          <p className="text-muted-foreground">View your scheduled interviews</p>
        </div>
        
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Interviews</TabsTrigger>
            <TabsTrigger value="completed">Completed Interviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-6">
            {upcomingInterviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingInterviews.map((interview) => (
                  <Card key={interview.id} className="bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{interview.company}</CardTitle>
                          <CardDescription>{interview.position}</CardDescription>
                        </div>
                        <Badge variant="secondary">{interview.mode}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          <span className="font-medium">
                            {interview.date.toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                          <span className="text-muted-foreground ml-2">
                            {interview.date.toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="ml-2">{interview.duration}</span>
                      </div>
                      
                      {interview.mode === "Online" && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Meeting Link:</span>
                          <a href={interview.link} target="_blank" rel="noopener noreferrer" 
                             className="ml-2 text-primary underline hover:text-primary/80">
                            Join Meeting
                          </a>
                        </div>
                      )}
                      
                      {interview.mode === "In-person" && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Location:</span>
                          <span className="ml-2">{interview.location}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">You don't have any upcoming interviews scheduled.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  When a company schedules an interview with you, it will appear here.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            {completedInterviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedInterviews.map((interview) => (
                  <Card key={interview.id} className="bg-card/60 backdrop-blur-sm opacity-70">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{interview.company}</CardTitle>
                          <CardDescription>{interview.position}</CardDescription>
                        </div>
                        <Badge variant="outline">{interview.mode}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          <span className="font-medium">
                            {interview.date.toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                          <span className="text-muted-foreground ml-2">
                            {interview.date.toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="ml-2">{interview.duration}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">You don't have any completed interviews yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentInterviews;
