import Booking from "../model/booking/booking.schema.js";
import Table from "../model/table/table.schema.js";
import User from "../model/user/user.schema.js";
import tableService from "./tableService.js";
import orderService from "./orderService.js";
import Promotion from "../model/promotions/promotion.schema.js";
const getAllBookings = async (page, limit, sortBy, sortOrder, status) => {
    // const pipeline = [
    //     {
    //         $
    //     }
    // ];
    const query = {};
    if (status) {
        query.status = status;
    }
    try {
        let bookings = await Booking.find(query).sort({ [sortBy]: sortOrder }).skip((page - 1) * limit).limit(limit);
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
const createBooking = async (user_id, table, booking) => { //completed
    try {
        // lấy bàn trống đầu tiên
        let resTable = {};
        resTable = await Table.findOne({ status: "available", ...table });
        if (!resTable) {
            let tableBooked = await Booking.find({ payment_status: { $ne: "paid" }, date: booking.date });
            resTable = await Table.findOne(
                {
                    status: "reserved",
                    type: table.type,
                    seat: { $gte: table.seat },
                    _id: { $nin: tableBooked.map(item => item.table_id) }
                });
            console.log("resTable:", resTable);
            if (!resTable) {
                return {
                    EC: 1,
                    EM: "Không tìm thấy bàn phù hợp",
                    DT: ""
                }
            } else {
                let updatedTable = await tableService.updateTable(resTable._id, { status: "reserved" });
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
        }
        else {
            let updatedTable = await tableService.updateTable(resTable._id, { status: "reserved" });
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
const getBookingById = async (id) => { //completed
    try {
        let booking = await Booking.findById(id);
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
const createComment = async (bookingId, user_id, data) => { //completed
    try {
        let booking = await Booking.findOneAndUpdate({ _id: bookingId, user_id, payment_status: 'paid', status: 'completed' }, { $set: { ...data } }, { new: true });
        if (!booking) {
            return {
                EC: 1,
                EM: "Đánh giá không thành công",
                DT: ""
            }
        } else
            return {
                EC: 0,
                EM: "Đánh giá thành công",
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
const updateBooking = async (id, booking) => {
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
const updateOrderByBookingID = async (id, order) => { //order = {food_id, quantity}
    try {
        let booking = await getOrderDetailByBookingId(id);

        const bookingMap = new Map(
            booking.DT.map(item => [item.food_id, item])
        );

        // Xử lý các item trong order
        const processedItems = order.reduce((acc, orderItem) => {
            const bookingItem = bookingMap.get(orderItem.food_id);

            if (bookingItem && bookingItem.quantity !== orderItem.quantity) {
                // Nếu item đã tồn tại trong booking, cộng quantity
                acc.push({
                    _id: bookingItem._id,
                    food_id: orderItem.food_id,
                    quantity: orderItem.quantity
                });
            } else {
                // Nếu là item mới, thêm vào với _id mới

                acc.push({
                    _id: `new_${orderItem.food_id}`, // hoặc generate _id theo logic của bạn
                    food_id: orderItem.food_id,
                    quantity: orderItem.quantity
                });
            }
            return acc;
        }, []);

        console.log(processedItems);
        // let updatedOrder = await Order.findByIdAndUpdate(id, { $set: order_detail }, { new: true });
        // kiểm tra nếu food_id đã tồn tại thì cập nhật quantity, nếu chưa thì thêm mới

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
const createBookingWithTableId = async (user_id, booking) => {
    let table = await tableService.getOneTable(booking.table_id);
    if (table.DT.status == "available") {
        let order_detail = [];
        //Tạo order
        if (booking?.order_detail?.length) {
            //có đặt món
            const list_order = await orderService.createOrder(booking.order_detail);
            order_detail = list_order.DT.map(item => item._id);
        }
        // lấy mảng id món ăn để tạo booking
        let newBooking = await Booking.create({ ...booking, user_id, order_detail });
        return {
            EC: 0,
            EM: "Tạo đặt lịch thành công",
            DT: newBooking
        }
    } else {
        //check booking table with today
        let bookingToday = await Booking.findOne({ table_id: booking.table_id, date: booking.date });
        if (bookingToday) {
            return {
                EC: 1,
                EM: "Bàn đã được đặt trong ngày",
                DT: ""
            }
        }
        else {
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
const getAllBookingsByPhoneNumber = async (phone_number, page = 1, limit = 10, sortBy = "date", sortOrder = "asc", status) => {
    try {
        let user = await User.findOne({ phone_number });
        console.log("user:", user);
        if (!user) {
            return {
                EC: 1,
                EM: "Không tìm thấy người dùng",
                DT: ""
            }
        }
        else {
            let query = {};
            if (status) {
                query.status = status;
            }
            let bookings = await Booking.find({ user_id: user._id, ...query }).sort({ [sortBy]: sortOrder }).skip((page - 1) * limit).limit(limit);
            return {
                EC: 0,
                EM: "Lấy thông tin booking thành công",
                DT: bookings
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
const payment = async (id, data) => {
    try {
        let checkBooking = await Booking.findById(id);
        if (checkBooking.payment_status === 'paid') {
            return {
                EC: 1,
                EM: "Hóa đơn đã được thanh toán",
                DT: ""
            }
        } else {
            // kiểm tra mã giảm giá
            let Code = await Promotion.findOne({ code: data.voucher });
            if (!Code) {
                return {
                    EC: 1,
                    EM: "Mã giảm giá không hợp lệ",
                    DT: ""
                }
            }
            else {
                // kiểm tra điều kiện mã giảm giá (status, startDate, endDate, condition)
                if (Code.status !== 'active' && new Date() > Code.startDate && new Date() < Code.endDate && Code.quantity > 0) {
                    return {
                        EC: 1,
                        EM: "Không thể sử dụng mã giảm giá",
                        DT: ""
                    }
                } else {
                    // thực hiện cập nhật promotion, booking, user 
                    let promotion = await Promotion.findByIdAndUpdate(Code._id, { $inc: { quantity: -1 } }, { new: true });
                    let booking = await Booking.findByIdAndUpdate(id, { $set: { ...data, payment_status: 'paid' } }, { new: true });
                    let user = await User.findByIdAndUpdate(booking.user_id, { $push: { save_voucher: data.voucher } }, { new: true });
                    if (promotion && booking && user)
                        return {
                            EC: 0,
                            EM: "Thanh toán thành công",
                            DT: booking
                        }
                    else
                        return {
                            EC: 1,
                            EM: "Thanh toán không thất bại",
                            DT: ""
                        }
                }
            }
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
const getAllBookingByUserId = async (id, page = 1, limit = 10, sortBy = "date", sortOrder = "asc", status) => {
    const query = {};
    if (status) {
        query.status = status;
    }
    try {
        let bookings = await Booking.find({ user_id: id, ...query }).sort({ [sortBy]: sortOrder }).skip((page - 1) * limit).limit(limit);
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
export default {
    getAllBookings,
    getAllBookingByUserId,
    createBooking,
    getBookingById,
    createComment,
    updateBooking,
    createBookingWithTableId,
    getOrderDetailByBookingId,
    getAllBookingsByPhoneNumber,
    payment
}