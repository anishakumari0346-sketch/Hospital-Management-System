import React, { useEffect, useState } from "react";
import API from "../../services/api";

const EditDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    consultationFee: "",
    availableDays: [],
    status: "Active",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await API.get("/doctor");

      setDoctors(response.data.doctors || []);
    } catch (error) {
      console.error("Fetch Doctors Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load doctors."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Select doctor
  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);

    setFormData({
      name: doctor.name || "",
      email: doctor.email || "",
      phone: doctor.phone || "",
      specialization: doctor.specialization || "",
      experience: doctor.experience ?? "",
      consultationFee: doctor.consultationFee ?? "",
      availableDays: doctor.availableDays || [],
      status: doctor.status || "Active",
    });

    setMessage("");
  };

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle available days
  const handleDayChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      availableDays: checked
        ? [...prev.availableDays, value]
        : prev.availableDays.filter(
            (day) => day !== value
          ),
    }));
  };

  // Update doctor
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctor) {
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const response = await API.put(
        `/doctor/${selectedDoctor._id}`,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          specialization: formData.specialization,
          experience: Number(
            formData.experience || 0
          ),
          consultationFee: Number(
            formData.consultationFee || 0
          ),
          availableDays: formData.availableDays,
          status: formData.status,
        }
      );

      setMessage(
        response.data.message ||
          "Doctor updated successfully!"
      );

      setSelectedDoctor(null);

      await fetchDoctors();
    } catch (error) {
      console.error(
        "Update Doctor Error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Something went wrong while updating doctor."
      );
    } finally {
      setSaving(false);
    }
  };

  // Cancel
  const handleCancel = () => {
    setSelectedDoctor(null);
    setMessage("");
  };

  if (loading) {
    return (
      <div style={styles.center}>
        Loading doctors...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Doctor List</h2>

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

      {!selectedDoctor ? (
        <div style={styles.tableContainer}>
          {doctors.length === 0 ? (
            <p style={styles.empty}>
              No doctors found.
            </p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>
                    Specialization
                  </th>
                  <th style={styles.th}>
                    Experience
                  </th>
                  <th style={styles.th}>Fee</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor._id}>
                    <td style={styles.td}>
                      {doctor.name || "-"}
                    </td>

                    <td style={styles.td}>
                      {doctor.email || "-"}
                    </td>

                    <td style={styles.td}>
                      {doctor.phone || "-"}
                    </td>

                    <td style={styles.td}>
                      {doctor.specialization || "-"}
                    </td>

                    <td style={styles.td}>
                      {doctor.experience || 0} years
                    </td>

                    <td style={styles.td}>
                      ₹{Number(
                        doctor.consultationFee || 0
                      )}
                    </td>

                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.status,
                          backgroundColor:
                            doctor.status === "Active"
                              ? "#dcfce7"
                              : "#fee2e2",
                          color:
                            doctor.status === "Active"
                              ? "#166534"
                              : "#991b1b",
                        }}
                      >
                        {doctor.status || "Active"}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <button
                        onClick={() =>
                          handleEdit(doctor)
                        }
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
          <h3>Edit Doctor</h3>

          <form onSubmit={handleSubmit}>
            <label style={styles.label}>
              Doctor Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <label style={styles.label}>
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <label style={styles.label}>
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <label style={styles.label}>
              Specialization
            </label>

            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <label style={styles.label}>
              Experience (Years)
            </label>

            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              min="0"
              style={styles.input}
            />

            <label style={styles.label}>
              Consultation Fee
            </label>

            <input
              type="number"
              name="consultationFee"
              value={formData.consultationFee}
              onChange={handleChange}
              min="0"
              required
              style={styles.input}
            />

            <label style={styles.label}>
              Available Days
            </label>

            <div style={styles.daysContainer}>
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <label
                  key={day}
                  style={styles.checkboxLabel}
                >
                  <input
                    type="checkbox"
                    value={day}
                    checked={formData.availableDays.includes(
                      day
                    )}
                    onChange={handleDayChange}
                  />

                  {" "}{day}
                </label>
              ))}
            </div>

            <label style={styles.label}>
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>

            <div style={styles.buttons}>
              <button
                type="submit"
                disabled={saving}
                style={styles.saveButton}
              >
                {saving
                  ? "Updating..."
                  : "Update Doctor"}
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
  },

  center: {
    textAlign: "center",
    padding: "40px",
  },

  tableContainer: {
    overflowX: "auto",
    backgroundColor: "#fff",
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
    color: "#fff",
    padding: "12px",
    textAlign: "left",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    whiteSpace: "nowrap",
  },

  editButton: {
    backgroundColor: "#f59e0b",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },

  formCard: {
    backgroundColor: "#fff",
    maxWidth: "650px",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
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

  daysContainer: {
    marginBottom: "15px",
  },

  checkboxLabel: {
    display: "inline-block",
    marginRight: "12px",
    marginBottom: "8px",
  },

  status: {
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },

  buttons: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

  saveButton: {
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  cancelButton: {
    backgroundColor: "#6b7280",
    color: "#fff",
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

export default EditDoctor;