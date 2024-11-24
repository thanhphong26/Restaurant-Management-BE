import Booking from "../model/booking/booking.schema.js";
import Table from "../model/table/table.schema.js";
import User from "../model/user/user.schema.js";
import tableService from "./tableService.js";
import orderService from "./orderService.js";
import { status, zone } from "../utils/index.js";
import Promotion from "../model/promotions/promotion.schema.js";
import { DateTime } from "luxon";
import mongoose from "mongoose";
const getAllBookings = async (page = 1, limit = 10, sortBy = 'date', sortOrder = 'asc', status = null) => {
    let match = {}
    if (status) {
        match = {
            $match: { payment_status: status }
        }
    } else {
        match = {
            $match: {}
        }
    }
    const pipelineMain = [match,
        {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $lookup: {
                from: "tables", // Tên collection lưu thông tin bàn
                localField: "table_id", // Trường trong bookingSchema
                foreignField: "_id", // Trường trong tables collection
                as: "table_info" // Tên field mới để chứa kết quả join
            }
        },
        {
            $project: {
                user: {
                    _id: "$user._id",
                    first_name: "$user.first_name",
                    last_name: "$user.last_name",
                    email: "$user.email",
                    phone_number: "$user.phone_number",
                },
                booking: {
                    _id: "$_id",
                    date: "$date",
                    time: "$time",
                    deposit: "$deposit",
                    total: "$total",
                    note: "$note",
                    payment_status: "$payment_status",
                    status: "$status",
                    table: {
                        name: { $arrayElemAt: ["$table_info.name", 0] },
                        type: { $arrayElemAt: ["$table_info.type", 0] }
                    },
                    order_detail: {
                        $map: {
                            input: "$order_detail",
                            as: "order",
                            in: {
                                food_id: "$$order.food_id",
                                quantity: "$$order.quantity",
                                status: "$$order.status"
                            }
                        }
                    },

                }
            }
        },

        {
            $sort: {
                ["date"]: -1,
                ["time"]: 1
            }
        }]
    const pipeline = [
        ...pipelineMain,
        {
            $skip: (page - 1) * limit
        },
        {
            $limit: +limit
        }
    ];
    try {
        let infor = await Booking.aggregate(pipeline);
        let booking = await Booking.aggregate([...pipelineMain, { $count: "total" }]);
        return {
            EC: 0,
            EM: "Lấy thông tin booking thành công",
            DT: { infor, total: booking[0]?.total || 0 }
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi hệ thống",
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
            EM: "Lỗi hệ thống",
            DT: "",
        }
    }
}
const getBookingById = async (id) => { //completed
    try {
        const pipeline = [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: "tables", // Tên collection lưu thông tin bàn
                    localField: "table_id", // Trường trong bookingSchema
                    foreignField: "_id", // Trường trong tables collection
                    as: "table_info" // Tên field mới để chứa kết quả join
                }
            },
            {
                $project: {
                    _id: 1,
                    date: 1,
                    time: 1,
                    table: {
                        name: { $arrayElemAt: ["$table_info.name", 0] },
                        type: { $arrayElemAt: ["$table_info.type", 0] }
                    },
                    order_detail: 1,
                    note: 1,
                    total: 1,
                    voucher: 1,
                    payment_method: 1,
                    payment_status: 1,
                    list_staff: 1,
                    comment: 1,
                    rate: 1,
                    status: 1
                }
            }
        ]
        let booking = await Booking.aggregate(pipeline);
        return {
            EC: 0,
            EM: "Lấy thông tin booking thành công",
            DT: booking
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi hệ thống",
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
            EM: "Lỗi hệ thống",
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
            EM: "Cập nhật thành công",
            DT: updatedBooking
        }
    }
    catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi hệ thống",
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
            EM: "Lỗi hệ thống",
            DT: "",
        }
    }
}
const createBookingWithTableId = async (user_id, booking) => {
    let table = await tableService.getOneTable(booking.table_id);
    if (table.DT.status == "available") {
        //update table status
        tableService.findByIdAndUpdate(booking.table_id, { status: "occupied" });
        let newBooking = await Booking.create({ ...booking, user_id });
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
            let newBooking = await Booking.create({ ...booking, user_id });
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
            EM: "Lỗi hệ thống",
            DT: "",
        }
    }
}
const getAllBookingsByPhoneNumber = async (phone_number = null, page = 1, limit = 10,) => {
    try {
        let match = {}
        let matchBooKing = {}
        const todayWithSpecificTime = DateTime.now()
            .setZone(zone) // Đặt múi giờ UTC
            .startOf("day"); // Đặt thời gian cụ thể
        // console.log(todayWithSpecificTime);
        if (phone_number) {
            match = { $match: { phone_number } }
            matchBooKing = { "booking.date": { $gte: todayWithSpecificTime } };
        } else {
            match = { $match: {} }
            matchBooKing = { "booking.date": todayWithSpecificTime };
        }
        const pipelineMain = [match,
            {
                $lookup: {
                    from: "bookings",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "booking"
                }
            },
            {
                $unwind: "$booking"
            },
            {
                $match: {
                    "booking.payment_status": "pending",
                    "booking.status": "confirmed",
                    ...matchBooKing
                }
            },
            {
                $lookup: {
                    from: "tables", // Tên collection lưu thông tin bàn
                    localField: "booking.table_id", // Trường trong bookingSchema
                    foreignField: "_id", // Trường trong tables collection
                    as: "table_info" // Tên field mới để chứa kết quả join
                }
            },
            {
                $project: {
                    _id: 1,
                    first_name: 1,
                    last_name: 1,
                    email: 1,
                    phone_number: 1,
                    avatar: 1,
                    address: 1,
                    dob: 1,

                    booking: {
                        _id: "$booking._id",
                        date: "$booking.date",
                        time: "$booking.time",
                        deposit: "$booking.deposit",
                        // total: "$booking.total",
                        table: {
                            name: { $arrayElemAt: ["$table_info.name", 0] },
                            type: { $arrayElemAt: ["$table_info.type", 0] }
                        },
                        order_detail: {
                            $map: {
                                input: "$order_detail",
                                as: "order",
                                in: {
                                    food_id: "$$order.food_id",
                                    quantity: "$$order.quantity",
                                    status: "$$order.status"
                                }
                            }
                        },
                        note: "$booking.note",
                        payment_status: "$booking.payment_status",
                        status: "$booking.status"
                    }
                }
            },
            {
                $sort: {
                    ["booking.date"]: -1,
                    ["booking.time"]: 1
                }
            }]
        const pipeline = [
            ...pipelineMain,
            {
                $skip: (page - 1) * limit
            },
            {
                $limit: +limit
            }
        ];
        let infor = await User.aggregate(pipeline);
        if (phone_number && infor.length === 0) {
            return {
                EC: 1,
                EM: "Không tìm thấy thông tin đặt trước của số điện thoại này",
                DT: [],
            }
        }
        let booking = await User.aggregate([...pipelineMain, { $count: "total" }]);
        return {
            EC: 0,
            EM: "Lấy danh sách đặt trước thành công",
            DT: { infor, total: booking[0]?.total || 0 }
        }
    }
    catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi hệ thống",
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
            if (data.voucher !== "undefined") {

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
            else {
                let booking = await Booking.findByIdAndUpdate(id, { $set: { ...data, voucher: "", payment_status: 'paid' } }, { new: true });
                return {
                    EC: 0,
                    EM: "Thanh toán thành công",
                    DT: booking
                }
            }
        }
    }
    catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi hệ thống",
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
            EM: "Lỗi hệ thống",
            DT: "",
        }
    }
}
const serveBooking = async (id, list_staff) => {
    try {
        let booking = await Booking.findByIdAndUpdate(id, { $addToSet: { list_staff: { $each: list_staff } } }, { new: true });
        return {
            EC: 0,
            EM: "Cập nhật thành công",
            DT: booking
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: "",
        }
    }
}

