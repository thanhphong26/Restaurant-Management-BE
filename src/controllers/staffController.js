import staffService from '../services/staffService.js';

const getAllStaff = async (req, res) => {
    try {
        const response = await staffService.getAllStaff();
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
        console.log(req.params.position);
        if(req.params.position){
            const response = await staffService.getStaffByPosition(req.params.position);
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
        if(req.params.type){
            const response = await staffService.getStaffByType(req.params.type);
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

export default {
    getAllStaff,
    getStaffByPosition,
    getStaffByType,
};