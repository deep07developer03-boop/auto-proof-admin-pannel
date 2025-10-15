import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePageOne from "./pages/HomePageOne";
import HomePageTwo from "./pages/HomePageTwo";
import HomePageThree from "./pages/HomePageThree";
import HomePageFour from "./pages/HomePageFour";
import HomePageFive from "./pages/HomePageFive";
import HomePageSix from "./pages/HomePageSix";
import HomePageSeven from "./pages/HomePageSeven";
import EmailPage from "./pages/EmailPage";
// import AddUserPage from "./pages/AddUserPage";
// import AlertPage from "./pages/AlertPage";
// import AssignRolePage from "./pages/AssignRolePage";

import ErrorPage from "./pages/ErrorPage";

import RouteScrollToTop from "./helper/RouteScrollToTop";

import HomePageEight from "./pages/HomePageEight";
import HomePageNine from "./pages/HomePageNine";

import Login from "./pages/Login";
import IndivisualUser from "./pages/IndivisualUser";
import Agent from "./pages/Agent";
import SubscriptionPlan from "./pages/SubscriptionPlan";
import AddSubscriptionPlan from "./pages/AddSubscriptionPlan";
import EditSubscriptionPlan from "./pages/EditSubscriptionPlan";
import CheckIn from "./pages/CheckIn";
import CheckOut from "./pages/CheckOut";
import NotificationPage from "./pages/NotificationPage";
import CompletedInspections from "./pages/CompletedInspections";

import AssignRolePage from "./pages/AsignRole";
import AddUserComp from "./components/AddUserComp";
import AddUser from "./pages/AddUser";
import ViewPage from "./pages/ViewPage";
import SendNotificationPage from "./pages/SendNotificationToAllUser";
import SendNotificationOnSheduledDateComp from "./components/SendNotificationOnSheduledDateComp";
import SendNotificationOnSheduledDate from "./pages/SendNotificationOnSheduledDate";
import RentalFleet from "./pages/RentalFleet";
import RentalByFleetSubscription from "./pages/RentalByFleetSubscription";
import IncomeManagementBySubscription from "./pages/IncomeManagementBySubscription";
import IncomeManagementByAddComp from "./components/IncomeManagementByAddComp";
import IncomeManagementByAdd from "./pages/IncomeManagementByAdd";
import PaymentTest from "./pages/PaymentTest";
import PaymentSucces from "./pages/PaymentSucces";
import PaymentCancel from "./pages/PaymentCancel";
import ContactUs from "./pages/ContactUs";

function App() {
  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePageTwo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <HomePageTwo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-test"
          element={
            <ProtectedRoute>
              <PaymentTest />
            </ProtectedRoute>
          }
        />
        <Route path="/payment-success" element={<PaymentSucces />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <HomePageThree />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inspection"
          element={
            <ProtectedRoute>
              <HomePageFour />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <HomePageFive />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicle"
          element={
            <ProtectedRoute>
              <HomePageSix />
            </ProtectedRoute>
          }
        />
        <Route
          path="/companies"
          element={
            <ProtectedRoute>
              <HomePageSeven />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute>
              <HomePageEight />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advertisement"
          element={
            <ProtectedRoute>
              <HomePageNine />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notification"
          element={
            <ProtectedRoute>
              <NotificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rental-feet"
          element={
            <ProtectedRoute>
              <RentalFleet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/by-subscription"
          element={
            <ProtectedRoute>
              <IncomeManagementBySubscription />
            </ProtectedRoute>
          }
        />
        <Route
          path="/by-add"
          element={
            <ProtectedRoute>
              <IncomeManagementByAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/send-notification"
          element={
            <ProtectedRoute>
              <SendNotificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/send-notification-on-sheduled-date"
          element={
            <ProtectedRoute>
              <SendNotificationOnSheduledDate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-in"
          element={
            <ProtectedRoute>
              <CheckIn />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-out"
          element={
            <ProtectedRoute>
              <CheckOut />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assign-role"
          element={
            <ProtectedRoute>
              <AssignRolePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-user"
          element={
            <ProtectedRoute>
              <AddUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-profile"
          element={
            <ProtectedRoute>
              <ViewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/by-fleet-subscription"
          element={
            <ProtectedRoute>
              <RentalByFleetSubscription />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complete-inspection"
          element={
            <ProtectedRoute>
              <CompletedInspections />
            </ProtectedRoute>
          }
        />
        <Route
          path="/indivisual-user"
          element={
            <ProtectedRoute>
              <IndivisualUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-subscription-plan"
          element={
            <ProtectedRoute>
              <AddSubscriptionPlan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-subscription-plan/:id"
          element={
            <ProtectedRoute>
              <EditSubscriptionPlan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agents"
          element={
            <ProtectedRoute>
              <Agent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription-plan"
          element={
            <ProtectedRoute>
              <SubscriptionPlan />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaints"
          element={
            <ProtectedRoute>
              <ContactUs />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
