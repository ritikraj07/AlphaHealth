const DoctorChemist = require("../models/doctorChemist.model");

const createDoctorChemist = async (req, res) => {
    try {
        const userId = req.userId;
      const { name, type, specialization, location, hq, addedBy, email } = req.body; 

      


        const doctorChemist = await DoctorChemist.create({
            name,
            type,
            specialization,
            location,
            hq,
            addedBy,
            email 
        });
        
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

module.exports = {
    createDoctorChemist,
    getAllDoctorChemist,
    deleteDoctorChemist
}