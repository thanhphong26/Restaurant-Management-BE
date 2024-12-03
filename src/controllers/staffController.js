import staffService from '../services/staffService.js';

const getAllStaff = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const search = req.query.search || "";
        const filterType = req.query.filterType || "";
        const filterValue = req.query.filterValue || "";
        const response = await staffService.getAllStaff(page, limit, search, filterType, filterValue);

        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        });
    }
};

const getStaffById = async (req, res) => {
    try {
        let staffId = req.params.id;
        if (staffId) {
            let response = await staffService.getStaffById(staffId);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            });
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Missing staff id",
                DT: ""
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        });
    }
}

const getStaffByUserId = async (req, res) => {
    try {
        let response = await staffService.getStaffByUserId(req.user.id);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        });
    }
}

const getTimeKeepingInMonthByStaffId = async (req, res) => {
    try {
        let staffId = req.query.id;
        let month = req.query.month;
        let year = req.query.year;
        if (staffId && month && year) {
            let response = await staffService.getTimeKeepingInMonthByStaffId(staffId, month, year);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            });
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Missing information",
                DT: ""
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        });
    }
}

const createStaff = async (req, res) => {
    try {
        let staff = req.body;
        if (staff && staff.user_id && staff.position && staff.salary && staff.type) {
            let response = await staffService.createStaff(staff);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        });
    }
};

const updateStaff = async (req, res) => {
    try {
        let staffId = req.params.id;
        let staff = req.body;
        if (staff && staffId && staff.position && staff.salary && staff.type) {
            let response = await staffService.updateStaff(staffId, staff);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            });
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Missing information",
                DT: ""
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        });
    }
}

const deleteStaff = async (req, res) => {
    try {
        let staffId = req.params.id;
        if (staffId) {
            let response = await staffService.deleteStaff(staffId);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            });
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Missing staff id",
                DT: ""
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        });
    }
}

export default {
    getAllStaff,
    getStaffById,
    getTimeKeepingInMonthByStaffId,
    createStaff,
    updateStaff,
    deleteStaff,
    getStaffByUserId
};