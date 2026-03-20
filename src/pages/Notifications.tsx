import { useEffect, useState } from "react";
import { ArrowLeft, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot, doc, updateDoc, orderBy, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { fsdb } from "../../firebase/firebase";

interface Notification {
    id: string;
    userId: string;
    message: string;
    groupId?: string;
    groupCollection?: string;
    read: boolean;
    createdAt: any;
}

const Notifications = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const user = auth.currentUser;

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(fsdb, "Notifications"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const notifList = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...(docSnap.data() as Omit<Notification, "id">),
            }));

            setNotifications(notifList);
            setLoading(false);
        });

        return () => unsub();
    }, [user]);

    const markAsRead = async (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        const ref = doc(fsdb, "Notifications", id);
        await updateDoc(ref, { read: true });
    };

    const markAllAsRead = async () => {
        if (!user) return;
        const q = query(
            collection(fsdb, "Notifications"),
            where("userId", "==", user.uid),
            where("read", "==", false)
        );
        const snap = await getDocs(q);
        snap.forEach(async (docSnap) => {
            await updateDoc(doc(fsdb, "Notifications", docSnap.id), { read: true });
        });
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const goToChat = (n: Notification) => {
        if (!n.groupId) return;
        navigate("/group-chats")
    };

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-lg font-semibold">Notifications</h1>
                    <div className="ml-auto">
                        <Button size="sm" variant="outline" onClick={markAllAsRead}>
                            Mark All Read
                        </Button>
                    </div>
                </div>
            </header>
            <div className="container mx-auto p-4">
                <Card className="p-6 shadow-card">
                    <div className="flex items-center gap-3 mb-4">
                        <Bell className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold">Your Notifications</h2>
                    </div>
                    <ScrollArea className="h-[500px] pr-2">
                        <div className="space-y-3">
                            {loading && (
                                <p className="text-center text-muted-foreground py-10">Loading...</p>
                            )}
                            {!loading && notifications.length === 0 && (
                                <p className="text-center text-muted-foreground py-10">
                                    No notifications yet
                                </p>
                            )}
                            {notifications.map((n) => (
                                <Card
                                    key={n.id}
                                    className={`p-4 flex flex-col gap-3 transition-all ${!n.read ? "border-primary bg-primary/5" : "border-muted-foreground bg-card"
                                        }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm">{n.message}</p>
                                        {!n.read && <Badge className="bg-primary text-white">New</Badge>}
                                    </div>

                                    <div className="flex gap-2 flex-wrap">
                                        {n.groupId && (
                                            <Button size="sm" onClick={() => goToChat(n)}>
                                                Go to Chat
                                            </Button>
                                        )}
                                        {!n.read && (
                                            <Button size="sm" variant="outline" onClick={() => markAsRead(n.id)}>
                                                Mark as Read
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </Card>
            </div>
        </div>
    );
};

export default Notifications;