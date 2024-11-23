import bookingService from "../services/bookingService.js";
import orderService from "../services/orderService.js";

const getAllBookings = async (req, res) => {
    try {

        const { page, limit, sortBy, sortOrder, status } = req.query;
        //lấy id từ query của req
        const role = req.user.role;
        if (role === 'customer') {
            let response = await bookingService.getAllBookingByUserId(req.user.id, page, limit, sortBy, sortOrder, status);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            });
        }
        else {
            let response = await bookingService.getAllBookings(page, limit, sortBy, sortOrder, status);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: "",
        });
    }
}
const createBooking = async (req, res) => {
    try {
        const { table, booking } = req.body;
        let response = {};
        if (req.user.role === 'staff') {
            response = await bookingService.createBooking(req.user.id, table, booking);
        } else {
            response = await bookingService.createBooking(req.user.id, table, booking);
        }
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
            DT: "",
        });
    }
}
const getBookingById = async (req, res) => {
    try {
        let response = await bookingService.getBookingById(req.params.id);
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
            DT: "",
        });
    }
}
const createComment = async (req, res) => {
    try {
        let response = await bookingService.createComment(req.params.id, req.user.id, req.body);
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
            DT: "",
        });
    }
}
const updateBooking = async (req, res) => {
    try {
        let response = await bookingService.updateBooking(req.params.id, req.body);
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
            DT: "",
        });
    }
}
const getOrderDetailByBookingId = async (req, res) => {
    try {
        let response = await bookingService.getOrderDetailByBookingId(req.params.id);
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
            DT: "",
        });
    }
}
const getAllBookingsByPhoneNumber = async (req, res) => {
    try {
        let response = await bookingService.getAllBookingsByPhoneNumber(req.query.phone_number, req.query.page, req.query.limit);
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
            DT: "",
        });
    }
}
const payment = async (req, res) => {
    try {
        let response = await bookingService.payment(req.query.bookingId, req.body);
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
            DT: "",
        });
    }
}
const serveBooking = async (req, res) => {
    try {
        let response = await bookingService.serveBooking(req.params.id, req.body.list_staff);
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
            DT: "",
        });
    }
}
const updateOrder = async (req, res) => {
    try {
        let response = await orderService.updateOrder(req.params.id, req.body.order_detail);
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
            DT: "",
        });
    }
}
const getOrderById = async (req, res) => {
    try {
        let response = await orderService.getOrderById(req.params.id);
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
            DT: "",
        });
    }
}
export default {
    getAllBookings,
    createBooking,
    getBookingById,
    createComment,
    updateBooking,
    getOrderDetailByBookingId,
    getAllBookingsByPhoneNumber,
    payment,
    serveBooking,
    updateOrder,
    getOrderById
}
