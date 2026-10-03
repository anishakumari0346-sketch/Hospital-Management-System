import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Doctors
import DoctorList from "./pages/doctors/DoctorList";
import DoctorForm from "./pages/doctors/DoctorForm";

// Patients
import PatientList from "./pages/patients/PatientList";
import AddPatient from "./pages/patients/AddPatient";
import EditPatient from "./pages/patients/EditPatient";

// Appointments
import AppointmentList from "./pages/appointments/AppointmentList";
import AddAppointment from "./pages/appointments/AddAppointment";
import EditAppointment from "./pages/appointments/EditAppointment";

// Billing
import BillingList from "./pages/billing/BillingList";
import AddBilling from "./pages/billing/AddBilling";
import EditBilling from "./pages/billing/EditBilling";


const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Login */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* Register */}
          <Route
            path="/register"
            element={<Register />}
          />


          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />


            {/* ================= DOCTORS ================= */}

            <Route
              path="/doctors"
              element={<DoctorList />}
            />

            <Route
              path="/doctors/add"
              element={<DoctorForm />}
            />

            <Route
              path="/doctors/edit/:id"
              element={<DoctorForm />}
            />


            {/* ================= PATIENTS ================= */}

            <Route
              path="/patients"
              element={<PatientList />}
            />

            <Route
              path="/patients/add"
              element={<AddPatient />}
            />

            <Route
              path="/patients/edit/:id"
              element={<EditPatient />}
            />


            {/* ================= APPOINTMENTS ================= */}

            <Route
              path="/appointments"
              element={<AppointmentList />}
            />

            <Route
              path="/appointments/add"
              element={<AddAppointment />}
            />

            <Route
              path="/appointments/edit/:id"
              element={<EditAppointment />}
            />


            {/* ================= BILLING ================= */}

            <Route
              path="/billing"
              element={<BillingList />}
            />

            <Route
              path="/billing/add"
              element={<AddBilling />}
            />

            <Route
              path="/billing/edit/:id"
              element={<EditBilling />}
            />

          </Route>


          {/* Unknown URL */}
          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;