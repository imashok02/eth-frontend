import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { connect, getSignerObject } from "./contract";
import axios from "axios";
import AuctionBids from "./AuctionBids";
import AuctionStatus from "./AuctionStatus";

function App() {
  const [contract, setContract] = useState(null);
  const [connected, setConnected] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts.length > 0) {
        handleInit();
      } else {
        setConnected(false);
        setIsLoggedIn(false)
      }
    });
  }, []);

  const handleInit = async () => {
    setConnected(true);
    getSignerObject().then(async ({ signer, contract }) => {

      const address = await signer.getAddress()

      setContract(contract)

      const authToken = localStorage.getItem('authToken');
      console.log("available token ==> ", authToken)

      if (!authToken) {
        const resNonce = await axios.get("http://localhost:4000/auth/wallet-login-nonce", { params: {
          address
        }})
  
        const signedMessage = await signer.signMessage(resNonce.data.nonce)
  
        const resAuth = await axios.post("http://localhost:4000/auth/login", { 
          signedMessage, message: resNonce.data.nonce, address
        })

        setIsLoggedIn(true)

        localStorage.setItem('authToken', resAuth.data.authToken)

      } else {
        setIsLoggedIn(true)
      }
    });
  };

  const connectCallback = async () => {
    window.location.reload();
    const { contract } = await connect();
    setContract(contract);
    if (contract) {
      setConnected(true);
    }
  };

  const logoutCallback = async () => {
    localStorage.removeItem("authToken");
    window.location.reload();
    setIsLoggedIn(false);
  }


  const becomeMember = async () => {
    if (!contract) {
      alert("Please connect to metamask.");
      return;
    }

    await contract
      .join()
      .then(() => {
        alert("Joined");
        setIsMember(true);
      })
      .catch((error) => alert(error.message));
  };

  return (
    <Router>
      <Navbar
        isLoggedIn={isLoggedIn}
        logout={logoutCallback}
        connect={connectCallback}
        connected={connected}
        becomeMember={becomeMember}
        isMember={isMember}
      />
      <div className="container">
        <Routes>
          <Route path="bids" element={<AuctionBids />} />
          <Route path="auction_status" element={<AuctionStatus contract={contract} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
