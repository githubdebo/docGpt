import React, { useState, useEffect, useRef } from "react";
//import Image from "next/image";

const MessageItem = ({ message, pngFile, isLast }) => {
  const userImage = "/assets/images/user.png";
  const botImage = `/assets/images/bot.png`;
  const [showSources, setShowSources] = useState(false);

  return (
    <div className={`flex flex-col ${isLast ? "flex-grow" : ""}`}>
      <div
        className={`message-card p-4 flex mb-4 ${message.type === "user" ? "justify-end bg-gray-300" : "bg-gray-200"}`}
      >
        {message.type === "user" ? (
          <>
            <p className="user" style={{ maxWidth: "90%" }}>
              {message.text}
            </p>
            <div className="rounded ml-4 h-10 w-10 relative overflow-hidden">
              <img
                src={userImage}
                alt={`${message.type}'s profile`}
                width={32}
                height={32}
                className="rounded"
                priority
                unoptimized
              />
            </div>
          </>
        ) : (
          <>
            <div className="rounded mr-4 h-10 w-10 relative overflow-hidden">
              <img
                src={botImage}
                alt={`${message.type}'s profile`}
                width={32}
                height={32}
                className="rounded"
                priority
                unoptimized
              />
            </div>
            <p className="bot" style={{ maxWidth: "90%" }}>
              {message.text}
            </p>
          </>
        )}
      </div>

      {message.sourceDocuments && (
        <div className="mb-6">
          <button
            className="text-gray-600 text-sm font-bold"
            onClick={() => setShowSources(!showSources)}
          >
            Source Documents {showSources ? "(Hide)" : "(Show)"}
          </button>
          {showSources &&
            message.sourceDocuments.map((document, docIndex) => (
              <div key={docIndex}>
                <h3 className="text-gray-600 text-sm font-bold">
                  Source {docIndex + 1}:
                </h3>
                <p className="text-gray-800 text-sm mt-2">
                  {document.pageContent}
                </p>
                <pre className="text-xs text-gray-500 mt-2">
                  {JSON.stringify(document.metadata, null, 2)}
                </pre>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const ResultWithSources = ({ messages, pngFile, maxMsgs }) => {
  const messagesContainerRef = useRef();

  useEffect(() => {
    if (messagesContainerRef.current) {
      const element = messagesContainerRef.current;
      element.scrollTop = element.scrollHeight;
    }
  }, [messages]);

  // E.g. Before we reach the max messages, we should add the justify-end property, which pushes messages to the bottom
  const maxMsgToScroll = maxMsgs || 5;

  return (
    <div
      ref={messagesContainerRef}
      className={`mb-8 overflow-y-auto flex flex-col space-y-4 ${
        messages.length < maxMsgToScroll && "justify-end"
      } message-container`}
    >
      {messages &&
        messages.map((message, index) => (
          <MessageItem key={index} message={message} pngFile={pngFile} />
        ))}
    </div>
  );
};

export default ResultWithSources;
