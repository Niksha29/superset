import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MessageCard } from "@/components/dashboard/MessageCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { messagesApi, eventsApi } from "@/services";
import { Message, Event } from "@/types";

const StudentDashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch messages and events in parallel
        const [messagesResponse, eventsResponse] = await Promise.all([
          messagesApi.getMessages(),
          eventsApi.getUpcomingEvents()
        ]);
        
        if (messagesResponse.error) {
          throw new Error(messagesResponse.error);
        }
        if (eventsResponse.error) {
          throw new Error(eventsResponse.error);
        }
        
        // Ensure messages is an array
        const messagesData = Array.isArray(messagesResponse.data) 
          ? messagesResponse.data 
          : messagesResponse.data?.messages || [];
        
        // Ensure events is an array
        const eventsData = Array.isArray(eventsResponse.data) 
          ? eventsResponse.data 
          : eventsResponse.data?.events || [];
        
        setMessages(messagesData);
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <DashboardLayout requiredRole="student">
      <div className="space-y-8 p-4">
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="w-full md:w-2/3 bg-card/60 backdrop-blur-sm animate-fade-in">
            <CardHeader>
              <CardTitle>Welcome to Placement Portal</CardTitle>
              <CardDescription>
                Stay updated with latest placement opportunities and messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <p>Loading messages...</p>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-32 text-destructive">
                  <p>{error}</p>
                </div>
              ) : !Array.isArray(messages) || messages.length === 0 ? (
                <div className="flex justify-center items-center h-32 text-muted-foreground">
                  <p>No messages available</p>
                </div>
              ) : (
                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">All Messages</TabsTrigger>
                    <TabsTrigger value="important">Important</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="mt-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <MessageCard
                          key={message.id}
                          title={message.title}
                          content={message.content}
                          date={message.date}
                          author={message.author}
                        />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="important" className="mt-4">
                    <div className="space-y-4">
                      {messages.slice(0, 2).map((message) => (
                        <MessageCard
                          key={message.id}
                          title={message.title}
                          content={message.content}
                          date={message.date}
                          author={message.author}
                        />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
          
          <Card className="w-full md:w-1/3 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading events...</p>
              ) : !Array.isArray(events) || events.length === 0 ? (
                <p className="text-muted-foreground">No upcoming events</p>
              ) : (
                <div className="space-y-4">
                  {events.map((event, index) => (
                    <div key={index} className="flex justify-between items-start border-b border-border pb-3 last:border-0">
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="bg-secondary px-2 py-1 rounded text-xs">
                        {event.type}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
