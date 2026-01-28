import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {ArrowLeft, PersonStandingIcon, PlusIcon, PlusSquareIcon} from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {Avatar,AvatarFallback} from "@/components/ui/avatar";

const CreateGroupChat =()=>{

    const navigate = useNavigate();

    const members = [
       {id:1, name: "Anthea", avatar:"A"},
       {id:2, name: "Slavi",avatar:"A"},
       {id:3, name: "Rougette",avatar:"A"}
    ]

    const tagOptions=[
        "adventure",
        "art",
        "baking",
        "bowling",
        "celebrity",
        "ziggy stardust"
    ]



    return(<div className = "min-h-screen bg-background">

        {/*Header*/}
        <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
       <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/group-chats")}
              className="transition-smooth"
            >
              <ArrowLeft className="h-4 w-4" /> 
            </Button>
            <h1 className = "text-xl font-semibold">Create Group</h1>
            </div>
            </div>
        </header>
        
        <Card className = "m-5 shadow-card">

        
          <div className="text-center p-8">
            <h3 className="text-3xl font-bold mb-4">Everything you need to stay connected</h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From private group conversations to discovering new communities, Cheer One has all the tools you need.
            </p>
        
        <form>
            <label>Group Name: </label><input
                type="text"
			    id="name"
				name="name"
				placeholder="Enter event name">
            
            </input>

            <label>Tags: </label>
            <DropdownMenu>
              

            </DropdownMenu>

           

            {members.map((member)=>(
              <div>
              <Avatar>
                <div>
                  <AvatarFallback>
                    <p>{member.avatar}</p>
                  </AvatarFallback> 
                </div>
                </Avatar>

                <div>  <p>{member.name}</p></div>
                </div>
                
            )

            )}



        </form>
        </div>
            
        </Card>
       
        
        <Button className = "ml-10"><PlusIcon/>Create Group</Button>
          



    </div>
    );
};

export default CreateGroupChat;