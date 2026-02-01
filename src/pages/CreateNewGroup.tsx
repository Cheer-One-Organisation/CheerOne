import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus,Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dropdown } from "react-day-picker";
import { ScrollArea } from "@radix-ui/react-scroll-area";





const CreateNewGroup =()=>{
    const navigate = useNavigate();


    return(
        <section>
            <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <section className="container mx-auto px-4 py-4">
          <section className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/group-chats")}
              className="transition-smooth"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Create New Group</h1>
            
          </section>
        </section>
      </header>


       <Card className="p-6 shadow-card mt-5 m-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Group Name</h2>
              <Input placeholder="Group 1" />

            </div>
            </div>
        </Card>

        

      
            















      {/* End of section */}
        </section>

    );

};

export default CreateNewGroup;