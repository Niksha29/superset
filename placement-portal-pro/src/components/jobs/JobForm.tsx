import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { jobSchema, JobFormValues, departments } from "./JobFormSchema";
import { JobFormBasicInfo } from "./JobFormBasicInfo";
import { JobFormDescription } from "./JobFormDescription";
import { JobFormCriteria } from "./JobFormCriteria";
import { JobFormDepartments } from "./JobFormDepartments";
import { JobFormOptions } from "./JobFormOptions";
import { useState } from "react";
import { jobsApi } from "@/services";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

export const JobForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      salary: "",
      description: "",
      requirements: "",
      departments: [],
      minCGPA: "7.0",
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks from now
      sendEmail: true,
      excludePlaced: true,
      pdfFile: undefined,
    },
  });
  
  const onSubmit = async (data: JobFormValues) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Append all form fields to FormData
      formData.append('title', data.title);
      formData.append('company', data.company);
      formData.append('location', data.location);
      formData.append('salary', data.salary);
      formData.append('description', data.description);
      formData.append('requirements', data.requirements);
      formData.append('departments', JSON.stringify(data.departments));
      formData.append('minCGPA', data.minCGPA);
      formData.append('deadline', data.deadline);
      formData.append('sendEmail', data.sendEmail.toString());
      formData.append('excludePlaced', data.excludePlaced.toString());
      
      // Append PDF file if it exists
      if (data.pdfFile instanceof File) {
        formData.append('pdfFile', data.pdfFile);
      }
      
      // Log the form data for debugging
      console.log('Form Data:', {
        title: data.title,
        company: data.company,
        location: data.location,
        salary: data.salary,
        description: data.description,
        requirements: data.requirements,
        departments: data.departments,
        minCGPA: data.minCGPA,
        deadline: data.deadline,
        sendEmail: data.sendEmail,
        excludePlaced: data.excludePlaced,
        hasPdfFile: data.pdfFile instanceof File
      });
      
      // Call the API to create a job with PDF
      const response = await jobsApi.createJob(formData);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // If "sendEmail" is true, we can implement additional logic here
      if (data.sendEmail) {
        // Add logic to send email notifications about the new job
        console.log("Sending email notifications for new job");
      }
      
      toast({
        title: "Job Created",
        description: `Job posting for "${data.title}" at "${data.company}" has been created successfully.`,
      });
      
      form.reset();
    } catch (error) {
      console.error("Error creating job:", error);
      toast({
        title: "Error",
        description: "There was an error creating the job posting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <JobFormBasicInfo form={form} />
        <JobFormDescription form={form} />
        <JobFormCriteria form={form} />
        <JobFormDepartments form={form} />
        <JobFormOptions form={form} />
        
        <FormField
          control={form.control}
          name="pdfFile"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Job Description PDF</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onChange(file);
                    }
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating..." : "Create Job Posting"}
        </Button>
      </form>
    </Form>
  );
};
