import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BillingList = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const fetchBills = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await axios.get(
        "http://localhost:5000/api/billing"
      );

      setBills(
        response.data.billings ||
          response.data.bills ||
          []
      );
    } catch (error) {
      console.error("Fetch Billing Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Something went wrong while loading bills."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  if (loading) {
    return (
      <div style={styles.center}>
        Loading bills...
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>

        <h2 style={styles.heading}>
          Billing List
        </h2>

        <div style={styles.buttonGroup}>

          {/* Add Billing Button */}
          <button
            onClick={() => navigate("/billing/add")}
            style={styles.addButton}
          >
            + Add Billing
          </button>

          {/* Refresh Button */}
          <button
            onClick={fetchBills}
            style={styles.refreshButton}
          >
            Refresh
          </button>

        </div>
      </div>

      {/* Error Message */}
      {message && (
        <p style={styles.error}>
          {message}
        </p>
      )}

      {/* No Bills */}
      {bills.length === 0 ? (
        <div style={styles.empty}>

          <p>No bills found.</p>

          <button
            onClick={() => navigate("/billing/add")}
            style={styles.emptyButton}
          >
            + Add First Bill
          </button>

        </div>
      ) : (

        /* Billing Table */
        <div style={styles.tableContainer}>

          <table style={styles.table}>

            <thead>
              <tr>

                <th style={styles.th}>
                  Patient
                </th>

                <th style={styles.th}>
                  Appointment
                </th>

                <th style={styles.th}>
                  Consultation
                </th>

                <th style={styles.th}>
                  Medicine
                </th>

                <th style={styles.th}>
                  Tests
                </th>

                <th style={styles.th}>
                  Other
                </th>

                <th style={styles.th}>
                  Total
                </th>

                <th style={styles.th}>
                  Payment Status
                </th>

                <th style={styles.th}>
                  Payment Method
                </th>

                <th style={styles.th}>
                  Date
                </th>

              </tr>
            </thead>

            <tbody>

              {bills.map((bill) => (

                <tr key={bill._id}>

                  {/* Patient */}
                  <td style={styles.td}>
                    {bill.patient?.name ||
                      bill.patient ||
                      "-"}
                  </td>

                  {/* Appointment */}
                  <td style={styles.td}>
                    {bill.appointment?.appointmentDate
                      ? new Date(
                          bill.appointment.appointmentDate
                        ).toLocaleDateString()
                      : bill.appointment
                      ? "Appointment"
                      : "-"}
                  </td>

                  {/* Consultation */}
                  <td style={styles.td}>
                    ₹{bill.consultationFee || 0}
                  </td>

                  {/* Medicine */}
                  <td style={styles.td}>
                    ₹{bill.medicineCharges || 0}
                  </td>

                  {/* Tests */}
                  <td style={styles.td}>
                    ₹{bill.testCharges || 0}
                  </td>

                  {/* Other */}
                  <td style={styles.td}>
                    ₹{bill.otherCharges || 0}
                  </td>

                  {/* Total */}
                  <td style={styles.total}>
                    ₹{bill.totalAmount || 0}
                  </td>

                  {/* Payment Status */}
                  <td style={styles.td}>

                    <span
                      style={{
                        ...styles.status,

                        backgroundColor:
                          bill.paymentStatus === "Paid"
                            ? "#dcfce7"
                            : bill.paymentStatus === "Partial"
                            ? "#fef3c7"
                            : "#fee2e2",

                        color:
                          bill.paymentStatus === "Paid"
                            ? "#166534"
                            : bill.paymentStatus === "Partial"
                            ? "#92400e"
                            : "#991b1b",
                      }}
                    >
                      {bill.paymentStatus ||
                        "Pending"}
                    </span>

                  </td>

                  {/* Payment Method */}
                  <td style={styles.td}>
                    {bill.paymentMethod || "-"}
                  </td>

                  {/* Created Date */}
                  <td style={styles.td}>
                    {bill.createdAt
                      ? new Date(
                          bill.createdAt
                        ).toLocaleDateString()
                      : "-"}
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
    gap: "15px",
    flexWrap: "wrap",
  },

  heading: {
    margin: 0,
    fontSize: "24px",
    color: "#1f2937",
  },

  buttonGroup: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },

  /* Add Billing Button */
  addButton: {
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  /* Refresh Button */
  refreshButton: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  tableContainer: {
    overflowX: "auto",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.08)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1100px",
  },

  th: {
    backgroundColor: "#2563eb",
    color: "#fff",
    padding: "12px",
    textAlign: "left",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    whiteSpace: "nowrap",
  },

  total: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    fontWeight: "bold",
    color: "#2563eb",
    whiteSpace: "nowrap",
  },

  status: {
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },

  center: {
    textAlign: "center",
    padding: "40px",
  },

  empty: {
    backgroundColor: "#fff",
    padding: "30px",
    textAlign: "center",
    borderRadius: "10px",
  },

  emptyButton: {
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
    fontWeight: "600",
  },

  error: {
    color: "#b91c1c",
    backgroundColor: "#fee2e2",
    padding: "10px",
    borderRadius: "6px",
  },
};

export default BillingList;