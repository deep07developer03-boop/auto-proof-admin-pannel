import { BrowserRouter, Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/" element={<HomePageTwo />} />
        <Route exact path="/dashboard" element={<HomePageTwo />} />
        <Route exact path="/users" element={<HomePageThree />} />
        <Route exact path="/inspection" element={<HomePageFour />} />
        <Route exact path="/clients" element={<HomePageFive />} />
        <Route exact path="/vehicle" element={<HomePageSix />} />
        <Route exact path="/companies" element={<HomePageSeven />} />
        <Route exact path="/subscriptions" element={<HomePageEight />} />
        <Route exact path="/advertisement" element={<HomePageNine />} />
        <Route exact path="/notification" element={<NotificationPage />} />

        <Route exact path="/rental-feet" element={<RentalFleet />} />

        <Route
          exact
          path="/by-subscription"
          element={<IncomeManagementBySubscription />}
        />

        <Route exact path="/by-add" element={<IncomeManagementByAdd />} />

        {/* IncomeManagementBySubscription */}
        <Route
          exact
          path="/send-notification"
          element={<SendNotificationPage />}
        />
        <Route
          exact
          path="/send-notification-on-sheduled-date"
          element={<SendNotificationOnSheduledDate />}
        />
        <Route exact path="/check-in" element={<CheckIn />} />
        <Route exact path="/check-out" element={<CheckOut />} />
        <Route exact path="/assign-role" element={<AssignRolePage />} />

        <Route exact path="/add-user" element={<AddUser />} />
        <Route exact path="/view-profile" element={<ViewPage />} />

        <Route
          exact
          path="/by-fleet-subscription"
          element={<RentalByFleetSubscription />}
        />

        <Route
          exact
          path="/complete-inspection"
          element={<CompletedInspections />}
        />
        <Route exact path="/indivisual-user" element={<IndivisualUser />} />
        <Route
          exact
          path="/add-subscription-plan"
          element={<AddSubscriptionPlan />}
        />
        <Route
          exact
          path="/edit-subscription-plan/:id"
          element={<EditSubscriptionPlan />}
        />
        <Route exact path="/agents" element={<Agent />} />
        <Route exact path="/subscription-plan" element={<SubscriptionPlan />} />
        {/* SL */}
        {/* <Route exact path="/add-user" element={<AddUserPage />} />
        <Route exact path="/alert" element={<AlertPage />} /> */}
        <Route exact path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
