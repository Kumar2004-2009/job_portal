import { Route,Routes } from "react-router-dom"
import Home from "./pages/Home"
import ApplyJob from "./pages/ApplyJob"
import Applications from "./pages/Applications"
import RecruiterLogin from "./components/RecruiterLogin"
import { useContext } from "react"
import { AppContext } from "./context/AppContext"
import Dasnboard from "./pages/Dasnboard"
import AddJob from "./pages/AddJob"
import ManageJobs from "./pages/ManageJobs"
import ViewApplication from "./pages/ViewApplication"
import 'quill/dist/quill.snow.css'

const App = () => {
  const {showRecruiterLogin} =useContext(AppContext)
  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin/>}
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/apply-job/:id" element={<ApplyJob/>} />
        <Route path="/applications" element={<Applications/>} />
        <Route path="/dashboard" element={<Dasnboard/>} >
          <Route path="add-job" element={<AddJob/>} />
          <Route path="manage-jobs" element={<ManageJobs/>} />
          <Route path="view-applications" element={<ViewApplication/>} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
