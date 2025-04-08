import chefPng from "/src/assets/Chef Claude Icon.png";
import "/src/App.css";
export default function Header(){
   return (
      <div className="header">
         <img src={chefPng} alt="head icon" width={60} />
         <h1>Chef DeepSeek</h1>
      </div>
   )
}