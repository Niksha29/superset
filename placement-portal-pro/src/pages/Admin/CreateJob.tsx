
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JobForm } from "@/components/jobs/JobForm";

const AdminCreateJob = () => {
  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Create Job</h1>
          <p className="text-muted-foreground">Create a new job posting for students</p>
        </div>
        
        <Card className="bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>New Job Posting</CardTitle>
            <CardDescription>
              Fill in the details below to create a new job opportunity for students.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JobForm />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminCreateJob;
