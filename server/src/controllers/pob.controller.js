const POB = require("../models/pob.model");
const Visit = require("../models/visit.model");
const moment = require("moment");

const createPOB = async (req, res) => {
  try {
    const { doctorChemist, visit, products, pobContributors, hq  } = req.body;

    const totalAmount = products.reduce((sum, item) => sum + item.amount, 0);
    if (!doctorChemist) {
      return res.status(400).json({ message: "Missing doctor/chemist" });
    }

    const payLoad = {
      employee: req.userId,
      doctorChemist,
      visit,
      products,
      totalAmount,
      hq: hq || req.user.hq,
    };

    console.log(req.body);

    if(pobContributors[0].employee && pobContributors.length > 0) {
      payLoad.pobContributors = pobContributors;
    }
    



    const pob = await POB.create(payLoad);

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


// doctor count with total sales, chemist count with total sales,
// this month visit count with doctor frenquency and chemist frenquency
// this month total sales
// 
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

    let totalSales = 0;

    let doctorsOrders = 0;
    let doctorsValue = 0;

    let chemistsOrders = 0;
    let chemistsValue = 0;

    let pending = 0;

    let monthlyValue = 0;
    let monthlyOrders = 0;

    const startOfMonth = moment().startOf("month");

    pobs.forEach((pob) => {
      const amount = pob.totalAmount || 0;
      totalSales += amount;

      // Pending
      if (pob.status === "pending") {
        pending++;
      }

      // Doctor / Chemist split
      if (pob.doctorChemist?.type === "doctor") {
        doctorsOrders++;
        doctorsValue += amount;
      }

      if (pob.doctorChemist?.type === "chemist") {
        chemistsOrders++;
        chemistsValue += amount;
      }

      // Monthly stats
      if (moment(pob.date).isSame(startOfMonth, "month")) {
        monthlyOrders++;
        monthlyValue += amount;
      }
    });

    res.json({
      success: true,

      totalSales,
      count: pobs.length,

      thisMonthSell: monthlyOrders,
      monthlyValue,

      doctors: {
        orders: doctorsOrders,
        value: doctorsValue,
      },

      chemists: {
        orders: chemistsOrders,
        value: chemistsValue,
      },

      pending,

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