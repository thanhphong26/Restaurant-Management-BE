import Notification from "../model/notification/notification.schema.js";

const createNotification = async (notification) => {
    try {
        const newNotification = await Notification.create(notification);
        console.log(newNotification);
        return {
            EC: 0,
            EM: "Tạo thông báo thành công",
            DT: newNotification
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: ""
        };
    }
}
export default {
    createNotification //tạo thông báo xin nghỉ,...
}