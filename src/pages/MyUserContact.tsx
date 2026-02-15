import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { ArrowLeft } from "lucide-react";


import { auth,db } from "../../firebase/firebase"; // adjust path if needed
import { doc, getDoc, setDoc } from "firebase/firestore";


const MyUserContact = () => {
  const navigate = useNavigate();

  const [description, setDescription] = useState(
    "Hey! I’m using Cheer One. You can reach me here."
  );




useEffect(() => {
  const fetchUser = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const docRef = doc(db, "Users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      if (data.description) setDescription(data.description);
      if (data.location) setLocation(data.location);
      if (data.liveLocationEnabled !== undefined)
        setLiveLocationEnabled(data.liveLocationEnabled);
    }
  };

  fetchUser();
}, []);


  const [liveLocationEnabled, setLiveLocationEnabled] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    { lat: 0, lng: 0 } // placeholder coordinates
  );

  const email = "myemail@example.com"; // Replace with actual account email



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
            <AvatarFallback className="gradient-primary text-xl font-semibold text-primary-foreground">
              ME
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold">My Name</h2>
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
  const user = auth.currentUser;
  if (!user) {
    alert("Not authenticated");
    return;
  }

  try {
    await setDoc(
      doc(db, "Users", user.uid),
      {
        description,
        location,
        liveLocationEnabled,
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
          <Label className="text-sm font-medium">Share Live Location</Label>
          <p className="text-xs text-muted-foreground">
            Enable to let friends see your real-time location
          </p>
        </div>
        <Switch
          checked={liveLocationEnabled}
          onCheckedChange={setLiveLocationEnabled}
        />
      </Card>

      {/* Map Placeholder */}
      {liveLocationEnabled && (
        <Card className="mx-5 mt-5 p-6 shadow-card flex flex-col items-center justify-center h-80 bg-muted/20 rounded-lg">
          <MapPin className="h-12 w-12 text-primary mb-2" />
          <p className="text-muted-foreground">Your live location will appear here</p>
        </Card>
      )}
    </section>
  );
};

export default MyUserContact;
