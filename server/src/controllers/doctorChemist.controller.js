const createDoctorChemist = async (req, res) => {
    res.send("Create Doctor Chemist")
}

const getAllDoctorChemist = async (req, res) => {
    res.send("Get All Doctor Chemist")
}

const deleteDoctorChemist = async (req, res) => {
    res.send("Delete Doctor Chemist")
}

module.exports = {
    createDoctorChemist,
    getAllDoctorChemist,
    deleteDoctorChemist
}