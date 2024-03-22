import { useState, useEffect } from "react"
import { Button } from "react-bootstrap"
import axios from "axios"
import { DateTime } from "luxon"


import Card from "react-bootstrap/Card"
import { getSignerObject } from "./contract"

const AuctionBids = ({ contract }) => {
  const [bids, setBids] = useState([])
  const [user, setUser] = useState([])


  getSignerObject().then(async ({ signer }) => {

    console.log("igner.getAddress() ==> ", await signer.getAddress());
    setUser(await signer.getAddress());
  })

  const authToken = localStorage.getItem("authToken")

  const getBids = async () => {


    const bidsList = await axios.get("http://localhost:4000/auction/history", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    setBids(bidsList.data.history)
  }

  useEffect(() => {
    getBids()
  }, [user])

  return (
    <>
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
                <pre>{DateTime.fromISO(bid.createdAt).toRelative({unit: "hours"})}</pre>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  )
}

export default AuctionBids
