const DoctorChemist = require("../models/doctorChemist.model");

const createDoctorChemist = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, type, specialization, location, hq, addedBy, email, phone, potential, frequency } = req.body;

    // Set default values based on the role of the user
    let isApproved = false;
    let approvedBy = null;

    if (addedBy.role === 'Admin' || addedBy.role === 'Manager') {
      isApproved = true;
      approvedBy = {
        id: addedBy.id,
        role: addedBy.role[0].toUpperCase + addedBy.role.slice(1) ,
        model: addedBy.model
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
    const { type, hq } = req.query;

    // Build filter dynamically
    const filter = {};
    if (type) filter.type = type; // doctor | chemist
    if (hq) filter.hq = hq;

    // Fetch list
    const data = await DoctorChemist.find(filter)
      .populate("hq", "name")
      .sort({ createdAt: -1 });

    // Aggregate counts
    const counts = await DoctorChemist.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 }
        }
      }
    ]);

    // Format counts nicely
    let doctorCount = 0;
    let chemistCount = 0;

    counts.forEach(item => {
      if (item._id === "doctor") doctorCount = item.count;
      if (item._id === "chemist") chemistCount = item.count;
    });

    return res.status(200).json({
      success: true,
      message: "Doctor & Chemist data fetched successfully",
      extra: {
        total: doctorCount + chemistCount,
        doctors: doctorCount,
        chemists: chemistCount
      },
      data
    });

  } catch (error) {
    console.error("getAllDoctorChemist error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor & chemist data",
      error: error.message
    });
  }
};

const deleteDoctorChemist = async (req, res) => {
    res.send("Delete Doctor Chemist")
}


const approveDoctorChemist = async (req, res) => {
  try {
    const userId = req.userId;
    const { role, model, doctorChemistId } = req.body;

    // Validate that the role is allowed to approve
    const allowedRoles = ['Admin', 'Manager'];
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to approve this doctor or chemist'
      });
    }

    // Find the doctor or chemist by ID and update approval status
    const doctorChemist = await DoctorChemist.findById(doctorChemistId);

    if (!doctorChemist) {
      return res.status(404).json({
        success: false,
        message: 'Doctor Chemist not found'
      });
    }

    // Check if the doctor or chemist is already approved
    if (doctorChemist.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'This doctor or chemist is already approved'
      });
    }

    // Update the approval status and the approver details
    doctorChemist.isApproved = true;
    doctorChemist.approvedBy = {
      id: userId,
      role,
      model
    };

    await doctorChemist.save();

    res.status(200).json({
      success: true,
      message: 'Doctor Chemist approved successfully',
      data: doctorChemist
    });

  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while approving the doctor or chemist',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};



module.exports = {
    createDoctorChemist,
    getAllDoctorChemist,
  deleteDoctorChemist,
  approveDoctorChemist
}