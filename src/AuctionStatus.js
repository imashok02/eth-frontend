import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import Form from "react-bootstrap/Form";

import Card from "react-bootstrap/Card";

const AuctionStatus = ({ contract }) => {
  const [auction, setAuctionStatus] = useState([]);
  const [auctionStats, setAuctionStats] = useState([]);
  const [bidAmount, setBidAmount] = useState(2);

  const authToken = localStorage.getItem("authToken");

  const getBids = async () => {
    const bidsList = await axios.get("http://localhost:4000/auction/status", {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    })
    setAuctionStatus(bidsList.data)
  };

  const getAuctionStats = async () => {
    const auctionStats = await axios.get("http://localhost:4000/auction/stats", {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    })
    setAuctionStats(auctionStats.data)
  };

  useEffect(() => {
    getBids()
  }, []);

  const placeBid = async() => {

    console.log("contart ==> ", contract)
    console.log("placing bid")
  }

  return (
  <>
    <div>

    { process.env.REACT_APP_API_KEY}
    <>Auction Details:</>
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
                  Total: { auctionStats?.totalBids} 
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
        <label htmlFor="options">Bid amount</label>
        <Form.Control
          type="number"
          min={2}
          max={8}
          name="options"
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
