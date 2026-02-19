import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { auth, fsdb } from "../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// Fix Leaflet default marker issue
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MyUserContact = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);

  const [description, setDescription] = useState(
    "Hey! I’m using Cheer One. You can reach me here."
  );
  const [displayName, setDisplayName] = useState("");
  const [liveLocationEnabled, setLiveLocationEnabled] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchUser = async () => {
      try {
        const docRef = doc(fsdb, "User", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setDescription(
            data.description ??
              "Hey! I’m using Cheer One. You can reach me here."
          );

          if (data.lastping) {
            setLocation({
              lat: data.lastping.latitude,
              lng: data.lastping.longitude,
            });
          }

          setDisplayName(data.displayName ?? user.displayName ?? "");
          setLiveLocationEnabled(data.locationlive ?? false);
        } else {
          // fallback to auth display name
          setDisplayName(user.displayName ?? "");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUser();
  }, [user]);

  const email = user?.email;

  return (
    <section className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">My Contact</h1>
        </div>
      </header>

      {/* Profile Card */}
      <Card className="mx-5 mt-5 p-6 shadow-card">
        <div className="flex flex-col items-center gap-4 text-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.photoURL ?? undefined} />
            <AvatarFallback className="gradient-primary text-xl font-semibold text-primary-foreground">
              {displayName?.[0] ?? "U"}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold">{displayName}</h2>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </Card>

      {/* Description Editor */}
      <Card className="mx-5 mt-5 p-6 shadow-card space-y-4">
        <Label htmlFor="description">Description / About Me</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write something about yourself..."
        />
        <Button
          onClick={async () => {
            if (!user) {
              alert("Not authenticated");
              return;
            }

            try {
              await setDoc(
                doc(fsdb, "User", user.uid),
                {
                  description,
                  location,
                  locationlive: liveLocationEnabled,
                  updatedAt: new Date(),
                },
                { merge: true }
              );

              alert("Saved successfully!");
            } catch (err) {
              console.error(err);
              alert("Error saving");
            }
          }}
          className="mt-2"
        >
          Save
        </Button>
      </Card>

      {/* Live Location Toggle */}
      <Card className="mx-5 mt-5 p-6 shadow-card flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">
            Share Live Location
          </Label>
          <p className="text-xs text-muted-foreground">
            Enable to let friends see your real-time location
          </p>
        </div>
        <Switch
          checked={liveLocationEnabled}
          onCheckedChange={setLiveLocationEnabled}
        />
      </Card>

      {/* Map */}
      {liveLocationEnabled && location && (
        <Card className="mx-5 mt-5 p-0 shadow-card rounded-lg h-80">
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[location.lat, location.lng]}>
              <Popup>Your Current Location</Popup>
            </Marker>
          </MapContainer>
        </Card>
      )}
    </section>
  );
};

export default MyUserContact;
