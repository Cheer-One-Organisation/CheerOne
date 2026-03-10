import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { fsdb, auth } from "../../firebase/firebase.js";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,

} from "firebase/firestore";

export default function CreateContact() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [shareLocation, setShareLocation] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();


  const requestLocationPermission = async () => {
    if (!navigator.geolocation) {
      setShareLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setShareLocation(true);
      },
      () => {
        setShareLocation(false);
      }
    );
  };


  //will use email.js here to send real email
  const sendInviteEmail = async (email: string, name: string) => {
    console.log(`Invite would be sent to ${email} for ${name}`);

  };


  const handleSubmit = async () => {

    if (!auth.currentUser) {
      alert("You must be logged in");
      return;
    }

    setIsSaving(true);

    try {

      //search if user has been previously invited to join a contact list
      const currentUserId = auth.currentUser.uid;

      const q = query(
        collection(fsdb, "Users"),
        where("email", "==", email)
      );

      const snapshot = await getDocs(q);

      const contactRef = doc(fsdb, "ContactList", currentUserId);


      if (!snapshot.empty) {

        const userDoc = snapshot.docs[0];
        const userId = userDoc.id;

        await setDoc(
          contactRef,
          {
            contacts: arrayUnion(userId),
           
          },
          { merge: true }
        );

        alert("Contact added successfully");

      }


      else {

        await sendInviteEmail(email, name);

        await setDoc(
          contactRef,
          {
            invites: arrayUnion({
              email,
              name,
              shareLocation,
              status: "pending"
              
            }),
          },
          { merge: true }
        );

        alert("User not found. Invite sent.");

      }

      setName("");
      setEmail("");

    } catch (error) {

      console.error("Error creating contact:", error);
      alert("Something went wrong");

    } finally {

      setIsSaving(false);

    }
  };


  return (

    <div>

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/location-finder")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <h1 className="text-2xl font-semibold">
              Create New Contact
            </h1>

          </div>

        </div>

      </header>


      <Card>

        <CardHeader>
          <CardTitle className="text-lg">
            Contact Details
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <div className="space-y-1">

            <Label>Name</Label>

            <Input
              placeholder="Julia Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

          </div>

          <div className="space-y-1">

            <Label>Email</Label>

            <Input
              type="email"
              placeholder="julia@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>

        </CardContent>

      </Card>


      {/* LOCATION SHARING */}

      <Card>

        <CardHeader>
          <CardTitle className="text-lg">
            Location Sharing
          </CardTitle>
        </CardHeader>

        <CardContent>

          <div className="flex items-center justify-between">

            <div>

              <Label className="text-sm font-medium">
                Share my location
              </Label>

              <p className="text-xs text-muted-foreground">
                Allow this contact to see your live location
              </p>

            </div>

            <Switch
              checked={shareLocation}
              onCheckedChange={(checked) => {

                if (checked) {
                  setConfirmOpen(true);
                } else {
                  setShareLocation(false);
                }

              }}
            />

          </div>

        </CardContent>

      </Card>


      {/* ACTION BUTTON */}

      <div className="flex justify-end mt-4">

        <Button
          disabled={!name || !email || isSaving}
          onClick={handleSubmit}
        >

          {isSaving ? "Creating..." : "Create Contact"}

        </Button>

      </div>


      {/* CONFIRM LOCATION SHARING */}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>

        <AlertDialogContent>

          <AlertDialogHeader>

            <AlertDialogTitle>
              Share your location with {name || "this contact"}?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This will allow them to see your live location.
              You can disable it anytime in settings.
            </AlertDialogDescription>

          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel
              onClick={() => {
                setConfirmOpen(false);
                setShareLocation(false);
              }}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={async () => {
                setConfirmOpen(false);
                await requestLocationPermission();
              }}
            >
              Confirm & Share
            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>

      </AlertDialog>

    </div>
  );
}