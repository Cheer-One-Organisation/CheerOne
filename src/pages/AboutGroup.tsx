import { useNavigate } from "react-router-dom";
import react from "react";
import { Button } from "@/components/ui/button";

// Code will go here. This is to check the about of a group - it's members, description
const AboutGroup=()=>{
    const navigate = useNavigate();




    return(
        <section>
            <Button onClick={()=>navigate("/group-chats")}> Back</Button>

        </section>

    );


};

export default AboutGroup;