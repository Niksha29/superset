import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { profileApi, Profile } from "@/services/api/profile";
import { Loader2 } from "lucide-react";

const StudentProfile = () => {
  const [student, setStudent] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await profileApi.getProfile();
      setStudent(data);
      setFormData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? ({
      ...prev,
      [name]: value
    }) : null);
  };
  
  const handleSave = async () => {
    if (!formData) return;
    
    try {
      await profileApi.updateProfile(formData);
      setStudent(formData);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Your profile information has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    if (!formData) return;
    const newEducation = [...formData.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setFormData(prev => prev ? ({ ...prev, education: newEducation }) : null);
  };

  const addEducation = () => {
    if (!formData) return;
    setFormData(prev => prev ? ({
      ...prev,
      education: [...prev.education, { level: '', institution: '', year: '', percentage: '' }]
    }) : null);
  };

  const removeEducation = (index: number) => {
    if (!formData) return;
    setFormData(prev => prev ? ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }) : null);
  };

  const handleSkillChange = (newSkills: string[]) => {
    if (!formData) return;
    setFormData(prev => prev ? ({ ...prev, skills: newSkills }) : null);
  };

  const handleProjectChange = (index: number, field: string, value: string) => {
    if (!formData) return;
    const newProjects = [...formData.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setFormData(prev => prev ? ({ ...prev, projects: newProjects }) : null);
  };

  const addProject = () => {
    if (!formData) return;
    setFormData(prev => prev ? ({
      ...prev,
      projects: [...prev.projects, { title: '', description: '', year: '' }]
    }) : null);
  };

  const removeProject = (index: number) => {
    if (!formData) return;
    setFormData(prev => prev ? ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }) : null);
  };

  if (isLoading) {
    return (
      <DashboardLayout requiredRole="student">
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!student || !formData) {
    return (
      <DashboardLayout requiredRole="student">
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <p>Failed to load profile data.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="student">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>
        
        <Card className="bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Avatar className="h-20 w-20">
                <AvatarImage src="" />
                <AvatarFallback className="text-xl">{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{student.name}</CardTitle>
                <CardDescription>{student.department} • {student.year}</CardDescription>
                <p className="text-sm mt-1">{student.email}</p>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        <Tabs defaultValue="personal">
          <TabsList>
            <TabsTrigger value="personal">Personal Details</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills & Projects</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="mt-6 space-y-6">
            <Card className="bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" value={formData.email} onChange={handleInputChange} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" name="address" value={formData.address} onChange={handleInputChange} />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{student.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{student.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone Number</p>
                      <p className="font-medium">{student.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{student.address}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Academic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input id="department" name="department" value={formData.department} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rollNumber">Roll Number</Label>
                      <Input id="rollNumber" name="rollNumber" value={formData.rollNumber} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Current Year</Label>
                      <Input id="year" name="year" value={formData.year} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cgpa">CGPA</Label>
                      <Input id="cgpa" name="cgpa" value={formData.cgpa} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backlogs">Backlogs</Label>
                      <Input id="backlogs" name="backlogs" value={formData.backlogs} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="placementStatus">Placement Status</Label>
                      <Input id="placementStatus" name="placementStatus" value={formData.placementStatus} onChange={handleInputChange} />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="font-medium">{student.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Roll Number</p>
                      <p className="font-medium">{student.rollNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Year</p>
                      <p className="font-medium">{student.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CGPA</p>
                      <p className="font-medium">{student.cgpa}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Backlogs</p>
                      <p className="font-medium">{student.backlogs}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Placement Status</p>
                      <p className="font-medium">{student.placementStatus}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {isEditing && (
              <div className="flex justify-end">
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="education" className="mt-6 space-y-6">
            <Card className="bg-card/60 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Education History</CardTitle>
                {isEditing && (
                  <Button onClick={addEducation} variant="outline" size="sm">
                    Add Education
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {(isEditing ? formData : student)?.education.map((edu, index) => (
                  <div key={index} className="space-y-4">
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`edu-level-${index}`}>Level</Label>
                          <Input
                            id={`edu-level-${index}`}
                            value={edu.level}
                            onChange={(e) => handleEducationChange(index, 'level', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`edu-year-${index}`}>Year</Label>
                          <Input
                            id={`edu-year-${index}`}
                            value={edu.year}
                            onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`edu-institution-${index}`}>Institution</Label>
                          <Input
                            id={`edu-institution-${index}`}
                            value={edu.institution}
                            onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`edu-percentage-${index}`}>Percentage/CGPA</Label>
                          <Input
                            id={`edu-percentage-${index}`}
                            value={edu.percentage}
                            onChange={(e) => handleEducationChange(index, 'percentage', e.target.value)}
                          />
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => removeEducation(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{edu.level}</h3>
                          <span className="text-sm text-muted-foreground">{edu.year}</span>
                        </div>
                        <p>{edu.institution}</p>
                        <p className="text-sm">Percentage/CGPA: {edu.percentage}</p>
                      </div>
                    )}
                    {index < student.education.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
            {isEditing && (
              <div className="flex justify-end">
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="skills" className="mt-6 space-y-6">
            <Card className="bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {formData?.skills.map((skill, index) => (
                        <div key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          {skill}
                          <button
                            onClick={() => handleSkillChange(formData.skills.filter((_, i) => i !== index))}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value) {
                            handleSkillChange([...formData?.skills || [], e.currentTarget.value]);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {student.skills.map((skill, index) => (
                      <div key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                        {skill}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-card/60 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Projects</CardTitle>
                {isEditing && (
                  <Button onClick={addProject} variant="outline" size="sm">
                    Add Project
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {(isEditing ? formData : student)?.projects.map((project, index) => (
                  <div key={index} className="space-y-4">
                    {isEditing ? (
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`project-title-${index}`}>Project Title</Label>
                          <Input
                            id={`project-title-${index}`}
                            value={project.title}
                            onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`project-description-${index}`}>Description</Label>
                          <Input
                            id={`project-description-${index}`}
                            value={project.description}
                            onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`project-year-${index}`}>Year</Label>
                          <Input
                            id={`project-year-${index}`}
                            value={project.year}
                            onChange={(e) => handleProjectChange(index, 'year', e.target.value)}
                          />
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => removeProject(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{project.title}</h3>
                          <span className="text-sm text-muted-foreground">{project.year}</span>
                        </div>
                        <p className="text-sm">{project.description}</p>
                      </div>
                    )}
                    {index < student.projects.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
            {isEditing && (
              <div className="flex justify-end">
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
