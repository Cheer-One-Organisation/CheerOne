import { useState } from "react";
import { ArrowLeft, MapPin, Send, Users, Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const LocationFinder = () => {
  const navigate = useNavigate();
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [pingMessage, setPingMessage] = useState("");

  const friends = [
    { id: 1, name: "Alex Thompson", status: "online", distance: "0.2 miles", avatar: "AT", lastSeen: "now" },
    { id: 2, name: "Sarah Chen", status: "away", distance: "1.5 miles", avatar: "SC", lastSeen: "5 mins ago" },
    { id: 3, name: "Mike Rodriguez", status: "online", distance: "0.8 miles", avatar: "MR", lastSeen: "now" },
    { id: 4, name: "Emma Wilson", status: "offline", distance: "3.2 miles", avatar: "EW", lastSeen: "2 hours ago" },
    { id: 5, name: "James Park", status: "online", distance: "0.5 miles", avatar: "JP", lastSeen: "now" },
  ];

  const recentPings = [
    { id: 1, from: "Alex", message: "At the coffee shop on Main St!", time: "2 mins ago", responded: true },
    { id: 2, from: "Sarah", message: "Anyone free for lunch?", time: "15 mins ago", responded: false },
    { id: 3, from: "Mike", message: "Playing basketball at the park", time: "1 hour ago", responded: true },
  ];

  const toggleFriendSelection = (friendId: number) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const sendPing = () => {
    if (selectedFriends.length > 0) {
      // In a real app, this would send the ping
      setSelectedFriends([]);
      setPingMessage("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'away': return 'bg-warning';
      default: return 'bg-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/dashboard")}
              className="transition-smooth"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Find Friends</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 space-y-6">
        {/* Quick Ping Section */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center">
              <Radar className="h-5 w-5 text-white ping-animation" />
            </div>
            <h2 className="text-lg font-semibold">Send Location Ping</h2>
          </div>

          <div className="space-y-4">
            <Input
              placeholder="Add a message to your ping..."
              value={pingMessage}
              onChange={(e) => setPingMessage(e.target.value)}
              className="w-full"
            />
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedFriends.length} friend{selectedFriends.length !== 1 ? 's' : ''} selected
              </span>
              <Button 
                onClick={sendPing}
                disabled={selectedFriends.length === 0}
                className="gradient-primary text-primary-foreground transition-bounce hover:scale-105"
              >
                <Send className="mr-2 h-4 w-4" />
                Send Ping
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Friends List */}
          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Friends Nearby</h2>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    onClick={() => toggleFriendSelection(friend.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-smooth border-2 ${
                      selectedFriends.includes(friend.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent hover:bg-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarFallback className="gradient-primary text-primary-foreground">
                            {friend.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${getStatusColor(friend.status)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{friend.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{friend.distance} away</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Last seen {friend.lastSeen}
                        </p>
                      </div>
                      <Badge 
                        variant={friend.status === 'online' ? 'default' : 'secondary'}
                        className={friend.status === 'online' ? 'gradient-success text-success-foreground' : ''}
                      >
                        {friend.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Recent Pings */}
          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold">Recent Pings</h2>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {recentPings.map((ping) => (
                  <div key={ping.id} className="p-4 bg-secondary rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{ping.from}</h4>
                      <span className="text-xs text-muted-foreground">{ping.time}</span>
                    </div>
                    <p className="text-sm mb-3">{ping.message}</p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant={ping.responded ? "secondary" : "default"}
                        className={!ping.responded ? "gradient-primary text-primary-foreground" : ""}
                        disabled={ping.responded}
                      >
                        {ping.responded ? "Responded" : "Respond"}
                      </Button>
                      <Button size="sm" variant="outline">
                        <MapPin className="mr-1 h-3 w-3" />
                        View Location
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Map Placeholder */}
        <Card className="p-6 shadow-card">
          <div className="h-64 bg-secondary rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
              <p className="text-muted-foreground">
                Map integration will show friend locations and ping history
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LocationFinder;