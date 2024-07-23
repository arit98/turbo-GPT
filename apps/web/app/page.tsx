"use client";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface ChatMessageProps {
  message: string;
  type: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, type }) => {
  return (
    <div
      className={`flex w-full ${type === "send" ? "justify-end" : "justify-start"} md:p-5 p-3`}
    >
      {type === "send" ? (
        <div className="bg-gray-900 py-2 px-6 rounded-b-xl rounded-tl-xl text-xl text-gray-200">
          {message}
        </div>
      ) : (
        <div className="bg-gray-300 py-2 px-6 rounded-b-xl rounded-tr-xl text-xl text-gray-900">
          {message.replaceAll("###", "😀")}
        </div>
      )}
    </div>
  );
};

interface Message {
  message: string;
  type: string;
}

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    newSocket.on("response", (message) => {
      console.log("Received response:", message);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "receive",
          message,
        },
      ]);
      setLoading(false);
    });

    console.log(socket);

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim() === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: "send",
        message: inputMessage,
      },
    ]);
    socket?.emit("message", inputMessage);
    setInputMessage("");
    setLoading(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    adjustTextAreaHeight(e.target);
  };

  const adjustTextAreaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className="w-full h-screen">
      <div className="w-full h-[90%] overflow-y-scroll">
        {messages.length === 0 ? (
          <div className="w-full flex items-center justify-center h-full flex-col">
            <h1 className="md:text-5xl text-4xl font-semibold bg-gradient-to-r from-blue-500 via-red-500 to-yellow-400 inline-block text-transparent bg-clip-text">Hi I'm Turbo-GPT</h1>
            <p className="md:text-2xl text-lg font-semibold text-gray-50">
              How can I help you today?
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <ChatMessage key={index} type={msg.type} message={msg.message} />
          ))
        )}
        {loading && (
          <div className="flex justify-center items-center max-h-full">
            <div className="flex justify-center items-center h-48">
              <div className="w-5 h-5 bg-transparent border-2 shadow-inner shadow-gray-300 rounded-full mx-2 animate-bounce animation-delay-300"></div>
              <div className="w-6 h-6 bg-transparent border-2 shadow-inner shadow-gray-300 rounded-full mx-2 animate-bounce"></div>
              <div className="w-7 h-7 bg-transparent border-2 shadow-inner shadow-gray-300 rounded-full mx-2 animate-bounce animation-delay-100"></div>
            </div>
          </div>
        )}
      </div>
      <div className="w-full md:h-[7%] h-[5%] flex items-center justify-center">
        <textarea
          ref={textareaRef}
          onKeyDown={handleKeyDown}
          value={inputMessage}
          onChange={handleChange}
          className="md:w-1/2 w-[90%] p-4 rounded-full bg-gray-300 outline-none  border-transparent text-gray-900 placeholder:text-gray-700 resize-none overflow-hidden text-xl"
          placeholder="Type something..."
          rows={1}
        />
      </div>
    </div>
  );
}
