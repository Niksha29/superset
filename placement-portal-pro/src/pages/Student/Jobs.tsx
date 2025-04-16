import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { JobCard } from "@/components/dashboard/JobCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { jobsApi } from "@/services";
import { Job } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

const StudentJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState("available");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        // Fetch applied jobs first
        const { data: appliedResponse, error: appliedError } = await jobsApi.getAppliedJobs();
        
        if (appliedError) {
          throw new Error(appliedError);
        }

        // Process applied jobs
        const appliedJobsData = appliedResponse?.appliedJobs || [];
        console.log('Raw applied jobs data:', appliedJobsData);
        
        const processedAppliedJobs = appliedJobsData.map(job => {
          // Safely parse departments
          let parsedDepartments = [];
          try {
            if (Array.isArray(job.departments)) {
              parsedDepartments = job.departments.map(dept => {
                if (typeof dept === 'string') {
                  try {
                    // Try to parse if it's a JSON string
                    const parsed = JSON.parse(dept);
                    return Array.isArray(parsed) ? parsed : [dept];
                  } catch {
                    // If parsing fails, use the string as is
                    return dept;
                  }
                }
                return dept;
              }).flat();
            } else if (typeof job.departments === 'string') {
              try {
                parsedDepartments = JSON.parse(job.departments);
              } catch {
                parsedDepartments = [job.departments];
              }
            }
          } catch (error) {
            console.error('Error parsing departments:', error);
            parsedDepartments = Array.isArray(job.departments) ? job.departments : [job.departments].filter(Boolean);
          }

          return {
            ...job,
            departments: parsedDepartments,
            postedDate: job.posted_date || job.postedDate,
            deadline: job.deadline,
            applied: true,
            status: job.status
          };
        });
        
        setAppliedJobs(processedAppliedJobs);
        console.log('Processed applied jobs:', processedAppliedJobs);

        // Fetch available jobs
        let jobsResponse;
        if (user && user.id) {
          jobsResponse = await jobsApi.getFilteredJobs(user.id);
        } else {
          jobsResponse = await jobsApi.getJobs();
        }
        
        console.log('Raw jobs response:', jobsResponse);
        const { data: responseData, error } = jobsResponse;
        
        if (error) {
          throw new Error(error);
        }

        // Process available jobs - directly use responseData since it's already the jobs array
        const allJobs = responseData || [];
        console.log('Extracted jobs array:', allJobs);
        
        const processedJobs = allJobs.map(job => {
          const isApplied = processedAppliedJobs.some(appliedJob => appliedJob.id === job.id);
          
          // Safely parse departments
          let parsedDepartments = [];
          try {
            if (Array.isArray(job.departments)) {
              parsedDepartments = job.departments.map(dept => {
                if (typeof dept === 'string') {
                  try {
                    // Try to parse if it's a JSON string
                    const parsed = JSON.parse(dept);
                    return Array.isArray(parsed) ? parsed : [dept];
                  } catch {
                    // If parsing fails, use the string as is
                    return dept;
                  }
                }
                return dept;
              }).flat();
            } else if (typeof job.departments === 'string') {
              try {
                parsedDepartments = JSON.parse(job.departments);
              } catch {
                parsedDepartments = [job.departments];
              }
            }
          } catch (error) {
            console.error('Error parsing departments:', error);
            parsedDepartments = Array.isArray(job.departments) ? job.departments : [job.departments].filter(Boolean);
          }

          return {
            ...job,
            departments: parsedDepartments,
            postedDate: job.posted_date || job.postedDate,
            deadline: job.deadline,
            applied: isApplied,
            pdf_path: job.pdf_path
          };
        });
        
        console.log('Processed available jobs:', processedJobs);
        setJobs(processedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast({
          title: "Error",
          description: "Failed to load jobs. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [user, toast]);
  
  const handleApply = async (jobId: string) => {
    try {
      const { data, error } = await jobsApi.applyForJob(jobId);
      
      if (error) {
        throw new Error(error);
      }
      
      if (data?.success) {
        // Update the jobs list to mark the job as applied
        setJobs(prevJobs => 
          prevJobs.map(job => 
            job.id === jobId ? { ...job, applied: true } : job
          )
        );
        
        // Add to applied jobs list
        const appliedJob = jobs.find(job => job.id === jobId);
        if (appliedJob) {
          setAppliedJobs(prev => [...prev, { ...appliedJob, applied: true }]);
          
          toast({
            title: "Application Submitted",
            description: `You have successfully applied for ${appliedJob.title} at ${appliedJob.company}.`,
          });
        }
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      toast({
        title: "Application Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const switchToAvailableJobs = () => {
    setActiveTab("available");
  };
  
  return (
    <DashboardLayout requiredRole="student">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Job Profiles</h1>
            <p className="text-muted-foreground">Browse and apply for available job opportunities</p>
          </div>
        </div>
        
        <Tabs defaultValue="available" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="available">Available Jobs</TabsTrigger>
            <TabsTrigger value="applied">Applied Jobs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="mt-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <p className="text-muted-foreground">Loading available jobs...</p>
              </div>
            ) : jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    id={job.id.toString()}
                    title={job.title}
                    company={job.company}
                    location={job.location}
                    salary={job.salary}
                    departments={job.departments}
                    postedDate={job.posted_date || job.postedDate}
                    deadline={job.deadline}
                    applied={job.applied}
                    onApply={job.applied ? undefined : () => handleApply(job.id.toString())}
                    pdfPath={job.pdf_path}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No available jobs found.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="applied" className="mt-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <p className="text-muted-foreground">Loading applied jobs...</p>
              </div>
            ) : appliedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {appliedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    id={job.id.toString()}
                    title={job.title}
                    company={job.company}
                    location={job.location}
                    salary={job.salary}
                    departments={job.departments}
                    postedDate={job.posted_date || job.postedDate}
                    deadline={job.deadline}
                    applied={true}
                    pdfPath={job.pdf_path}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">You haven't applied to any jobs yet.</p>
                <Button variant="outline" onClick={switchToAvailableJobs}>
                  Browse Available Jobs
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentJobs;
