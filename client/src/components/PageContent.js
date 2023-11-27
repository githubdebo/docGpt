import React,{useState} from 'react'
import Title from './Title'
import Layout from './Layout'
import PageHeader from './PageHeader'
import ButtonContainer from './ButtonContainer'
import Button from './Button'
import ResultWithSources from './ResultWithSources'
import PromptBox from './PromptBox'
import "../global.css"
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


export const PageContent = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Hi, What would you like to know?",
      type: "bot",
    },
  ]);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploadDisabled, setIsUploadDisabled] = useState(true);
  const [isPromptDisabled, setIsPromptDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadFileName, setUploadFileName] = useState("");
  const [isUploadCompleted, setIsUploadCompleted] = useState(false);
  const attachment = '/assets/images/selectfile.png';
  const fileUpload = '/assets/images/uploadfile.png';


  // This function updates the prompt value when the user types in the prompt box
  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const clickFileUpload= (e) => {
    document.getElementById('file-upload').click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    let filePath=(event.target.value).split('\\');

    if (file && file.type === "application/pdf") {
      setUploadFileName(filePath[filePath.length-1]);
      setSelectedFile(file);
      setIsUploadDisabled(false);
    } else {
      setIsUploadDisabled(true);
      toast.info("Please upload a PDF file. Other file types are not supported.", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  function showSuccessNotification() {
    console.log("Toastr");
    toast.success("File uploaded successfully!", {
      position: toast.POSITION.TOP_CENTER,
    });
  }

  // This function handles the submission of the form when the user hits 'Enter' or 'Submit'
  // It sends a GET request to the provided endpoint with the current prompt as the query
  const handleUpload = async (endpoint) => {
    setIsLoading(true);
    if(selectedFile){
      setIsUploadDisabled(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      try {
        console.log(`sending ${prompt}`);
        console.log(`using ${endpoint}`);
  
        // // A POST request is sent to the backend
        let body = {
          method: "POST",
          body: formData,
        }
        const response = await fetch(`/api/${endpoint}`, body).then((response)=>{
          showSuccessNotification();
          setIsUploadDisabled(true)
          setIsPromptDisabled(false);
          setIsLoading(false);
          setIsUploadCompleted(true);
        });
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
    }
  };

  // This function handles the submission of the user's prompt when the user hits 'Enter' or 'Submit'
  // It sends a POST request to the provided endpoint with the current prompt in the request body
  const handleSubmitPrompt = async (endpoint) => {
    try {
      setPrompt("");
      // Push the user's message into the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: prompt, type: "user", sourceDocuments: null },
      ]);

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "typing...", type: "bot", sourceDocuments: null, isTyping: true },
      ]);

      // A POST request is sent to the backend with the current prompt in the request body
      const response = await fetch(`/api/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: prompt }),
      });

      // Throw an error if the HTTP status is not OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the response from the backend as JSON
      const searchRes = await response.json();

      console.log({ searchRes });

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const typingMessageIndex = updatedMessages.findIndex(
          (message) => message.isTyping
        );
  
        if (typingMessageIndex !== -1) {
          updatedMessages[typingMessageIndex] = {
            text: searchRes.result.text,
            type: "bot",
            sourceDocuments: searchRes.result.sourceDocuments,
          };
        }
  
        return updatedMessages;
      });

      setError(""); // Clear any existing error messages
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  // The component returns a two column layout with various child components
  return (
    <>
      <div>
        <Layout
          headerChildren={
            <>
              <ToastContainer />
              <PageHeader
                heading="Talk To Doc"
                //boldText="How to get rich? How to be happy?"
                description="This tool will let you ask anything contained in a document."
              />
              <ButtonContainer>
                {isUploadDisabled && (
                  <label
                    htmlFor="file-upload"
                    className="text-white"
                    style={{ fontSize: "14px", fontWeight: "bold", cursor:"pointer" }}
                  >
                    Select a file
                  </label>
                )}
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <img
                  src={attachment}
                  width={32}
                  height={32}
                  className="rounded cursor-pointer hover:bg-gray-400 border-b-10"
                  priority
                  unoptimized
                  onClick={() => {
                    clickFileUpload();
                  }}
                />
                <span
                  style={{
                    marginLeft: `${isUploadCompleted ? "10px" : ""}`,
                    border: `${uploadFileName !== "" ? "1px solid white" : ""}`,
                    borderRadius: "3px",
                    padding: "3px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {uploadFileName}
                </span>

                {!isUploadDisabled && (
                  <Button
                    handleSubmit={handleUpload}
                    endpoint="pdf-upload"
                    buttonText={
                      <>
                        {"Upload"}
                        <img
                          className="icon-image"
                          src={
                            process.env.PUBLIC_URL +
                            "/assets/images/uploadfile.png"
                          }
                          alt="Upload Icon"
                          style={{
                            marginLeft: "5px",
                            height: "20px",
                            width: "20px",
                          }}
                        />
                      </>
                    }
                  />
                )}
              </ButtonContainer>
            </>
          }
          contentChildren={
            <>
              <ResultWithSources messages={messages} pngFile="pdf" />
              <PromptBox
                prompt={prompt}
                handlePromptChange={handlePromptChange}
                handleSubmit={() => handleSubmitPrompt("/pdf-query")}
                placeHolderText={"Please enter your question..."}
                error={error}
                isDisabled={isPromptDisabled}
              />
            </>
          }
        />

        {isLoading && (
          <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-gray-100 backdrop-blur-md opacity-80">
            <div className="flex items-center mb-4">
              <div className="dot animate-dot1"></div>
              <div className="dot animate-dot2"></div>
              <div className="dot animate-dot3"></div>
            </div>
            <p className="text-gray-600">Uploading file...</p>
          </div>
        )}
      </div>
    </>
  );
}
