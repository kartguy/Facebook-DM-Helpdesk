import { Input } from "../components/Input";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import{backendUrl} from "../backendURL"

export function Signup() {
  const [fName, setFname] = useState();
  const [email, setEmail] = useState();
  const [pass, setPass] = useState();
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-600">
      <div className="p-6 shadow-lg rounded-lg w-96 bg-white">
        <div className="text-center mb-6">
          <div>
            <h1 className="text-xl font-bold">Create Account</h1>
          </div>
        </div>

        <div className="text-sm">
          <Input
            type="text"
            name="Name"
            onChange={(e) => {
              setFname(e.target.value);
            }}
          />

          <Input
            type="email"
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

          <div className="p-2">
            <button
              className="bg-blue-600 w-full h-10 rounded-lg text-white text-md"
              onClick={async () => {
                try {
                  const response = await axios.post(`${backendUrl}/api/signup`, {
                    fullName: fName,
                    email: email,
                    password: pass,
                  });

                  const token = response.data.jwtToken;

                  localStorage.setItem("jwtToken", token);

                  navigate('/login');
                  setTimeout(() => {
                    alert(response.data.msg);
                  }, 100);
                } catch (error) {
                  console.log(error.response.data);
                  alert("Wrong Inputs");
                }
              }}
            >
              Sign up
            </button>
          </div>

          <div className="text-center text-md font-semibold">
            <h1>
              Already have an account?
              <a className="underline text-md" href="/login">
                Login
              </a>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
