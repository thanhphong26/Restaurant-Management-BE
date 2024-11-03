import Booking from "../model/booking/booking.schema.js";
import Table from "../model/table/table.schema.js";
import tableService from "./tableService.js";
import orderService from "./orderService.js";
const getAllBookings = async () => {
    // const pipeline = [
    //     {
    //         $
    //     }
    // ];
    try {
        let bookings = await Booking.find();
        console.log(bookings);
        return {
            EC: 0,
            EM: "Lấy thông tin booking thành công",
            DT: bookings
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
const createBooking = async (user_id, booking) => {
    try {
        // lấy bàn trống đầu tiên
        let table = await Table.findOne({ status: "available" });
        if (!table) {
            return {
                EC: 1,
                EM: "Không còn bàn trống",
                DT: ""
            }
        }
        else {
            let updatedTable = await tableService.updateTable(table._id, { status: "reserved" });
            if (updatedTable.EC === 0) {
                let newBooking = await Booking.create({ ...booking, user_id, table_id: updatedTable.DT._id });
                console.log("newBooking:", newBooking);
                return {
                    EC: 0,
                    EM: "Đặt lịch thành công",
                    DT: newBooking
                }
            }

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
const getBookingById = async (id) => {
    try {
        let booking = await Booking.find({ _id: id });
        return {
            EC: 0,
            EM: "Lấy thông tin booking thành công",
            DT: booking
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
const createComment = async (comment) => {
    try {
        let booking = await Booking.findOneAndUpdate({ _id: comment._id }, { $push: { comment: comment.comment, rate: comment.rate } }, { new: true });
        return {
            EC: 0,
            EM: "Bình luận thành công",
            DT: booking
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
const updateListStaff = async (id, booking) => {
    try {
        let updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { $set: booking },
            { new: true });
        return {
            EC: 0,
            EM: "Cập nhật đặt lịch thành công",
            DT: updatedBooking
        }
    }
    catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}
const createBookingWithTableId = async (id, booking) => {
    try {
        let order_detail = [];
        //Tạo order
        if (booking?.order_detail?.length) {
            //có đặt món
            const list_order = await orderService.createOrder(booking.order_detail);
            order_detail = list_order.DT.map(item => item._id);
        }
        // lấy mảng id món ăn để tạo booking
        let newBooking = await Booking.create({ ...booking, user_id: id, order_detail });
        return {
            EC: 0,
            EM: "Tạo đặt lịch thành công",
            DT: newBooking
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
const getOrderDetailByBookingId = async (id) => {
    try {
        let booking = await Booking.findById(id);
        let order = await orderService.getOrderById(booking.order_detail);
        return {
            EC: 0,
            EM: "Lấy order thành công",
            DT: order.DT
        }
    }
    catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}
export default {
    getAllBookings,
    createBooking,
    getBookingById,
    createComment,
    updateListStaff,
    createBookingWithTableId,
    getOrderDetailByBookingId
}