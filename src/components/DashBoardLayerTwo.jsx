import React from "react";
import UnitCountTwo from "./child/UnitCountTwo";
import RevenueGrowthOne from "./child/RevenueGrowthOne";
import EarningStaticOne from "./child/EarningStaticOne";
import CampaignStaticOne from "./child/CampaignStaticOne";
import ClientPaymentOne from "./child/ClientPaymentOne";
import CountryStatusOne from "./child/CountryStatusOne";
import TopPerformanceOne from "./child/TopperformanceOne";
import LatestPerformanceOne from "./child/LatestPerformanceOne";
import LastTransactionOne from "./child/LastTransactionOne";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

const BASE_URL = process.env.REACT_APP_BASE_URL;

console.log("base url DashBoardLayerTwo", process.env.REACT_APP_BASE_URL);

const DashBoardLayerTwo = () => {
  const [data, setData] = useState({
    activeUsers: "",
    checkinCount: "",
    checkoutCount: "",
    totalProfit: "",
    totalSales: "",
    totalUser: "",
    transactions: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    const getData = async () => {
      try {
        const res = await axios.get(
          BASE_URL + `/super-admin-pannel/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json", // ✅ correct for JSON body
            },
          }
        );

        setData(res?.data?.data);
      } catch (error) {
        console.log("error", error);
      }
    };

    getData();
  }, []);

  console.log("DashBoardLayerTwo", data);
  return (
    <section className="row gy-4">
      {/* UnitCountTwo */}
      <UnitCountTwo data={data && data} />

      {/* RevenueGrowthOne */}
      <RevenueGrowthOne data={data?.totalSales} />

      {/* EarningStaticOne */}
      {/* <EarningStaticOne /> */}

      {/* CampaignStaticOne */}
      {/* <CampaignStaticOne /> */}

      {/* ClientPaymentOne  */}
      {/* <ClientPaymentOne data={data?.transactions} /> */}

      {/* CountryStatusOne */}
      {/* <CountryStatusOne /> */}

      {/* TopPerformanceOne */}
      {/* <TopPerformanceOne /> */}

      {/* LatestPerformanceOne */}
      {/* <LatestPerformanceOne /> */}

      {/* LastTransactionOne */}
      <LastTransactionOne data={data?.transactions} />
    </section>
  );
};

export default DashBoardLayerTwo;
