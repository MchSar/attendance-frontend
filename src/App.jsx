import * as faceapi from "face-api.js"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { db, auth } from "./firebase"
import {
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth"

import {
  collection,
  addDoc
} from "firebase/firestore"

import { useState, useEffect, useRef } from "react"
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
  const [phone, setPhone] = useState("")
  const [inputCode, setInputCode] = useState("")
  const [message, setMessage] = useState("")
  const [verificationMessage, setVerificationMessage] = useState("")
  const [demoOtp, setDemoOtp] = useState("")
  const [otpVerified, setOtpVerified] = useState(false)
  const [studentName, setStudentName] = useState("Unknown")
  const [activeTab, setActiveTab] = useState("home")
  const [cameraOn, setCameraOn] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)
  const [identityVerified, setIdentityVerified] =
  useState(false)
  const [location, setLocation] = useState("Detecting...")
  const [distance, setDistance] = useState("0m")
  const [locationVerified, setLocationVerified] = useState(false)
  const [attendanceRate, setAttendanceRate] = useState(0)
  const [presentCount, setPresentCount] = useState(0)
  const [absentCount, setAbsentCount] = useState(0)
  const [punctuality, setPunctuality] = useState(0)
  const [consistency, setConsistency] = useState(0)
  const [discipline, setDiscipline] = useState(0)
  const [loggedIn, setLoggedIn] = useState(false)
  const [rollNumber, setRollNumber] = useState("")
  const [password, setPassword] = useState("")
  const [studentData, setStudentData] = useState(null)
  const [attendanceHistory, setAttendanceHistory] = useState([])
  const [liveAttendance, setLiveAttendance] = useState([])
  const [darkMode, setDarkMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("AI")
  const heatmapData = [
    
    

  1,1,1,0,1,1,1,
  1,0,1,1,1,1,0,
  1,1,1,1,0,1,1,
  1,1,0,1,1,1,1,
  1,1,1,0,1,1,1

]
const subjectAnalytics = [

  {
    subject: "AI",
    attendance: 92
  },

  {
    subject: "DBMS",
    attendance: 81
  },

  {
    subject: "ML",
    attendance: 76
  },

  {
    subject: "CN",
    attendance: 88
  },

  {
    subject: "OS",
    attendance: 69
  }

]
  const webcamRef = useRef(null)
  const [faceLoading, setFaceLoading] = useState(false)
  const [faceProgress, setFaceProgress] = useState(0)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [blinkDetected, setBlinkDetected] = useState(false)

const [livenessMessage, setLivenessMessage] = useState("")
const [aiStatus, setAiStatus] = useState("AI Idle")

  const students = [

{
roll: "123250700071",
password: "071",
name: "Sarthak Choudhary",
department: "CSE (AIML)",
phone: "8585039251",
jisId: "JIS/2025/0949",
universityId: "12325260037224",
status: "Active"
},

{
roll: "123250700082",
password: "082",
name: "Soumik Basfore",
department: "CSE (AIML)",
phone: "7699617290",
jisId: "JIS/2025/1254",
universityId: "12325260007970",
status: "Active"
},

{
roll: "123250700072",
password: "072",
name: "Sateesh Rajbhar",
department: "CSE (AIML)",
phone: "8697135457",
jisId: "JIS/2025/1228",
universityId: "12325260033130",
status: "Active"
},

{
roll: "123250700074",
password: "074",
name: "Sayantani Sinha",
department: "CSE (AIML)",
phone: "7364988041",
jisId: "JIS/2025/0705",
universityId: "12325260032481",
status: "Active"
},

{
roll: "123250700066",
password: "066",
name: "Sankalpa Biswas",
department: "CSE (AIML)",
phone: "9643549202",
jisId: "JIS/2025/0035",
universityId: "12325260008603",
status: "Active"
},

{
roll: "123250700064",
password: "064",
name: "Saikat Deb Sharma",
department: "CSE (AIML)",
phone: "6295096193",
jisId: "JIS/2025/0141",
universityId: "12325260030409",
status: "Active"
}

]

const demoOtps = {

  "8585039251": "482917",

  "7699617290": "731864",

  "8697135457": "294615",

  "7364988041": "857203",

  "9643549202": "641982",

  "6295096193": "518374"

}

const generateCode = async () => {

  try {

    const container =
      document.getElementById(
        "recaptcha-container"
      )

    if (container) {

      container.innerHTML = ""

    }

    window.recaptchaVerifier =
      new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible"
        }
      )

    await window.recaptchaVerifier.render()

    const confirmation =
      await signInWithPhoneNumber(
        auth,
        `+91${phone}`,
        window.recaptchaVerifier
      )

    window.confirmationResult =
      confirmation

    alert("OTP Sent Successfully")
    setDemoOtp(
  demoOtps[phone] || "No Demo OTP Found"
)

  } catch (error) {

    console.log(error)

    alert(error.message)

  }

}
const verifyCode = async () => {
  

  console.log("Verify Clicked")
  if (!identityVerified) {

  alert("Verify Face First")

  return

}


  const enteredOtp =
  inputCode.replace(/\s/g, "")

const realOtp =
  code.replace(/\s/g, "")

  console.log("Entered:", enteredOtp)
  console.log("Real:", realOtp)
  console.log({
  enteredOtp,
  realOtp
})

  try {

  await window.confirmationResult.confirm(
    inputCode
  )

} catch {

  alert("Invalid OTP")

  return

}
const today = new Date().toLocaleDateString()

const alreadyMarked = attendanceHistory.some(
  (item) =>
    item.subject === `📚 ${selectedSubject} Lecture` &&
    item.date === today
)

if (alreadyMarked) {

  alert("⚠ Attendance already marked for this subject today")

  return

}

  const newAttendance = {

    subject: `📚 ${selectedSubject} Lecture`,

    status: "Present",

    time: new Date().toLocaleTimeString(),

    date: new Date().toLocaleDateString()

  }

  const updatedHistory = [
    newAttendance,
    ...attendanceHistory
  ]

  setAttendanceHistory(updatedHistory)
  setLiveAttendance((prev) => [

  {
    name: studentData?.name,
    roll: studentData?.roll,
    department: studentData?.department,
    subject: selectedSubject,
    time: new Date().toLocaleTimeString(),
    status: "Present"
  },

  ...prev

])

 if (studentData?.roll) {
  
  localStorage.setItem(

    `attendance_${studentData.roll}`,

    JSON.stringify(updatedHistory)

  )

}
setOtpVerified(true)

setVerificationMessage("✅ Attendance Verified Successfully")
  try {

    await addDoc(

      collection(db, "attendance"),

      {

        name: studentData?.name || "Unknown",
roll: studentData?.roll || "Unknown",
department: studentData?.department || "Unknown",

        subject: selectedSubject,

        status: "Present",

        time: new Date().toLocaleTimeString(),

        date: new Date().toLocaleDateString()

      }

    )

    console.log("Attendance Saved")

  } catch (error) {

    console.log(error.message)

    alert(error.message)

  }

alert("SETTING VERIFIED TRUE")


console.log("OTP VERIFIED SUCCESS")

setTimeout(() => {

  setPhone("")
  setInputCode("")

}, 2000)
}
const handleLogin = () => {

  const foundStudent = students.find(

    (student) =>
      student.roll === rollNumber &&
      student.password === password

  )

  if (foundStudent) {

    setLoggedIn(true)

    setStudentData(foundStudent)

  } else {

    alert("Invalid Roll Number or Password")

  }

}
const registerFace = async () => {
  if (!modelsLoaded) {

  alert("Models still loading")
  return

}
  setFaceLoading(true)
  setAiStatus("Scanning Face...")
setFaceProgress(10)

  if (!cameraOn) {

    alert("Start Camera First")
    return

  }

  if (!webcamRef.current) {

    alert("Webcam Ref Missing")
    return

  }

  alert("Webcam Found")

  await new Promise(resolve =>
  setTimeout(resolve, 1500)
)
await new Promise(resolve =>
  setTimeout(resolve, 2500)
)
const screenshot =
  webcamRef.current.getScreenshot()
    setFaceProgress(30)

  console.log(screenshot)

  const img = document.createElement("img")

img.src = screenshot

await new Promise((resolve) => {
  img.onload = resolve
})
  setFaceProgress(60)

  const detection = await faceapi
  .detectSingleFace(
    img,
    new faceapi.TinyFaceDetectorOptions({
      inputSize: 320,
      scoreThreshold: 0.3
    })
  )
  .withFaceLandmarks()
  .withFaceDescriptor()

console.log(detection)
alert(
  detection
    ? "FACE DETECTED"
    : "NO FACE DETECTED"
)
if (!detection) {

  setFaceLoading(false)

  setFaceProgress(0)

  setMessage("❌ Face Not Detected")

  alert("Face not detected clearly")

  return

}

 setFaceProgress(90) 
 localStorage.removeItem(
  `face_${studentData.roll}`
)
localStorage.setItem(

    `face_${studentData.roll}`,

    JSON.stringify(
      Array.from(detection.descriptor)
    )

  )
  setMessage(
  "✅ Face Enrolled Successfully"
)
  setFaceProgress(100)

setTimeout(() => {
  setFaceLoading(false)
}, 800)
setFaceDetected(true)
setAiStatus("Face Registered")
  

alert("✅ Face Registered Successfully")

}
const detectFace = async () => {

  if (!webcamRef.current) {

    alert("Start Camera First")
    return

  }

  const screenshot =
    webcamRef.current.getScreenshot()

  if (!screenshot) {

    alert("Camera not ready")
    return

  }

  const img = document.createElement("img")

img.src = screenshot

await new Promise((resolve) => {
  img.onload = resolve
})

const detection = await faceapi
  .detectSingleFace(
    img,
    new faceapi.TinyFaceDetectorOptions({
      inputSize: 320,
      scoreThreshold: 0.3
    })
  )
  .withFaceLandmarks()
  .withFaceDescriptor()

if (!detection) {

  alert("No face detected")

  return

}


const savedFace = localStorage.getItem(
  `face_${studentData.roll}`
)

if (!savedFace) {

  alert("No Registered Face Found")

  return

}

const savedDescriptor = new Float32Array(
  JSON.parse(savedFace)
)

  const distance = faceapi.euclideanDistance(
   
    detection.descriptor,
    savedDescriptor
  )

   console.log("FACE DISTANCE:", distance)

  if (distance < 0.65) {

    setFaceDetected(true)
    setIdentityVerified(true)
    setBlinkDetected(true)
    setAiStatus("Face Verified")

    setMessage(
  "✅ Identity Verified Successfully"
)
    await checkLiveness()

  } else {

    setFaceDetected(false)

    setMessage("❌ Face Does Not Match")

  }

}
const checkLiveness = async () => {

  if (!webcamRef.current) {

    alert("Start Camera First")
    return

  }

  const screenshot =
    webcamRef.current.getScreenshot()

  if (!screenshot) {

    alert("Camera not ready")
    return

  }

  const img = await faceapi.fetchImage(screenshot)

  const detection = await faceapi
    .detectSingleFace(
      img,
      new faceapi.SsdMobilenetv1Options({
        minConfidence: 0.05
      })
    )
    .withFaceLandmarks()

  if (!detection) {

    setLivenessMessage("❌ No Face Detected")
    return

  }

  const leftEye =
    detection.landmarks.getLeftEye()

  const rightEye =
    detection.landmarks.getRightEye()

  const eyeOpen =
    leftEye[1].y - leftEye[5].y > 3 &&
    rightEye[1].y - rightEye[5].y > 3

  if (eyeOpen) {

    setBlinkDetected(true)
    setAiStatus("Real Human Detected")

    setLivenessMessage("✅ Real Human Detected")

  } else {

    setBlinkDetected(false)

    setLivenessMessage("⚠️ Blink Your Eyes")

  }

}
const checkFace = async () => {
  const response = await fetch(
    "https://attendance-ui-3.onrender.com/face-status"
  )

  const data = await response.json()
  console.log(data)

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

  const loadModels = async () => {

    await faceapi.nets.ssdMobilenetv1.loadFromUri("/models")

    await faceapi.nets.faceLandmark68Net.loadFromUri("/models")

    await faceapi.nets.faceRecognitionNet.loadFromUri("/models")

    await faceapi.nets.tinyFaceDetector.loadFromUri("/models")

    setModelsLoaded(true)

    console.log("Face API Loaded")

  }

  loadModels()

}, [])

