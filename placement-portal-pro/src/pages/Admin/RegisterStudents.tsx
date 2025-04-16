import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { departments } from "@/config/departments";

const API_BASE_URL = "http://localhost:5000";
const AdminRegisterStudents = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [bulkEmails, setBulkEmails] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0].label);
  const [singleEmail, setSingleEmail] = useState("");
  const { toast } = useToast();
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };
  
  const handleFileSubmit = async () => {
    if (!uploadedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV or Excel file containing student email addresses.",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('csvFile', uploadedFile);
      
      await axios.post(`${API_BASE_URL}/api/admin/register-students`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: "Invitations Sent",
        description: `Invitations have been sent to all email addresses in ${uploadedFile.name}.`,
      });
      setUploadedFile(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitations. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleBulkSubmit = async () => {
    if (!bulkEmails.trim()) {
      toast({
        title: "No Emails Entered",
        description: "Please enter at least one email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      const emails = bulkEmails.split("\n").filter(email => email.trim());
      for (const email of emails) {
        await axios.post(`${API_BASE_URL}/api/users/register`, {
          email,
          department: selectedDepartment
        });
      }

      toast({
        title: "Invitations Sent",
        description: `Invitations have been sent to ${emails.length} email addresses.`,
      });
      setBulkEmails("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send some invitations. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSingleSubmit = async () => {
    if (!singleEmail.trim() || !singleEmail.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/users/register`, {
        email: singleEmail,
        department: selectedDepartment
      });

      toast({
        title: "Invitation Sent",
        description: `An invitation has been sent to ${singleEmail}.`,
      });
      setSingleEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Student Registration</h1>
          <p className="text-muted-foreground">Register students by sending email invitations</p>
        </div>
        
        <Tabs defaultValue="bulk">
          <TabsList>
            <TabsTrigger value="bulk">Bulk Registration</TabsTrigger>
            <TabsTrigger value="single">Single Registration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bulk" className="mt-6 space-y-6">
            <Card className="bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Upload File</CardTitle>
                <CardDescription>
                  Upload a CSV or Excel file containing student email addresses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="file-upload">CSV or Excel File</Label>
                  <Input 
                    id="file-upload" 
                    type="file" 
                    accept=".csv,.xlsx,.xls" 
                    onChange={handleFileUpload}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The file should have one email address per row in the first column.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Department</Label>
                  <select 
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.label}>{dept.label}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleFileSubmit}>
                  Process File & Send Invitations
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Enter Multiple Emails</CardTitle>
                <CardDescription>
                  Enter email addresses manually, one per line
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="bulk-emails">Email Addresses</Label>
                  <Textarea 
                    id="bulk-emails" 
                    placeholder="Enter email addresses, one per line"
                    rows={8}
                    value={bulkEmails}
                    onChange={(e) => setBulkEmails(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Department</Label>
                  <select 
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.label}>{dept.label}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleBulkSubmit}>
                  Send Invitations
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="single" className="mt-6">
            <Card className="bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Register Individual Student</CardTitle>
                <CardDescription>
                  Send a registration invitation to a single student
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="single-email">Student Email</Label>
                  <Input 
                    id="single-email" 
                    type="email" 
                    placeholder="student@example.com"
                    value={singleEmail}
                    onChange={(e) => setSingleEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Department</Label>
                  <select 
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.label}>{dept.label}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleSingleSubmit}>
                  Send Invitation
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminRegisterStudents;
