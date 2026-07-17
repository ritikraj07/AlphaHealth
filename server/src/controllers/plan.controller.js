const Admin = require("../models/admin.model");
const Plan = require("../models/plan.model");
const moment = require("moment");
const { scheduleNotification } = require("../services/scheduler.service");
const Device = require("../models/device.model");



const createPlan = async (req, res) => {
  try {
    const { doctorChemist, date, productFocus, jointEmployees, remark, employeeModel, isJointPlan } =
      req.body;

    const plan = await Plan.create({
      employee: req.userId,
      doctorChemist,
      date,
      productFocus,
      jointEmployees,
      remark,
      employeeModel,
      isJointPlan
    });

    const employeeIds = [
      req.userId,
      ...jointEmployees
    ];

    const devices = await Device.find({
      user: { $in: employeeIds }
    });

    const notificationDate = new Date(plan.date);

    // Set notification time to 9:00:00 AM
    notificationDate.setHours(9);
    notificationDate.setMinutes(0);
    notificationDate.setSeconds(0);
    notificationDate.setMilliseconds(0);

    for (const device of devices) {

      scheduleNotification({
        jobId: `${plan._id}-${device._id}`,
        date: notificationDate,
        title: `Today's Plan`,
        body: remark,
        data: { planId: plan._id, screen: "PlanDetailsScreen", plan },
        pushToken: devices.expoPushToken
      })
    }
    


    res.status(201).json({
      success: true,
      message: "Plan created successfully",
      data: plan,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getMyPlans = async (req, res) => {
  try {
    const { filter } = req.query; // today | week | month

    let startDate, endDate;

    if (filter === "today") {
      startDate = moment().startOf("day").toDate();
      endDate = moment().endOf("day").toDate();
    }

    if (filter === "week") {
      startDate = moment().startOf("week").toDate();
      endDate = moment().endOf("week").toDate();
    }

    if (filter === "month") {
      startDate = moment().startOf("month").toDate();
      endDate = moment().endOf("month").toDate();
    }

    let query = { employee: req.userId };

    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
      }
      
      await Plan.updateMany(
        {
          employee: req.userId,
          status: "planned",
          date: { $lt: moment().startOf("day").toDate() },
        },
        {
          $set: { status: "missed" },
        },
      );


    const plans = await Plan.find(query)
      .populate("doctorChemist")
      .sort({ date: 1 });

    res.json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const updatePlanStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["completed", "missed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Only admin or owner can update
    if (plan.employee.toString() !== req.userId.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    plan.status = status;
    await plan.save();

    res.json({
      success: true,
      message: "Plan status updated",
      data: plan,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const deletePlan = async (req, res) => {
  try {
    const admin = await Admin.findById(req.userId);
    if (admin) {
      return res.status(403).json({ message: "Admin only action" });
    }

    await Plan.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Plan deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTeamPlans = async (req, res) => {
  try {
    const plans = await Plan.find()
      .populate("doctorChemist")
      .sort({ date: 1 });

    res.json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find()
      .populate("doctorChemist")
      .sort({ date: 1 });

    res.json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPlan,
  getMyPlans,
  updatePlanStatus,
    deletePlan,
  getTeamPlans,
  getPlans
};