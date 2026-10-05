import React, { useEffect, useState } from "react";
import API from "../../services/app";

const EditPatientList = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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

  // Get all patients
  const fetchPatients = async () => {
    try {
      setLoading(true);

      const response = await API.get("/patient");

      setPatients(response.data.patients || response.data || []);
    } catch (error) {
      console.error("Fetch Patients Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load patients."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Select patient for editing
  const handleEdit = (patient) => {
    setSelectedPatient(patient);

    setFormData({
      name: patient.name || "",
      email: patient.email || "",
      phone: patient.phone || "",
      age: patient.age || "",
      gender: patient.gender || "",
      address: patient.address || "",
      bloodGroup: patient.bloodGroup || "",
      medicalHistory: patient.medicalHistory || "",
    });

    setMessage("");
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update patient
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPatient) {
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const response = await API.put(
        `/patient/${selectedPatient._id}`,
        {
          ...formData,
          age: Number(formData.age),
        }
      );

      setMessage(
        response.data.message ||
          "Patient updated successfully!"
      );

      setSelectedPatient(null);

      await fetchPatients();
    } catch (error) {
      console.error("Update Patient Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Something went wrong while updating patient."
      );
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setSelectedPatient(null);
    setMessage("");
  };

  if (loading) {
    return (
      <div style={styles.center}>
        Loading patients...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Patient List</h2>

      {message && (
        <p
          style={{
            ...styles.message,
            color: message.toLowerCase().includes("success")
              ? "green"
              : "red",
          }}
        >
          {message}
        </p>
      )}

      {!selectedPatient ? (
        <div style={styles.tableContainer}>
          {patients.length === 0 ? (
            <p style={styles.empty}>
              No patients found.
            </p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Age</th>
                  <th style={styles.th}>Gender</th>
                  <th style={styles.th}>Blood Group</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {patients.map((patient) => (
                  <tr key={patient._id}>
                    <td style={styles.td}>
                      {patient.name}
                    </td>

                    <td style={styles.td}>
                      {patient.phone}
                    </td>

                    <td style={styles.td}>
                      {patient.age}
                    </td>

                    <td style={styles.td}>
                      {patient.gender}
                    </td>

                    <td style={styles.td}>
                      {patient.bloodGroup || "-"}
                    </td>

                    <td style={styles.td}>
                      <button
                        onClick={() => handleEdit(patient)}
                        style={styles.editButton}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div style={styles.formCard}>
          <h3>Edit Patient</h3>

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
              placeholder="Phone"
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

            <div style={styles.buttons}>
              <button
                type="submit"
                disabled={saving}
                style={styles.saveButton}
              >
                {saving
                  ? "Updating..."
                  : "Update Patient"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "25px",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
  },

  heading: {
    marginBottom: "20px",
  },

  center: {
    textAlign: "center",
    padding: "40px",
  },

  tableContainer: {
    overflowX: "auto",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "700px",
  },

  th: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "12px",
    textAlign: "left",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
  },

  editButton: {
    backgroundColor: "#f59e0b",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },

  formCard: {
    backgroundColor: "white",
    maxWidth: "600px",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
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
  },

  buttons: {
    display: "flex",
    gap: "10px",
  },

  saveButton: {
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  cancelButton: {
    backgroundColor: "#6b7280",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  message: {
    fontWeight: "bold",
    marginBottom: "15px",
  },

  empty: {
    padding: "30px",
    textAlign: "center",
  },
};

export default EditPatientList;