import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import API from "../../services/app";

const DoctorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const editing = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    specialization: "",
    email: "",
    phone: "",
    experience: "",
    consultationFee: "",
    availableDays: [],
    status: "Active",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (editing) {
      fetchDoctor();
    }
  }, [id]);

  // Fetch doctor for edit
  const fetchDoctor = async () => {
    try {
      setFetching(true);

      const res = await API.get(`/doctor/${id}`);

      const doctor = res.data.doctor || res.data;

      setForm({
        name: doctor.name || "",
        specialization: doctor.specialization || "",
        email: doctor.email || "",
        phone: doctor.phone || "",
        experience: doctor.experience ?? "",
        consultationFee: doctor.consultationFee ?? "",
        availableDays: doctor.availableDays || [],
        status: doctor.status || "Active",
      });
    } catch (error) {
      console.error("Fetch Doctor Error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to load doctor details"
      );
    } finally {
      setFetching(false);
    }
  };

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle available days
  const handleDayChange = (e) => {
    const { value, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      availableDays: checked
        ? [...prev.availableDays, value]
        : prev.availableDays.filter(
            (day) => day !== value
          ),
    }));
  };

  // Submit form
  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const doctorData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        specialization: form.specialization,

        experience:
          form.experience === ""
            ? 0
            : Number(form.experience),

        consultationFee:
          Number(form.consultationFee) || 0,

        availableDays: form.availableDays,

        status: form.status,
      };

      if (editing) {
        await API.put(
          `/doctor/${id}`,
          doctorData
        );

        alert("Doctor updated successfully!");
      } else {
        await API.post(
          "/doctor",
          doctorData
        );

        alert("Doctor added successfully!");
      }

      navigate("/doctors");
    } catch (error) {
      console.error("Doctor Submit Error:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="text-center p-4">
        <h4>Loading doctor...</h4>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2>
            {editing ? "Edit Doctor" : "Add Doctor"}
          </h2>
        </div>
      </div>

      {/* Form Card */}
      <div className="content-card">
        <form onSubmit={submit}>
          <div className="row">

            {/* Doctor Name */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Doctor Name</label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter doctor name"
                  required
                />
              </div>
            </div>

            {/* Specialization */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Specialization</label>

                <input
                  type="text"
                  name="specialization"
                  className="form-control"
                  value={form.specialization}
                  onChange={handleChange}
                  placeholder="Cardiologist"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="doctor@gmail.com"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Phone</label>

                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            {/* Experience */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Experience (Years)</label>

                <input
                  type="number"
                  name="experience"
                  className="form-control"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="5"
                  min="0"
                />
              </div>
            </div>

            {/* Consultation Fee */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Consultation Fee</label>

                <input
                  type="number"
                  name="consultationFee"
                  className="form-control"
                  value={form.consultationFee}
                  onChange={handleChange}
                  placeholder="500"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Available Days */}
            <div className="col-12">
              <div className="form-group">
                <label>Available Days</label>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "15px",
                    marginTop: "10px",
                  }}
                >
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
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <input
                        type="checkbox"
                        value={day}
                        checked={form.availableDays.includes(
                          day
                        )}
                        onChange={handleDayChange}
                      />

                      {day}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Status</label>

                <select
                  name="status"
                  className="form-control"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <button
            type="submit"
            className="btn btn-primary me-2"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editing
              ? "Update Doctor"
              : "Add Doctor"}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/doctors")}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorForm;