import React, { useEffect, useState } from "react";
import API from "../../services/api";

const EditBilling = () => {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

  const [formData, setFormData] = useState({
    consultationFee: "",
    medicineCharges: "",
    testCharges: "",
    otherCharges: "",
    paymentStatus: "Pending",
    paymentMethod: "Cash",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch all bills
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
      console.error("Fetch Bills Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load bills."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // Select bill for editing
  const handleEdit = (bill) => {
    setSelectedBill(bill);

    setFormData({
      consultationFee: bill.consultationFee ?? "",
      medicineCharges: bill.medicineCharges ?? "",
      testCharges: bill.testCharges ?? "",
      otherCharges: bill.otherCharges ?? "",
      paymentStatus: bill.paymentStatus || "Pending",
      paymentMethod: bill.paymentMethod || "Cash",
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

  // Calculate total
  const totalAmount =
    Number(formData.consultationFee || 0) +
    Number(formData.medicineCharges || 0) +
    Number(formData.testCharges || 0) +
    Number(formData.otherCharges || 0);

  // Update bill
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBill) {
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const response = await API.put(
        `/billing/${selectedBill._id}`,
        {
          consultationFee: Number(
            formData.consultationFee || 0
          ),
          medicineCharges: Number(
            formData.medicineCharges || 0
          ),
          testCharges: Number(
            formData.testCharges || 0
          ),
          otherCharges: Number(
            formData.otherCharges || 0
          ),
          totalAmount,
          paymentStatus: formData.paymentStatus,
          paymentMethod: formData.paymentMethod,
        }
      );

      setMessage(
        response.data.message ||
          "Bill updated successfully!"
      );

      setSelectedBill(null);

      await fetchBills();
    } catch (error) {
      console.error("Update Billing Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Something went wrong while updating bill."
      );
    } finally {
      setSaving(false);
    }
  };

  // Cancel
  const handleCancel = () => {
    setSelectedBill(null);
    setMessage("");
  };

  if (loading) {
    return (
      <div style={styles.center}>
        Loading bills...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Billing List</h2>

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

      {!selectedBill ? (
        <div style={styles.tableContainer}>
          {bills.length === 0 ? (
            <p style={styles.empty}>
              No bills found.
            </p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Patient</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Payment Status</th>
                  <th style={styles.th}>Payment Method</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {bills.map((bill) => (
                  <tr key={bill._id}>
                    <td style={styles.td}>
                      {bill.patient?.name ||
                        bill.patient ||
                        "-"}
                    </td>

                    <td style={styles.total}>
                      ₹{Number(bill.totalAmount || 0)}
                    </td>

                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.status,
                          backgroundColor:
                            bill.paymentStatus === "Paid"
                              ? "#dcfce7"
                              : bill.paymentStatus ===
                                "Partial"
                              ? "#fef3c7"
                              : "#fee2e2",
                          color:
                            bill.paymentStatus === "Paid"
                              ? "#166534"
                              : bill.paymentStatus ===
                                "Partial"
                              ? "#92400e"
                              : "#991b1b",
                        }}
                      >
                        {bill.paymentStatus ||
                          "Pending"}
                      </span>
                    </td>

                    <td style={styles.td}>
                      {bill.paymentMethod || "-"}
                    </td>

                    <td style={styles.td}>
                      {bill.createdAt
                        ? new Date(
                            bill.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td style={styles.td}>
                      <button
                        onClick={() => handleEdit(bill)}
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
          <h3>Edit Bill</h3>

          <form onSubmit={handleSubmit}>
            <label style={styles.label}>
              Consultation Fee
            </label>

            <input
              type="number"
              name="consultationFee"
              value={formData.consultationFee}
              onChange={handleChange}
              min="0"
              style={styles.input}
            />

            <label style={styles.label}>
              Medicine Charges
            </label>

            <input
              type="number"
              name="medicineCharges"
              value={formData.medicineCharges}
              onChange={handleChange}
              min="0"
              style={styles.input}
            />

            <label style={styles.label}>
              Test Charges
            </label>

            <input
              type="number"
              name="testCharges"
              value={formData.testCharges}
              onChange={handleChange}
              min="0"
              style={styles.input}
            />

            <label style={styles.label}>
              Other Charges
            </label>

            <input
              type="number"
              name="otherCharges"
              value={formData.otherCharges}
              onChange={handleChange}
              min="0"
              style={styles.input}
            />

            <div style={styles.totalBox}>
              <span>Total Amount</span>
              <strong>₹{totalAmount}</strong>
            </div>

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

            <div style={styles.buttons}>
              <button
                type="submit"
                disabled={saving}
                style={styles.saveButton}
              >
                {saving
                  ? "Updating..."
                  : "Update Bill"}
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
    minWidth: "750px",
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
  },

  total: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    fontWeight: "bold",
    color: "#2563eb",
  },

  status: {
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
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
    maxWidth: "600px",
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

  buttons: {
    display: "flex",
    gap: "10px",
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

export default EditBilling;