import { useState, useEffect, useRef } from "react"; 
import { ArrowLeft, Send, Plus, Users, Search, MessageCircle, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

import {
  collection,
  query,
  onSnapshot,
  getDocs,
  doc,
  addDoc,
  orderBy,
  serverTimestamp,
  setDoc
} from "firebase/firestore";

import { auth, fsdb } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const GroupChats = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingGroups, setLoadingGroups] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchGroups = async () => {
      setLoadingGroups(true);
      const publicSnap = await getDocs(collection(fsdb, "Publicgroups"));
      const privateSnap = await getDocs(collection(fsdb, "Privategroups"));
      const allGroups: any[] = [];
      publicSnap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.participants?.some((p: any) => p.id === user.uid)) {
          allGroups.push({ id: docSnap.id, collection: "Publicgroups", ...data });
        }
      });
      privateSnap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.participants?.some((p: any) => p.id === user.uid)) {
          allGroups.push({ id: docSnap.id, collection: "Privategroups", ...data });
        }
      });
      setGroups(allGroups);
      setLoadingGroups(false);
    };
    fetchGroups();
  }, [user]);

  useEffect(() => {
    if (!selectedGroup) return;
    const q = query(
      collection(fsdb, selectedGroup.collection, selectedGroup.id, "Messages"),
      orderBy("timestamp", "asc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const msgList: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        msgList.push({ id: doc.id, ...data, isMe: data.senderId === user.uid });
      });
      setMessages(msgList);
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 50);
    });
    return () => unsub();
  }, [selectedGroup, user]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedGroup) return;
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const tempMessage = {
      id: Date.now(),
      textMessage: newMessage,
      senderId: currentUser.uid,
      senderName: currentUser.displayName || "You",
      timestamp: new Date(),
      isMe: true
    };
    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    setGroups((prevGroups) =>
      prevGroups.map((g) =>
        g.id === selectedGroup.id
          ? { ...g, lastMessage: tempMessage.textMessage, lastTimeStamp: tempMessage.timestamp }
          : g
      )
    );

    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 50);

    const groupRef = doc(fsdb, selectedGroup.collection, selectedGroup.id);
    await addDoc(collection(groupRef, "Messages"), {
      senderId: currentUser.uid,
      senderName: currentUser.displayName || "You",
      textMessage: tempMessage.textMessage,
      timestamp: serverTimestamp()
    });
    await setDoc(
      groupRef,
      { lastMessage: tempMessage.textMessage, lastTimeStamp: serverTimestamp() },
      { merge: true }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Group Chats</h1>
          <div className="ml-auto">
            <Button onClick={() => navigate("/create-new-group")} size="sm">
              <Plus className="mr-2 h-4 w-4" />Create New Group
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 h-[calc(100vh-88px)]">
        <div className="grid lg:grid-cols-3 gap-6 h-full">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Your Groups</h2>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
              <Input placeholder="Search groups..." className="pl-10" />
            </div>
            {loadingGroups ? (
              <div className="flex justify-center items-center h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : groups.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <p>You are not in any groups</p>
                <Button onClick={() => navigate("/create-new-group")}>Create Group</Button>
                <Button variant="outline" onClick={() => navigate("/public-groups")}>Join Groups</Button>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      onClick={() => setSelectedGroup(group)}
                      className={`p-4 cursor-pointer ${selectedGroup?.id === group.id ? "bg-primary/10" : "hover:bg-secondary"}`}
                    >
                      <div className="flex gap-3">
                        <Avatar><AvatarFallback>{group.groupname?.[0] ?? "G"}</AvatarFallback></Avatar>
                        <div className="flex-1">
                          <h3>{group.groupname}</h3>
                          <p className="text-sm truncate">{group.lastMessage}</p>
                          <p className="text-xs">{group.participants?.length} members</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </Card>

          <Card className="lg:col-span-2 flex flex-col">
            {selectedGroup ? (
              <>
                <div className="p-6 border-b flex items-center gap-3">
                  <Avatar><AvatarFallback>{selectedGroup.groupname?.[0]}</AvatarFallback></Avatar>
                  <div>
                    <h3>{selectedGroup.groupname}</h3>
                    <p className="text-sm">{selectedGroup.participants?.length} members</p>
                  </div>
                  <div className="ml-auto"><InfoIcon onClick={() => navigate("/about-group")} /></div>
                </div>

                <ScrollArea ref={scrollRef} className="flex-1 p-6">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl ${msg.isMe ? "bg-primary text-white" : "bg-secondary"}`}>
                          <p>{msg.textMessage}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="p-6 border-t flex gap-3">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <MessageCircle className="h-12 w-12" />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GroupChats;