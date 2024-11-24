import os
import smtplib
import random
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import cv2
app = Flask(__name__)
CORS(app)

# Initialize the Groq client with the correct API key
client = Groq(api_key='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')
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
# Define the upload folder
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load sensitive information from environment variables
sender_email = 'computertipstricks0308@gmail.com'
sender_password ='hoaz fqtu wqch dcdw'
@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        # Save the uploaded MP4 file to the specified directory
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        # Send the saved MP4 file to the transcription API
        with open(filepath, 'rb') as audio_file:
            transcription = client.audio.transcriptions.create(
                file=(file.filename, audio_file.read()),  # Read the saved file
                model="whisper-large-v3-turbo",
                response_format="json",
                language="en",
                temperature=0.0
            )

        # Cleanup: delete the uploaded file after processing
        os.remove(filepath)

        return jsonify({"transcription": transcription.text}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/send_email', methods=['POST'])
def send_email():
    data = request.get_json()
    if not all(k in data for k in ("recipient", "subject")):
        return jsonify({"error": "Please provide recipient and subject"}), 400

    verification_code = str(random.randint(1000, 9999))  # Generate a 4-digit code
    # Here you can store the verification code in a session or database for later validation

    try:
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = data['recipient']
        msg['Subject'] = data['subject']

        # HTML template for the email body
        email_content = f"""
        <html>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
                <div style="background: linear-gradient(135deg, #6a0dad, #4b0082); padding: 20px; border-radius: 8px; color: #fff; text-align: center;">
                    <h2 style="font-size: 24px; margin-bottom: 10px;">Welcome to AI Mock Interview Platform</h2>
                    <p style="font-size: 16px; margin-bottom: 20px;">
                        Thank you for signing up! To complete your registration, please use the following code to verify your email address:
                    </p>
                    <div style="font-size: 28px; font-weight: bold; padding: 10px 20px; border-radius: 5px; background: #fff; color: #4b0082;">
                        {verification_code}
                    </div>
                    <p style="font-size: 14px; margin-top: 20px;">
                        This code is valid for the next 15 minutes. Please do not share it with anyone for security reasons.
                    </p>
                    <p style="font-size: 14px;">
                        If you didn’t sign up, please disregard this email.
                    </p>
                </div>
                <p style="text-align: center; font-size: 12px; color: #666;">
                    © {datetime.datetime.now().year} AI Mock Interview Platform. All rights reserved.
                </p>
            </body>
        </html>
        """
        
        msg.attach(MIMEText(email_content, 'html'))

        # Send email via Gmail's SMTP server
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, data['recipient'], msg.as_string())

        return jsonify({"status": "Email sent successfully", "verification_code": verification_code}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/detect_faces', methods=['GET'])
def detect_faces():
    # Initialize the video capture for the webcam
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        return jsonify({"error": "Could not access the webcam."}), 500
    
    # Capture a single frame
    ret, frame = cap.read()
    
    # Release the webcam after capturing the frame
    cap.release()

    if not ret:
        return jsonify({"error": "Could not read frame."}), 500

    # Convert the frame to grayscale (better for face detection)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces in the grayscale frame
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    # Return the number of detected faces as JSON
    return jsonify({"face_count": len(faces)})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
