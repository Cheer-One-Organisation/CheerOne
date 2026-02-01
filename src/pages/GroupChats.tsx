import { useState } from "react";
import { ArrowLeft, Send, Plus, Users, Search, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

const GroupChats = () => {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState("");

  const groups = [
    { id: 1, name: "College Friends", members: 8, lastMessage: "Hey everyone! 🎉", avatar: "CF" },
    { id: 2, name: "Work Team", members: 12, lastMessage: "Meeting at 3 PM", avatar: "WT" },
    { id: 3, name: "Family", members: 6, lastMessage: "Dinner this Sunday?", avatar: "FM" },
    { id: 4, name: "Gaming Squad", members: 5, lastMessage: "New raid tonight!", avatar: "GS" },
  ];

  const messages = [
    { id: 1, sender: "Alex", message: "Hey everyone! How's your day going?", time: "2:30 PM", isMe: false },
    { id: 2, sender: "You", message: "Pretty good! Just finished my project 🎉", time: "2:32 PM", isMe: true },
    { id: 3, sender: "Sarah", message: "Awesome! Congrats 🎊", time: "2:33 PM", isMe: false },
    { id: 4, sender: "Mike", message: "Nice work! Let's celebrate this weekend", time: "2:35 PM", isMe: false },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message
      setNewMessage("");
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
            <h1 className="text-xl font-semibold">Group Chats</h1>
            <div className="ml-auto">
              <Button onClick={()=>navigate("/create-new-group")} size="sm" className="gradient-primary text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                New Group
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 h-[calc(100vh-88px)]">
        <div className="grid lg:grid-cols-3 gap-6 h-full">
          {/* Groups Sidebar */}
          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Your Groups</h2>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search groups..." className="pl-10" />
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => setSelectedGroup(group.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-smooth ${
                      selectedGroup === group.id
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="gradient-primary text-primary-foreground">
                          {group.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{group.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {group.lastMessage}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {group.members} members
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col shadow-card">
            {selectedGroup ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="gradient-primary text-primary-foreground">
                        {groups.find(g => g.id === selectedGroup)?.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {groups.find(g => g.id === selectedGroup)?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {groups.find(g => g.id === selectedGroup)?.members} members
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-2xl transition-smooth ${
                            message.isMe
                              ? 'gradient-primary text-primary-foreground ml-4'
                              : 'bg-secondary text-secondary-foreground mr-4'
                          }`}
                        >
                          {!message.isMe && (
                            <p className="text-xs font-medium mb-1 opacity-70">
                              {message.sender}
                            </p>
                          )}
                          <p>{message.message}</p>
                          <p className={`text-xs mt-1 ${message.isMe ? 'opacity-70' : 'text-muted-foreground'}`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-6 border-t">
                  <div className="flex gap-3">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="gradient-primary text-primary-foreground transition-bounce hover:scale-105"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-6">
                <div>
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a Group</h3>
                  <p className="text-muted-foreground">
                    Choose a group from the sidebar to start chatting
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GroupChats;