import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchMe,
    selectUser,
    selectAuthChecked,
} from "./features/auth/authSlice";

import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./screens/Header";
import Footer from "./screens/Footer";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import AdminPrograms from "./pages/AdminPrograms";
import CreateUser from "./pages/CreateUser";
import UserProfile from "./pages/UserProfile";
import Teacher from "./pages/Teacher";
import Department from "./pages/Department";
import StudentPrograms from "./pages/StudentPrograms";
import Home from "./pages/Home";
import Event from "./pages/Event";
import RegisterEvent from "./pages/RegisterEvent";
import Announcment from "./pages/Announcment";
import Contact from "./pages/Contact";
import Results from "./pages/Results";
import Point_Table from "./pages/Point_Table";
import Gallery from "./pages/Gallery";
import Shedule from "./pages/Shedule";
import EventDetail from "./pages/EventDetail";
import MyEvents from "./pages/MyEvents";
import PageNotFound from "./screens/PageNotFound";
import ResultDetails from "./pages/ResultDetailed";
import Account from "./screens/Account";
import Participations from "./pages/Participations";
import AnnouncementCreate from "./pages/AnnouncementCreate";
import AddScore from "./pages/AddScore";
import JudgeDashboard from "./pages/JudgeDashboard";

// Redirects '/' to the correct role-specific page
const RoleDashboard = () => {
    const user = useSelector(selectUser);
    const routes = {
        principal: "/principal",
        admin: "/admin",
        teacher: "/teacher",
        judge: "/judge",
        student: "/student",
        vice_principal: "/vice-principal",
    };
    return <Navigate to={routes[user?.role] || "/login"} replace />;
};

function App() {
    const dispatch = useDispatch();
    const authChecked = useSelector(selectAuthChecked);

    useEffect(() => {
        dispatch(fetchMe());
    }, [dispatch]);

    if (!authChecked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3 text-indigo-600">
                    <svg
                        className="animate-spin h-8 w-8 text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                        />
                    </svg>
                    <p className="text-sm font-medium">Loading session...</p>
                </div>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/events" element={<Event />} />
                        <Route
                            path="/register-event"
                            element={<RegisterEvent />}
                        />
                        <Route
                            path="/announcements"
                            element={<Announcment />}
                        />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/results" element={<Results />} />
                        <Route
                            path="/results/:id"
                            element={<ResultDetails />}
                        />
                        <Route path="/points_table" element={<Point_Table />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/schedule" element={<Shedule />} />
                        <Route path="/event/:id" element={<EventDetail />} />
                        <Route path="/my-events" element={<MyEvents />} />
                        <Route
                            path="/announcement/"
                            element={<Announcment />}
                        />
                        <Route path="/account/" element={<Account />} />
                        <Route path="*" element={<PageNotFound />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/admin"
                            element={
                                <PrivateRoute roles={["admin", "principal"]}>
                                    <Admin />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin/create-user"
                            element={
                                <PrivateRoute
                                    roles={["admin", "principal", "teacher"]}
                                >
                                    <CreateUser />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin/announcement"
                            element={
                                <PrivateRoute
                                    roles={["admin", "principal", "judge", "teacher"]}
                                >
                                    <AnnouncementCreate />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin/scoreupload"
                            element={
                                <PrivateRoute
                                    roles={["admin", "principal", "judge"]}
                                >
                                    <AddScore />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin/schedule/:id"
                            element={
                                <PrivateRoute
                                    roles={["admin", "principal", "judge", "teacher"]}
                                >
                                    <AnnouncementCreate />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/department/:id"
                            element={
                                <PrivateRoute>
                                    <Department />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/department/:id"
                            element={
                                <PrivateRoute>
                                    <Department />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/participations"
                            element={
                                <PrivateRoute
                                    roles={[
                                        "admin",
                                        "principal",
                                        "judge",
                                        "teacher",
                                    ]}
                                >
                                    <Participations />
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/admin/users/:id"
                            element={
                                <PrivateRoute
                                    roles={["admin", "principal", "teacher"]}
                                >
                                    <UserProfile />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/unauthorized"
                            element={
                                <div className="p-8 text-red-600 text-xl font-bold">
                                    403 — You are not authorized to view this
                                    page.
                                </div>
                            }
                        />
                        <Route
                            path="/admin/programs"
                            element={
                                <PrivateRoute roles={["admin", "principal"]}>
                                    <AdminPrograms />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/teacher"
                            element={
                                <PrivateRoute roles={["teacher"]}>
                                    <Teacher />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/judge"
                            element={
                                <PrivateRoute roles={["judge"]}>
                                    <JudgeDashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/student"
                            element={
                                <PrivateRoute roles={["student"]}>
                                    <StudentPrograms />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                    {/* <Routes>

                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <RoleDashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={<Profile />} />
                        
                  
                        <Route
                            path="/admin"
                            element={
                                <PrivateRoute roles={["admin", "principal"]}>
                                    <Admin />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/principal"
                            element={
                                <PrivateRoute roles={["principal"]}>
                                    <div className="p-8 text-xl font-bold text-gray-800">
                                        Principal Dashboard
                                    </div>
                                </PrivateRoute>
                            }
                        />
                        
                        
                        <Route
                            path="/student"
                            element={
                                <PrivateRoute roles={["student"]}>
                                    <StudentPrograms />
                                </PrivateRoute>
                            }
                        />
                        

                        
                    </Routes> */}
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
