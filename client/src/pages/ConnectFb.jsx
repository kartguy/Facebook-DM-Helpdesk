import axios from "axios";
import { useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export function ConnectFb() {
  const [pages, setPages] = useState(null);
  const [showPages, setShowPages] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const toggleButton = () => {
    setShowButton(false); // Update the state to hide the button
    setShowPages(false);
  };

  const overlayRef = useRef(null);
  const navigate = useNavigate();

  const connectPage = async () => {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/me/accounts`,
        {
          params: {
            access_token: import.meta.env.VITE_USER_ACCESS_TOKEN,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwtToken"),
          },
        }
      );

      const data = response.data;
      setPages(data.data);
    //   console.log(data.data);

      if (data.length === 0) {
        window.alert("No Pages Found.");
      } else {
        setShowPages(true);
      }
    } catch (error) {
      console.error(error);
      window.alert("Internal Server Error");
    }
  };

  const handleOverlayClick = (event) => {
    if (overlayRef.current && event.target === overlayRef.current) {
      setShowPages(false);
    }
  };

  const PageListPopup = () => {
    return (
      <div
        className="text-center"
        onClick={handleOverlayClick}
        ref={overlayRef}
      >
        <div className="page-popup">
          <p className="text-lg font-semibold">Pages Name</p>
          {pages ? (
            pages.map((i) => (
              <NavLink to={`/disconnect?name=${i.name}`} key={i.id}>
                <p className="text-sm">{i.name}</p>
              </NavLink>
            ))
          ) : (
            <p className="text1">Loading...</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-600">
      <div className="p-6 shadow-lg rounded-lg w-96 bg-white">
        <div className="text-center mb-6">
          <div>
            <h1 className="text-xl font-bold">Facebook Page Integration</h1>
          </div>
        </div>

        {showButton ? (
          <div className="p-2">
            <button
              className="bg-blue-600 w-full h-10 rounded-lg text-white text-sm"
              onClick={connectPage}
            >
              Connect Page
            </button>
          </div>
        ) : null}

        <div>{showPages && <PageListPopup />}</div>
      </div>
    </div>
  );
}
