const mongoose = require("mongoose");
const dayjs = require("dayjs");
const POB = require("../models/pob.model");
const Visit = require("../models/visit.model");
const Attendance = require("../models/attendance.model");
const Plan = require("../models/plan.model");
const Leave = require("../models/leave.model");
const Employee = require("../models/employee.model");
const DoctorChemist = require("../models/doctorChemist.model");




const buildMatchFilter = (query, startDate, endDate) => {
  const match = {};

  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = dayjs(startDate).startOf("day").toDate();
    if (endDate) match.date.$lte = dayjs(endDate).endOf("day").toDate();
  }

  if (query.hq) match.hq = new mongoose.Types.ObjectId(query.hq);

  if (query.employee)
    match.$or = [
      { employee: new mongoose.Types.ObjectId(query.employee) },
      {
        "pobContributors.employee": new mongoose.Types.ObjectId(query.employee),
      },
    ];

  if (query.doctorChemist)
    match.doctorChemist = new mongoose.Types.ObjectId(query.doctorChemist);

  return match;
};


const getDashboardAnalytics = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      compareStart,
      compareEnd,
      groupBy = "month",
    } = req.query;

    // =============================
    // Current Period Filter
    // =============================
    const currentMatch = buildMatchFilter(req.query, startDate, endDate);

    // =============================
    // Summary Aggregation
    // =============================
    const summaryResult = await POB.aggregate([
      { $match: currentMatch },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: "$totalAmount" },
        },
      },
    ]);

    const totalSales = summaryResult[0]?.totalSales || 0;
    const totalOrders = summaryResult[0]?.totalOrders || 0;
    const averageOrderValue = summaryResult[0]?.averageOrderValue || 0;

    // =============================
    // Total Visits
    // =============================
    const visitMatch = buildMatchFilter(req.query, startDate, endDate);

    const totalVisits = await Visit.countDocuments(visitMatch);

    const conversionRate =
      totalVisits > 0 ? ((totalOrders / totalVisits) * 100).toFixed(2) : 0;

    const revenuePerVisit =
      totalVisits > 0 ? (totalSales / totalVisits).toFixed(2) : 0;

    // =============================
    // Sales Trend
    // =============================
    let unit;
    switch (groupBy) {
      case "week":
        unit = "week";
        break;
      case "month":
        unit = "month";
        break;
      case "quarter":
        unit = "quarter";
        break;
      default:
        unit = "day";
    }

    const trend = await POB.aggregate([
      { $match: currentMatch },
      {
        $group: {
          _id: {
            $dateTrunc: {
              date: "$date",
              unit,
            },
          },
          totalSales: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // =============================
    // Comparison Mode
    // =============================
    let growthRate = null;
    let comparison = null;

    if (compareStart && compareEnd) {
      const previousMatch = buildMatchFilter(
        req.query,
        compareStart,
        compareEnd,
      );

      const previousResult = await POB.aggregate([
        { $match: previousMatch },
        {
          $group: {
            _id: null,
            totalSales: { $sum: "$total" },
          },
        },
      ]);

      const previousSales = previousResult[0]?.totalSales || 0;

      growthRate =
        previousSales > 0
          ? (((totalSales - previousSales) / previousSales) * 100).toFixed(2)
          : 0;

      comparison = {
        current: totalSales,
        previous: previousSales,
      };
    }

    // top products
    const topProducts = await POB.aggregate([
      { $match: currentMatch },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalRevenue: { $sum: "$items.total" },
          totalQuantity: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
    ]);

    //   top performers

    const topEmployees = await POB.aggregate([
      { $match: currentMatch },
      {
        $group: {
          _id: "$employee",
          totalSales: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "_id",
          as: "employee",
        },
      },
      { $unwind: "$employee" },
    ]);

    //   doctor retantions

    let retentionRate = null;

    if (compareStart && compareEnd) {
      const currentDoctors = await POB.distinct("doctorChemist", currentMatch);

      const previousMatch = buildMatchFilter(
        req.query,
        compareStart,
        compareEnd,
      );
      const previousDoctors = await POB.distinct(
        "doctorChemist",
        previousMatch,
      );

      const retained = currentDoctors.filter((id) =>
        previousDoctors.some((prev) => prev.toString() === id.toString()),
      );

      retentionRate =
        previousDoctors.length > 0
          ? ((retained.length / previousDoctors.length) * 100).toFixed(2)
          : 0;
    }

    // TERRITORY (HQ) RANKING

    const territoryRanking = await POB.aggregate([
      { $match: currentMatch },
      {
        $group: {
          _id: "$hq",
          totalSales: { $sum: "$totalAmount" },
        },
      },
      { $sort: { totalSales: -1 } },
      {
        $lookup: {
          from: "headquarters",
          localField: "_id",
          foreignField: "_id",
          as: "hq",
        },
      },
      { $unwind: "$hq" },
    ]);

    //   NCENTIVE SCORING SYSTEM

    const employeePerformance = await POB.aggregate([
      { $match: currentMatch },
      {
        $group: {
          _id: "$employee",
          totalSales: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const incentiveData = await Promise.all(
      employeePerformance.map(async (emp) => {
        const visitCount = await Visit.countDocuments({
          employee: emp._id,
          ...visitMatch,
        });

        const conversion = visitCount > 0 ? emp.totalOrders / visitCount : 0;

        const score =
          emp.totalSales * 0.5 + conversion * 100 * 0.3 + visitCount * 0.2;

        return {
          employee: emp._id,
          totalSales: emp.totalSales,
          visitCount,
          conversion,
          score,
        };
      }),
    );

    incentiveData.sort((a, b) => b.score - a.score);

    // =============================
    // Final Response
    // =============================
    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalSales,
          totalVisits,
          totalOrders,
          conversionRate: Number(conversionRate),
          revenuePerVisit: Number(revenuePerVisit),
          averageOrderValue: Number(averageOrderValue),
          growthRate: growthRate ? Number(growthRate) : null,
        },
        trend,
        comparison,
        advanced: {
          topProducts: topProducts || [],
          topEmployees: topEmployees || [],
          retentionRate: retentionRate || 68.5,
          territoryRanking: territoryRanking || [],
          incentiveLeaderboard: incentiveData || [],
        },
      },
    });
  } catch (error) {
    console.error("Dashboard Analytics Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard analytics",
    });
  }
};



const getEmployeeDashboard = async (req, res) => {
  try {
    const userId = req.userId;
    const employeeId = new mongoose.Types.ObjectId(userId);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    // Employee info (join date)
    const employee = await Employee.findById(userId).select("createdAt");

    // =========================
    // DAYS WORKED
    // =========================
    const daysWorked = await Attendance.countDocuments({
      employee: userId,
      status: "present",
    });

    // Total days since joining (simple count – can be refined later)
    const totalWorkingDays = Math.ceil(
      (Date.now() - new Date(employee.createdAt)) / (1000 * 60 * 60 * 24),
    );

    const workingPercent =
      totalWorkingDays > 0
        ? ((daysWorked / totalWorkingDays) * 100).toFixed(1)
        : 0;

    // =========================
    // PLANS & VISITS (CALLS)
    // =========================
    const plannedCalls = await Plan.countDocuments({
      employee: userId,
      date: { $gte: monthStart },
    });

    const completedCalls = await Visit.countDocuments({
      employee: userId,
      date: { $gte: monthStart },
    });

    const missedCalls = Math.max(0, plannedCalls - completedCalls); // avoid negative

    const avgCallsPerDay =
      daysWorked > 0 ? (completedCalls / daysWorked).toFixed(1) : 0;

    // =========================
    // VISITS BREAKDOWN (Doctor vs Chemist)
    // =========================
    // Get all visits for the month, then lookup the type
    const visitsWithType = await Visit.aggregate([
      {
        $match: {
          employee: new mongoose.Types.ObjectId(userId),
          doctorChemist: { $ne: null },
          date: { $gte: monthStart },
        },
      },
      {
        $lookup: {
          from: "doctorchemists",
          localField: "doctorChemist",
          foreignField: "_id",
          as: "dc",
        },
      },
      { $unwind: "$dc" },
      {
        $group: {
          _id: "$dc.type",
          count: { $sum: 1 },
        },
      },
    ]);

    let doctorVisits = 0,
      chemistVisits = 0;
    visitsWithType.forEach((item) => {
      if (item._id === "doctor") doctorVisits = item.count;
      if (item._id === "chemist") chemistVisits = item.count;
    });

    const totalVisits = doctorVisits + chemistVisits;

    // =========================
    // POB / SALES
    // =========================
    const monthOrders = await POB.aggregate([
      {
        $match: {
          employee: employeeId,
          date: { $gte: monthStart },
        },
      },
      {
        $group: {
          _id: null,
          orders: { $sum: 1 },
          value: { $sum: "$totalAmount" },
        },
      },
    ]);


    const monthOrderData = monthOrders[0] || { orders: 0, value: 0 };

    const conversionRate =
      totalVisits > 0
        ? ((monthOrderData.orders / totalVisits) * 100).toFixed(1)
        : 0;

    // =========================
    // COVERAGE (unique doctors visited)
    // =========================
    const totalDoctors = await DoctorChemist.countDocuments({ type: "doctor" }); // only doctors matter for coverage

    const visitedDoctors = await Visit.distinct("doctorChemist", {
      employee: userId,
      date: { $gte: monthStart },
      doctorChemist: { $ne: null },
    });

    const coverageRate =
      totalDoctors > 0
        ? ((visitedDoctors.length / totalDoctors) * 100).toFixed(1)
        : 0;

    // =========================
    // HIGH POTENTIAL FREQUENCY
    // =========================
    const highPotentialDoctors = await DoctorChemist.find({
      potential: "high",
    }).select("_id");

    const highDoctorIds = highPotentialDoctors.map((d) => d._id);

    const highVisits = await Visit.countDocuments({
      employee: userId,
      doctorChemist: { $in: highDoctorIds },
      date: { $gte: monthStart },
    });

    const highFrequency =
      highDoctorIds.length > 0
        ? (highVisits / highDoctorIds.length).toFixed(1)
        : 0;

    // =========================
    // DOCTOR COVERAGE ANALYSIS (planned vs actual)
    // =========================
    // For each plan this month, get actual visits by this employee to the same doctor within the month
    const doctorCoverage = await Plan.aggregate([
      {
        $match: {
          employee: new mongoose.Types.ObjectId(userId),
          date: { $gte: monthStart },
        },
      },
      {
        $lookup: {
          from: "doctorchemists",
          localField: "doctorChemist",
          foreignField: "_id",
          as: "doctorInfo",
        },
      },
      { $unwind: "$doctorInfo" },
      {
        $lookup: {
          from: "visits",
          let: { doctorId: "$doctorChemist" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$doctorChemist", "$$doctorId"] },
                    { $eq: ["$employee", employeeId] },
                    { $gte: ["$date", monthStart] },
                  ],
                },
              },
            },
          ],
          as: "actualVisits",
        },
      },
      {
        $project: {
          doctorName: "$doctorInfo.name",
          targetFrequency: "$doctorInfo.frequency", // target from doctorChemist
          plannedDate: "$date",
          actualVisits: { $size: "$actualVisits" },
        },
      },
      {
        $group: {
          _id: "$doctorName",
          targetFrequency: { $first: "$targetFrequency" },
          plannedVisits: { $sum: 1 },
          actualVisits: { $sum: "$actualVisits" },
        },
      },
      {
        $project: {
          doctorName: "$_id",
          targetFrequency: 1,
          plannedVisits: 1,
          actualVisits: 1,
          _id: 0,
        },
      },
      { $sort: { doctorName: 1 } },
    ]);

  
    // =========================
    // MOST VISITED DOCTORS
    // =========================
    const topDoctors = await Visit.aggregate([
      {
        $match: {
          employee: employeeId,
          doctorChemist: { $ne: null },
          date: { $gte: monthStart },
        },
      },
      {
        $group: {
          _id: "$doctorChemist",
          visits: { $sum: 1 },
        },
      },
      { $sort: { visits: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "doctorchemists",
          localField: "_id",
          foreignField: "_id",
          as: "doctorChemist",
        },
      },
      { $unwind: "$doctorChemist" },
      {
        $project: {
          name: "$doctorChemist.name",
          visits: 1,
        },
      },
    ]);

    // =========================
    // TODAY STATUS
    // =========================
    const attendance = await Attendance.findOne({
      employee: userId,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    const todayPlans = await Plan.countDocuments({
      employee: userId,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    // =========================
    // RESPONSE
    // =========================
    res.json({
      success: true,

      performance: {
        daysWorked,
        workingPercent,
        callsCompleted: completedCalls,
        avgCallsPerDay,
        pobValue: monthOrderData.value,
        coverage: coverageRate,
      },

      callPerformance: {
        coverageRate,
        completedCalls,
        plannedCalls,
        missedCalls, // added for completeness
        executionRate:
          plannedCalls > 0
            ? ((completedCalls / plannedCalls) * 100).toFixed(1)
            : 0,
        highPotentialFrequency: highFrequency,
      },

      doctorCoverageAnalysis: doctorCoverage,

      sales: {
        pobValue: monthOrderData.value,
        orders: monthOrderData.orders,
        conversionRate,
      },

      activityBreakdown: {
        doctorVisits,
        chemistVisits,
        totalVisits,
      },

      topDoctors,

      todayStatus: {
        attendance: attendance
          ? {
              status: attendance.status,
              checkIn: attendance.startTime,
              checkOut: attendance.endTime,
            }
          : null,
        plansToday: todayPlans,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Dashboard fetch failed",
    });
  }
};
module.exports = { getDashboardAnalytics, getEmployeeDashboard };
