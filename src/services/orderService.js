import Order from "../model/order/order.schema.js";

const createOrder = async (order) => {
    try {
        let newOrder = await Order.create(order);
        return {
            EC: 0,
            EM: "Tạo order thành công",
            DT: newOrder
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}
const updateOrder = async (id, order) => {
    try {
        let updatedOrder = await Order.findByIdAndUpdate(id, { $set: order }, { new: true });
        return {
            EC: 0,
            EM: "Cập nhật order thành công",
            DT: updatedOrder
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}
const deleteOrder = async (id) => {
    try {
        let deletedOrder = await Order.findByIdAndDelete(id);
        return {
            EC: 0,
            EM: "Xóa order thành công",
            DT: deletedOrder
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}
const getOrderById = async (id) => {
    try {
        const orders = await Order.find({ _id: { $in: id } });
        return {
            EC: 0,
            EM: "Lấy order thành công",
            DT: orders
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}

export default {
    createOrder,
    updateOrder,
    deleteOrder,
    getOrderById
}