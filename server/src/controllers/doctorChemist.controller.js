const Admin = require("../models/admin.model");
const DoctorChemist = require("../models/doctorChemist.model");
const Employee = require("../models/employee.model");

const createDoctorChemist = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, type, specialization, location, hq, addedBy, email, phone, potential, frequency } = req.body;

    // Set default values based on the role of the user
    let isApproved = false;
    let approvedBy = null;

    if (addedBy.role === 'admin' || addedBy.role === 'manager') {
      isApproved = true;
      approvedBy = {
        id: addedBy.id,
        role: addedBy.role,
        model: addedBy.model == 'Admin' ? 'Admin' : 'Employee'
      };
    }

    // Create the new DoctorChemist record
    const doctorChemist = new DoctorChemist({
      name,
      type,
      specialization: type === 'doctor' ? specialization : undefined,
      location,
      hq,
      addedBy,
      email,
      phone,
      potential,
      frequency,
      isApproved,
      approvedBy
    });

    // Save the record to the database
    await doctorChemist.save();

    res.status(201).json({
      success: true,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} created successfully`,
      data: doctorChemist
    });
      
    } catch (error) {
        console.error("Create doctor/chemist error:", error);

    
         // Duplicate key error (MongoDB)
  if (error?.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || "field";

    return res.status(409).json({
      success: false,
      message: `This ${field} already exists`,
      field,
    });
  }


        res.status(500).json({
            success: false,
            message: "Error creating doctor chemist",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
}

const getAllDoctorChemist = async (req, res) => {
  try {
    /* ==============================
       1️⃣ Extract & Validate Params
    =============================== */
    const {
      type,
      hq,
      potential,
      search,
      page = 1,
      limit = 10,
      isApproved,
    } = req.query;

    const allowedTypes = ["doctor", "chemist"];
    const allowedPotential = ["high", "medium", "low"];

    const filter = {};

    // Validate type
    if (type && allowedTypes.includes(type.toLowerCase())) {
      filter.type = type.toLowerCase();
    }

    // Validate isApproved
    if (isApproved) {
      filter.isApproved = isApproved;
    }

    // Validate potential
    if (potential && allowedPotential.includes(potential)) {
      filter.potential = potential;
    }

    // HQ filter
    if (hq) {
      filter.hq = hq;
    }

    // Search filter (name, location)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    /* ==============================
       2️⃣ Pagination Setup
    =============================== */
    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = Math.max(1, parseInt(limit));
    const skip = (pageNumber - 1) * limitNumber;

    /* ==============================
       3️⃣ Run Queries in Parallel
    =============================== */
    const [data, counts] = await Promise.all([
      DoctorChemist.find(filter)
        .populate("hq", "name")
        .populate("addedBy.id", "name")
        .populate("approvedBy.id", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),

      DoctorChemist.aggregate([
        { $match: filter }, // IMPORTANT: apply filter here
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    /* ==============================
       4️⃣ Format Counts Cleanly
    =============================== */
    const countMap = counts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const doctorCount = countMap.doctor || 0;
    const chemistCount = countMap.chemist || 0;

    /* ==============================
       5️⃣ Total Documents Count
    =============================== */
    const totalDocuments = doctorCount + chemistCount;

    /* ==============================
       6️⃣ Structured Response
    =============================== */
    return res.status(200).json({
      success: true,
      message: "Doctor & Chemist data fetched successfully",
      filters: {
        type: type || null,
        hq: hq || null,
        potential: potential || null,
        search: search || null,
      },
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalDocuments / limitNumber),
        totalRecords: totalDocuments,
        limit: limitNumber,
      },
      counts: {
        total: totalDocuments,
        doctors: doctorCount,
        chemists: chemistCount,
      },
      data,
    });
  } catch (error) {
    console.error("getAllDoctorChemist error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor & chemist data",
      error: error.message,
    });
  }
};


const deleteDoctorChemist = async (req, res) => {
    res.send("Delete Doctor Chemist")
}


const approveDoctorChemist = async (req, res) => {
  try {
    const userId = req.userId;
    const { doctorChemistId } = req.body;

    const doctorChemist = await DoctorChemist.findById(doctorChemistId);

    if (!doctorChemist) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    let model = null;
    let role = null;

    // Check if Admin
    const adminUser = await Admin.findById(userId);

    if (adminUser) {
      model = "Admin";
      role = "admin";
    } else {
      // 🔒 Ensure it was added by Employee
      if (doctorChemist.addedBy.model !== "Employee") {
        return res.status(403).json({
          success: false,
          message: "Only Admin can approve this entry",
        });
      }

      const employee = await Employee.findById(doctorChemist.addedBy.id);

      if (!employee || String(employee.manager) !== String(userId)) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to approve",
        });
      }

      model = "Employee";
      role = "manager";
    }

    // 🔥 Atomic approval (single truth)
    const updatedDoc = await DoctorChemist.findOneAndUpdate(
      { _id: doctorChemistId, isApproved: false },
      {
        isApproved: true,
        approvedBy: {
          id: userId,
          model,
          role,
        },
      },
      { new: true },
    );

    if (!updatedDoc) {
      return res.status(400).json({
        success: false,
        message: "Already approved",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor Chemist approved successfully",
      data: updatedDoc,
    });
  } catch (error) {
    console.error("Approval error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};





module.exports = {
    createDoctorChemist,
    getAllDoctorChemist,
  deleteDoctorChemist,
  approveDoctorChemist
}