import leaveApplicationService from "../services/leaveApplicationService.js";
const createLeaveApplication = async (req, res) => {
    try {
        const response = await leaveApplicationService.createLeaveApplication(req.body);
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
const updateStatusLeaveApplication = async (req, res) => {
    try {
        const response = await leaveApplicationService.updateStatusLeaveApplication(req.params.id, req.body.status);
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
const checkIn = async (req, res) => {
    try {
        const response = await leaveApplicationService.checkIn(req.params.id);
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
const checkOut = async (req, res) => {
    try {
        const response = await leaveApplicationService.checkOut(req.params.id);
        console.log("response: ", response);
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
const getTimeKeepingInMonth = async (req, res) => {
    try {
        const response = await leaveApplicationService.getTimeKeepingInMonth(req.params.staff_id, req.params.month, req.params.year);
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
const getListApplicationByDate= async (req, res) => {
    try {
        const { page, limit, date, status } = req.query;
        const response = await leaveApplicationService.getListApplicationByDate(date, status, page, limit);
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
    createLeaveApplication,
    updateStatusLeaveApplication,
    checkIn,
    checkOut,
    getTimeKeepingInMonth,
    getListApplicationByDate
    // handleCheckPresence
};