import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Users,
  MessageCircle,
  Info
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  collection,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDoc,
  setDoc,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

import { auth, fsdb } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const FriendChats = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    if (!user) return;

    
    const q = query(
      collection(fsdb, "IndividualChats"),
      where("participans", "array-contains", user.uid),
      orderBy("lastTimeStamp", "desc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatList: any[] = [];

      for (const docSnap of snapshot.docs) {
        const chatData = docSnap.data();
        console.log(chatData);

        // find the OTHER user
        const otherUserId = chatData.participans.find(
          (id: string) => id !== user.uid
        );

        const otherUserDoc = await getDoc(doc(fsdb, "User", otherUserId));
        const otherUserData = otherUserDoc.data();

        chatList.push({
          id: docSnap.id,
          ...chatData,
          otherUser: {
            id: otherUserId,
            ...otherUserData
          }
        });
      }

      setChats(chatList);
    });

    return () => unsubscribe();
  }, [user]);

  // ✅ Load messages of selected chat
  useEffect(() => {
    if (!selectedChat) return;
    if (!selectedChat || !user) return;

    console.log(selectedChat);

    const q = query(
      collection(fsdb, "IndividualChats", selectedChat.id, "Messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgList: any[] = [];
      snapshot.forEach((doc) => {
        msgList.push({
          id: doc.id,
          ...doc.data(),
          isMe: doc.data().senderId === user.uid
        });
      });
      setMessages(msgList);
    });

    return () => unsubscribe();
  }, [selectedChat]);

  // ✅ Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const chatRef = doc(fsdb, "IndividualChats", selectedChat.id);

    await setDoc(
      chatRef,
      {
        lastMessage: newMessage,
        lastTimeStamp: serverTimestamp()
      },
      { merge: true }
    );

    await addDoc(collection(chatRef, "Messages"), {
      senderId: user.uid,
      textMessage: newMessage,
      timestamp: serverTimestamp()
    });

    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Friend Chats</h1>
        </div>
      </header>

      <div className="container mx-auto p-4 h-[calc(100vh-88px)]">
        <div className="grid lg:grid-cols-3 gap-6 h-full">

          {/* Sidebar */}
          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Chats</h2>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`p-4 rounded-lg cursor-pointer ${
                      selectedChat?.id === chat.id
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-secondary"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={chat.otherUser?.photoURL} />
                        <AvatarFallback>
                          {chat.otherUser?.displayName?.[0] ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium">
                          {chat.otherUser?.displayName}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.lastMessage}
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
            {selectedChat ? (
              <>
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.isMe ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-2xl ${
                            msg.isMe
                              ? "gradient-primary text-primary-foreground"
                              : "bg-secondary"
                          }`}
                        >
                          <p>{msg.textMessage}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="p-6 border-t flex gap-3">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSendMessage()
                    }
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <MessageCircle className="h-12 w-12 mb-4" />
              </div>
            )}
          </Card>

        </div>
      </div>
    </div>
  );
};

export default FriendChats;