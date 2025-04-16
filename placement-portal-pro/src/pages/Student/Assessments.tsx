
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Mock assessment data
const mockAssessments = [
  {
    id: "1",
    title: "Technical Aptitude Test",
    company: "TechCorp",
    date: new Date(2023, 4, 18, 14, 0),
    duration: "60 minutes",
    status: "upcoming",
    description: "This assessment will test your technical knowledge and problem-solving skills.",
    topics: ["Data Structures", "Algorithms", "Programming Concepts"],
    link: "https://assessment-platform.com/test/abc123"
  },
  {
    id: "2",
    title: "Coding Challenge",
    company: "WebWorks",
    date: new Date(2023, 4, 22, 10, 0),
    duration: "120 minutes",
    status: "upcoming",
    description: "Solve coding problems to demonstrate your programming skills.",
    topics: ["JavaScript", "React", "Frontend Development"],
    link: "https://codingplatform.com/challenge/xyz789"
  },
  {
    id: "3",
    title: "Data Analysis Challenge",
    company: "DataMinds",
    date: new Date(2023, 4, 10, 15, 0),
    duration: "90 minutes",
    status: "completed",
    result: {
      score: 85,
      maxScore: 100,
      percentile: 92
    },
    description: "Analyze given datasets and extract meaningful insights.",
    topics: ["Data Analysis", "Statistics", "Data Visualization"]
  }
];

const StudentAssessments = () => {
  const [assessments, setAssessments] = useState(mockAssessments);
  
  const upcomingAssessments = assessments.filter(assessment => assessment.status === "upcoming");
  const completedAssessments = assessments.filter(assessment => assessment.status === "completed");

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout requiredRole="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Assessments</h1>
          <p className="text-muted-foreground">View your scheduled and completed assessments</p>
        </div>
        
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Assessments</TabsTrigger>
            <TabsTrigger value="completed">Completed Assessments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-6">
            {upcomingAssessments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingAssessments.map((assessment) => (
                  <Card key={assessment.id} className="bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{assessment.title}</CardTitle>
                          <CardDescription>{assessment.company}</CardDescription>
                        </div>
                        <Badge>Upcoming</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm space-y-2">
                        <div>
                          <span className="text-muted-foreground">Date:</span>
                          <span className="ml-2 font-medium">{formatDate(assessment.date)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Time:</span>
                          <span className="ml-2">{formatTime(assessment.date)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="ml-2">{assessment.duration}</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm mb-2">{assessment.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {assessment.topics.map((topic, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <a href={assessment.link} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button className="w-full">
                          Take Assessment
                        </Button>
                      </a>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">You don't have any upcoming assessments scheduled.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  When a company schedules an assessment for you, it will appear here.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            {completedAssessments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedAssessments.map((assessment) => (
                  <Card key={assessment.id} className="bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{assessment.title}</CardTitle>
                          <CardDescription>{assessment.company}</CardDescription>
                        </div>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm space-y-2">
                        <div>
                          <span className="text-muted-foreground">Date:</span>
                          <span className="ml-2">{formatDate(assessment.date)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="ml-2">{assessment.duration}</span>
                        </div>
                      </div>
                      
                      {'result' in assessment && assessment.result && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Score: {assessment.result.score}/{assessment.result.maxScore}</span>
                            <span className="text-sm">{Math.round((assessment.result.score / assessment.result.maxScore) * 100)}%</span>
                          </div>
                          <Progress value={(assessment.result.score / assessment.result.maxScore) * 100} className="h-2" />
                          <p className="text-sm text-muted-foreground">
                            Percentile: {assessment.result.percentile}
                          </p>
                        </div>
                      )}
                      
                      <div>
                        <p className="text-sm mb-2">{assessment.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {assessment.topics.map((topic, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">You don't have any completed assessments yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentAssessments;
