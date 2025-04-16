import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStudentRegistration } from "@/contexts/StudentRegistrationContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { DetailedProfileData, studentApi } from "@/services/studentApi";
import { departments } from "@/config/departments";

const educationSchema = z.object({
  year: z.string().min(1, { message: "Year is required" }),
  level: z.string().min(1, { message: "Level is required" }),
  percentage: z.string().min(1, { message: "Percentage is required" }),
  institution: z.string().min(1, { message: "Institution is required" }),
});

const projectSchema = z.object({
  name: z.string().min(1, { message: "Project name is required" }),
  year: z.string().min(1, { message: "Year is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

const detailedFormSchema = z.object({
  full_name: z.string().min(2, { message: "Full name is required" }),
  phone_number: z.string().min(10, { message: "Valid phone number is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  roll_number: z.string().min(1, { message: "Roll number is required" }),
  current_year: z.string().min(1, { message: "Current year is required" }),
  cgpa: z.string().min(1, { message: "CGPA is required" }),
  backlogs: z.coerce.number().min(0, { message: "Invalid backlogs value" }),
  placement_status: z.string().min(1, { message: "Placement status is required" }),
  education_history: z.array(educationSchema).min(1, { message: "At least one education entry is required" }),
  skills: z.string().min(1, { message: "Please enter at least one skill" }),
  projects: z.array(projectSchema).min(1, { message: "At least one project is required" }),
});

export function DetailedInfoForm() {
  const { registrationData, updateDetailedInfo, submitDetailedInfo, submitRegistration, isSubmitting } = useStudentRegistration();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Convert skills array to comma-separated string for the form
  const defaultSkills = registrationData.skills.join(", ");

  const form = useForm<z.infer<typeof detailedFormSchema>>({
    resolver: zodResolver(detailedFormSchema),
    defaultValues: {
      full_name: registrationData.full_name || registrationData.name,
      phone_number: registrationData.phone_number || registrationData.phone,
      address: registrationData.address,
      department: registrationData.department,
      roll_number: registrationData.roll_number,
      current_year: registrationData.current_year,
      cgpa: registrationData.cgpa,
      backlogs: registrationData.backlogs,
      placement_status: registrationData.placement_status,
      education_history: registrationData.education_history.length 
        ? registrationData.education_history 
        : [{ year: "", level: "", percentage: "", institution: "" }],
      skills: defaultSkills,
      projects: registrationData.projects.length 
        ? registrationData.projects 
        : [{ name: "", year: "", description: "" }],
    },
  });

  const onSubmit = async (values: z.infer<typeof detailedFormSchema>) => {
    setIsSubmittingForm(true);
    try {
      // Convert skills from comma-separated string to array
      const skillsArray = values.skills.split(',').map(skill => skill.trim()).filter(Boolean);
      
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error("User ID not found. Please register again.");
      }

      const profileData = {
        ...values,
        user_id: userId,
        skills: skillsArray,
        education_history: values.education_history.map(edu => ({
          year: edu.year,
          level: edu.level,
          percentage: edu.percentage,
          institution: edu.institution
        })),
        projects: values.projects.map(proj => ({
          name: proj.name,
          year: proj.year,
          description: proj.description
        }))
      };
      
      await studentApi.updateProfile(profileData as DetailedProfileData);
      
      // Clear the stored user ID after successful profile creation
      localStorage.removeItem('userId');
      
      toast({
        title: "Profile Created",
        description: "Your profile has been successfully created.",
      });
      
      // Navigate to the student dashboard
      navigate('/student/dashboard');
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Education fields - properly using useFieldArray
  const educationFieldArray = useFieldArray({
    control: form.control,
    name: "education_history"
  });

  // Project fields - properly using useFieldArray
  const projectFieldArray = useFieldArray({
    control: form.control,
    name: "projects"
  });

  return (
    <div className="min-h-screen bg-background [&_.bg-slate-50]:bg-transparent [&_.bg-slate-50]:bg-[#020817]">
      <div className="container mx-auto py-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">Detailed Profile</h2>
          <p className="text-muted-foreground mb-8">Complete your profile to access placement opportunities</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Personal Information</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept.id} value={dept.label}>
                                {dept.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Academic Information</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="roll_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Roll Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="current_year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Year</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1st Year">1st Year</SelectItem>
                            <SelectItem value="2nd Year">2nd Year</SelectItem>
                            <SelectItem value="3rd Year">3rd Year</SelectItem>
                            <SelectItem value="4th Year">4th Year</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cgpa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CGPA</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="backlogs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Backlogs</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="placement_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Placement Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Not Placed">Not Placed</SelectItem>
                            <SelectItem value="Placed">Placed</SelectItem>
                            <SelectItem value="Internship">Internship</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-white">Education History</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => educationFieldArray.append({ 
                      year: "", 
                      level: "", 
                      percentage: "", 
                      institution: "" 
                    })}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Education
                  </Button>
                </div>

                {educationFieldArray.fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-white">Education #{index + 1}</h4>
                      {index > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive"
                          onClick={() => educationFieldArray.remove(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={`education_history.${index}.year`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year</FormLabel>
                            <FormControl>
                              <Input placeholder="2020-2024" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`education_history.${index}.level`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Level</FormLabel>
                            <FormControl>
                              <Input placeholder="BE, XII, X" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`education_history.${index}.percentage`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Percentage/CGPA</FormLabel>
                            <FormControl>
                              <Input placeholder="85%" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`education_history.${index}.institution`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Institution</FormLabel>
                            <FormControl>
                              <Input placeholder="Example Engineering College" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills (comma-separated)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="JavaScript, React, Node.js, Python, Data Structures" 
                          className="min-h-24"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-white">Projects</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => projectFieldArray.append({ name: "", year: "", description: "" })}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Project
                  </Button>
                </div>

                {projectFieldArray.fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-white">Project #{index + 1}</h4>
                      {index > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive"
                          onClick={() => projectFieldArray.remove(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={`projects.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`projects.${index}.year`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`projects.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/student/login')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmittingForm}>
                  {isSubmittingForm ? "Submitting..." : "Complete Registration"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}