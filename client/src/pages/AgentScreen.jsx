import React, { useEffect, useState } from "react";
import { backendUrl } from "../backendURL";
import { useNavigate } from "react-router-dom";
import { ChatList } from "../components/ChatList";
import { Chat } from "../components/Chat";
import mailbox from "../assets/mailbox.png";
import user from "../assets/user.png";
import people from "../assets/people.png"
import rising from "../assets/rising.png"
import burger from "../assets/burger.jpeg"
import reload from "../assets/reload.png"
import phone from "../assets/phone.png"
import share from "../assets/share.png"
import "./AgentScreen/final.css";

export function AgentScreen () {
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



  const fetchMessages = async () => {
    try {
      const res = await fetch(
        `https://graph.facebook.com/v19.0/${import.meta.env.VITE_PAGE_ID}/conversations?fields=participants,messages%7Bid,message,created_time,from%7D&access_token=${import.meta.env.VITE_PAGE_ACCESS_TOKEN}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwtToken"),
          },
        }
      );

      const data = await res.json();
    

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

  
  const sendMessage = async () => {
    try {
      const res = await fetch(
        `https://graph.facebook.com/v19.0/${import.meta.env.VITE_PAGE_ID}/messages?access_token=${import.meta.env.VITE_PAGE_ACCESS_TOKEN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipient: {
              id: "7278206338892253",
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

  
  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      sendMessage();
    }
  };

  
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

 
  const checkIfNewMessage = async () => {
    try {
      const res = await fetch(
        `${backendUrl}/api/lastStoredMessageTimestamp?custId=${activeChatMessages.id}`,
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
     
    }
  };

  
  const storeNewMessage = async () => {
    if (isNewMessage) {

      try {
        
        const newMessages = activeChatMessages.messages.filter((message) => {
          const messageTimestamp = Date.parse(message.created_time);
          return messageTimestamp > lastStoredMessageTimestamp;
        });

        
        if (newMessages.length > 0) {
          const res = await fetch(`${backendUrl}/api/storeMessages`, {
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
    
    const intervalId = setInterval(() => fetchMessages(), 3000); // Poll every 3 seconds
    return () => clearInterval(intervalId);
  }, []);

  
  return (
    <div className="container">
      <div className="first-column">
        <ul className="options">
          <li>
            <img
              src={share}
              width="50px"
              height="50px"
              className="sidebar-logos"
            />
          </li>
          <li>
            <img
              src={mailbox}
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
              src={rising}
              width="50px"
              height="50px"
              className="sidebar-logos"
            />
          </li>
        </ul>

        <div className="agentDetails">
          <div className="profilePic">
            <img
              src={user}
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
              src={burger}
              width="70px"
              height="70px"
              alt="Menu Image"
              className="menu-img"
            />
            <span className="conversation">Conversation</span>
          </div>
          <img
            src={reload}
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
            <ChatList name={i.name} messages={i.messages} />
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
                  .map((i) => <Chat msg={i} pageName={pageName} />);
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
            src={user}  
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
                src={user}
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