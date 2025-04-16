import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { messagesApi } from "@/services";

// Schema for message form
const messageSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters long" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters long" }),
  departments: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Select at least one department",
  }),
  isPinned: z.boolean().default(false),
});

type MessageFormValues = z.infer<typeof messageSchema>;

// Mock departments
const departments = [
  { id: "Computer Science", label: "Computer Science" },
  { id: "Information Technology", label: "Information Technology" },
  { id: "Electronics and Communication", label: "Electronics and Communication" },
  { id: "Electrical Engineering", label: "Electrical Engineering" },
  { id: "Mechanical Engineering", label: "Mechanical Engineering" },
  { id: "Civil Engineering", label: "Civil Engineering" },
];

const AdminCreateMessage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      title: "",
      content: "",
      departments: ["all"],
      isPinned: false,
    },
  });
  
  const onSubmit = async (data: MessageFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Create message through API
      const messageData = {
        title: data.title,
        content: data.content,
        author: "Placement Cell",
        departments: data.departments.includes("all") ? ["all"] : data.departments,
        isPinned: data.isPinned
      };
      
      console.log('Sending message data:', messageData);
      const response = await messagesApi.createMessage(messageData);
      console.log('Create message response:', response);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Always notify students after creating message
      if (response.data && response.data.id) {
        console.log('Message created with ID:', response.data.id);
        try {
          const notifyResult = await messagesApi.notifyStudents(response.data.id.toString());
          console.log('Notify API called with result:', notifyResult);
          if (notifyResult.error) {
            console.error("Error notifying students:", notifyResult.error);
          }
        } catch (notifyError) {
          console.error('Error calling notify API:', notifyError);
        }
      } else {
        console.error('No message ID received:', response);
      }
      
      toast({
        title: "Message Created",
        description: `Your message "${data.title}" has been published successfully.`,
      });
      
      form.reset();
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast({
        title: "Error",
        description: "There was an error creating your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Create Message</h1>
          <p className="text-muted-foreground">Create a new message or announcement for students</p>
        </div>
        
        <Card className="bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>New Message</CardTitle>
            <CardDescription>
              Fill in the details below to create a new message for students.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter the title of your message" {...field} />
                      </FormControl>
                      <FormDescription>
                        A clear and concise title for your message.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter the content of your message" 
                          rows={6} 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        The main content of your message.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="departments"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Target Departments</FormLabel>
                          <FormDescription>
                            Select which departments should receive this message.
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name="departments"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes("all")}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange(["all"]);
                                      } else {
                                        field.onChange([]);
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  All Departments
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          {form.watch("departments").includes("all") ? null : (
                            departments.map((department) => (
                              <FormField
                                key={department.id}
                                control={form.control}
                                name="departments"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(department.id)}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            field.onChange([...field.value, department.id]);
                                          } else {
                                            field.onChange(field.value?.filter(
                                              (value) => value !== department.id
                                            ));
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {department.label}
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <FormField
                    control={form.control}
                    name="isPinned"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Pin Message
                          </FormLabel>
                          <FormDescription>
                            Pin this message to the top of students' dashboards.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Posting..." : "Post Message"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminCreateMessage;