const getBookingByUserId = async (page, limit, status, date, user_id) => {
    try {
        // Tạo matchStage cơ bản với user_id
        const matchStage = {
            user_id: new mongoose.Types.ObjectId(user_id),
        };

        // Thêm điều kiện status nếu được cung cấp
        if (status) {
            matchStage.status = status;
        }

        // Thêm điều kiện date nếu được cung cấp
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            matchStage.date = {
                $gte: startOfDay,
                $lte: endOfDay
            };
        }

        const pipeline = [
            { $match: matchStage },
            { $sort: { date: -1 } },
            {
                $lookup: {
                    from: 'tables',
                    localField: 'table_id',
                    foreignField: '_id',
                    as: 'table'
                }
            },
            {
                $unwind: '$table'
            },
            {
                $lookup: {
                    from: 'foods',
                    let: { orderDetails: '$order_detail' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ['$_id', {
                                        $map: {
                                            input: '$$orderDetails',
                                            as: 'order',
                                            in: '$$order.food_id'
                                        }
                                    }]
                                }
                            }
                        }
                    ],
                    as: 'foods'
                }
            },
            {
                $addFields: {
                    order_detail: {
                        $map: {
                            input: '$order_detail',
                            as: 'order',
                            in: {
                                food: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: '$foods',
                                                as: 'food',
                                                cond: { $eq: ['$$food._id', '$$order.food_id'] }
                                            }
                                        },
                                        0
                                    ]
                                },
                                quantity: '$$order.quantity',
                                status: '$$order.status'
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    date: 1,
                    time: 1,
                    table: {
                        name: '$table.name',
                        type: '$table.type'
                    },
                    order_detail: {
                        $map: {
                            input: '$order_detail',
                            as: 'item',
                            in: {
                                food_id: '$$item.food._id',
                                name: '$$item.food.name',
                                price: '$$item.food.price',
                                image: '$$item.food.image',
                                quantity: '$$item.quantity',
                                status: '$$item.status'
                            }
                        }
                    },
                    note: 1,
                    total: 1,
                    voucher: 1,
                    payment_method: 1,
                    payment_status: 1,
                    list_staff: 1,
                    comment: 1,
                    rate: 1,
                    status: 1
                }
            },
            {
                $facet: {
                    metadata: [
                        { $count: "total" },
                        { $addFields: { page: page, limit: +limit } },
                    ],
                    data: [
                        { $skip: (page - 1) * +limit },
                        { $limit: +limit },
                    ],
                },
            },
        ];

        const result = await Booking.aggregate(pipeline);

        // Trích xuất dữ liệu kết quả
        const bookings = result[0]?.data || [];
        const metadata = result[0]?.metadata[0] || { total: 0, page, limit };

        return {
            EC: 0,
            EM: "Lấy thông tin booking thành công",
            DT: {
                metadata,
                bookings,
            },
        };
    } catch (error) {
        console.error(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        };
    }
};


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
    payment,
    serveBooking,
    getBookingByUserId,
}