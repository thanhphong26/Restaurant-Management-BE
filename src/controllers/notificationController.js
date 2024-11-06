import notificationService from "../services/notificationService.js";

const createNotification = async (req, res) => {
    try {
        let response = await notificationService.createNotification(req.body);
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
export default {
    createNotification
}