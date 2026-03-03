const POB = require("../models/pob.model");
const Visit = require("../models/visit.model");

const createPOB = async (req, res) => {
  try {
    const { doctorChemist, visit, products, pobContributors,  } = req.body;

    const totalAmount = products.reduce((sum, item) => sum + item.amount, 0);

    const pob = await POB.create({
      employee: req.userId,
      doctorChemist,
      visit,
      products,
      totalAmount,
      pobContributors,
      hq: req.user.hq,
    });

    // If linked visit exists → mark order received
    if (visit) {
      await Visit.findByIdAndUpdate(visit, {
        isOrderReceived: true,
      });
    }

    res.status(201).json({
      success: true,
      message: "POB created successfully",
      data: pob,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getMyPOB = async (req, res) => {
  try {
    const { filter } = req.query;

    let query = { employee: req.userId };

    if (filter === "month") {
      query.date = {
        $gte: moment().startOf("month").toDate(),
        $lte: moment().endOf("month").toDate(),
      };
    }

    const pobs = await POB.find(query)
      .populate("doctorChemist")
      .populate("products.product")
      .sort({ date: -1 });

    res.json({
      success: true,
      totalSales: pobs.reduce((sum, p) => sum + p.totalAmount, 0),
      count: pobs.length,
      data: pobs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTeamPOB = async (req, res) => {
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

    const pobs = await POB.find({
      employee: { $in: employeeIds },
    }).populate("employee doctorChemist");

    res.json({
      success: true,
      data: pobs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePOB = async (req, res) => {
  try {
    
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only action" });
    }

    await POB.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "POB deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = { createPOB, getMyPOB, getTeamPOB, deletePOB };