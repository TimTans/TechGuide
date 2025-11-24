//This file will check if there are some errors when loading the website on the client side

export function installErrorReporter(){
    console.log("Error reporter installed");
    const send = (type,data) => {
        console.log("Sending error to /api/client-error:", {type, data});
        fetch("/api/client-error",{
            method:"POST",
            headers: {"Content-Type":"application/json"},
            keepalive: true,
            body:JSON.stringify({
                type,
                data,
                timestamp: new Date().toISOString(),
            }),
        }).catch((err) =>{
            console.log("Error sending to /api/client-error:",err);
        });
    };
    
    //makes it possible to print the error and store it in reports
    window.addEventListener("error", (event)=>{
        send("error",{
            message:event.message,
            stack: event.error?.stack,
            filename: event.filename,
            line: event.lineno,
            col: event.colno,
        });
    });

    window.addEventListener("unhandledrejection", (event)=>{
        send("unhandledrejection",{
            reason: event.reason?.message || String(event.reason),
            stack: event.reason?.stack,
        });
    });
}