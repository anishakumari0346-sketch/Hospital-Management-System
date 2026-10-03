import React, { useState } from "react";
import axios from "axios";

const AddPatient = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    address: "",
    bloodGroup: "",
    medicalHistory: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const patientData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        age: Number(formData.age),
        gender: formData.gender,
        address: formData.address,
        bloodGroup: formData.bloodGroup,
        medicalHistory: formData.medicalHistory,
      };

      console.log("Sending:", patientData);

      const response = await axios.post(
        "http://localhost:5000/api/patient",
        patientData
      );

      console.log("Response:", response.data);

      setMessage("Patient added successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        age: "",
        gender: "",
        address: "",
        bloodGroup: "",
        medicalHistory: "",
      });
    } catch (error) {
      console.log("FULL ERROR:", error);
      console.log("SERVER ERROR:", error.response?.data);

      setMessage(
        error.response?.data?.message ||
          "Patient add nahi hua. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Add Patient</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Patient Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            min="0"
            required
            style={styles.input}
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            style={styles.textarea}
          />

          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>

          <textarea
            name="medicalHistory"
            placeholder="Medical History"
            value={formData.medicalHistory}
            onChange={handleChange}
            rows="4"
            style={styles.textarea}
          />

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Adding Patient..." : "Add Patient"}
          </button>

          {message && (
            <p
              style={{
                ...styles.message,
                color: message.includes("successfully")
                  ? "green"
                  : "red",
              }}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },

  heading: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#222",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    boxSizing: "border-box",
    fontSize: "15px",
  },

  textarea: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    boxSizing: "border-box",
    fontSize: "15px",
    resize: "vertical",
    fontFamily: "Arial, sans-serif",
  },

  button: {
    width: "100%",
    padding: "13px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },

  message: {
    textAlign: "center",
    marginTop: "15px",
    fontWeight: "bold",
  },
};

export default AddPatient;