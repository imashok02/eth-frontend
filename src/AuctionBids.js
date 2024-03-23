import { useState, useEffect } from "react"
import { Button } from "react-bootstrap"
import axios from "axios"
import { DateTime } from "luxon"


import Card from "react-bootstrap/Card"
import { getSignerObject } from "./contract"

const AuctionBids = ({ contract }) => {
  const [bids, setBids] = useState([])
  const [user, setUser] = useState([])
  const [errors, setErrors] = useState();


  getSignerObject().then(async ({ signer }) => {
    setUser(await signer.getAddress());
  })

  const authToken = localStorage.getItem("authToken")

  const getBids = async () => {
    let bidsList 
    
    try {
      bidsList = await axios.get(`${process.env.REACT_APP_API_URL}/auction/history`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

    } catch(e) {
        localStorage.removeItemItem("authToken");
        setErrors("Not Authorized")
        return 
    
    }
    setBids(bidsList.data.history)
  }

  useEffect(() => {
    getBids()
  }, [user])

  return (
    <>
    <div>{errors !== '' ? <p style={{color: "red"}}>{errors}</p> : ''}</div>
      <div>
        <div className="my-2">Bids Till now:</div>
        {bids.map((bid) => (
          <Card key={bid.id} className="my-2">
            <Card.Header>Bid Amount: {bid.bidAmount}</Card.Header>
            <Card.Body>
              <div className="mt-1" key={Math.random() + bid.id}>
                <div className="d-flex w-100 align-items-center">
                  Bidder: {user === bid.address ? `You (${bid.address})` : bid.address }
                </div>
                <pre>{DateTime.fromISO(bid.createdAt).toRelative({unit: "hours"}) }</pre>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  )
}

export default AuctionBids
