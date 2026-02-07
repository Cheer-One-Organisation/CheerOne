import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, MessageCircle, MapPin, Users, Bell } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg"; // Replace with your asset

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageCircle,
      title: "Group Chats",
      description: "Create private or public groups and stay in touch with your friends.",
      gradient: "gradient-primary",
    },
    {
      icon: MapPin,
      title: "Share Locations",
      description: "Send live location pings or see friends nearby safely.",
      gradient: "gradient-accent",
    },
    {
      icon: Users,
      title: "Discover Communities",
      description: "Find and join public groups that match your interests.",
      gradient: "gradient-hero",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold gradient-hero bg-clip-text text-transparent">
            Cheer One
          </h1>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate("/signin")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/signup")}>Sign Up</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-24 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Cheer One{" "}
              <span className="gradient-hero bg-clip-text text-transparent block">
                Moments Together
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Stay connected with friends, join groups, and share your live location with ease and safety.
            </p>
            <div className="flex gap-4">
              <Button
                size="lg"
                className="gradient-primary text-primary-foreground shadow-glow hover:scale-105 transition-transform"
                onClick={() => navigate("/signup")}
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="hover:scale-105 transition-transform"
                onClick={() => navigate("/features")}
              >
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <img
              src={heroBanner}
              alt="People connecting"
              className="rounded-2xl shadow-xl w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything You Need to Stay Connected
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From private group chats to discovering new communities and sharing live locations, Cheer One gives you all the tools.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="p-8 rounded-2xl shadow-card cursor-pointer hover:scale-105 transition-transform"
              >
                <div
                  className={`w-16 h-16 rounded-xl ${feature.gradient} flex items-center justify-center mb-6 shadow-glow`}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl lg:text-5xl font-bold">
            Ready to start your Cheer One journey?
          </h2>
          <p className="text-lg">
            Sign up now and start connecting with friends, sharing moments, and exploring communities.
          </p>
          <Button
            size="lg"
            className="gradient-primary shadow-glow hover:scale-105 transition-transform"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/80 backdrop-blur-md border-t py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Cheer One. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
