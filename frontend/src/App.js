import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import SubBar from "./components/SubBar"
import Home from "./pages/Home"
import Events from "./pages/Events"
import Sports from "./pages/Sports"
import Schedule from "./pages/Schedule"
import Results from "./pages/Results"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Payment from "./pages/Payment"
import SportRegistration from "./pages/SportRegistration"
import Live from "./pages/Live"
import AdminDashboard from "./pages/AdminDashboard"
import ParticipationDashboard from "./pages/ParticipationDashboard"

const AUTH_ROUTES = ["/login", "/register"]

function Layout() {
  const location = useLocation()
  const isAuthPage = AUTH_ROUTES.includes(location.pathname)

  return (
    <>
      <Navbar />
      <SubBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/live" element={<Live />} />
        <Route path="/sports/:eventId" element={<Sports />} />
        <Route path="/schedule/:sportId" element={<Schedule />} />
        <Route path="/results/:sportId" element={<Results />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sport-registration/:eventId/:sportId" element={<SportRegistration />} />
        <Route path="/payment/:eventId/:sportId" element={<Payment />} />
        <Route path="/profile" element={<ParticipationDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/manager" element={<AdminDashboard />} />
      </Routes>
      {!isAuthPage && <Footer />}
    </>
  )
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  )
}

export default App