import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await axios.get(
        "http://localhost:5000/api/appointment"
      );

      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error("Fetch Appointments Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Something went wrong while loading appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Change appointment status
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/appointment/${id}`,
        { status }
      );

      setMessage("Appointment status updated successfully.");

      fetchAppointments();
    } catch (error) {
      console.error("Update Status Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to update appointment status."
      );
    }
  };

  if (loading) {
    return (
      <div style={styles.center}>
        Loading appointments...
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.heading}>
          Appointment List
        </h2>

        <div style={styles.buttonGroup}>

          {/* Add Appointment */}
          <button
            onClick={() => navigate("/appointments/add")}
            style={styles.addButton}
          >
            + Add Appointment
          </button>

          {/* Refresh */}
          <button
            onClick={fetchAppointments}
            style={styles.refreshButton}
          >
            Refresh
          </button>

        </div>
      </div>

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

      {/* No appointments */}
      {appointments.length === 0 ? (
        <div style={styles.empty}>
          <p>No appointments found.</p>

          <button
            onClick={() => navigate("/appointments/add")}
            style={styles.emptyButton}
          >
            + Add First Appointment
          </button>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>

            <thead>
              <tr>
                <th style={styles.th}>Patient</th>
                <th style={styles.th}>Doctor</th>
                <th style={styles.th}>
                  Specialization
                </th>
                <th style={styles.th}>
                  Appointment Date
                </th>
                <th style={styles.th}>Reason</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id}>

                  {/* Patient */}
                  <td style={styles.td}>
                    {appointment.patient?.name ||
                      "Patient"}
                  </td>

                  {/* Doctor */}
                  <td style={styles.td}>
                    {appointment.doctor?.name
                      ? `Dr. ${appointment.doctor.name}`
                      : "Doctor"}
                  </td>

                  {/* Specialization */}
                  <td style={styles.td}>
                    {appointment.doctor
                      ?.specialization || "-"}
                  </td>

                  {/* Date */}
                  <td style={styles.td}>
                    {appointment.appointmentDate
                      ? new Date(
                          appointment.appointmentDate
                        ).toLocaleString()
                      : "-"}
                  </td>

                  {/* Reason */}
                  <td style={styles.td}>
                    {appointment.reason || "-"}
                  </td>

                  {/* Status */}
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.status,
                        backgroundColor:
                          appointment.status ===
                          "Confirmed"
                            ? "#dcfce7"
                            : appointment.status ===
                              "Completed"
                            ? "#dbeafe"
                            : appointment.status ===
                              "Cancelled"
                            ? "#fee2e2"
                            : "#fef3c7",

                        color:
                          appointment.status ===
                          "Confirmed"
                            ? "#166534"
                            : appointment.status ===
                              "Completed"
                            ? "#1e40af"
                            : appointment.status ===
                              "Cancelled"
                            ? "#991b1b"
                            : "#92400e",
                      }}
                    >
                      {appointment.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td style={styles.td}>
                    <select
                      value={appointment.status}
                      onChange={(e) =>
                        updateStatus(
                          appointment._id,
                          e.target.value
                        )
                      }
                      style={styles.select}
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
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    padding: "25px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  heading: {
    margin: 0,
    color: "#1f2937",
  },

  buttonGroup: {
    display: "flex",
    gap: "10px",
  },

  addButton: {
    backgroundColor: "#16a34a",
    color: "#ffffff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  refreshButton: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  emptyButton: {
    backgroundColor: "#16a34a",
    color: "#ffffff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
    fontWeight: "600",
  },

  tableContainer: {
    overflowX: "auto",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1000px",
  },

  th: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    padding: "12px",
    textAlign: "left",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    whiteSpace: "nowrap",
  },

  status: {
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },

  select: {
    padding: "7px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#fff",
  },

  center: {
    textAlign: "center",
    padding: "40px",
  },

  empty: {
    backgroundColor: "#ffffff",
    padding: "30px",
    textAlign: "center",
    borderRadius: "10px",
  },

  message: {
    fontWeight: "600",
    marginBottom: "15px",
  },
};

export default AppointmentList;