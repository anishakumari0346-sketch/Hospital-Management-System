import React, { useEffect, useState } from "react";
import axios from "axios";

const AddAppointment = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    patient: "",
    doctor: "",
    appointmentDate: "",
    reason: "",
    status: "Pending",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch Patients
  const fetchPatients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/patient"
      );

      setPatients(response.data.patients || []);
    } catch (error) {
      console.error("Fetch Patients Error:", error);
    }
  };

  // Fetch Doctors
  const fetchDoctors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/doctor"
      );

      setDoctors(response.data.doctors || []);
    } catch (error) {
      console.error("Fetch Doctors Error:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  // Handle Input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit Appointment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patient) {
      setMessage("Please select a patient.");
      return;
    }

    if (!formData.doctor) {
      setMessage("Please select a doctor.");
      return;
    }

    if (!formData.appointmentDate) {
      setMessage("Please select appointment date.");
      return;
    }

    if (!formData.reason.trim()) {
      setMessage("Please enter appointment reason.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        "http://localhost:5000/api/appointment",
        {
          patient: formData.patient,
          doctor: formData.doctor,
          appointmentDate: formData.appointmentDate,
          reason: formData.reason,
          status: formData.status,
        }
      );

      setMessage(
        response.data.message ||
          "Appointment created successfully!"
      );

      // Reset form
      setFormData({
        patient: "",
        doctor: "",
        appointmentDate: "",
        reason: "",
        status: "Pending",
      });
    } catch (error) {
      console.error("Add Appointment Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Something went wrong while creating appointment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>
          Add Appointment
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Patient */}
          <label style={styles.label}>
            Select Patient
          </label>

          <select
            name="patient"
            value={formData.patient}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">
              Select Patient
            </option>

            {patients.map((patient) => (
              <option
                key={patient._id}
                value={patient._id}
              >
                {patient.name} - {patient.phone}
              </option>
            ))}
          </select>

          {/* Doctor */}
          <label style={styles.label}>
            Select Doctor
          </label>

          <select
            name="doctor"
            value={formData.doctor}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">
              Select Doctor
            </option>

            {doctors.map((doctor) => (
              <option
                key={doctor._id}
                value={doctor._id}
              >
                Dr. {doctor.name} -{" "}
                {doctor.specialization}
              </option>
            ))}
          </select>

          {/* Appointment Date */}
          <label style={styles.label}>
            Appointment Date & Time
          </label>

          <input
            type="datetime-local"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            required
            style={styles.input}
          />

          {/* Reason */}
          <label style={styles.label}>
            Reason
          </label>

          <textarea
            name="reason"
            placeholder="Enter appointment reason"
            value={formData.reason}
            onChange={handleChange}
            required
            rows="4"
            style={styles.textarea}
          />

          {/* Status */}
          <label style={styles.label}>
            Status
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="Pending">
              Pending
            </option>

            <option value="Confirmed">
              Confirmed
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading
              ? "Creating Appointment..."
              : "Add Appointment"}
          </button>

          {/* Message */}
          {message && (
            <p
              style={{
                ...styles.message,
                color: message
                  .toLowerCase()
                  .includes("success")
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
    backgroundColor: "#f5f7fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
    color: "#1f2937",
  },

  label: {
    display: "block",
    fontWeight: "600",
    marginBottom: "7px",
    color: "#374151",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "18px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    boxSizing: "border-box",
    fontSize: "15px",
    backgroundColor: "#fff",
  },

  textarea: {
    width: "100%",
    padding: "12px",
    marginBottom: "18px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    boxSizing: "border-box",
    fontSize: "15px",
    resize: "vertical",
  },

  button: {
    width: "100%",
    padding: "13px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  message: {
    textAlign: "center",
    fontWeight: "600",
    marginTop: "15px",
  },
};

export default AddAppointment;
