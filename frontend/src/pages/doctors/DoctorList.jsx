import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../services/api";

const DoctorList = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================
  // FETCH DOCTORS
  // ==========================
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/doctor");

      setDoctors(res.data.doctors || []);
    } catch (error) {
      console.error(
        "Fetch Doctors Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load doctors"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // ==========================
  // DELETE DOCTOR
  // ==========================
  const deleteDoctor = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this doctor?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await API.delete(`/doctor/${id}`);

      alert(
        "Doctor deleted successfully!"
      );

      fetchDoctors();
    } catch (error) {
      console.error(
        "Delete Doctor Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to delete doctor"
      );
    }
  };

  // ==========================
  // LOADING
  // ==========================
  if (loading) {
    return (
      <div className="text-center p-4">
        <h4>Loading doctors...</h4>
      </div>
    );
  }

  return (
    <div>
      {/* ==========================
          PAGE HEADER
      ========================== */}
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h2>Doctors</h2>
          <p>
            Manage hospital doctors
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() =>
            navigate("/doctors/add")
          }
        >
          + Add Doctor
        </button>
      </div>

      {/* ==========================
          ERROR
      ========================== */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* ==========================
          EMPTY STATE
      ========================== */}
      {!error && doctors.length === 0 && (
        <div className="content-card text-center p-4">
          <h4>No doctors found</h4>

          <p>
            Add your first doctor to get
            started.
          </p>

          <button
            className="btn btn-primary"
            onClick={() =>
              navigate("/doctors/add")
            }
          >
            Add Doctor
          </button>
        </div>
      )}

      {/* ==========================
          DOCTOR TABLE
      ========================== */}
      {doctors.length > 0 && (
        <div className="content-card">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Doctor Name</th>
                  <th>Specialization</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Experience</th>
                  <th>Consultation Fee</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {doctors.map(
                  (doctor, index) => (
                    <tr key={doctor._id}>
                      {/* Number */}
                      <td>
                        {index + 1}
                      </td>

                      {/* Name */}
                      <td>
                        <strong>
                          Dr. {doctor.name}
                        </strong>
                      </td>

                      {/* Specialization */}
                      <td>
                        {doctor.specialization ||
                          "-"}
                      </td>

                      {/* Email */}
                      <td>
                        {doctor.email || "-"}
                      </td>

                      {/* Phone */}
                      <td>
                        {doctor.phone || "-"}
                      </td>

                      {/* Experience */}
                      <td>
                        {doctor.experience ?? 0}{" "}
                        years
                      </td>

                      {/* Fee */}
                      <td>
                        ₹
                        {doctor.consultationFee ??
                          0}
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`badge ${
                            doctor.status ===
                            "Active"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {doctor.status ||
                            "Active"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() =>
                              navigate(
                                `/doctors/edit/${doctor._id}`
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              deleteDoctor(
                                doctor._id
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorList;
