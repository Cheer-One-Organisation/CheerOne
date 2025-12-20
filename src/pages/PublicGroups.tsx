import { useState } from "react";
import {ArrowLeft, Search, Filter, Users, MapPin, Heart, Star, TrendingUp} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const PublicGroups = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All", icon: Users },
    { id: "trending", name: "Trending", icon: TrendingUp },
    { id: "local", name: "Local", icon: MapPin },
    { id: "hobbies", name: "Hobbies", icon: Heart },
    { id: "featured", name: "Featured", icon: Star },
  ];

  const groups = [
    {
      id: 1,
      name: "Downtown Coffee Lovers",
      description: "Meet fellow coffee enthusiasts in the downtown area",
      members: 247,
      category: "local",
      location: "Downtown",
      tags: ["coffee", "meetups", "local"],
      avatar: "DCL",
      isJoined: false,
      trending: true
    },
    {
      id: 2,
      name: "React Developers Hub", 
      description: "Share knowledge, discuss latest React trends and help each other",
      members: 1832,
      category: "hobbies",
      location: "Global",
      tags: ["react", "coding", "tech"],
      avatar: "RDH",
      isJoined: true,
      trending: true
    },
    {
      id: 3,
      name: "Weekend Hikers",
      description: "Plan hiking trips and share trail recommendations",
      members: 459,
      category: "hobbies", 
      location: "Mountain View",
      tags: ["hiking", "outdoors", "nature"],
      avatar: "WH",
      isJoined: false,
      trending: false
    },
    {
      id: 4,
      name: "Board Game Night",
      description: "Weekly board game sessions at local cafes",
      members: 89,
      category: "local",
      location: "City Center", 
      tags: ["games", "social", "weekly"],
      avatar: "BGN",
      isJoined: false,
      trending: false
    },
    {
      id: 5,
      name: "Photography Club",
      description: "Share photos, get feedback, and organize photo walks",
      members: 673,
      category: "hobbies",
      location: "San Francisco",
      tags: ["photography", "art", "creative"],
      avatar: "PC",
      isJoined: false,
      trending: true
    },
  ];

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || 
                           group.category === selectedCategory ||
                           (selectedCategory === "trending" && group.trending);
    
    return matchesSearch && matchesCategory;
  });

  const joinGroup = (groupId: number) => {
    // In a real app, this would handle joining/leaving the group
    console.log("Joining group:", groupId);
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
              onClick={() => navigate("/")}
              className="transition-smooth"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Public Groups</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 space-y-6">
        {/* Search and Filters */}
        <Card className="p-6 shadow-card">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search groups by name, description, or interests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="w-full grid grid-cols-5">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                    <category.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </Card>

        {/* Groups Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <Card key={group.id} className="p-6 shadow-card hover:shadow-soft transition-smooth">
              <div className="space-y-4">
                {/* Group Header */}
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="gradient-primary text-primary-foreground">
                      {group.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{group.name}</h3>
                      {group.trending && (
                        <Badge variant="secondary" className="gradient-accent text-accent-foreground">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <Users className="h-3 w-3" />
                      <span>{group.members.toLocaleString()} members</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{group.location}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground">{group.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {group.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Action Button */}
                <Button 
                  onClick={() => joinGroup(group.id)}
                  className={`w-full transition-bounce hover:scale-105 ${
                    group.isJoined 
                      ? 'bg-success text-success-foreground hover:bg-success/90' 
                      : 'gradient-primary text-primary-foreground'
                  }`}
                  disabled={group.isJoined}
                >
                  {group.isJoined ? "Joined" : "Join Group"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredGroups.length === 0 && (
          <Card className="p-12 text-center shadow-card">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No groups found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or browse different categories
            </p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </Card>
        )}

        {/* Create Group CTA */}
        <Card className="p-8 text-center shadow-card gradient-hero text-white">
          <h3 className="text-xl font-semibold mb-2">Can't find the right group?</h3>
          <p className="mb-4 opacity-90">Create your own community and bring people together!</p>
          <Button variant="secondary" size="lg" className="transition-bounce hover:scale-105" onClick={()=>navigate("/create-group-chat")}>
            Create New Group
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default PublicGroups;