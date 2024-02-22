import React, { useEffect, useState } from "react";
import CustomersList from "./CustomersList";
import Chats from "./Chats";
import { backendUrl } from "../../backendUrl";
import { useNavigate } from "react-router-dom";
// import inbox from "../../Assets/inbox.png";
// import logo from "../../Assets/logo.png";
// import people from "../../Assets/people.png";
// import stocks from "../../Assets/stocks.png";
// import minion from "../../Assets/SpaceMinion.png";
// import phone from "../../Assets/phone.png";
// import profile from "../../Assets/profile.png";
// import menu from "../../Assets/menu.jpeg";
// import refresh from "../../Assets/refresh.png";
// import "./agentScreen.css";

const AgentScreen = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [conversations, setConversations] = useState([]);
  const [pageName, setPageName] = useState("");
  const [ShowChat, setShowChat] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isNewMessage, setIsNewMessage] = useState(false);
  const [activeChatMessages, setActiveChatMessages] = useState([]);

  let custName = "";
  let custEmail = "";
  let custId = "";
  let lastStoredMessageTimestamp="";

  // checking that user is authenticated or not
//   const fetchUserData = async () => {
//     try {
//       const res = await fetch(`${backendUrl}/userdata`, {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           Authorization: localStorage.getItem("jwtToken"),
//         },
//         credentials: "include",
//       });

