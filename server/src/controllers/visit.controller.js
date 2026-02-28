const Employee = require("../models/employee.model");
const moment = require("moment");
const Visit = require("../models/visit.model");
const Plan = require("../models/plan.model");
const Admin = require("../models/admin.model");

const createVisit = async (req, res) => {
  try {
    const { doctorChemist, plan, remark, jointEmployees } = req.body;

    const visit = await Visit.create({
      employee: req.userId,
      doctorChemist,
      plan,
      remark,
      jointEmployees,
    });

    // Auto mark linked plan completed
    if (plan) {
      await Plan.findByIdAndUpdate(plan, {
        status: "completed",
      });
    }

    res.status(201).json({
      success: true,
      message: "Visit recorded successfully",
      data: visit,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getPlanDashboard = async (req, res) => {
  try {
    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    const employeeId = req.userId;

    const totalPlans = await Plan.countDocuments({
      employee: employeeId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const completedPlans = await Plan.countDocuments({
      employee: employeeId,
      status: "completed",
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const missedPlans = await Plan.countDocuments({
      employee: employeeId,
      status: "missed",
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const coverageRate =
      totalPlans === 0 ? 0 : ((completedPlans / totalPlans) * 100).toFixed(2);

    res.json({
      success: true,
      data: {
        totalPlans,
        completedPlans,
        missedPlans,
        coverageRate,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getTeamVisits = async (req, res) => {
  try {
      let employeeIds = [];
      


    if (req.user.role === "admin") {
      const employees = await Employee.find().select("_id");
      employeeIds = employees.map((e) => e._id);
    }

    if (req.user.role === "manager") {
      const team = await Employee.find({ manager: req.user._id }).select("_id");
      employeeIds = team.map((e) => e._id);
    }

    const visits = await Visit.find({
      employee: { $in: employeeIds },
    })
      .populate("employee")
      .populate("doctorChemist");

    res.json({
      success: true,
      data: visits,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getMyVisits = async (req, res) => {
  try {
    const { filter } = req.query;

    let query = { employee: req.userId };

    if (filter === "month") {
      query.date = {
        $gte: moment().startOf("month").toDate(),
        $lte: moment().endOf("month").toDate(),
      };
    }

    const visits = await Visit.find(query)
      .populate("doctorChemist")
      .sort({ date: -1 });

    res.json({
      success: true,
      count: visits.length,
      data: visits,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteVisit = async (req, res) => {
    try {
        //   ! Only admin can delete 
        const admin = await Admin.findById(req.userId);
    if (admin) {
      return res.status(403).json({ message: "Admin only action" });
    }

    await Visit.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Visit deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
    createVisit,
    getPlanDashboard,
    getMyVisits,
    getTeamVisits,
    deleteVisit
};
