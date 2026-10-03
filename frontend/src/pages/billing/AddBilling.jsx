import React, { useEffect, useState } from "react";
import axios from "axios";

const AddBilling = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [formData, setFormData] = useState({
    patient: "",
    appointment: "",
    consultationFee: "",
    medicineCharges: "",
    testCharges: "",
    otherCharges: "",
    paymentStatus: "Pending",
    paymentMethod: "Cash",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch patients
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

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/appointment"
      );

      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error("Fetch Appointments Error:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchAppointments();
  }, []);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Calculate total
  const totalAmount =
    Number(formData.consultationFee || 0) +
    Number(formData.medicineCharges || 0) +
    Number(formData.testCharges || 0) +
    Number(formData.otherCharges || 0);

  // Submit billing
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patient) {
      setMessage("Please select a patient.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        "http://localhost:5000/api/billing",
        {
          patient: formData.patient,
          appointment: formData.appointment || undefined,
          consultationFee: Number(formData.consultationFee || 0),
          medicineCharges: Number(formData.medicineCharges || 0),
          testCharges: Number(formData.testCharges || 0),
          otherCharges: Number(formData.otherCharges || 0),
          totalAmount,
          paymentStatus: formData.paymentStatus,
          paymentMethod: formData.paymentMethod,
        }
      );

      console.log("Billing created:", response.data);

      setMessage("Bill created successfully!");

      setFormData({
        patient: "",
        appointment: "",
        consultationFee: "",
        medicineCharges: "",
        testCharges: "",
        otherCharges: "",
        paymentStatus: "Pending",
        paymentMethod: "Cash",
      });
    } catch (error) {
      console.error("Add Billing Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Something went wrong while creating bill."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Add Billing</h2>

        <form onSubmit={handleSubmit}>
          {/* Patient */}
          <label style={styles.label}>Patient</label>

          <select
            name="patient"
            value={formData.patient}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Select Patient</option>

            {patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.name} - {patient.phone}
              </option>
            ))}
          </select>

          {/* Appointment */}
          <label style={styles.label}>Appointment</label>

          <select
            name="appointment"
            value={formData.appointment}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Appointment (Optional)</option>

            {appointments.map((appointment) => (
              <option
                key={appointment._id}
                value={appointment._id}
              >
                {appointment.appointmentDate
                  ? new Date(
                      appointment.appointmentDate
                    ).toLocaleDateString()
                  : "Appointment"}{" "}
                - {appointment.reason}
              </option>
            ))}
          </select>

          {/* Consultation Fee */}
          <label style={styles.label}>
            Consultation Fee
          </label>

          <input
            type="number"
            name="consultationFee"
            placeholder="Consultation Fee"
            value={formData.consultationFee}
            onChange={handleChange}
            min="0"
            style={styles.input}
          />

          {/* Medicine Charges */}
          <label style={styles.label}>
            Medicine Charges
          </label>

          <input
            type="number"
            name="medicineCharges"
            placeholder="Medicine Charges"
            value={formData.medicineCharges}
            onChange={handleChange}
            min="0"
            style={styles.input}
          />

          {/* Test Charges */}
          <label style={styles.label}>
            Test Charges
          </label>

          <input
            type="number"
            name="testCharges"
            placeholder="Test Charges"
            value={formData.testCharges}
            onChange={handleChange}
            min="0"
            style={styles.input}
          />

          {/* Other Charges */}
          <label style={styles.label}>
            Other Charges
          </label>

          <input
            type="number"
            name="otherCharges"
            placeholder="Other Charges"
            value={formData.otherCharges}
            onChange={handleChange}
            min="0"
            style={styles.input}
          />

          {/* Total */}
          <div style={styles.totalBox}>
            <span>Total Amount</span>
            <strong>₹{totalAmount}</strong>
          </div>

          {/* Payment Status */}
          <label style={styles.label}>
            Payment Status
          </label>

          <select
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
          </select>

          {/* Payment Method */}
          <label style={styles.label}>
            Payment Method
          </label>

          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            <option value="Online">Online</option>
          </select>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Creating Bill..." : "Create Bill"}
          </button>

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
    maxWidth: "650px",
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  },

  heading: {
    textAlign: "center",
    marginBottom: "25px",
  },

  label: {
    display: "block",
    fontWeight: "600",
    marginBottom: "6px",
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

  totalBox: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#eff6ff",
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "7px",
    fontSize: "18px",
    color: "#1d4ed8",
  },

  button: {
    width: "100%",
    padding: "13px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },

  message: {
    textAlign: "center",
    fontWeight: "bold",
    marginTop: "15px",
  },
};

export default AddBilling;
