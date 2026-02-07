import { useNavigate } from "react-router-dom";
import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Search,
  Users,
  Crown,
  UserPlus,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type RoleFilter = "all" | "admin" | "member";

const AboutGroup = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  const friends = [
    { id: 1, name: "Julia Fox", avatar: "JF", role: "admin" },
    { id: 2, name: "Ivine Couger", avatar: "IC", role: "member" },
    { id: 3, name: "Fiona Mables", avatar: "FM", role: "admin" },
    { id: 4, name: "Greg Sweeney", avatar: "GS", role: "member" },
  ];

  const filteredMembers = useMemo(() => {
    return friends.filter((member) => {
      const matchesSearch = member.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesRole =
        roleFilter === "all" || member.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [friends, searchQuery, roleFilter]);

  return (
    <section className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/group-chats")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">About Group</h1>
        </div>
      </header>

      {/* Group Info */}
      <Card className="mx-5 mt-5 p-6 shadow-card">
        <div className="flex flex-col items-center text-center gap-3">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="gradient-primary text-xl font-semibold text-primary-foreground">
              GG
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-xl font-semibold">Gaming Group</h2>
            <p className="text-sm text-muted-foreground">
              {friends.length} members • Private group
            </p>
          </div>
        </div>
      </Card>

      {/* Description */}
      <Card className="mx-5 mt-5 p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-2">About</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          A chill space for gamers to coordinate raids, share builds, and
          occasionally argue about which console is superior. Be respectful,
          stay active, and have fun.
        </p>
      </Card>

      {/* Search + Filters */}
      <Card className="mx-5 mt-5 p-6 shadow-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 mt-4">
          {(["all", "admin", "member"] as RoleFilter[]).map((filter) => (
            <Button
              key={filter}
              size="sm"
              variant={roleFilter === filter ? "default" : "outline"}
              onClick={() => setRoleFilter(filter)}
              className="capitalize"
            >
              {filter}
            </Button>
          ))}
        </div>
      </Card>

      {/* Members */}
      <Card className="mx-5 mt-5 p-6 shadow-card flex-1">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Members</h2>
        </div>

        <ScrollArea className="h-[400px] pr-2">
          <div className="space-y-2">
            {filteredMembers.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No members found
              </p>
            )}

            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted/50 transition"
              >
                <Avatar>
                  <AvatarFallback className="gradient-primary text-primary-foreground">
                    {member.avatar}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{member.name}</p>
                </div>

                {member.role === "admin" ? (
                  <Badge variant="secondary" className="gap-1">
                    <Crown className="h-3 w-3" />
                    Admin
                  </Badge>
                ) : (
                  <Badge variant="outline">Member</Badge>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Actions */}
      <Card className="mx-5 mt-5 mb-6 p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-4">Group Actions</h3>

        <div className="space-y-3">
          <Button className="w-full gap-2">
            <UserPlus className="h-4 w-4" />
            Add Member
          </Button>

          <Separator />

          <Button
            variant="destructive"
            className="w-full gap-2"
          >
            <LogOut className="h-4 w-4" />
            Leave Group
          </Button>
        </div>
      </Card>
    </section>
  );
};

export default AboutGroup;
