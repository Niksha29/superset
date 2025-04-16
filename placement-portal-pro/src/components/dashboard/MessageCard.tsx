import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface MessageCardProps {
  title: string;
  content: string;
  date: Date | string;
  author: string;
}

export const MessageCard = ({ title, content, date, author }: MessageCardProps) => {
  // Safely convert date to Date object
  const messageDate = (() => {
    try {
      if (typeof date === 'string') {
        const parsedDate = new Date(date);
        return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
      }
      return date;
    } catch (error) {
      console.error('Error parsing date:', error);
      return new Date();
    }
  })();
  
  return (
    <Card className="overflow-hidden bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-200 mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="flex justify-between items-center">
          <span>Posted by {author}</span>
          <span className="text-xs">{formatDistanceToNow(messageDate, { addSuffix: true })}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content}</p>
      </CardContent>
    </Card>
  );
};
