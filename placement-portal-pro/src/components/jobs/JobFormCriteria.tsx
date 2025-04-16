
import { FormField, FormItem, FormMessage, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface JobFormCriteriaProps {
  form: UseFormReturn<any>;
}

export const JobFormCriteria = ({ form }: JobFormCriteriaProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="minCGPA"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Minimum CGPA</FormLabel>
            <FormControl>
              <Input type="number" step="0.1" min="0" max="10" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="deadline"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Application Deadline</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
