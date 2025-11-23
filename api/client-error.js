import fs from "fs";
import path from "path";
//this code will create a message in the terminal 
export default async function handler(req,res){
    if(req.method !== "POST"){
        return res.status(405).json({error: "Not Allowed"});
    }
    const body= req.body;

    console.error("Alert Client Error - Must Review:", body);
    //let's record these client side errors in the reports folder.
    const clientreport = path.join(process.cwd(),"reports");
    if(!fs.existsSync(clientreport)){
        fs.mkdirSync(reportsDir);
    }
    const filepath = path.join(clientreport,"client-errors.json");
    const EN= JSON.stringify(body) + ","+"\n";
    fs.appendFileSync(filepath, EN);
    //Add an email alert

    return res.status(200).json({ok: true});
}
/*
 This code is used to test the client error checker
 To use it: place it inside App.jsx. It will cause an in house error (error within our code) and then cause an javascript error.

 
import { useEffect } from "react";
function Home(){
    useEffect(()=>{
        setTimeout(()=>{
            throw new Error("Test app crash fromt Home Component");
        },1000);
    }, []);
    return <div>Home page</div>;
} 
export default Home;
*/ 