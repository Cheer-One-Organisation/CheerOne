import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import CreateNewGroup from "./pages/CreateNewGroup";
import AboutGroup from "./pages/AboutGroup";
import GroupChats from "./pages/GroupChats";
import LocationFinder from "./pages/LocationFinder";
import PublicGroups from "./pages/PublicGroups";
import NotFound from "./pages/NotFound";
import FriendChats from "./pages/FriendChats";
import AboutContact from "./pages/AboutContact";
import CreateContact from "./pages/CreateContact";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path= "/" element={<SignIn/>}/>
          <Route path="/group-chats" element={<GroupChats />} />
          <Route path="/location-finder" element={<LocationFinder />} />
          <Route path="/public-groups" element={<PublicGroups />} />
          <Route path="/create-new-group" element={<CreateNewGroup/>}/>
          <Route path="/friend-chats" element = {<FriendChats/>}/>
          <Route path="/about-group" element={<AboutGroup/>}/>
          <Route path="/about-contact" element={<AboutContact/>}/>
          <Route path="/create-contact" element={<CreateContact/>}/>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
