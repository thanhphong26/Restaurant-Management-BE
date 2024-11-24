import mongoose from "mongoose";
import Booking from "../model/booking/booking.schema.js";

const updateOrder = async (bookingId, orderDetails) => {
    try {
        // Tìm booking bằng ID
        const booking = await Booking.findById(bookingId);

        if (booking) {
            // Duyệt qua danh sách `order_detail` từ request body
            for (const newOrderItem of orderDetails) {
                const { food_id, quantity } = newOrderItem;

                // Tìm phần tử trong mảng `order_detail` có cùng `food_id`
                const existingOrder = booking.order_detail.find(
                    (order) => order.food_id.toString() === food_id
                );

                if (existingOrder) {
                    // Nếu tồn tại, cộng dồn quantity
                    existingOrder.quantity += quantity;
                } else {
                    // Nếu không tồn tại, thêm mới
                    booking.order_detail.push({
                        food_id,
                        quantity
                    });
                }
            }
            // Lưu lại thay đổi
            const updatedBooking = await booking.save();
            return {
                EC: 0,
                EM: "Cập nhật order thành công",
                DT: updatedBooking
            }
        }
        return {
            EC: 1,
            EM: "Không tìm thấy booking",
            DT: ""
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
        const pipeline = [
            {
                // Bước 1: Tìm booking theo _id
                $match: { _id: new mongoose.Types.ObjectId(id) }
            },
            {
                // Bước 2: Giải phóng mảng order_detail để xử lý từng order riêng
                $unwind: "$order_detail"
            },
            {
                // Bước 3: Lookup để lấy thông tin chi tiết từ collection Food
                $lookup: {
                    from: "foods", // Tên collection chứa Food
                    localField: "order_detail.food_id", // Trường liên kết với Food
                    foreignField: "_id", // Trường _id của Food
                    as: "food_detail" // Thông tin chi tiết sẽ được lưu vào food_detail
                }
            },
            {
                // Bước 4: Giải phóng mảng food_detail (do lookup trả về mảng)
                $unwind: "$food_detail"
            },
            {
                // Bước 5: Tái cấu trúc dữ liệu trả về
                $project: {
                    _id: 0, // Không trả về _id của booking
                    booking_id: "$_id",
                    food_id: "$order_detail.food_id",
                    quantity: "$order_detail.quantity",
                    status: "$order_detail.status",
                    food_name: "$food_detail.name",
                    food_image: "$food_detail.image",
                    food_price: "$food_detail.price",
                    food_type: "$food_detail.type",
                    food_description: "$food_detail.description"
                }
            }
        ];
        const orders = await Booking.aggregate(pipeline);
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
    updateOrder,
    getOrderById
}