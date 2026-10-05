import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/app";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await API.get("/patient");

      setPatients(response.data.patients || response.data || []);
    } catch (error) {
      console.error("Fetch Patients Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Something went wrong while loading patients."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) {
    return <div style={styles.center}>Loading patients...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2>Patient List</h2>

        <div style={styles.buttonGroup}>
          {/* Add Patient Button */}
          <button
            onClick={() => navigate("/patients/add")}
            style={styles.addButton}
          >
            + Add Patient
          </button>

          {/* Refresh Button */}
          <button
            onClick={fetchPatients}
            style={styles.refreshButton}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {message && <p style={styles.error}>{message}</p>}

      {/* No Patients */}
      {patients.length === 0 ? (
        <div style={styles.empty}>
          <p>No patients found.</p>

          <button
            onClick={() => navigate("/patients/add")}
            style={styles.emptyButton}
          >
            + Add First Patient
          </button>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Age</th>
                <th style={styles.th}>Gender</th>
                <th style={styles.th}>Blood Group</th>
                <th style={styles.th}>Address</th>
                <th style={styles.th}>Medical History</th>
              </tr>
            </thead>

            <tbody>
              {patients.map((patient) => (
                <tr key={patient._id}>
                  <td style={styles.td}>
                    {patient.name}
                  </td>

                  <td style={styles.td}>
                    {patient.email || "-"}
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
                    {patient.address || "-"}
                  </td>

                  <td style={styles.td}>
                    {patient.medicalHistory || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  buttonGroup: {
    display: "flex",
    gap: "10px",
  },

  addButton: {
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },

  refreshButton: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  emptyButton: {
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
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
    minWidth: "900px",
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
    color: "#333",
  },

  center: {
    textAlign: "center",
    padding: "40px",
  },

  empty: {
    backgroundColor: "white",
    padding: "30px",
    textAlign: "center",
    borderRadius: "10px",
  },

  error: {
    color: "red",
    backgroundColor: "#fee2e2",
    padding: "10px",
    borderRadius: "6px",
  },
};

export default PatientList;