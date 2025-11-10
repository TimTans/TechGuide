//Lets you run shell commands
import {execSync} from "node:child_process";
//Lets you create file or folder and write into that file/folder
import { mkdirSync, writeFileSync} from "node:fs";
import {join} from "node:path";

const folder_name = "reports";
//We will store all reports in the reports folder
mkdirSync(folder_name, {recursive: true});
//the block of code below will name the file of the reports by date
const now = () => new Date().toISOString().replace("/[:.]g", "-");
const out = (name) => join(folder_name, `${now()}-${name}`);
//Will allow use to run commands 
function run(commands, outputss={}){
    return execSync(commands, {stdio: "pipe", encoding: "utf8", ...outputss});
}
//Will tell use how many errors appear in the text
function count(str,pattern){
    const re= new RegExp(pattern, "gi");
    return (str.match(re)|| []).length;
}
//Now to record the time of compile and its build logs
console.log("Builds and Time Recorded");
const timebefore= performance.now();
let space ="";
      //new
//spawn is basically allowing you to run a new process in the project itself.
//completely separate from your project although it is within your project.
//Since it is a separate "entity" from your project, it is like two projects, but second is within your first project.
//The better word is "program" so having two separate programs where the is parent=first progarm and the child=second program
try{
    space = execSync("npm run build", {encoding: "utf8"});
} catch (e){
    //Get output no matter what
    const outputss = e.stdout?.toString() ?? "";
    const errorss = e.stderr?.toString() ?? "";
    space = outputss + errorss;
}
const timeafter =performance.now();
const compile_time= Math.round(timeafter - timebefore);
//counts all the errors and warnings
const build_Errors= count(space, "\\berror\\b|\\bERR!\\b|failed");
const build_warnings = count(space, "\\bwarn\\b|deprecated");
writeFileSync(out("build.log"),space,"utf8");
writeFileSync(
    out("build_summary.json"),
    JSON.stringify({compile_time, build_Errors,build_warnings}, null, 2),"utf8"
);
console.log(`Build Time in ${compile_time} ms [Errors Detected: ${build_Errors}, Warnings Detected: ${build_warnings}]`);
console.log (" Reports Saved ");