import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus,Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dropdown } from "react-day-picker";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useState, useMemo } from "react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";


const CreateNewGroup =()=>{
    const navigate = useNavigate();

    const MAX_TAGS = 5;

    // this will be pooled from backend soon. Crowdsharing tags ( research how this is done for social media apps)
const TAG_SUGGESTIONS = [
  "gauteng",
  "marathon",
  "trailrun",
  "cycling",
  "fitness",
  "running",
  "johannesburg",
  "pretoria",
  "comrades"
];


  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const filteredSuggestions = useMemo(() => {
    if (!inputValue) return [];

    return TAG_SUGGESTIONS.filter(
      (tag) =>
        tag.includes(inputValue.toLowerCase()) &&
        !tags.includes(tag)
    );
  }, [inputValue, tags]);

  function addTag(tag: string) {
    if (
      tags.length >= MAX_TAGS ||
      tags.includes(tag)
    ) return;

    setTags([...tags, tag]);
    setInputValue("");
  }

  function removeTag(tag: string) {
    setTags(tags.filter(t => t !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (!inputValue.trim()) return;
      addTag(inputValue.trim().toLowerCase());
    }

    if (e.key === "Backspace" && !inputValue && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  }


    const friends=[
    { id: 1, name: "Alex Thompson", status: "online", distance: "0.2 miles", avatar: "AT", lastSeen: "now" },
    { id: 2, name: "Sarah Chen", status: "away", distance: "1.5 miles", avatar: "SC", lastSeen: "5 mins ago" },
    { id: 3, name: "Mike Rodriguez", status: "online", distance: "0.8 miles", avatar: "MR", lastSeen: "now" },
    { id: 4, name: "Emma Wilson", status: "offline", distance: "3.2 miles", avatar: "EW", lastSeen: "2 hours ago" },
    { id: 5, name: "James Park", status: "online", distance: "0.5 miles", avatar: "JP", lastSeen: "now" }

    ];


    const [selectedFriends, setSelectedFriends] =useState<number[]>([]);

    const toggleFriendSelection = (friendId: number) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'away': return 'bg-warning';
      default: return 'bg-muted-foreground';
    }
  };


    return(
        <section>
      
            <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <section className="container mx-auto px-4 py-4">
          <section className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/group-chats")}
              className="transition-smooth"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Create New Group</h1>
            
          </section>
        </section>
      </header>

      {/*Group Name and define tags*/}
       <Card className="p-6 shadow-card mt-5 m-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 mb-6">
              
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Group Name</h2>
              <Input placeholder="Group 1" />

                <div className="w-full max-w-md">


      {/* Tag container with spacing yet */}
      <div className="flex flex-wrap gap-2 border rounded p-2">
        {tags.map(tag => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-full text-sm"
          >
            #{tag}
            <button
              onClick={() => removeTag(tag)}
              className="text-gray-600 hover:text-black"
            >
              ✕
            </button>
          </span>
        ))}

        {tags.length < MAX_TAGS && (
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a tag…"
            className="flex-1 min-w-[120px] outline-none"
          />
        )}
      </div>

      {/* Suggestions */}
      {filteredSuggestions.length > 0 && (
        <ul className="mt-1 border rounded bg-white shadow">
          {filteredSuggestions.map(tag => (
            <li
              key={tag}
              onClick={() => addTag(tag)}
              className="px-3 py-1 cursor-pointer hover:bg-gray-100"
            >
              #{tag}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-1 text-xs text-gray-500">
        {tags.length}/{MAX_TAGS} tags
      </p>
    </div>
    {/*End of tag container*/}

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
              </div>

      
            















      {/* End of section */}
        </section>

    );

};

export default CreateNewGroup;