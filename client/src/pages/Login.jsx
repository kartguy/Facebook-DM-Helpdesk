import { Input } from "../components/Input";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../backendURL";

export function Login() {
  const [email, setEmail] = useState();
  const [pass, setPass] = useState();
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-600">
      <div className="p-6 shadow-lg rounded-lg w-96 bg-white">
        <div className="text-center mb-6">
          <div>
            <h1 className="text-xl font-bold">Login to your account</h1>
          </div>
        </div>

        <div className="text-sm">
          <Input
            type="email"
            place="abc@gmail.com"
            name="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Input
            type="password"
            name="Password"
            onChange={(e) => {
              setPass(e.target.value);
            }}
          />

          <div className="flex my-4 pl-2">
            <div className="">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
            </div>

            <div className="pl-3 ml-2 text-gray-700 text-sm">
              <h1>Remember Me</h1>
            </div>
          </div>
        </div>

        <div className="p-2">
          <button
            className="bg-blue-600 w-full h-10 rounded-lg text-white text-sm"
            onClick={async () => {
              try {
                const response = await axios.post(`${backendUrl}/api/login`, {
                  email: email,
                  password: pass,
                });

                console.log(response.data.msg);
                const token = response.data.jwtToken;
                localStorage.setItem("jwtToken", token);

                navigate('/connectFb');
                setTimeout(() => {
                  alert(response.data.message);
                }, 100);
              } catch (error) {
                console.log(error.response.data);
                alert("Incorrect Email or password");
              }
            }}
          >
            Login
          </button>
        </div>

        <div className="text-center text-sm font-semibold">
          <h1>New to my app? <a className="underline text-sm" href="/">
            Sign up
          </a></h1>
        </div>
      </div>
    </div>
  );
}
