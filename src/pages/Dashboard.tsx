import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, MapPin, Users, Bell, ArrowLeft, Menu, UserCogIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroBanner from "@/assets/hero-banner.jpg";
import { getDocs, collection, doc,setDoc,GeoPoint } from "firebase/firestore"
import { fsdb, auth } from "../../firebase/firebase.js";
const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const usercollectionref = collection(fsdb, "User");
 const user = auth.currentUser;
;
  const [userfildata, setuserfildata] = useState([]);
  const [curruserdata, setcurruserdata] = useState(null);
  const [currentping ,setcurrentping]=useState({});
  console.log(currentping);
  const signOut = () => {
    navigate("/");
  };

  const features = [
    {
      icon: MessageCircle,
      title: "Group Chats",
      description: "Connect with your groups and stay in touch",
      path: "/group-chats",
      gradient: "gradient-primary",
    },
    {
      icon: MapPin,
      title: "Find Friends",
      description: "Locate friends nearby and send location pings",
      path: "/location-finder",
      gradient: "gradient-accent",
    },
    {
      icon: Users,
      title: "Public Groups",
      description: "Discover and join communities",
      path: "/public-groups",
      gradient: "gradient-hero",
    },
  ];

  const getusers = async () => {
    try {
      const data = await getDocs(usercollectionref);
      const filtdata = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      console.log(filtdata);
      setuserfildata(filtdata);

    } catch (err) {
      console.error(err);
    }

  };
  const finduserdata = () => {
    if (user) {
      console.log(user.uid);
      console.log(user.email);
      console.log(user.displayName);
      userfildata.map(
        (doc) => {
          if (doc.userid == user.uid) {
            setcurruserdata(doc);
          }
        });
    }
    else {
      console.log("there is no user");
    }
  };
  const adduser = async () => {
    try {
      
      navigator.geolocation.getCurrentPosition(async (pos) => {
      console.log(pos.coords.latitude, pos.coords.longitude);
      setcurrentping({lat:pos.coords.latitude, long:pos.coords.longitude});
      
      localStorage.setItem("currentping",JSON.stringify({lat:pos.coords.latitude, long:pos.coords.longitude}));
       const adata = {
        displayName: user.displayName,
        email: user.email,
        lastping: new GeoPoint(pos.coords.latitude,pos.coords.longitude),
        userid: user.uid,
        locationlive:true
      };
     await setDoc(doc(fsdb,"User",user.uid), adata,{merge:true});

      });
     

      getusers();
      finduserdata();

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user) return;

    
    getusers();
    finduserdata();

    if (!curruserdata) {

      adduser();
      console.log(curruserdata);

    }
  }, []);




  return (
    <div className="min-h-screen bg-background flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col transition-all">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            {/* Notifications Button */}
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </Button>

            {/* Sidebar Toggle */}
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-4 py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Cheer One
                  <span className="gradient-hero bg-clip-text text-transparent block">
                    Moments Together
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground">
                  Stay connected with friends through group chats, share locations, and discover new communities.
                </p>
                <div className="flex gap-4">
                  <Button
                    onClick={() => navigate("/group-chats")}
                    size="lg"
                    className="gradient-primary text-primary-foreground shadow-glow transition-bounce hover:scale-105"
                  >
                    Continue Chatting
                  </Button>
                  <Button
                    onClick={() => navigate("/location-finder")}
                    variant="outline"
                    size="lg"
                    className="transition-bounce hover:scale-105"
                  >
                    Find Friends
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img
                  src={heroBanner}
                  alt="People connecting through Cheer One"
                  className="rounded-2xl shadow-card w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold mb-4">Everything you need to stay connected</h3>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                From private group conversations to discovering new communities, Cheer One has all the tools you need.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="p-8 cursor-pointer transition-bounce hover:scale-105 shadow-card hover:shadow-soft"
                  onClick={() => navigate(feature.path)}
                >
                  <div
                    className={`w-16 h-16 rounded-xl ${feature.gradient} flex items-center justify-center mb-6 shadow-glow`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
                  <p className="text-muted-foreground mb-6">{feature.description}</p>
                  <Button variant="outline" className="w-full transition-smooth">
                    View Chats
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Right Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-card shadow-lg z-40 transform transition-transform opacity-95 ${sidebarOpen ? "translate-x-0" : "translate-x-full"
          } flex flex-col justify-between`}
      >
        {/* Sidebar Header with Close Button */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Cheer One</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </Button>
        </div>

        <div className="p-6 space-y-3 flex-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/about")}
          >
            About
          </Button>

          <Button variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/my-profile")}>
            View and edit my profile

          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/group-chats")}
          >
            Group Chats
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/public-groups")}
          >
            Public Groups
          </Button>
        </div>

        <div className="p-6">
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={signOut}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

    </div>
  );
};

export default Dashboard;
