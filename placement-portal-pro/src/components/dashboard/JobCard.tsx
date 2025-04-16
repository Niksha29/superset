import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { FileText } from "lucide-react";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  departments: string[];
  postedDate: Date | string;
  deadline: Date | string;
  applied?: boolean;
  onApply?: (id: string) => void;
  pdfPath?: string;
}

export const JobCard = ({
  id,
  title,
  company,
  location,
  salary,
  departments = [],
  postedDate,
  deadline,
  applied = false,
  onApply,
  pdfPath
}: JobCardProps) => {
  console.log('JobCard props:', { id, title, company, location, salary, departments, postedDate, deadline, applied, pdfPath });
  
  // Safely parse dates
  const parsedPostedDate = (() => {
    try {
      const date = typeof postedDate === 'string' ? new Date(postedDate) : postedDate;
      return isNaN(date.getTime()) ? new Date() : date;
    } catch (error) {
      console.error('Error parsing posted date:', error);
      return new Date();
    }
  })();

  const parsedDeadline = (() => {
    try {
      const date = typeof deadline === 'string' ? new Date(deadline) : deadline;
      return isNaN(date.getTime()) ? new Date() : date;
    } catch (error) {
      console.error('Error parsing deadline:', error);
      return new Date();
    }
  })();

  const isExpired = new Date() > parsedDeadline;

  const handleDownloadPDF = () => {
    if (pdfPath) {
      // Extract just the filename from the full path
      const filename = pdfPath.split('\\').pop() || pdfPath.split('/').pop() || pdfPath;
      // Convert the file path to a URL
      const pdfUrl = `http://localhost:5000/api/jobs/pdf/${encodeURIComponent(filename)}`;
      window.open(pdfUrl, '_blank');
    }
  };
  
  return (
    <Card className="overflow-hidden bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-200 mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{title || 'Untitled Job'}</CardTitle>
            <CardDescription>
              {company || 'Unknown Company'} • {location || 'Location not specified'}
            </CardDescription>
          </div>
          {applied && (
            <Badge variant="outline" className="bg-primary/20 text-primary border-primary">
              Applied
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Salary</p>
            <p className="font-medium">{salary || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Posted</p>
            <p className="font-medium">{formatDistanceToNow(parsedPostedDate, { addSuffix: true })}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Deadline</p>
            <p className="font-medium">{formatDistanceToNow(parsedDeadline, { addSuffix: true })}</p>
          </div>
        </div>
        
        {departments.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Eligible Departments</p>
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <Badge key={dept} variant="secondary" className="text-xs">
                  {dept}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {pdfPath && (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <Button 
              variant="link" 
              className="p-0 h-auto" 
              onClick={handleDownloadPDF}
            >
              View Job Description PDF
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!applied && !isExpired && onApply && (
          <Button onClick={() => onApply(id)}>
            Apply Now
          </Button>
        )}
        {isExpired && (
          <Badge variant="destructive">Expired</Badge>
        )}
      </CardFooter>
    </Card>
  );
};
