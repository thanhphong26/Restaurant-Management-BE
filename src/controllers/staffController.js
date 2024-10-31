import staffService from '../services/staffService.js';

const getAllStaff = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const search = req.query.search || "";
        const response = await staffService.getAllStaff(page, limit, search);

        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        });
    }
};

const getStaffByPosition = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const search = req.query.search || "";
        const position = req.query.position;
        if(position){
            const response = await staffService.getStaffByPosition(page, limit, search, position);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            });
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Missing position",
                DT: ""
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        });
    }
};

const getStaffByType = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const search = req.query.search || "";
        const type = req.query.type;
        if(type){
            const response = await staffService.getStaffByType(page, limit, search, type);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            });
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Missing type",
                DT: ""
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        });
    }
};

const getStaffById = async (req, res) => {
    try{
        let staffId = req.params.id;
        if(staffId){
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
            EM: "Error from server",
            DT: ""
        });
    }
}

const createStaff = async (req, res) => {
    try {
        let staff = req.body;
        if(staff && staff.user_id && staff.position && staff.salary && staff.type) {
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
            EM: "Error from server",
            DT: ""
        });
    }
};

const updateStaff = async (req, res) => {
    try {
        let staffId = req.params.id;
        let staff = req.body;
        if(staff && staffId && staff.position && staff.salary && staff.type) {
            let response = await staffService.updateStaff(staffId, staff);
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
            EM: "Error from server",
            DT: ""
        });
    }
}

const deleteStaff = async (req, res) => {
    try {
        let staffId = req.params.id;
        if(staffId) {
            let response = await staffService.deleteStaff(staffId);
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
            EM: "Error from server",
            DT: ""
        });
    }
}

export default {
    getAllStaff,
    getStaffByPosition,
    getStaffByType,
    getStaffById,
    createStaff,
    updateStaff,
    deleteStaff
};