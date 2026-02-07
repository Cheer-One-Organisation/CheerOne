import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import {
  ArrowLeft,
  Phone,
  Video,
  MessageSquare,
  Trash2,
  Users,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const AboutContact = () => {
  const navigate = useNavigate();

  const contact = {
    name: "Julia Fox",
    avatar: "JF",
    status: "Online",
    about:
      "Probably gaming, possibly sleeping. Messages may be replied to instantly or three business days later.",
    phone: "+27 81 234 5678",
  };

  const sharedGroups = [
    { id: 1, name: "Gaming Group", avatar: "GG" },
    { id: 2, name: "Weekend Squad", avatar: "WS" },
    { id: 3, name: "Design Nerds", avatar: "DN" },
  ];

  const [shareLocation, setShareLocation] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

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

  return (
    <section className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">About Contact</h1>
        </div>
      </header>

      {/* Contact Info */}
      <Card className="mx-5 mt-5 p-6 shadow-card">
        <div className="flex flex-col items-center text-center gap-3">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="gradient-primary text-xl font-semibold text-primary-foreground">
              {contact.avatar}
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-xl font-semibold">{contact.name}</h2>
            <p className="text-sm text-muted-foreground">{contact.status}</p>
          </div>

          <div className="flex gap-3 mt-4">
            <Button size="icon" variant="outline">
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline">
              <Phone className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline">
              <Video className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card className="mx-5 mt-5 p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-2">About</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{contact.about}</p>
      </Card>

      {/* Contact Details */}
      <Card className="mx-5 mt-5 p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-4">Contact Details</h3>
        <div>
          <p className="text-sm text-muted-foreground">Phone</p>
          <p className="font-medium">{contact.phone}</p>
        </div>
      </Card>

      {/* Shared Groups */}
      {sharedGroups.length > 0 && (
        <Card className="mx-5 mt-5 p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">
              Shared Groups ({sharedGroups.length})
            </h3>
          </div>

          <div className="space-y-2">
            {sharedGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => navigate("/group-chats")}
                className="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer hover:bg-muted/50 transition"
              >
                <Avatar>
                  <AvatarFallback className="gradient-primary text-primary-foreground">
                    {group.avatar}
                  </AvatarFallback>
                </Avatar>

                <p className="font-medium truncate">{group.name}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Location Sharing */}
      <Card className="mx-5 mt-5 p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Share my location</Label>
            <p className="text-xs text-muted-foreground">
              Allow {contact.name} to see your live location
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
      </Card>

      {/* Actions */}
      <Card className="mx-5 mt-5 mb-6 p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-4">Actions</h3>

        <div className="space-y-3">
          <Button variant="outline" className="w-full">
            Block Contact
          </Button>

          <Separator />

          <Button variant="destructive" className="w-full gap-2">
            <Trash2 className="h-4 w-4" />
            Delete Contact
          </Button>
        </div>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Share your location with {contact.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will allow them to see your live location. You can turn this
              off anytime in contact settings.
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
                // request permission
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    () => setShareLocation(true),
                    () => setShareLocation(false)
                  );
                }
              }}
            >
              Confirm & Share
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default AboutContact;
