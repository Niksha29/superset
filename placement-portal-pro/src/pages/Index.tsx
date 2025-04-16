
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jobsApi } from "@/services";
import { Job } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [latestJobs, setLatestJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await jobsApi.getJobs();
        // Get the latest 3 jobs
        setLatestJobs(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="py-6 px-4 md:px-8 border-b">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Campus Placement Portal</h1>
            <div className="space-x-2">
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-12 px-4 md:px-8">
        <section className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Welcome to the Campus Placement Portal</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get access to exclusive job opportunities, prepare for interviews, and connect with top companies.
          </p>
        </section>

        <section className="mb-12">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-2xl font-bold">Latest Job Opportunities</h3>
            <Button variant="outline" asChild>
              <Link to="/student/jobs">View All Jobs</Link>
            </Button>
          </div>

          {loading ? (
            <p className="text-center py-8">Loading latest jobs...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestJobs.map((job) => (
                <Card key={job.id} className="backdrop-blur-sm hover:bg-card/80 transition-all duration-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription>{job.company} • {job.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {job.description.substring(0, 100)}...
                      </p>
                      <p className="text-sm font-medium">Salary: {job.salary}</p>
                      <Button size="sm" className="w-full" asChild>
                        <Link to="/login">Login to Apply</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>For Students</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Access job opportunities, prepare for interviews, and track your applications.
              </p>
              <Button asChild>
                <Link to="/register">Register as Student</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>For Administrators</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Manage job postings, track student applications, and coordinate with companies.
              </p>
              <Button asChild>
                <Link to="/login">Login as Admin</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t py-6 px-4 md:px-8">
        <div className="container mx-auto text-center text-muted-foreground">
          &copy; 2025 Campus Placement Portal. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