useEffect(() => {
  verifyLocation()
}, [])
useEffect(() => {
  getAnalytics()
}, [])

useEffect(() => {

  if (studentData?.roll) {

    const savedHistory = localStorage.getItem(
      `attendance_${studentData.roll}`
    )

    if (savedHistory) {

      setAttendanceHistory(JSON.parse(savedHistory))

    }

  }

}, [studentData])


  // useEffect(() => {
//   getLocation()
// }, [])
 const downloadReport = () => {

  const doc = new jsPDF()

  doc.text("AI Smart Attendance Report", 20, 20)

  autoTable(doc, {

    head: [["Name", "Department", "Status"]],

    body: students.map((student) => [

      student.name,

      student.department,

      "Present"

    ])

  })

  doc.save("attendance-report.pdf")

}
  if (!loggedIn) {
   

  return (

    <div className={`min-h-screen flex justify-center items-start p-4 relative overflow-hidden duration-500 ${
  darkMode
    ? "bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b]"
    : "bg-gradient-to-br from-[#eef2ff] via-[#f8faff] to-[#ede9fe]"
}`}>

      <div className="w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-[32px] p-8 shadow-xl border border-white/50">

        <h1 className="text-4xl font-black text-center text-gray-800">
          Welcome, {studentData?.name}
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Secure Student Login
        </p>

        <input
          type="text"
          placeholder="Enter Roll Number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          className="w-full h-14 mt-8 rounded-2xl border border-gray-200 px-4 text-center text-lg font-semibold outline-none focus:ring-2 focus:ring-violet-500"
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-14 mt-4 rounded-2xl border border-gray-200 px-4 text-center text-lg font-semibold outline-none focus:ring-2 focus:ring-violet-500"
        />

        <button
          onClick={handleLogin}
          className="w-full h-14 mt-6 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 text-white font-bold shadow-lg"
        >
          Login
        </button>

      </div>

    </div>

  )

}

