import React,{useState} from "react";
import logo from './logo.svg';
//import './App.css';
import { PageContent } from './components/PageContent';

function App() {
  const [data, setData] = useState(null);

  // React.useEffect(() => {
  //   fetch("/api")
  //     .then((res) => res.json())
  //     .then((data) => setData(data.message));
  // }, []);
  return (
    <div className="content">
      <PageContent/>
    </div>
  );
}

export default App;
