import shiftService from '../services/shiftService.js';

const getAllShifts = async (req, res) => {
    try {
        let page = req.query.page || 1;
        let limit = req.query.limit || 10;
        let search = req.query.search || "";
        let startDate = req.query.start_date || null;
        let endDate = req.query.end_date || null;
        const response = await shiftService.getAllShifts(page, limit, search, startDate, endDate);
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

const getShiftsByStaffId = async (req, res) => {
    try {
        const staffId = req.params.id;
        const response = await shiftService.getShiftsByStaffId(staffId);
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

const createShift = async (req, res) => {
    try{
        let shift = req.body;
        if(shift && shift.date && shift.shift_number && shift.list_staff){
            const response = await shiftService.createShift(shift);
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

const updateShift = async (req, res) => {
    try{
        let shiftId = req.params.id;
        let shift = req.body;
        if(shift && shift.date && shift.shift_number && shift.list_staff){
            const response = await shiftService.updateShift(shiftId, shift);
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

const deleteShift = async (req, res) => {
    try {
        const shiftId = req.params.id;
        const response = await shiftService.deleteShift(shiftId);
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

export default {
    getAllShifts,
    getShiftsByStaffId,
    createShift,
    updateShift,
    deleteShift
}