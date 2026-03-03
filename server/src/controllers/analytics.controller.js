const mongoose = require("mongoose");
const dayjs = require("dayjs");
const POB = require("../models/pob.model");
const Visit = require("../models/visit.model");



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
          totalSales: { $sum: "$total" },
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
          totalSales: { $sum: "$total" },
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
          totalSales: { $sum: "$total" },
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

module.exports = { getDashboardAnalytics };
