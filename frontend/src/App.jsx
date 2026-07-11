import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';

// Public pages
import Home          from './pages/Home';
import About         from './pages/About';
import Menu          from './pages/Menu';
import Gallery       from './pages/Gallery';
import Contact       from './pages/Contact';
import ReserveTable  from './pages/ReserveTable';
import ReserveRoom   from './pages/ReserveRoom';
import FeedbackPage  from './pages/FeedbackPage';
import NotFound      from './pages/NotFound';

// Admin
import AdminLogin              from './admin/AdminLogin';
import AdminLayout             from './admin/AdminLayout';
import AdminDashboard          from './admin/AdminDashboard';
import AdminMenu               from './admin/AdminMenu';
import AdminTableReservations  from './admin/AdminTableReservations';
import AdminRoomReservations   from './admin/AdminRoomReservations';
import AdminEnquiries          from './admin/AdminEnquiries';
import AdminTables             from './admin/restaurant/AdminTables';
import KitchenKOT              from './admin/kitchen/KitchenKOT';
import AdminBilling            from './admin/billing/AdminBilling';
import AdminAnalytics          from './admin/analytics/AdminAnalytics';
import AdminFeedback           from './admin/restaurant/feedback/AdminFeedback';
import AdminWhatsApp           from './admin/AdminWhatsApp';
import AdminRooms              from './admin/rooms/AdminRooms';

// Waiter
import WaiterPanel from './waiter/WaiterPanel';

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"               element={<Home />} />
      <Route path="/about"          element={<About />} />
      <Route path="/menu"           element={<Menu />} />
      <Route path="/gallery"        element={<Gallery />} />
      <Route path="/contact"        element={<Contact />} />
      <Route path="/reserve-table"  element={<ReserveTable />} />
      <Route path="/reserve-room"   element={<ReserveRoom />} />
      <Route path="/feedback/:token" element={<FeedbackPage />} />

      {/* Waiter */}
      <Route path="/waiter" element={<WaiterPanel />} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index            element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="tables"    element={<AdminTables />} />
        <Route path="kitchen"   element={<KitchenKOT />} />
        <Route path="billing"   element={<AdminBilling />} />
        <Route path="menu"      element={<AdminMenu />} />
        <Route path="table-reservations" element={<AdminTableReservations />} />
        <Route path="room-reservations"  element={<AdminRoomReservations />} />
        <Route path="rooms"     element={<AdminRooms />} />
        <Route path="feedback"  element={<AdminFeedback />} />
        <Route path="whatsapp"  element={<AdminWhatsApp />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
