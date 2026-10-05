import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/app";

const BillingList = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // ===============================
  // FETCH BILLS
  // ===============================
  const fetchBills = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await API.get("/billing");

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

  // ===============================
  // LOAD BILLS
  // ===============================
  useEffect(() => {
    fetchBills();
  }, []);

  // ===============================
  // LOADING
  // ===============================
  if (loading) {
    return (
      <div style={styles.center}>
        Loading bills...
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* ===============================
          HEADER
      =============================== */}
      <div style={styles.header}>

        <h2 style={styles.heading}>
          Billing List
        </h2>

        <div style={styles.buttonGroup}>

          {/* ADD BILLING */}
          <button
            onClick={() => navigate("/billing/add")}
            style={styles.addButton}
          >
            + Add Billing
          </button>

          {/* REFRESH */}
          <button
            onClick={fetchBills}
            style={styles.refreshButton}
          >
            Refresh
          </button>

        </div>
      </div>

      {/* ===============================
          ERROR MESSAGE
      =============================== */}
      {message && (
        <p style={styles.error}>
          {message}
        </p>
      )}

      {/* ===============================
          NO BILLS
      =============================== */}
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

        /* ===============================
           BILLING TABLE
        =============================== */
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

                  {/* PATIENT */}
                  <td style={styles.td}>
                    {bill.patient?.name ||
                      bill.patient ||
                      "-"}
                  </td>

                  {/* APPOINTMENT */}
                  <td style={styles.td}>
                    {bill.appointment?.appointmentDate
                      ? new Date(
                          bill.appointment.appointmentDate
                        ).toLocaleDateString()
                      : bill.appointment
                      ? "Appointment"
                      : "-"}
                  </td>

                  {/* CONSULTATION */}
                  <td style={styles.td}>
                    ₹{Number(bill.consultationFee || 0)}
                  </td>

                  {/* MEDICINE */}
                  <td style={styles.td}>
                    ₹{Number(bill.medicineCharges || 0)}
                  </td>

                  {/* TEST */}
                  <td style={styles.td}>
                    ₹{Number(bill.testCharges || 0)}
                  </td>

                  {/* OTHER */}
                  <td style={styles.td}>
                    ₹{Number(bill.otherCharges || 0)}
                  </td>

                  {/* TOTAL */}
                  <td style={styles.total}>
                    ₹{Number(bill.totalAmount || 0)}
                  </td>

                  {/* PAYMENT STATUS */}
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
                      {bill.paymentStatus || "Pending"}
                    </span>

                  </td>

                  {/* PAYMENT METHOD */}
                  <td style={styles.td}>
                    {bill.paymentMethod || "-"}
                  </td>

                  {/* CREATED DATE */}
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

  addButton: {
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

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