import { useState, useEffect } from "react"
 import Webcam from "react-webcam"
import {
  ScanFace,
  ShieldCheck,
  BadgeCheck,
  User,
  Building2,
  House,
  History,
  BarChart3,
  UserCircle,
} from "lucide-react"
 
export default function App() {

  const [code, setCode] = useState("------")
  const [inputCode, setInputCode] = useState("")
  const [message, setMessage] = useState("")
  const [verified, setVerified] = useState(false)
  const [studentName, setStudentName] = useState("Unknown")
  const [activeTab, setActiveTab] = useState("home")
  const [cameraOn, setCameraOn] = useState(false)
  const [location, setLocation] = useState("Detecting...")
  const [distance, setDistance] = useState("0m")
  const [locationVerified, setLocationVerified] = useState(false)
  const [attendanceRate, setAttendanceRate] = useState(0)
  const [presentCount, setPresentCount] = useState(0)
  const [absentCount, setAbsentCount] = useState(0)
  const [punctuality, setPunctuality] = useState(0)
  const [consistency, setConsistency] = useState(0)
  const [discipline, setDiscipline] = useState(0)

  const generateCode = async () => {

    const response = await fetch(
      "https://attendance-ui-3.onrender.com/generate-code"
    )

    const data = await response.json()

    setCode(data.code)

  }

  const verifyCode = () => {

    if (inputCode === code) {

      setMessage("Verification Successful")
      setVerified(true)

    } else {

      setMessage("Wrong Code")

    }

  }

 const checkFace = async () => {

  const response = await fetch(
    "https://attendance-ui-3.onrender.com/face-status"
  )

  const data = await response.json()

  setStudentName(data.student)

}
const verifyLocation = () => {

  navigator.geolocation.getCurrentPosition(

    async (position) => {

      const lat = position.coords.latitude
      const lon = position.coords.longitude

      setLocation(
        `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`
      )

      const response = await fetch(
        "https://attendance-ui-3.onrender.com/verify-location",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            lat,
            lon
          })
        }
      )

      const data = await response.json()

      setLocationVerified(data.verified)
      setDistance(data.message)

    }

  )

}
const getAnalytics = async () => {

  const response = await fetch(
    "https://attendance-ui-3.onrender.com/analytics"
  )

  const data = await response.json()

  setAttendanceRate(data.attendanceRate)
  setPresentCount(data.present)
  setAbsentCount(data.absent)

}
const getBehavior = async () => {

  const response = await fetch(
    "https://attendance-ui-3.onrender.com/behavior"
  )

  const data = await response.json()

  setPunctuality(data.punctuality)
  setConsistency(data.consistency)
  setDiscipline(data.discipline)

}
useEffect(() => {
  getBehavior()
}, [])

useEffect(() => {
  verifyLocation()
}, [])
useEffect(() => {
  getAnalytics()
}, [])


  // useEffect(() => {
