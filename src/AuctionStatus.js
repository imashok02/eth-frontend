import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import Form from "react-bootstrap/Form";

import Card from "react-bootstrap/Card";
import { ethers } from "ethers";

const AuctionStatus = ({ contract }) => {
  const [auction, setAuctionStatus] = useState([]);
  const [auctionStats, setAuctionStats] = useState([]);
  const [bidAmount, setBidAmount] = useState();
  const [errors, setErrors] = useState();

  const authToken = localStorage.getItem("authToken");

  const getBids = async () => {
    let bidsList
    
    try {
        bidsList = await axios.get(`${process.env.REACT_APP_API_URL}/auction/status`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
    } catch(e) {
        localStorage.removeItemItem("authToken");
        setErrors("Not Authorized")
        return

    }

    setAuctionStatus(bidsList.data)
  };

  const getAuctionStats = async () => {
    let auctionStats;
    try {
        auctionStats = await axios.get(`${process.env.REACT_APP_API_URL}/auction/stats`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
    } catch(e) {
        localStorage.removeItemItem("authToken");
        setErrors("Not Authorized")
        return
    }

    setAuctionStats(auctionStats.data)
  };

  useEffect(() => {
    getBids()
    getAuctionStats()
  }, []);

  const placeBid = async() => {

    console.log("contract ==> ", contract);

    const authToken = localStorage.getItem("authToken");

    if (authToken === '' || authToken == null) {
        alert("Unauthorized")
        localStorage.removeItemItem("authToken");
        return
    }
    
    const getHighestBid = await contract.highestBid();
    const highestBid = ethers.utils.formatEther(getHighestBid)

    if (ethers.utils.formatUnits(bidAmount) <= highestBid) {
        alert("bid is less than the highest bid.")
        return
    } else {
        const transactionInfo = await contract.bid({
                value: bidAmount,
        });

        alert(JSON.stringify(transactionInfo))
    }

  }

  return (
  <>
  <div>{errors !== '' ? <p style={{color: "red"}}>{errors}</p> : ''}</div>
    <div>

    { process.env.REACT_APP_API_KEY}
    <div className="my-2"></div>
    <>Auction Contract : {auction.contractAddress}</>
        <Card className="my-2">
          <Card.Header>Auction Status</Card.Header>
          <Card.Body>
              <div className="mt-1">
                <div className="d-flex w-100 align-items-center">
                  Creator: { auction?.beneficiary} 
                  <br></br>
                 Highest Bidder: { auction?.highestBidder }
                 <br></br>
                 HighestBid: { auction?.highestBid }
                 <br></br>
                 Auction Status: { auction?.status }
                 <br></br>
                 Auction Ending on : { auction?.auctionEndTime }
                </div>
              </div>
          </Card.Body>
        </Card>
    </div>
    <div>
    <Card className="my-2">
    <Card.Header>Auction Stats</Card.Header> 
    <Card.Body>
              <div className="mt-1">
                <div className="d-flex w-100 align-items-center">
                  Total Bids: { auctionStats?.totalBids} 
                  <br></br>
                  Total Eth Volume: { auctionStats?.totalEthVolume }
                 <br></br>
                </div>
              </div>
          </Card.Body>
    </Card>
    <Card className="my-2">
    {(authToken !== '' ? (<><Form className="m-2">
      <h2 className="d-flex justify-content-center">Place your Bid</h2>
      <Form.Group className="m-2">
        <label htmlFor="options">Bid amount  (in wei)</label>
        <Form.Control
          type="number"
          name="options"
          step="1"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="m-2 mt-4">
        <Button variant="success" onClick={placeBid} >
          Place Bid
        </Button>
      </Form.Group>
    </Form></>) :(<>No Token</>))}
    </Card>
    </div>
    </>
  );
};

export default AuctionStatus;
