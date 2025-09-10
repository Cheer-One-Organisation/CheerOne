import { MessageCircle, MapPin, Users, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";

const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageCircle,
      title: "Group Chats",
      description: "Connect with your groups and stay in touch",
      path: "/group-chats",
      gradient: "gradient-primary"
    },
    {
      icon: MapPin,
      title: "Find Friends",
      description: "Locate friends nearby and send location pings",
      path: "/location-finder",
      gradient: "gradient-accent"
    },
    {
      icon: Users,
      title: "Public Groups",
      description: "Discover and join communities with shared interests",
      path: "/public-groups",
      gradient: "gradient-hero"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              Cheer One
            </h1>
            <Button variant="outline" size="sm">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
                Connect & Share
                <span className="gradient-hero bg-clip-text text-transparent block">
                  Moments Together
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Stay connected with friends through group chats, share locations, and discover new communities.
              </p>
              <div className="flex gap-4">
                <Button 
                  onClick={() => navigate("/group-chats")} 
                  size="lg"
                  className="gradient-primary text-primary-foreground shadow-glow transition-bounce hover:scale-105"
                >
                  Start Chatting
                </Button>
                <Button 
                  onClick={() => navigate("/location-finder")} 
                  variant="outline" 
                  size="lg"
                  className="transition-bounce hover:scale-105"
                >
                  Find Friends
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroBanner} 
                alt="People connecting through Cheer One" 
                className="rounded-2xl shadow-card w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Everything you need to stay connected</h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From private group conversations to discovering new communities, Cheer One has all the tools you need.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card 
                key={feature.title} 
                className="p-8 cursor-pointer transition-bounce hover:scale-105 shadow-card hover:shadow-soft"
                onClick={() => navigate(feature.path)}
              >
                <div className={`w-16 h-16 rounded-xl ${feature.gradient} flex items-center justify-center mb-6 shadow-glow`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
                <p className="text-muted-foreground mb-6">{feature.description}</p>
                <Button variant="outline" className="w-full transition-smooth">
                  Get Started
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;