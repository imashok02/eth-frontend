import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const NavbarTop = ({ isLoggedIn, logout, connect, connected, becomeMember, isMember }) => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand href="/">Ashok's Auction</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link href="/bids">Bid history</Nav.Link>
            <Nav.Link href="/auction_status">Auction status</Nav.Link>
          </Nav>
          <Nav>
            {/* {!connected ? (
              <Button onClick={connect}>Connect to Metamask</Button>
            ) : (
              <p style={{ color: "white" }}>Connected to Metamask.</p>
            )} */}
            <div></div>
            { isLoggedIn && connected ? (<Button onClick={logout}>Logout</Button>) : '' }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarTop;
