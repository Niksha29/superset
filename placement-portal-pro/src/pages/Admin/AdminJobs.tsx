import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { jobsApi } from "@/services";
import { Job } from "@/types";
import * as XLSX from 'xlsx';

interface JobApplication {
  id: string;
  studentId: string;
  status: string;
  studentProfile: {
    full_name: string;
    roll_number: string;
    department: string;
    cgpa: number;
    backlogs: number;
    phone_number: string;
    email: string;
  };
}

const AdminJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await jobsApi.getJobs();
      if (error) throw new Error(error);
      setJobs(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (jobId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/jobs/${jobId}/applications`, {
        credentials: 'include'
      });
      const data = await response.json();
      setApplications(data.applications);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive",
      });
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      const { error } = await jobsApi.deleteJob(jobId);
      if (error) throw new Error(error);
      toast({
        title: "Success",
        description: "Job deleted successfully",
      });
      fetchJobs();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
    }
  };

  const handleDownloadExcel = () => {
    if (!selectedJob || applications.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(
      applications.map(app => ({
        'Student Name': app.studentProfile.full_name,
        'Roll Number': app.studentProfile.roll_number,
        'Department': app.studentProfile.department,
        'CGPA': app.studentProfile.cgpa,
        'Backlogs': app.studentProfile.backlogs,
        'Phone': app.studentProfile.phone_number,
        'Email': app.studentProfile.email,
        'Application Status': app.status
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');
    XLSX.writeFile(workbook, `${selectedJob.title}_applications.xlsx`);
  };

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Jobs</h1>
          <p className="text-muted-foreground">View and manage job postings and applications</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Posted Jobs</CardTitle>
              <CardDescription>Manage job postings and view applications</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <p className="text-muted-foreground">Loading jobs...</p>
                </div>
              ) : jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <Card key={job.id} className="bg-background/50 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-primary">{job.title}</h3>
                          <p className="text-sm text-muted-foreground">{job.company}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Posted: {new Date(job.postedDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedJob(job);
                              fetchApplications(job.id);
                            }}
                          >
                            View Applications
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteJob(job.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center py-12">
                  <p className="text-muted-foreground">No jobs posted yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Applications</CardTitle>
              <CardDescription>
                {selectedJob
                  ? `Applications for ${selectedJob.title}`
                  : "Select a job to view applications"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedJob && applications.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      {applications.length} application(s)
                    </p>
                    <Button variant="secondary" onClick={handleDownloadExcel}>
                      Download Excel
                    </Button>
                  </div>
                  <div className="rounded-md border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Student Name</TableHead>
                          <TableHead>Roll Number</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>CGPA</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {applications.map((app) => (
                          <TableRow key={app.id}>
                            <TableCell className="font-medium">{app.studentProfile.full_name}</TableCell>
                            <TableCell>{app.studentProfile.roll_number}</TableCell>
                            <TableCell>{app.studentProfile.department}</TableCell>
                            <TableCell>{app.studentProfile.cgpa}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                app.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                app.status === 'accepted' ? 'bg-green-500/10 text-green-500' :
                                'bg-red-500/10 text-red-500'
                              }`}>
                                {app.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center py-12">
                  <p className="text-muted-foreground">
                    {selectedJob
                      ? "No applications for this job"
                      : "Select a job to view applications"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminJobs; 