//       const data = await res.json();
//       console.log(`Logged in as ${data.name}`);
//     } catch (error) {
//       console.log(error);
//       navigate("/login");
//       window.alert("Internal Server Error");
//     }
//   };

  // fetching all the messages log and info from backend
  const fetchMessages = async () => {
    try {
      const res = await fetch(
        `https://graph.facebook.com/v19.0/${import.meta.env.VITE_PAGE_ID}/conversations?fields=participants,messages%7Bid,message,created_time,from%7D&access_token=${import.meta.env.VITE_USER_ACCESS_TOKEN}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwtToken"),
          },
        }
      );

      const data = await res.json();

      // getting the info from the data that we just got
      const conversationsData = [];
      data.data.forEach((chat) => {
        const participants = chat.participants.data;
        setPageName(participants[1].name);
        custEmail = participants[0].email;
        custName = participants[0].name;
        custId = participants[0].id;

        const conversationMessages = [];
        chat.messages.data.forEach((message) => {
          conversationMessages.push(message);
        });

        conversationsData.push({
          name: custName,
          email: custEmail,
          id: custId,
          messages: conversationMessages,
        });
      });

      setConversations(conversationsData);

      if (data.length === 0) {
        window.alert("No Pages Found.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // sending message to customer
  const sendMessage = async () => {
    try {
      const res = await fetch(
        `https://graph.facebook.com/v19.0/me/messages?access_token=${process.env.REACT_APP_PAGE_ACCESS_TOKEN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipient: {
              id: "7949585871722916",
            },
            message: {
              text: newMessage,
            },
          }),
        }
      );

      const data = await res.json();
      console.log("Message sent:", data);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // logic for send message button
  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      sendMessage();
    }
  };

  // opening clicked chat
  const handleViewChat = (email, name) => {
    const [firstName, ...lastNameArray] = name.split(" ");
    const lastName = lastNameArray.join(" ");

    setEmail(email);
    setFullName(name);
    setFname(firstName);
    setLname(lastName);
    setShowChat(true);
    checkIfNewMessage();

    conversations.map((conversation) => {
      if (conversation.email === Email && conversation.messages) {
        setActiveChatMessages(conversation);
      }
    });
    console.log(activeChatMessages);
  };

  // checking for the new messages
  const checkIfNewMessage = async () => {
    try {
      const res = await fetch(
        `${backendUrl}/lastStoredMessageTimestamp?custId=${activeChatMessages.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwtToken"),
          },
        }
      );
      const data = await res.json();

      lastStoredMessageTimestamp = Date.parse(data.timestamp);
      const currentMessageTimestamp = Date.parse(
        activeChatMessages.messages[0].created_time
      );

      if (currentMessageTimestamp > lastStoredMessageTimestamp) {
        setIsNewMessage(true);
        storeNewMessage();
      } else {
        setIsNewMessage(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // storing the new messages in the database
  const storeNewMessage = async () => {
    if (isNewMessage) {

      try {
        // Extracting new messages
        const newMessages = activeChatMessages.messages.filter((message) => {
          const messageTimestamp = Date.parse(message.created_time);
          return messageTimestamp > lastStoredMessageTimestamp;
        });

        // If there are new messages to store
        if (newMessages.length > 0) {
          const res = await fetch(`${backendUrl}/storeMessages`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              custId: activeChatMessages.id,
              custMsg: newMessages,
            }),
          });

          const data = await res.json();

        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    // fetchMessages();
    const intervalId = setInterval(() => fetchMessages(), 3000); // Poll every 3 seconds
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    fetchUserData();
  }, []);




// ------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
//   
// 
// 
// 
// -------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------



  
  return (
    <div className="container">
      <div class="first-column">
        <ul class="options">
          <li>
            <img
              src={logo}
              width="50px"
              height="50px"
              className="sidebar-logos"
            />
          </li>
          <li>
            <img
              src={inbox}
              width="50px"
              height="50px"
              className="sidebar-logos"
            />
          </li>
          <li>
            <img
              src={people}
              width="50px"
              height="50px"
              className="sidebar-logos"
            />
          </li>
          <li>
            <img
              src={stocks}
              width="50px"
              height="50px"
              className="sidebar-logos"
            />
          </li>
        </ul>

        <div class="agentDetails">
          <div class="profilePic">
            <img
              src={minion}
              width="70px"
              height="70px"
              alt="Profile Picture"
            />
          </div>
        </div>
      </div>

      <div className="second-column">
        <div className="top-bar">
          <div className="top-left">
            <img
              src={menu}
              width="70px"
              height="70px"
              alt="Menu Image"
              className="menu-img"
            />
            <span className="conversation">Conversation</span>
          </div>
          <img
            src={refresh}
            width="70px"
            height="70px"
            alt="Refresh Image"
            className="refresh-img"
            onClick={() => window.location.reload()}
          />
        </div>

        <div className="partition"></div>
        {conversations.map((i, index) => (
          <div
            key={index}
            className={index % 2 === 0 ? "grey-background" : "white-background"}
            onClick={() => handleViewChat(i.email, i.name)}
          >
            <CustomersList name={i.name} messages={i.messages} />
          </div>
        ))}
      </div>

      <div className="third-column">
        <div className="top-bar">
          <span className="chat-top">{fullName ? fullName : "Chat"}</span>
        </div>
        <div className="partition"></div>
        <div className="all-chats">
          {ShowChat &&
            conversations.map((conversation) => {
              if (conversation.email === Email && conversation.messages) {
                return conversation.messages
                  .slice()
                  .reverse()
                  .map((i) => <Chats msg={i} pageName={pageName} />);
              }
            })}
        </div>

        <div className="msg-typing-area">
          <input
            type="text"
            className="msg-typing-area-inside"
            placeholder={`Message ${fullName}`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <button className="send-button" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>

      <div className="forth-column">
        <div className="customer-profile-tab">
          <img
            src={minion}
            width="70px"
            height="70px"
            alt="Profile Picture"
            className="customer-picture"
          />

          <div className="customer-name">{fullName}</div>

          <div className="customer-status-tab">
            <div className="customer-status-offdot"></div>
            <div className="customer-status">Offline</div>
          </div>

          <div className="buttons">
            <button className="call-button">
              <img
                src={phone}
                width="25px"
                height="25px"
                alt="Call Image"
                className="call-profile-button"
              />
              Call
            </button>

            <button className="profile-button">
              <img
                src={profile}
                width="25px"
                height="25px"
                alt="Profile Image"
                className="call-profile-button"
              />
              Profile
            </button>
          </div>
        </div>

        <div className="partition"></div>

        <div className="customer-details">
          <div className="details-section">
            <div className="all-details">
              <div className="top-details-text">Customer Details</div>

              <div className="customer-email">
                <div className="email">Email</div>
                <div className="fetched-email">{Email}</div>
              </div>

              <div className="customer-fname">
                <div className="fname">First Name</div>
                <div className="fetched-fname">{fname}</div>
              </div>

              <div className="customer-lname">
                <div className="lname">Last Name</div>
                <div className="fetched-lname">{lname}</div>
              </div>

              <div className="view-more-details">View more details</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentScreen;