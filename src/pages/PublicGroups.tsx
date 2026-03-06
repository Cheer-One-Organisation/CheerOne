import { useState, useEffect } from "react";
import { ArrowLeft, Search, Users, MapPin, Heart, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

import { fsdb } from "../../firebase/firebase.js";
import { collection, where, getDocs, query, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const PublicGroups = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [groups, setGroups] = useState<any[]>([]);

  const auth = getAuth();

  const fetchPublicGroups = async () => {
    try {
      const q = query(
        collection(fsdb, "Publicgroups"),
        where("isprivate", "==", false)
      );

      const snapshot = await getDocs(q);

      const groupsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setGroups(groupsData);
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  useEffect(() => {
    fetchPublicGroups();
  }, []);

  /* ---------------- JOIN GROUP ---------------- */

  const joinPublicGroup = async (groupId: string) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        alert("You must be logged in");
        return;
      }

      const newParticipant = {
        id: user.uid,
        role: "member",
      };

      const groupRef = doc(fsdb, "Publicgroups", groupId);

      await updateDoc(groupRef, {
        participants: arrayUnion(newParticipant),
      });

      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId
            ? {
                ...g,
                participants: [...(g.participants || []), newParticipant],
              }
            : g
        )
      );
    } catch (err) {
      console.error("Error joining group:", err);
    }
  };

  /* ---------------- FILTERING ---------------- */

  const categories = [
    { id: "all", name: "All", icon: Users },
    { id: "trending", name: "Trending", icon: TrendingUp },
    { id: "local", name: "Local", icon: MapPin },
    { id: "hobbies", name: "Hobbies", icon: Heart },
    { id: "featured", name: "Featured", icon: Star },
  ];

  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      group.category === selectedCategory ||
      (selectedCategory === "trending" && group.trending);

    return matchesSearch && matchesCategory;
  });

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-background">

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <h1 className="text-xl font-semibold">Public Groups</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 space-y-6">

        {/* SEARCH */}

        <Card className="p-6 shadow-card">
          <div className="space-y-4">

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="w-full grid grid-cols-5">

                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex items-center gap-2"
                  >
                    <category.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {category.name}
                    </span>
                  </TabsTrigger>
                ))}

              </TabsList>
            </Tabs>

          </div>
        </Card>

        {/* GROUP LIST */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredGroups.map((group) => {
            const joined = group.participants?.some(
              (p: any) => p.id === auth.currentUser?.uid
            );

            return (
              <Card
                key={group.id}
                className="p-6 shadow-card hover:shadow-soft transition-smooth"
              >
                <div className="space-y-4">

                  {/* HEADER */}

                  <div className="flex items-start gap-3">

                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="gradient-primary text-white">
                        {group.name?.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">

                      <h3 className="font-semibold truncate">
                        {group.name}
                      </h3>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground">

                        <Users className="h-3 w-3" />

                        <span>
                          {group.participants?.length || 0} members
                        </span>

                      </div>

                      {group.location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">

                          <MapPin className="h-3 w-3" />

                          <span>{group.location}</span>

                        </div>
                      )}

                    </div>
                  </div>

                  {/* DESCRIPTION */}

                  <p className="text-sm text-muted-foreground">
                    {group.description}
                  </p>

                  {/* TAGS */}

                  <div className="flex flex-wrap gap-2">

                    {group.tags?.map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}

                  </div>

                  {/* JOIN BUTTON */}

                  <Button
                    onClick={() => joinPublicGroup(group.id)}
                    className={`w-full ${
                      joined
                        ? "bg-green-500 text-white"
                        : "gradient-primary text-white"
                    }`}
                    disabled={joined}
                  >
                    {joined ? "Joined" : "Join Group"}
                  </Button>

                </div>
              </Card>
            );
          })}
        </div>

        {/* EMPTY STATE */}

        {filteredGroups.length === 0 && (
          <Card className="p-12 text-center shadow-card">

            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />

            <h3 className="text-lg font-semibold mb-2">
              No groups found
            </h3>

            <p className="text-muted-foreground mb-4">
              Try adjusting your search
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

        {/* CREATE GROUP */}

        <Card className="p-8 text-center shadow-card gradient-hero text-white">

          <h3 className="text-xl font-semibold mb-2">
            Can't find the right group?
          </h3>

          <p className="mb-4 opacity-90">
            Create your own community and bring people together
          </p>

          <Button
            onClick={() => navigate("/create-new-group")}
            variant="secondary"
            size="lg"
          >
            Create New Group
          </Button>

        </Card>

      </div>
    </div>
  );
};

export default PublicGroups;