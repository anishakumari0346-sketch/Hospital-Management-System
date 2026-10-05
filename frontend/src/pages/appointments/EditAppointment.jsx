import React, { useEffect, useState } from "react";
import API from "../../services/api";

const EditAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [selectedAppointment, setSelectedAppointment] =
    useState(null);

  const [formData, setFormData] = useState({
    patient: "",
    doctor: "",
    appointmentDate: "",
    reason: "",
    status: "Pending",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // =========================
  // FETCH APPOINTMENTS
  // =========================
  const fetchAppointments = async () => {
    try {
      const response = await API.get("/appointment");

      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error("Fetch Appointments Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load appointments."
      );
    }
  };

  // =========================
  // FETCH PATIENTS
  // =========================
  const fetchPatients = async () => {
    try {
      const response = await API.get("/patient");

      setPatients(response.data.patients || []);
    } catch (error) {
      console.error("Fetch Patients Error:", error);
    }
  };

  // =========================
  // FETCH DOCTORS
  // =========================
  const fetchDoctors = async () => {
    try {
      const response = await API.get("/doctor");

      setDoctors(response.data.doctors || []);
    } catch (error) {
      console.error("Fetch Doctors Error:", error);
    }
  };

  // =========================
  // LOAD ALL DATA
  // =========================
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([
        fetchAppointments(),
        fetchPatients(),
        fetchDoctors(),
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  // =========================
  // EDIT BUTTON
  // =========================
  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);

    let formattedDate = "";

    if (appointment.appointmentDate) {
      const date = new Date(appointment.appointmentDate);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    setFormData({
      patient:
        appointment.patient?._id ||
        appointment.patient ||
        "",

      doctor:
        appointment.doctor?._id ||
        appointment.doctor ||
        "",

      appointmentDate: formattedDate,

      reason: appointment.reason || "",

      status: appointment.status || "Pending",
    });

    setMessage("");
  };

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // UPDATE APPOINTMENT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAppointment) {
      return;
    }

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
      setSaving(true);
      setMessage("");

      const response = await API.put(
        `/appointment/${selectedAppointment._id}`,
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
          "Appointment updated successfully!"
      );

      setSelectedAppointment(null);

      await fetchAppointments();
    } catch (error) {
      console.error("Update Appointment Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Something went wrong while updating appointment."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // CANCEL
  // =========================
  const handleCancel = () => {
    setSelectedAppointment(null);
    setMessage("");
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div style={styles.center}>
        Loading appointments...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>
        Appointment Management
      </h2>

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

      {/* =========================
          APPOINTMENT LIST
      ========================= */}
      {!selectedAppointment ? (
        <div style={styles.tableContainer}>
          {appointments.length === 0 ? (
            <div style={styles.empty}>
              <p>No appointments found.</p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Patient</th>
                  <th style={styles.th}>Doctor</th>
                  <th style={styles.th}>Specialization</th>
                  <th style={styles.th}>Date & Time</th>
                  <th style={styles.th}>Reason</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td style={styles.td}>
                      {appointment.patient?.name || "Patient"}
                    </td>

                    <td style={styles.td}>
                      {appointment.doctor?.name
                        ? `Dr. ${appointment.doctor.name}`
                        : "Doctor"}
                    </td>

                    <td style={styles.td}>
                      {appointment.doctor?.specialization || "-"}
                    </td>

                    <td style={styles.td}>
                      {appointment.appointmentDate
                        ? new Date(
                            appointment.appointmentDate
                          ).toLocaleString()
                        : "-"}
                    </td>

                    <td style={styles.td}>
                      {appointment.reason || "-"}
                    </td>

                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.status,
                          backgroundColor:
                            appointment.status === "Confirmed"
                              ? "#dcfce7"
                              : appointment.status === "Completed"
                              ? "#dbeafe"
                              : appointment.status === "Cancelled"
                              ? "#fee2e2"
                              : "#fef3c7",

                          color:
                            appointment.status === "Confirmed"
                              ? "#166534"
                              : appointment.status === "Completed"
                              ? "#1e40af"
                              : appointment.status === "Cancelled"
                              ? "#991b1b"
                              : "#92400e",
                        }}
                      >
                        {appointment.status}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <button
                        onClick={() => handleEdit(appointment)}
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
        /* =========================
           EDIT FORM
        ========================= */
        <div style={styles.formCard}>
          <h3>Edit Appointment</h3>

          <form onSubmit={handleSubmit}>
            {/* Patient */}
            <label style={styles.label}>
              Patient
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
              Doctor
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
                  Dr. {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>

            {/* Date */}
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
              value={formData.reason}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Enter appointment reason"
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

            {/* Buttons */}
            <div style={styles.buttons}>
              <button
                type="submit"
                disabled={saving}
                style={styles.saveButton}
              >
                {saving
                  ? "Updating..."
                  : "Update Appointment"}
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
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    padding: "25px",
  },

  heading: {
    marginBottom: "20px",
    color: "#1f2937",
  },

  center: {
    textAlign: "center",
    padding: "40px",
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
    minWidth: "1100px",
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

  editButton: {
    backgroundColor: "#f59e0b",
    color: "#ffffff",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },

  formCard: {
    backgroundColor: "#ffffff",
    maxWidth: "650px",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
  },

  label: {
    display: "block",
    fontWeight: "600",
    marginBottom: "6px",
    color: "#374151",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    boxSizing: "border-box",
    fontSize: "15px",
    backgroundColor: "#fff",
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
    marginTop: "10px",
  },

  saveButton: {
    backgroundColor: "#16a34a",
    color: "#ffffff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  cancelButton: {
    backgroundColor: "#6b7280",
    color: "#ffffff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  message: {
    fontWeight: "600",
    marginBottom: "15px",
  },

  empty: {
    padding: "30px",
    textAlign: "center",
  },
};

export default EditAppointment;