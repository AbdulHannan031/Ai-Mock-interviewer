async function transcribeAudio(file) {
    const FLASK_URL = "http://127.0.0.1:5001/transcribe";  // Adjust port if needed
    
    try {
      // Create a FormData object and append the file
      const formData = new FormData();
      formData.append("file", file);
  
      // Send the file to the Flask API
      const response = await fetch(FLASK_URL, {
        method: "POST",
        body: formData,
      });
  
      // Handle the response
      if (response.ok) {
        const data = await response.json();
        console.log("Transcription:", data.transcription);  // Log transcription or process it further
        return data.transcription;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to transcribe audio.");
      }
    } catch (error) {
      console.error("Error:", error.message);
      return null;
    }
  }
  