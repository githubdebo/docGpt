// server/index.js

import { PineconeClient } from "@pinecone-database/pinecone";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import express from 'express';
import {config} from 'dotenv';
import {createRequire} from 'module';
import bodyParser from 'body-parser';
import cors from 'cors';
import { OpenAI } from "langchain";
import {VectorDBQAChain} from "langchain/chains";
import multer from "multer";
import path from "path";

const require = createRequire(import.meta.url);
config();

const PORT = process.env.PORT || 3001;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'server/documents/'); // specify the directory where you want to save the files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('server/documents', express.static(path.join('server/', 'documents')));

app.post("/api/pdf-upload", upload.single("file"), async (req, res) => {
  if (req.file) {
    console.log("File", req.file);

    //Load Document
    const loader = new PDFLoader(
      path.join("server/documents/", req.file.originalname)
    );
    const docs = await loader.load();
    console.log("Docs", docs);

    if (docs.length === 0) {
      console.log("No Docs Found");
      return;
    }

    const splitter = new CharacterTextSplitter({
      separator: " ",
      chunkSize: 250,
      chunkOverlap: 10,
    });
    const splitDocs = await splitter.splitDocuments(docs);

    //Reduce the size of the metadata
    const reduceDocs = splitDocs.map((doc) => {
      const reducedMetaData = { ...doc.metadata };
      delete reducedMetaData.pdf;
      return new Document({
        pageContent: doc.pageContent,
        metadata: reducedMetaData,
      });
    });

    console.log(reduceDocs[0]);
    console.log(splitDocs.length);

    //Upload To DataBase
    const client = new PineconeClient();
    console.log(process.env.PINECONE_ENVIRONMENT);
    console.log(process.env.PINECONE_API_KEY);
    await client.init({
      environment: process.env.PINECONE_ENVIRONMENT,
      apiKey: process.env.PINECONE_API_KEY,
    });
    //langchain-js
    const pineconeIndex = client.Index(process.env.PINECONE_INDEX);
    console.log("PineConeIndex", pineconeIndex);
    console.log("Init", client);

    const openaiEmbeddings = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
    });

    //upload documents to pinecone
    await PineconeStore.fromDocuments(reduceDocs, openaiEmbeddings, {
      pineconeIndex,
    });

    console.log("Successfully uploaded to database");
    return res.status(200).json({ result: {'msg': 'uploaded'} });
  }
});
  

app.post("/api/pdf-query", async (req, res) => {
  const reqBody = req.body;
  console.log("PDF Query api call", reqBody.input);

  // Initilize Pinecone
  const client = new PineconeClient();

  await client.init({
    environment: process.env.PINECONE_ENVIRONMENT,
    apiKey: process.env.PINECONE_API_KEY,
  });

  //langchain-js
  const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

  //Search

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex }
  )

  const model = new OpenAI();

  const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
    k: 1,
    returnSourceDocuments: true,
  });

  const response = await chain.call({query: reqBody.input})

  console.log("Answer", response);

  return res.status(200).json({result: response});
});
  
app.listen(PORT, () => {
 console.log(`Server listening on ${PORT}`);
});
