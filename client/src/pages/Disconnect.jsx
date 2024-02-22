import axios from "axios";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { backendUrl } from "../backendURL";

export function DisconnectPage(){
  const navigate=useNavigate();
  const [searchParams]=useSearchParams();
  const name=searchParams.get("name");

    return(
        <div className="flex items-center justify-center min-h-screen bg-blue-600">
      <div className="p-6 shadow-lg rounded-lg w-96 bg-white">
        <div className="text-center mb-6">
          <div>
            <h1 className="text-xl font-bold">Facebook Page Integration</h1>
          </div>

          <div>
            <h1 className="text-lg font-light">Integrated Page: {name}</h1>
          </div>
        </div>

        

        <div className="p-2">
            <div>
            <button
                className="bg-red-500 w-full h-10 rounded-lg text-white text-sm"
                onClick={async () => {
                try {
                    navigate('/connectFb')
                } catch (error) {
                    
                }
                }}
                >Delete Integration</button>
            </div>
          
          <div className="mt-2">
            <button
                className="bg-blue-600 w-full h-10 rounded-lg text-white text-sm"
                onClick={async () => {
                try {
                    navigate('/chat-screen')
                } catch (error) {
                    
                }
                }}
            >Reply To Messages</button>
          </div>

        </div>
      </div>
    </div>
    )
}