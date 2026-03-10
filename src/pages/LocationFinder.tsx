import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Send, Users, Radar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { auth, fsdb } from "../../firebase/firebase";
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";

// Leaflet default icon fix
//@ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const LocationFinder = () => {
  const navigate = useNavigate();
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [pingMessage, setPingMessage] = useState("");
  const [friends, setFriends] = useState<any[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });

  const [recentPings, setRecentPings] = useState<any[]>([]);
  const user = auth.currentUser;

  const navCreateFriend = () => {
    navigate("/create-contact");
  };

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const sendPing = () => {
    if (selectedFriends.length > 0) {
      // In a real app, send ping to Firestore
      setSelectedFriends([]);
      setPingMessage("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-success";
      case "away":
        return "bg-warning";
      default:
        return "bg-muted-foreground";
    }
  };

  useEffect(() => {
    const fetchContacts = async () => {
      if (!user) return;

      // 1️⃣ Get ContactList for current user
      const contactSnap = await getDoc(doc(fsdb, "ContactList", user.uid));
      if (!contactSnap.exists()) return;

      const contactData = contactSnap.data();
      const userIds: string[] = contactData.contacts || [];

      // 2️⃣ Fetch User info
      const usersQuery = query(
        collection(fsdb, "User"),
        where("userid", "in", userIds.slice(0, 10)) // Firestore "in" max 10
      );
      const usersSnap = await getDocs(usersQuery);

      const friendsList = usersSnap.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: data.userid,
          name: data.displayName,
          avatar: data.displayName
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase(),
          lastSeen: data.lastping ? "now" : "offline",
          status: data.locationlive ? "online" : "offline",
          distance: "0.5 miles",
          lastping: data.lastping,
          email: data.email,
        };
      });

      setFriends(friendsList);

      // 3️⃣ Set user's location
      const userDoc = await getDoc(doc(fsdb, "User", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.lastping)
          setLocation({
            lat: userData.lastping.latitude,
            lng: userData.lastping.longitude,
          });
      }

      // 4️⃣ Populate recent pings (mock or from Firestore)
      setRecentPings(
        friendsList.slice(0, 3).map((f, i) => ({
          id: i,
          from: f.name.split(" ")[0],
          message: "Sent you a ping",
          time: "now",
          responded: false,
          userId: f.id,
        }))
      );
    };

    fetchContacts();
  }, [user]);

  const goToFriendChat = (friendId: string) => {
    navigate("/friends-chats");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Find Friends</h1>
          <Button onClick={navCreateFriend}>
            <Plus /> Add a friend
          </Button>
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
                {selectedFriends.length} friend
                {selectedFriends.length !== 1 ? "s" : ""} selected
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
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:bg-secondary"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarFallback className="gradient-primary text-primary-foreground">
                            {friend.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${getStatusColor(
                            friend.status
                          )}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{friend.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{friend.distance}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Last seen {friend.lastSeen}
                        </p>
                      </div>
                      <Badge
                        variant={friend.status === "online" ? "default" : "secondary"}
                        className={friend.status === "online" ? "gradient-success text-success-foreground" : ""}
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
              <Users className="h-5 w-5 text-primary" />
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
                        onClick={() => goToFriendChat}
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

        {/* Map */}
        <Card className="mx-5 mt-5 p-0 shadow-card rounded-lg h-80">
          <MapContainer
            key={`${location.lat}-${location.lng}`}
            center={[location.lat, location.lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[location.lat, location.lng]}>
              <Popup>Your Current Location</Popup>
            </Marker>
          </MapContainer>
        </Card>
      </div>
    </div>
  );
};

export default LocationFinder;