//   getLocation()
// }, [])

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-[#f8faff] to-[#ede9fe] flex justify-center items-start p-4 relative overflow-hidden">

  {/* BACKGROUND BLOBS */}

  <div className="absolute top-0 left-0 w-72 h-72 bg-violet-300 opacity-20 blur-3xl rounded-full"></div>

  <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-300 opacity-20 blur-3xl rounded-full"></div>

      <div className="w-full max-w-md lg:max-w-7xl">

<div className="space-y-6">

   {/* HEADER */}

        <div className="text-center mb-4">

          <h1 className="text-4xl font-black tracking-tight text-gray-800">
            AI Smart Attendance
          </h1>

          <p className="text-gray-500 mt-2">
            Face Recognition + Verification
          </p>

        </div>


  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

       
        {/* FACE CARD */}

        <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-4 shadow-xl border border-white/50 h-[500px]">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-bold text-gray-800">
              Face Recognition
            </h2>

            <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center">

              <ScanFace className="text-violet-600" />

            </div>

          </div>

          {/* FACE SCAN */}

          <div className="mt-4 flex justify-center">

            <div className="w-44 h-44 rounded-3xl border-[6px] border-violet-500 bg-gradient-to-br from-violet-100 to-blue-100 flex items-center justify-center relative overflow-hidden">

              <div className="absolute w-full h-2 bg-violet-500 animate-pulse"></div>

             {cameraOn ? (

 <Webcam
  audio={false}
  screenshotFormat="image/jpeg"
  videoConstraints={{
    facingMode: "user"
  }}
  className="w-full h-full object-cover rounded-3xl"
/>

) : (

  <ScanFace size={80} className="text-violet-700" />

)}
            </div>

          </div>

          <div className="text-center mt-4">

            <p className="text-green-600 font-semibold">
              Face Recognized
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-4">
              {studentName}
            </h2>

          </div>

          <button
            onClick={() => {
  setCameraOn(!cameraOn)

  if (!cameraOn) {
    checkFace()
  }
}}
            className="w-full h-14 mt-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 text-white font-semibold shadow-lg hover:scale-[1.02] duration-200"
          >
            {cameraOn ? "Stop Scan" : "Start Scan"}
          </button>

        </div>

        {/* VERIFICATION */}

        <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-4 shadow-xl border border-white/50 mt-4 h-[500px]">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-bold text-gray-800">
              Verification
            </h2>

            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">

              <ShieldCheck className="text-blue-600" />

            </div>

          </div>

          {/* CODE */}

          <div className="mt-4 text-center">

            <h1 className="text-4xl font-black tracking-[10px] text-violet-600">
              {code}
            </h1>

            <button
              onClick={generateCode}
              className="mt-4 px-6 h-12 rounded-2xl bg-violet-600 text-white font-semibold hover:bg-violet-700 duration-200"
            >
              Generate Code
            </button>

          </div>

          {/* INPUT */}

          <input
            type="text"
            placeholder="Enter Verification Code"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="w-full h-14 mt-4 rounded-2xl border border-gray-200 px-4 text-center text-2xl font-bold outline-none focus:ring-2 focus:ring-violet-500"
          />

          <button
            onClick={verifyCode}
            className="w-full h-14 mt-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500 text-white font-semibold shadow-violet-300/40 hover:scale-[1.02] duration-200"
          >
            Verify Attendance
          </button>

         <div className={`text-center mt-4 font-semibold ${
  verified ? "text-green-600" : "text-red-500"
}`}>
  {message}
            {verified && (

  <div className="mt-6 bg-green-50 rounded-2xl p-4">

    <h2 className="text-green-700 font-bold text-xl">
      Attendance Marked
    </h2>

    <p className="text-gray-600 mt-2">
      {studentName}
    </p>

  </div>

)}
          </div>

        </div>

</div>

{/* DASHBOARD GRID */}

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

  {/* STUDENT BEHAVIOR */}

  <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-4 shadow-xl border border-white/50 h-[320px]">

    <h2 className="text-2xl font-bold text-gray-800">
      Student Behavior
    </h2>

    <div className="mt-6">

      <div className="flex justify-between mb-2">
        <span>Punctuality</span>
        <span>{punctuality}%</span>
      </div>

      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-violet-500"
          style={{ width: `${punctuality}%` }}
        ></div>
      </div>

    </div>

  </div>

  {/* LOCATION */}

  <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-4 shadow-xl border border-white/50 h-[320px]">

    <h2 className="text-2xl font-bold text-gray-800">
      Location
    </h2>

    <p className="mt-6 text-gray-600">
      {location}
    </p>

    <div className="mt-4 bg-green-50 rounded-2xl p-4">

      <p className="text-green-700 font-semibold">
        {locationVerified
          ? `GPS Verified • ${distance}`
          : "Location Failed"}
      </p>

    </div>

  </div>

  {/* ANALYTICS */}

  <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-4 shadow-xl border border-white/50 h-[320px]">

    <h2 className="text-2xl font-bold text-gray-800">
      Analytics
    </h2>

    <h1 className="text-5xl font-black text-violet-600 mt-6">
      {attendanceRate}%
    </h1>

    <div className="grid grid-cols-2 gap-4 mt-6">

      <div className="bg-green-50 rounded-2xl p-4">
        <p>Present</p>
        <h2 className="text-2xl font-bold">
          {presentCount}
        </h2>
      </div>

      <div className="bg-red-50 rounded-2xl p-4">
        <p>Absent</p>
        <h2 className="text-2xl font-bold">
          {absentCount}
        </h2>
      </div>

    </div>

  </div>

  {/* TIMETABLE */}

  <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-4 shadow-xl border border-white/50 h-[320px]">

    <h2 className="text-2xl font-bold text-gray-800">
      Timetable
    </h2>

    <div className="mt-4 space-y-3">

      <div className="bg-violet-50 rounded-2xl p-3">
        AI • 9:00 AM
      </div>

      <div className="bg-blue-50 rounded-2xl p-3">
        DBMS • 11:00 AM
      </div>

      <div className="bg-green-50 rounded-2xl p-3">
        ML • 1:00 PM
      </div>

    </div>

  </div>

</div>

{activeTab === "analytics" && (

  <div className="space-y-6">

    <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-6 shadow-xl border border-white/50">

      <h1 className="text-3xl font-black text-gray-800">
        Attendance Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

        <div className="bg-violet-50 rounded-3xl p-6">

          <p className="text-gray-500">
            Attendance Rate
          </p>

          <h1 className="text-5xl font-black text-violet-700 mt-4">
            {attendanceRate}%
          </h1>

        </div>

        <div className="bg-green-50 rounded-3xl p-6">

          <p className="text-gray-500">
            Present Classes
          </p>

          <h1 className="text-5xl font-black text-green-700 mt-4">
            {presentCount}
          </h1>

        </div>

        <div className="bg-red-50 rounded-3xl p-6">

          <p className="text-gray-500">
            Absent Classes
          </p>

          <h1 className="text-5xl font-black text-red-700 mt-4">
            {absentCount}
          </h1>

        </div>

      </div>

    </div>

  </div>

)}
{activeTab === "history" && (

  <div className="space-y-6">

    <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-6 shadow-xl border border-white/50">

      <h1 className="text-3xl font-black text-gray-800">
        Attendance History
      </h1>

      <div className="mt-6 space-y-4">

        <div className="bg-green-50 rounded-2xl p-4 flex justify-between">

          <div>

            <h2 className="font-bold">
              AI Lecture
            </h2>

            <p className="text-gray-500">
              Present
            </p>

          </div>

          <span className="text-green-600 font-bold">
            Today
          </span>

        </div>

        <div className="bg-red-50 rounded-2xl p-4 flex justify-between">

          <div>

            <h2 className="font-bold">
              DBMS Lab
            </h2>

            <p className="text-gray-500">
              Absent
            </p>

          </div>

          <span className="text-red-600 font-bold">
            Yesterday
          </span>

        </div>

      </div>

    </div>

  </div>

)}
{activeTab === "profile" && (

  <div className="mt-6 bg-white/70 backdrop-blur-2xl rounded-[32px] p-6 shadow-xl border border-white/50">

    <div className="flex flex-col items-center">

      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold">

        S

      </div>

      <h1 className="text-3xl font-black text-gray-800 mt-4">
        Sarthak Choudhary
      </h1>

      <p className="text-gray-500 mt-1">
        AI & Machine Learning
      </p>

    </div>

    <div className="grid grid-cols-2 gap-4 mt-8">

      <div className="bg-violet-50 rounded-2xl p-4">

        <p className="text-gray-500">
          Roll Number
        </p>

        <h2 className="text-xl font-bold text-violet-700 mt-2">
          AIML-203
        </h2>

      </div>

      <div className="bg-blue-50 rounded-2xl p-4">

        <p className="text-gray-500">
          Attendance
        </p>

        <h2 className="text-xl font-bold text-blue-700 mt-2">
          {attendanceRate}%
        </h2>

      </div>

    </div>

    <div className="mt-6 bg-green-50 rounded-2xl p-4 flex items-center justify-between">

      <div>

        <p className="text-gray-500">
          Verification Status
        </p>

        <h2 className="font-bold text-green-700 mt-1">
          Verified Student
        </h2>

      </div>

      <BadgeCheck className="text-green-600" size={36} />

    </div>

    <button className="w-full h-14 mt-6 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 text-white font-bold shadow-lg">

      Edit Profile

    </button>

  </div>

)} 
{/* BOTTOM NAVIGATION */}

<div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/80 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-xl px-6 py-4 flex justify-between items-center">

  <button
    onClick={() => setActiveTab("home")}
    className={`flex flex-col items-center text-sm ${
      activeTab === "home"
        ? "text-violet-600"
        : "text-gray-400"
    }`}
  >
    <House size={22} />
    <span className="mt-1">Home</span>
  </button>

  <button
    onClick={() => setActiveTab("history")}
    className={`flex flex-col items-center text-sm ${
      activeTab === "history"
        ? "text-violet-600"
        : "text-gray-400"
    }`}
  >
    <History size={22} />
    <span className="mt-1">History</span>
  </button>

  <button
    onClick={() => setActiveTab("analytics")}
    className={`flex flex-col items-center text-sm ${
      activeTab === "analytics"
        ? "text-violet-600"
        : "text-gray-400"
    }`}
  >
    <BarChart3 size={22} />
    <span className="mt-1">Analytics</span>
  </button>

  <button
    onClick={() => setActiveTab("profile")}
    className={`flex flex-col items-center text-sm ${
      activeTab === "profile"
        ? "text-violet-600"
        : "text-gray-400"
    }`}
  >
    <UserCircle size={22} />
    <span className="mt-1">Profile</span>
  </button>

</div>

</div>

</div>

</div>

  )
}
{/* deployment refresh */}