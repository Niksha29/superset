
import { FormField, FormItem, FormLabel, FormDescription, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";

interface JobFormOptionsProps {
  form: UseFormReturn<any>;
}

export const JobFormOptions = ({ form }: JobFormOptionsProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <FormField
        control={form.control}
        name="sendEmail"
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
                Send Email Notification
              </FormLabel>
              <FormDescription>
                Notify eligible students via email about this job opportunity.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="excludePlaced"
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
                Exclude Already Placed Students
              </FormLabel>
              <FormDescription>
                Hide this job posting from students who already have placement offers.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};
