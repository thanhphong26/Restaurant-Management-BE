import timeKeepingService from "../services/timeKeepingService.js";

const createTimeSheet = async (req, res) => {
    try {
        let response = await timeKeepingService.createTimeSheet(req.body);
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
            DT: "",
        });
    }
}
const updateTimeSheet = async (req, res) => {
    try {
        let response = await timeKeepingService.updateTimeSheet(req.body);
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
            DT: "",
        });
    }
}
export default {
    createTimeSheet,
    updateTimeSheet
}