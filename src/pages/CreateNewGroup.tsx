import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus,Scroll,Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dropdown } from "react-day-picker";
import { useState, useMemo } from "react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FcPlus } from "react-icons/fc";



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
  const [isPrivate, setIsPrivate] = useState(false);
  const [friend,setFriend] = useState("");
  const [description, setDescription]=useState("")

  type Role = "member" | "admin";
  const [friendRoles, setFriendRoles] = useState<Record<number, Role>>({});

  const toggleRole = (friendId: number) => {
  setFriendRoles(prev => ({
    ...prev,
    [friendId]: prev[friendId] === "admin" ? "member" : "admin",
  }));
};



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


      {/*When a contact is selected it is shown in a vertically scrollable tray for top of the screen access*/}
      {selectedFriends.length > 0 && (
  <div className="sticky top-[72px] z-40 bg-card border-b px- py-3">
    <ScrollArea className="w-full">
      <div className="flex gap-4">
        {selectedFriends.map((id) => {
          const friend = friends.find(f => f.id === id);
          if (!friend) return null;

          return (
            <div
              key={id}
              className="flex flex-col items-center gap-1 min-w-[64px]"
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="gradient-primary text-primary-foreground">
                    {friend.avatar}
                  </AvatarFallback>
                </Avatar>

                <button
                  onClick={() => toggleFriendSelection(id)}
                  className="absolute -top-0 -right-1 h-5 w-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <span className="text-xs truncate max-w-[64px] text-center">
                {friend.name.split(" ")[0]}
              </span>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  </div>
)}


      

      {/*Group Name and define tags*/}
       <Card className="p-6 shadow-card mt-5 m-4 space-y-6">

  {/* Privacy Toggle */}
  <div className="flex items-center justify-between">
  <div className="space-y-1">
    <Label className="text-sm font-medium">
      {isPrivate ?  "Public Group": "Private Group" }
    </Label>

    <p className="text-xs text-muted-foreground">
      {!isPrivate
        ? "Only invited members can find and join this group"
        : "Anyone can discover and request to join this group"}
    </p>
  </div>

  <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
</div>


  {/* Group Name */}
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Users className="h-5 w-5 text-primary" />
      <h2 className="text-lg font-semibold">Group Name</h2>
    </div>

    <Input placeholder="Group 1" className="max-w-md" />
  </div>

  {/* Group Description */}
<div className="space-y-2">
  <div className="flex items-center gap-2">
    <Scroll className="h-5 w-5 text-primary" />
    <h2 className="text-lg font-semibold">Group Description</h2>
  </div>

  <textarea
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="What is this group about?"
    rows={4}
    maxLength={300}
    className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
  />

  <p className="text-xs text-muted-foreground text-right">
    {description.length}/300
  </p>
</div>


  {/* Tags */}
  <div className="space-y-2">
    <Label className="text-sm font-medium">Tags</Label>

      <div className="flex flex-wrap gap-2 border rounded-lg p-2">
        {tags.map(tag => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-sm"
          >
            #{tag}
            <button
              onClick={() => removeTag(tag)}
              className="text-muted-foreground hover:text-foreground"
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
            className="flex-1 min-w-[120px] outline-none bg-transparent"
          />
        )}
      </div>

      {filteredSuggestions.length > 0 && (
        <ul className="border rounded-md bg-popover shadow-sm">
          {filteredSuggestions.map(tag => (
            <li
              key={tag}
              onClick={() => addTag(tag)}
              className="px-3 py-1 cursor-pointer hover:bg-muted"
            >
              #{tag}
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-muted-foreground">
        {tags.length}/{MAX_TAGS} tags
      </p>
    </div>

  </Card>

        
       
         <div className="ml-5 mr-5 grid lg:grid-cols-1 gap-6">
        
                  {/* Friends List */}
                  <Card className="p-6 shadow-card">
                    <div className="flex items-center gap-3 mb-6">
                      <Users className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">Contact List</h2>
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
                               
                                <p className="text-xs text-muted-foreground">
                                  Last seen {friend.lastSeen}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
  {selectedFriends.includes(friend.id) && (
    <Button
      size="sm"
      variant={friendRoles[friend.id] === "admin" ? "default" : "outline"}
      onClick={(e) => {
        e.stopPropagation();
        toggleRole(friend.id);
      }}
    >
      {friendRoles[friend.id] === "admin" ? "Admin" : "Member"}
    </Button>
  )}

  
</div>

                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </Card>
              </div>
              

              <div className="sticky bottom-0 z-50 border-t bg-card/80 backdrop-blur-md px-4 py-3">
  <div className="flex justify-between items-center">
    <p className="text-sm text-muted-foreground">
      {selectedFriends.length} members selected
    </p>

    <Button

    
      size="lg"
      disabled={!selectedFriends.length}
      onClick={() => {
        const payload = {
          isPrivate,
          tags,
          members: selectedFriends.map(id => ({
            id,
            role: friendRoles[id] ?? "member",
          })),
        };

        console.log("CREATE GROUP:", payload);

        navigate("/group-chats");
      }}
    >
      I'm Happy With This !
    </Button>
  </div>
</div>

              

      
            















      {/* End of section */}
        </section>

    );

};

export default CreateNewGroup;