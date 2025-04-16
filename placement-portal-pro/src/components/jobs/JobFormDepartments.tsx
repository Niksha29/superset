import { FormField, FormItem, FormMessage, FormLabel, FormDescription, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { departments } from "./JobFormSchema";
import { UseFormReturn } from "react-hook-form";

interface JobFormDepartmentsProps {
  form: UseFormReturn<any>;
}

export const JobFormDepartments = ({ form }: JobFormDepartmentsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="departments"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel>Eligible Departments</FormLabel>
              <FormDescription>
                Select which departments are eligible for this job.
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
                            checked={field.value?.includes(department.label)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, department.label]);
                              } else {
                                field.onChange(field.value?.filter(
                                  (value) => value !== department.label
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
  );
};