return (

<div className={`min-h-screen flex justify-center items-start p-4 relative overflow-visible duration-500 ${
  darkMode
    ?  "bg-gradient-to-br from-[#1e1b4b] via-[#0f172a] to-[#111827]"
    : "bg-gradient-to-br from-[#eef2ff] via-[#f8faff] to-[#ede9fe]"
}`}>

  {/* BACKGROUND BLOBS */}

  <div className="absolute top-0 left-0 w-72 h-72 bg-violet-300 opacity-20 blur-3xl rounded-full"></div>

  <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-300 opacity-20 blur-3xl rounded-full"></div>

<div className="w-full max-w-[2600px] mx-auto px-8">

<div className="space-y-6 w-full">

   {/* HEADER */}

        <div className="text-center mb-4">

          <button
  onClick={() => setDarkMode(!darkMode)}
 className={`absolute top-6 right-6 px-5 py-3 rounded-2xl text-base font-bold shadow-xl duration-300 ${
  darkMode
    ? "bg-white text-black"
    : "bg-black text-white"
}`}
>
  {darkMode ? "☀️ Light" : "🌙 Dark"}
</button>

          <h1 className={`text-4xl font-black tracking-tight ${
  darkMode ? "text-white" : "text-gray-800"
}`}>
            AI Smart Attendance
          </h1>

          <p className="text-gray-500 mt-2">
            Face Recognition + Verification
          </p>

        </div>


  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch overflow-visible">

       
       {/* FACE CARD */}

<div
 className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-4 shadow-xl border border-white/50 duration-300 flex flex-col justify-between"
>

  <div className="flex items-center justify-between">

    <h2 className="text-xl font-bold text-gray-800">
      Face Recognition
    </h2>

    <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center">

      <ScanFace className="text-violet-600" />

    </div>

  </div>

  <div className="mt-4 flex justify-center">

    <div className="w-full max-w-[260px] h-[260px] rounded-3xl border-[6px] border-violet-500 bg-gradient-to-br from-violet-100 to-blue-100 flex items-center justify-center overflow-hidden">

      {cameraOn ? (

        <Webcam
  ref={webcamRef}
  audio={false}
  screenshotFormat="image/jpeg"
  screenshotQuality={1}
  mirrored={true}
  videoConstraints={{
    facingMode: "user",
    width: 1280,
    height: 720
  }}
  className="w-full h-full object-cover"
/>

      ) : (

        <ScanFace size={80} className="text-violet-700" />

      )}

    </div>

  </div>

  <p className="text-center text-sm text-gray-500 mt-4">
    Position your face clearly before scanning
  </p>

  <div className="mt-4 bg-gradient-to-r from-violet-600 to-blue-500 rounded-2xl p-4 shadow-lg">

  <div className="flex items-center gap-3">

    <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>

    <h2 className="text-white font-bold text-lg">
  {aiStatus}
</h2>

  </div>

</div>

  <div className="mt-4">

    <button
      onClick={() => setCameraOn(!cameraOn)}
      className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 text-white font-bold"
    >
      {cameraOn ? "Stop Scan" : "Start Scan"}
    </button>

    {faceLoading && (

  <div className="mt-4">

    <div className="flex justify-between text-sm font-semibold text-violet-700 mb-2">

      <span>Recording Face...</span>

      <span>{faceProgress}%</span>

    </div>

    <div className="w-full h-3 bg-violet-100 rounded-full overflow-hidden">

      <div
        className="h-full bg-violet-600 duration-300"
        style={{ width: `${faceProgress}%` }}
      ></div>

    </div>

  </div>

)}

  </div>

  <button
    onClick={detectFace}
    className="w-full h-14 mt-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 text-white font-bold shadow-lg"
  >
    Verify For Attendance
  </button>
  
<div className="text-center mt-4 font-bold text-lg text-orange-600">

  {livenessMessage}
 
</div>

  {faceDetected && (

    <div className="mt-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl p-4 text-center shadow-xl">

      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto">

        <BadgeCheck size={42} className="text-green-600" />

      </div>

      <h1 className="text-2xl font-black text-white mt-4">
        Face Verified
      </h1>

      <p className="text-white/90 mt-2 text-lg">
        {studentData?.name}
      </p>

    </div>

  )}

</div>

        <div
 className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-4 shadow-xl border border-white/50 duration-500 flex flex-col justify-between"
>

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-bold text-gray-800">
              Verification
            </h2>

            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">

              <ShieldCheck className="text-blue-600" />

            </div>

          </div>

          {/* CODE */}
{/* OTP SECTION */}

<div className="mt-3">

  <h1 className="text-3xl font-black text-violet-600 text-center">
    OTP Verification
  </h1>

  <p className="text-center text-gray-500 mt-2">
    Verify attendance using phone OTP
  </p>
  <select
  value={selectedSubject}
  onChange={(e) => setSelectedSubject(e.target.value)}
  className="w-full h-14 mt-4 rounded-2xl border border-gray-200 px-4 text-lg font-semibold outline-none focus:ring-2 focus:ring-violet-500"
>

  <option>AI</option>
  <option>DBMS</option>
  <option>ML</option>
  <option>CN</option>
  <option>OS</option>

</select>

  <input
    type="text"
    placeholder="Enter Phone Number"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    className="w-full h-12 mt-3 rounded-2xl border border-gray-200 px-4 text-center text-lg font-semibold outline-none focus:ring-2 focus:ring-violet-500"
  />

  <button
  onClick={generateCode}
  className="w-full h-12 mt-3 rounded-2xl bg-violet-600 text-white font-bold"
>
  Send OTP
</button>

<div id="recaptcha-container" className="mt-4"></div>
{demoOtp && (

  <div className="mt-4 bg-violet-50 rounded-2xl p-4 text-center">

    <p className="text-gray-500 text-sm">
      Demo OTP
    </p>

    <h1 className="text-3xl font-black text-violet-700 mt-2 tracking-widest">
      {demoOtp}
    </h1>

  </div>

)}

  <input
    type="text"
    placeholder="Enter OTP"
    value={inputCode}
    onChange={(e) => setInputCode(e.target.value)}
    className="w-full h-12 mt-3 rounded-2xl border border-gray-200 px-4 text-center text-2xl font-black outline-none focus:ring-2 focus:ring-violet-500"
  />

  <button
    onClick={verifyCode}
    className="w-full h-12 mt-3 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 text-white font-bold"
  >
    Verify Attendance
  </button>

  <div className="text-center mt-3 font-semibold text-lg">

    {verificationMessage}

  </div>



 {otpVerified === true && (

  <div className="mt-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl p-4 text-center shadow-xl">

    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto">

      <BadgeCheck size={42} className="text-green-600" />

    </div>

    <h1 className="text-2xl font-black text-white mt-4">
      Attendance Verified
    </h1>

    <p className="text-white/90 mt-2 text-lg">
      {studentData?.name}
    </p>

  </div>

)}
</div>


</div>

</div>

<div className="mt-8 w-full">

{activeTab === "home" && (

<div className="w-full">
  
<div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 auto-rows-fr">


  {/* STUDENT BEHAVIOR */}

  <div className={`backdrop-blur-2xl rounded-[32px] p-6 shadow-xl border duration-500 ${
  darkMode
  ? "bg-[#1f2937]/70 border-[#374151]"
  : "bg-white/70 border-white/50"
}`}>

    <h2 className={`text-2xl font-bold ${
  darkMode ? "text-white" : "text-gray-800"
}`}>
      Student Behavior
    </h2>

    <div className="mt-6 space-y-5">

  <div>

    <div className="flex justify-between mb-2">
      <span className="font-semibold">Punctuality</span>
      <span>{punctuality}%</span>
    </div>

    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

      <div
        className="h-full bg-violet-500"
        style={{ width: `${punctuality}%` }}
      ></div>

    </div>

  </div>

  <div>

    <div className="flex justify-between mb-2">
      <span className="font-semibold">Consistency</span>
      <span>{consistency}%</span>
    </div>

    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

      <div
        className="h-full bg-blue-500"
        style={{ width: `${consistency}%` }}
      ></div>

    </div>

  </div>

  <div>

    <div className="flex justify-between mb-2">
      <span className="font-semibold">Discipline</span>
      <span>{discipline}%</span>
    </div>

    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

      <div
        className="h-full bg-green-500"
        style={{ width: `${discipline}%` }}
      ></div>

    </div>

  </div>

</div>

  </div>
  

  {/* LOCATION */}

  <div className={`backdrop-blur-2xl rounded-[32px] p-6 shadow-xl border duration-500 ${
  darkMode
    ? "bg-[#1f2937]/70 border-[#374151]"
    : "bg-white/70 border-white/50"
}`}>
    <h2 className={`text-2xl font-bold ${
  darkMode ? "text-white" : "text-gray-800"
}`}>
      Smart Location
    </h2>

    <p className="mt-6 text-gray-600">
      {location}
    </p>
    <div className="flex items-center gap-2 mt-3">

  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>

  <p className="text-sm text-gray-500">
    Live GPS Tracking Active
  </p>

</div>

    <div className="mt-4 bg-green-50 rounded-2xl p-4">

      <p className="text-green-700 font-semibold">
        {locationVerified
          ? `GPS Verified • ${distance}`
          : "Location Failed"}
      </p>
      <div className="mt-4 bg-blue-50 rounded-2xl p-3">

  <p className="text-xs text-blue-700 font-semibold">
    📍 Campus Radius: 120m
  </p>

</div>
      <p className="text-xs text-green-600 mt-2">
  Smart Campus Zone Detected
</p>

    </div>

  </div>

  {/* ANALYTICS */}

  <div className={`backdrop-blur-2xl rounded-[32px] p-6 shadow-xl border duration-500 ${
  darkMode
    ? "bg-[#1f2937]/70 border-[#374151]"
    : "bg-white/70 border-white/50"
}`}>
    <h2 className={`text-2xl font-bold ${
  darkMode ? "text-white" : "text-gray-800"
}`}>
      Analytics
    </h2>

    <h1 className="text-5xl font-black text-violet-600 mt-6">
      {attendanceRate}%
    </h1>

    <div className="mt-4 bg-green-50 rounded-2xl p-4 flex items-center justify-between">

  <div>

    <p className="text-gray-500">
      Monthly Trend
    </p>

    <h2 className="text-xl font-bold text-green-700 mt-1">
      +12% Increase
    </h2>

  </div>

  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">

    <span className="text-2xl">
      ↑
    </span>

  </div>

</div>

    <div className="grid grid-cols-2 gap-2 mt-4">

      <div className="bg-green-50 rounded-2xl p-3">
        <p>Present</p>
        <h2 className="text-xl font-bold">
          {presentCount}
        </h2>
      </div>

      <div className="bg-red-50 rounded-2xl p-3">
        <p>Absent</p>
        <h2 className="text-xl font-bold">
          {absentCount}
        </h2>
      </div>

    </div>

  </div>

  {/* TIMETABLE */}

  <div className={`backdrop-blur-2xl rounded-[32px] p-6 shadow-xl border duration-500 ${
  darkMode
    ? "bg-[#1f2937]/70 border-[#374151]"
    : "bg-white/70 border-white/50"
}`}>

    <h2 className={`text-2xl font-bold ${
  darkMode ? "text-white" : "text-gray-800"
}`}>
      Timetable
    </h2>

    <div className="mt-4 space-y-3">

      <div className="bg-violet-50  border-l-4 border-violet-500 rounded-2xl p-2">
        🤖AI • 9:00 AM
      </div>
     <div className="flex items-center gap-2 mt-1">

  <p className="text-[10px] text-violet-600 font-semibold">
    Live Now
  </p>

  <p className="text-[10px] text-gray-500">
    Lab Session
  </p>

</div>

      <div className="bg-blue-50  border-l-4 border-violet-500 rounded-2xl p-2">
        🗄️DBMS • 11:00 AM
      </div>
     <div className="flex items-center gap-2 mt-1">

  <p className="text-[10px] text-violet-600 font-semibold">
    Live Now
  </p>

  <p className="text-[10px] text-gray-500">
    Lab Session
  </p>

</div>

      <div className="bg-green-50  border-l-4 border-violet-500 rounded-2xl p-2">
       📊ML • 1:00 PM
      </div>
    <div className="flex items-center gap-2 mt-1">

  <p className="text-[10px] text-violet-600 font-semibold">
    Live Now
  </p>

  <p className="text-[10px] text-gray-500">
    Lab Session
  </p>

</div>

    </div>

  </div>
<div className="mt-6 bg-white rounded-3xl p-5">

  <h2 className="text-2xl font-black text-gray-800">
    Subject Analytics
  </h2>

  <div className="mt-6 space-y-5">

    {subjectAnalytics.map((item, index) => (

      <div key={index}>

        <div className="flex justify-between mb-2">

          <span className="font-bold text-gray-700">
            {item.subject}
          </span>

          <span className="font-bold text-violet-700">
            {item.attendance}%
          </span>

        </div>

        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

          <div
            className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full"
            style={{
              width: `${item.attendance}%`
            }}
          ></div>

        </div>

      </div>

    ))}

  </div>

</div>
</div>

</div>

)}


{activeTab === "analytics" && (

  <div className="space-y-6 w-full">

   <div className={`backdrop-blur-2xl rounded-[32px] p-4 shadow-xl border duration-500 ${
  darkMode
    ? "bg-[#1f2937]/70 border-[#374151]"
    : "bg-white/70 border-white/50"
}`}>

      <h1 className="text-3xl font-black text-gray-800">
        Attendance Analytics
      </h1>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">

        <div className="bg-violet-50 rounded-3xl p-6">

          <p className="text-gray-500">
            Attendance Rate
          </p>

          <h1 className="text-4xl font-black text-violet-700 mt-4 break-words">
            {attendanceRate}%
          </h1>

        </div>

        <div className="bg-green-50 rounded-3xl p-6">

          <p className="text-gray-500">
            Present Classes
          </p>

          <h1 className="text-4xl font-black text-green-700 mt-4">
            {presentCount}
          </h1>

        </div>

        <div className="bg-red-50 rounded-3xl p-6">

          <p className="text-gray-500">
            Absent Classes
          </p>

          <h1 className="text-4xl font-black text-red-700 mt-4">
            {absentCount}
          </h1>

        </div>

      </div>

    </div>

  </div>

)}

</div>
{activeTab === "history" && (

  <div className="space-y-6 w-full">

    <div className={`backdrop-blur-2xl rounded-[32px] p-4 shadow-xl border duration-500 ${
  darkMode
    ? "bg-[#1f2937]/70 border-[#374151]"
    : "bg-white/70 border-white/50"
}`}>

      <h1 className="text-3xl font-black text-gray-800">
        Attendance History
      </h1>
      <p className="text-gray-500 mt-2">
  AI-powered attendance tracking timeline
</p>

      <div className="mt-6 space-y-4">
        <div className="mt-8 bg-white rounded-3xl p-5">

  <div className="flex justify-between items-center">

    <h2 className="text-2xl font-black text-gray-800">
      Live Attendance
    </h2>

    <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">
      LIVE
    </div>

  </div>

  <div className="mt-6 space-y-3 max-h-[320px] overflow-y-auto">

    {liveAttendance.length > 0 ? (

      liveAttendance.map((student, index) => (

        <div
          key={index}
          className="bg-violet-50 rounded-2xl p-4 flex justify-between items-center"
        >

          <div>

            <h2 className="font-bold text-violet-700">
              {student.name}
            </h2>

            <p className="text-sm text-gray-500">
              {student.department}
            </p>

          </div>

          <div className="text-right">

            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
              {student.status}
            </span>

            <p className="text-xs text-gray-400 mt-2">
              {student.time}
            </p>

          </div>

        </div>

      ))

    ) : (

      <p className="text-gray-400 text-center">
        No live attendance yet
      </p>

    )}

  </div>

</div>

  {attendanceHistory.length > 0 ? (

    attendanceHistory.map((item, index) => (

      <div
        key={index}
        className="bg-green-50 rounded-2xl p-4 border-l-4 border-green-500 flex justify-between"
      >

        <div>

          <h2 className="font-bold">
            {item.subject}
          </h2>

          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
            {item.status}
          </span>

          <p className="text-xs text-gray-400 mt-1">
            {item.time}
          </p>

        </div>

        <span className="text-green-600 font-bold">
          {item.date}
        </span>

      </div>

    ))

  ) : (

    <p className="text-gray-500 text-center">
      No attendance history found
    </p>

  )}

</div>

    </div>

  </div>

)}
{activeTab === "admin" && (

  <div className="space-y-6 w-full">

    <div className={`backdrop-blur-2xl rounded-[32px] p-6 shadow-xl border duration-500 ${
      darkMode
        ? "bg-[#1f2937]/70 border-[#374151]"
        : "bg-white/70 border-white/50"
    }`}>

      <h1 className={`text-3xl font-black ${
        darkMode ? "text-white" : "text-gray-800"
      }`}>
        Admin Dashboard
      </h1>

      <p className="text-gray-500 mt-2">
        Student Attendance Management
       <button
  onClick={downloadReport}
  className="w-full h-14 mt-6 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 text-white font-bold shadow-lg"
>
  Download Attendance Report
</button>
      </p>
      <input
  type="text"
  placeholder="Search student..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="w-full h-14 mt-6 rounded-2xl border border-gray-200 px-4 text-lg font-semibold outline-none focus:ring-2 focus:ring-violet-500"
/>
     
     <div className="grid grid-cols-2 gap-4 mt-6">

  <div className="bg-violet-50 rounded-2xl p-4">

    <p className="text-gray-500 text-sm">
      Total Students
    </p>

    <h1 className="text-3xl font-black text-violet-700 mt-2">
      {students.length}
    </h1>

  </div>

  <div className="bg-green-50 rounded-2xl p-4">

    <p className="text-gray-500 text-sm">
      Active Today
    </p>

    <h1 className="text-3xl font-black text-green-700 mt-2">
      {presentCount}
    </h1>

  </div>

  <div className="bg-blue-50 rounded-2xl p-4">

    <p className="text-gray-500 text-sm">
      Attendance
    </p>

    <h1 className="text-3xl font-black text-blue-700 mt-2">
      {attendanceRate}%
    </h1>

  </div>

  <div className="bg-orange-50 rounded-2xl p-4">

    <p className="text-gray-500 text-sm">
      AI Monitor
    </p>

    <h1 className="text-xl font-black text-orange-600 mt-2">
      Active
    </h1>

  </div>

</div>
      <div className="mt-6 space-y-4">
        </div>

{/* WEEKLY CHART */}

<div className="mt-6 bg-white rounded-3xl p-5">
  <div className="mt-6 bg-white rounded-3xl p-5">

  <div className="flex justify-between items-center">

    <h2 className="text-xl font-bold text-gray-800">
      Attendance Heatmap
    </h2>

    <span className="text-sm text-violet-600 font-semibold">
      Last 30 Days
    </span>

  </div>

  <div className="grid grid-cols-7 gap-2 mt-6">

    {heatmapData.map((day, index) => (

      <div
        key={index}
        className={`h-10 rounded-xl ${
          day === 1
            ? "bg-green-500"
            : "bg-red-400"
        }`}
      ></div>

    ))}

  </div>

  <div className="flex justify-between mt-5 text-sm text-gray-500">

    <span>Less</span>

    <div className="flex gap-2">

      <div className="w-4 h-4 rounded bg-red-400"></div>

      <div className="w-4 h-4 rounded bg-green-500"></div>

    </div>

    <span>More</span>

  </div>

</div>

  <div className="flex justify-between items-center">

    <h2 className="text-xl font-bold text-gray-800">
      Weekly Attendance
    </h2>

    <span className="text-sm text-violet-600 font-semibold">
      AI Analytics
    </span>

  </div>

  <div className="mt-6 space-y-4">

    <div>

      <div className="flex justify-between text-sm mb-1">
        <span>Monday</span>
        <span>92%</span>
      </div>

      <div className="w-full h-3 bg-violet-100 rounded-full overflow-hidden">

        <div
          className="h-full bg-violet-600 rounded-full"
          style={{ width: "92%" }}
        ></div>

      </div>

    </div>

  </div>

</div>

<div className="mt-6 space-y-4">


        {students
  .filter((student) =>
    student.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )
  .map((student, index) => (

          <div
            key={index}
            className="bg-violet-50 rounded-2xl p-4 flex justify-between items-center"
          >

            <div>

              <h2 className="font-bold text-violet-700">
                {student.name}
              </h2>

              <p className="text-sm text-gray-500">
                {student.department}
              </p>

            </div>

            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
              Active
            </span>

          </div>

        ))}

      </div>

    </div>

  </div>

)}
{activeTab === "profile" && (

 <div className={`backdrop-blur-2xl rounded-[32px] p-4 shadow-xl border duration-500 ${
  darkMode
    ? "bg-[#1f2937]/70 border-[#374151]"
    : "bg-white/70 border-white/50"
}`}>

    <div className="flex flex-col items-center">

      <div className="w-28 h-28 rounded-full shadow-2xl shadow-violet-500/30 bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold">

        {studentData?.name?.charAt(0)}

      </div>

      <h1 className="text-3xl font-black text-gray-800 mt-4">
        {studentData?.name}
      </h1>

     <p className="text-gray-500 mt-1">
  {studentData?.department}
</p>
<div className="w-full mt-6 space-y-3">

  <div className="bg-violet-50 rounded-2xl p-4">

    <p className="text-gray-500 text-sm">
      Phone Number
    </p>

    <h2 className="text-lg font-bold text-violet-700 mt-1">
      {studentData?.phone}
    </h2>

  </div>

  <div className="bg-blue-50 rounded-2xl p-4">

    <p className="text-gray-500 text-sm">
      University ID
    </p>

    <h2 className="text-lg font-bold text-blue-700 mt-1">
      {studentData?.universityId}
    </h2>

  </div>

  <div className="bg-green-50 rounded-2xl p-4">

    <p className="text-gray-500 text-sm">
      JIS Student ID
    </p>

    <h2 className="text-lg font-bold text-green-700 mt-1">
      {studentData?.jisId}
    </h2>

  </div>

  <div className="bg-orange-50 rounded-2xl p-4">

    <p className="text-gray-500 text-sm">
      AI Biometric Status
    </p>

    <h2 className="text-lg font-bold text-orange-600 mt-1">
      {localStorage.getItem(
  `face_${studentData?.roll}`
)
  ? "Enrolled"
  : "Not Enrolled"}
    </h2>

  </div>

</div>

<div className="mt-3 bg-green-50 text-green-700 px-4 py-2 rounded-full flex items-center gap-2">

  <BadgeCheck size={18} />

  <span className="font-semibold">
    Verified • {studentData?.department}
  </span>

</div>

    </div>

    <div className="grid grid-cols-2 gap-4 mt-8">

  <div className="bg-violet-50 rounded-2xl p-4">

    <p className="text-gray-500">
      Roll Number
    </p>

    <h2 className="text-xl font-bold text-violet-700 mt-2">
      {studentData?.roll}
    </h2>

  </div>

  <div className="bg-blue-50 rounded-2xl p-4">

    <p className="text-gray-500">
      Attendance
    </p>

    <h2 className="text-xl font-bold text-blue-700 mt-2">
      {attendanceRate}%
    </h2>

    <p className="text-green-600 font-semibold mt-2 text-sm">
      ↑ 12% this month
    </p>
    <div className="w-full h-2 bg-violet-100 rounded-full mt-3 overflow-hidden">

  <div
    className="h-full bg-violet-600 rounded-full"
    style={{ width: `${attendanceRate}%` }}
  ></div>

</div>
<p className="text-xs text-gray-500 mt-2">
  AI Prediction: Excellent Attendance
</p>
<div className="flex items-center gap-2 mt-2">

  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>

  <p className="text-xs text-gray-500">
    Live Tracking Active
  </p>

</div>

  </div>

</div>

<div className="mt-6 bg-violet-50 rounded-2xl p-4">

  <p className="text-gray-500">
    Attendance Streak
  </p>

  <h1 className="text-4xl font-black text-violet-700 mt-2">
    12 Days
  </h1>

</div>

<div className="mt-6 bg-white rounded-3xl p-5">

  <div className="flex justify-between items-center">

    <h2 className="text-xl font-bold text-gray-800">
      Weekly Attendance
    </h2>

    <span className="text-sm text-violet-600 font-semibold">
      AI Analytics
    </span>

  </div>

  <div className="mt-6 space-y-4">

    <div>

      <div className="flex justify-between text-sm mb-1">

        <span>Monday</span>
        <span>92%</span>

      </div>

      <div className="w-full h-3 bg-violet-100 rounded-full overflow-hidden">

        <div
          className="h-full bg-violet-600 rounded-full"
          style={{ width: "92%" }}
        ></div>

      </div>

    </div>

  </div>

</div>
<button
  onClick={registerFace}
  className="w-full h-14 mt-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg"
>
  Enroll Face
</button>

  <div className="grid grid-cols-2 gap-4 mt-6">

  <button className="h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 text-white font-bold shadow-lg">
    Edit Profile
  </button>

  <button
    onClick={() => {
      setLoggedIn(false)
      setStudentData(null)
    }}
    className="h-14 rounded-2xl border border-red-200 text-red-600 font-semibold bg-white"
  >
    Logout
  </button>

</div>

</div>


)}

</div>

{/* BOTTOM NAVIGATION */}

<div className={`fixed bottom-5 left-1/2 -translate-x-1/2 w-[90%] max-w-md backdrop-blur-2xl rounded-3xl shadow-xl px-6 py-4 flex justify-between items-center border duration-500 ${
  darkMode
    ? "bg-[#111827]/80 border-[#374151]"
    : "bg-white/80 border-white/50"
}`}
>

  <button
  onClick={() => setActiveTab("admin")}
  className={`flex flex-col items-center text-sm ${
    activeTab === "admin"
      ? "text-violet-600"
      : "text-gray-400"
  }`}
>
  <User size={22} />
  <span className="mt-1">Admin</span>
</button>

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


  )

}
//Real OTP/SMS Teacher Panel Cloud deployment animated AI scan overlay real-time face box tracking voice assistant teacher portal cloud deployment real Firebase auth live webcam detection loop AI attendance predictions