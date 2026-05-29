from flask import Flask, jsonify, request
from flask_cors import CORS
import random
import math

print("FLASK STARTING...")

app = Flask(__name__)
CORS(app)

@app.route("/face-status")
def face_status():
    return jsonify({
        "student": "Sarthak Choudhary",
        "status": "recognized"
    })

@app.route("/generate-code", methods=["POST"])
def generate_code():

    global stored_otp

    data = request.json

    phone = data["phone"]

    code = str(random.randint(100000, 999999))

    stored_otp = code

    print(f"OTP for {phone}: {code}")

    return jsonify({
        "success": True,
        "code": code
    })

stored_otp = ""

@app.route("/verify-otp", methods=["POST"])
def verify_otp():

    global stored_otp

    data = request.get_json()

    entered_otp = str(data.get("otp"))

    print("ENTERED:", entered_otp)
    print("STORED:", stored_otp)

    if entered_otp.strip() == stored_otp.strip():

        return jsonify({
            "verified": True,
            "message": "Attendance Verified"
        })

    return jsonify({
        "verified": False,
        "message": "Wrong OTP"
    })


@app.route("/verify-location", methods=["POST"])
def verify_location():

    data = request.json

    user_lat = data["lat"]
    user_lon = data["lon"]

    campus_lat = 22.5726
    campus_lon = 88.3639

    distance = math.sqrt(
        (user_lat - campus_lat) ** 2 +
        (user_lon - campus_lon) ** 2
    )

    if distance < 0.01:
        return jsonify({
            "verified": True,
            "message": "Inside Campus Range"
        })

    else:
        return jsonify({
            "verified": False,
            "message": "Outside Campus Range"
        })

@app.route("/analytics")
def analytics():

    total_classes = 90
    present = 75
    absent = 5

    attendance_rate = int(
        (present / total_classes) * 100
    )

    return jsonify({
        "attendanceRate": attendance_rate,
        "present": present,
        "absent": absent
    })
@app.route("/behavior")
def behavior():

    return jsonify({

        "punctuality": 92,
        "consistency": 88,
        "discipline": 95

    })

if __name__ == "__main__":
   app.run(host="0.0.0.0")