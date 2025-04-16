
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, Calendar, User, MessageSquare, Book } from "lucide-react";

const features = [
  {
    title: "Job Portal",
    description: "Discover the latest job opportunities from top companies tailored to your profile and department.",
    icon: Briefcase,
  },
  {
    title: "Interview Scheduling",
    description: "Seamlessly manage and track your upcoming interviews with potential employers.",
    icon: Calendar,
  },
  {
    title: "Profile Management",
    description: "Create and maintain a comprehensive profile showcasing your academic achievements and skills.",
    icon: User,
  },
  {
    title: "Important Announcements",
    description: "Stay informed with critical updates from the placement cell directly on your dashboard.",
    icon: MessageSquare,
  },
  {
    title: "Assessment Tracking",
    description: "Keep track of upcoming assessments and review performance in previous evaluations.",
    icon: Book,
  }
];

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Placement Portal</h1>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Admin Register</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container px-4 mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              College Placement Management System
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Streamlining the placement process for students and administrators with a comprehensive digital solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/login">Student Login</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Admin Login</Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="bg-muted/30 py-16">
          <div className="container px-4 mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-card/80 backdrop-blur-sm rounded-xl p-6 hover:shadow-lg transition-all border border-border">
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-24">
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Streamline Your Placement Process?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Join our platform to connect with top employers and manage your entire placement journey in one place.
            </p>
            <Button size="lg" asChild>
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="bg-card py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} College Placement Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
