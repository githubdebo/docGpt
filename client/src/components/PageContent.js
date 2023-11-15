import React,{useState} from 'react'
import Title from './Title'
import TwoColumnLayout from './TwoColumnLayout'
import PageHeader from './PageHeader'
import ButtonContainer from './ButtonContainer'
import Button from './Button'
import ResultWithSources from './ResultWithSources'
import PromptBox from './PromptBox'
//import handleApiRequest from '../api/api'
import "../global.css"
import Alert from './Alert'

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
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isUploadDisabled, setIsUploadDisabled] = useState(true);
  const [isPromptDisabled, setIsPromptDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // This function updates the prompt value when the user types in the prompt box
  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setIsUploadDisabled(false);
  };

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
          setIsFileUploaded(true)
          setIsUploadDisabled(true)
          setIsPromptDisabled(false);
          setIsLoading(false);
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

      // Push the response into the messages array
      // setMessages((prevMessages) => [
      //   ...prevMessages,
      //   {
      //     text: searchRes.result.text,
      //     type: "bot",
      //     sourceDocuments: searchRes.result.sourceDocuments
      //   },
      // ]);

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

  const handleClose = () => {
    setIsFileUploaded(false);
  }

  // The component returns a two column layout with various child components
  return (
    <>
    {isLoading?
      (<div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-gray-100 backdrop-blur-md opacity-80">
      <div className="flex items-center mb-4">
        <div className="dot animate-dot1"></div>
        <div className="dot animate-dot2"></div>
        <div className="dot animate-dot3"></div>
      </div>
      <p className="text-gray-600">Uploading file</p>
    </div>):
      (
    <div>
      <TwoColumnLayout
        leftChildren={
          <>
          {isFileUploaded && <Alert onClose={handleClose}></Alert>}
            <PageHeader
              heading="Talk To Doc"
              //boldText="How to get rich? How to be happy?"
              description="This tool will
            let you ask anything contained in a document."
            />
            <ButtonContainer>
            <input type="file" className="bg-white text-gray-800 font-bold rounded border-b-2   hover:bg-green-600 hover:text-white shadow-md py-2 px-6 inline-flex items-center" onChange={handleFileChange} />
              <Button
                handleSubmit={handleUpload}
                endpoint="pdf-upload"
                buttonText="Upload 📚"
                disabled={isUploadDisabled}
              />
            </ButtonContainer>
          </>
        }
        rightChildren={
          <>
            <ResultWithSources messages={messages} pngFile="pdf"/>
            <PromptBox
              prompt={prompt}
              handlePromptChange={handlePromptChange}
              handleSubmit={() => handleSubmitPrompt("/pdf-query")}
              // handleSubmit={() => handleSubmitQuery("/pdfquery-agent")}
              placeHolderText={"Please enter your question..."}
              error={error}
              isDisabled = {isPromptDisabled}
            />
          </>
        }
      />
    </div>
    )
    }
    </>
  )
}
