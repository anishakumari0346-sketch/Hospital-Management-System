import { useEffect, useState } from "react";

import {
  FaUserMd,
  FaUsers,
  FaCalendarCheck,
  FaMoneyBillWave,
} from "react-icons/fa";

import API from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);

  // ==========================
  // FETCH DASHBOARD DATA
  // ==========================
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const [
        doctorsResponse,
        patientsResponse,
        appointmentsResponse,
        billingResponse,
      ] = await Promise.all([
        API.get("/doctor"),
        API.get("/patient"),
        API.get("/appointment"),
        API.get("/billing"),
      ]);

      // Backend se arrays nikalna
      const doctors =
        doctorsResponse.data.doctors || [];

      const patients =
        patientsResponse.data.patients || [];

      const appointments =
        appointmentsResponse.data.appointments ||
        [];

      const billings =
        billingResponse.data.billings || [];

      // Total revenue calculate
      const revenue = billings.reduce(
        (total, bill) =>
          total + Number(bill.totalAmount || 0),
        0
      );

      setStats({
        doctors: doctors.length,
        patients: patients.length,
        appointments: appointments.length,
        revenue,
      });
    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // DASHBOARD CARDS
  // ==========================
  const cards = [
    {
      title: "Total Doctors",
      value: stats.doctors,
      icon: <FaUserMd />,
      color: "primary",
    },
    {
      title: "Total Patients",
      value: stats.patients,
      icon: <FaUsers />,
      color: "success",
    },
    {
      title: "Appointments",
      value: stats.appointments,
      icon: <FaCalendarCheck />,
      color: "warning",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.revenue}`,
      icon: <FaMoneyBillWave />,
      color: "danger",
    },
  ];

  return (
    <div>
      {/* ==========================
          HEADER
      ========================== */}
      <h2 className="mb-4">
        Dashboard
      </h2>

      {/* ==========================
          LOADING
      ========================== */}
      {loading ? (
        <div className="text-center p-4">
          <h5>Loading dashboard...</h5>
        </div>
      ) : (
        <div className="row">
          {cards.map((card) => (
            <div
              className="col-md-6 col-lg-3 mb-4"
              key={card.title}
            >
              <div
                className={`card dashboard-card border-${card.color}`}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">

                    {/* Card Text */}
                    <div>
                      <h6 className="text-muted">
                        {card.title}
                      </h6>

                      <h3>
                        {card.value}
                      </h3>
                    </div>

                    {/* Card Icon */}
                    <div
                      className={`dashboard-icon text-${card.color}`}
                    >
                      {card.icon}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
