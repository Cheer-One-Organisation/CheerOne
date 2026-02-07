import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { ArrowLeft } from "lucide-react";
import { useNavigate} from "react-router-dom"

export default function CreateContact() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [shareLocation, setShareLocation] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();

  const requestLocationPermission = async () => {
    if (!navigator.geolocation) {
      setShareLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setShareLocation(true)
      },
      () => {
        setShareLocation(false)
      }
    )
  }

  const handleSubmit = async () => {
    setIsSaving(true)

    const payload = {
      name,
      email,
      shareLocation,
    }

    console.log("Creating contact:", payload)

    // TODO: send to backend
    setTimeout(() => {
      setIsSaving(false)
    }, 800)
  }

  return (
      <div>
        <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
            <div className="container mx-auto px-4 py-4">

            <div className="flex items-center gap-4">
               <Button variant="ghost"size="sm" 
               onClick={() => navigate("/friend-chats")} className="transition-smooth">
                <ArrowLeft className="h-4 w-4" /> </Button>
                  <h1 className="text-2xl font-semibold">Create New Contact</h1>
            </div>
       
        
      </div>
      </header>
      

      {/* Contact details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Details</CardTitle>
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

      {/* Location sharing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Location Sharing</CardTitle>
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
                  setConfirmOpen(true)
                } else {
                  setShareLocation(false)
                }
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end">
        <Button
          disabled={!name || !email || isSaving}
          onClick={handleSubmit}
        >
          {isSaving ? "Creating..." : "Create Contact"}
        </Button>
      </div>

      {/* Confirmation dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Share your location with {name || "this contact"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will allow them to see your live location.
              You can turn this off at any time in contact settings.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setConfirmOpen(false)
                setShareLocation(false)
              }}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={async () => {
                setConfirmOpen(false)
                await requestLocationPermission()
              }}
            >
              Confirm & Share
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
