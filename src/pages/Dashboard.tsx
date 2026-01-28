import { MessageCircle, MapPin, Users, Download, Plus, Check, X, ArrowRight, Camera, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-hero p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <Card className="rounded-3xl bg-white/95 backdrop-blur-sm p-8 mb-8 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Download className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Cheer One</h1>
            </div>
          </div>
          
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 h-96">
            {/* Main Feature Card - Group Chats */}
            <Card 
              className="col-span-1 md:col-span-2 gradient-primary rounded-2xl p-6 cursor-pointer transition-bounce hover:scale-105 text-white"
              onClick={() => navigate("/group-chats")}
            >
              <Camera className="h-12 w-12 mb-4 text-white/90" />
              <h3 className="text-lg font-semibold mb-2">Group Chats</h3>
              <p className="text-white/80 text-sm">Connect with your groups and stay in touch with real-time messaging</p>
            </Card>

            {/* Feature Description */}
            <Card className="col-span-1 md:col-span-2 bg-muted/50 rounded-2xl p-6">
              <h4 className="font-bold mb-2">Pure messaging</h4>
              <h5 className="font-semibold mb-3">Stay connected everywhere</h5>
              <p className="text-muted-foreground text-sm mb-4">
                Seamlessly connect with friends through group conversations, 
                share locations in real-time, and discover new communities with shared interests.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
                  <span className="text-background text-xs font-bold">✌️</span>
                </div>
              </div>
            </Card>

            {/* Stats Circle */}
            <Card className="col-span-1 md:col-span-1 bg-foreground rounded-2xl p-4 flex flex-col items-center justify-center text-background">
              <div className="text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2" />
                <span className="text-xs font-medium">03</span>
              </div>
            </Card>

            {/* Action Buttons Column */}
            <div className="col-span-1 flex flex-col gap-2">
              <Button variant="outline" size="sm" className="rounded-full">
                <X className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="rounded-full">
                <Check className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="rounded-full">
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="rounded-full">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* Numbered List */}
            <Card className="rounded-2xl p-6 bg-muted/30">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-2xl">01</span>
                  <span className="text-sm">Join group conversations instantly</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-2xl">02</span>
                  <span className="text-sm">Share your location with friends</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-2xl">03</span>
                  <span className="text-sm">Discover public communities</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-2xl">04</span>
                  <span className="text-sm">Get notified of nearby friends</span>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full rounded-full"
                onClick={() => navigate("/location-finder")}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Find out more
                <Plus className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                className="w-full rounded-full gradient-primary"
                onClick={() => navigate("/public-groups")}
              >
                Find out more
                <Check className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full rounded-full"
                onClick={() => navigate("/group-chats")}
              >
                Put it here
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Stats Card */}
            <Card className="rounded-2xl p-6 bg-foreground text-background flex flex-col items-center justify-center">
              <Plus className="h-8 w-8 mb-2" />
              <Users className="h-12 w-12 mb-4" />
              <span className="text-4xl font-bold">70%</span>
              <span className="text-sm">Connected</span>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;