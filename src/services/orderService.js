import Booking from "../model/booking/booking.schema.js";

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
const updateOrder = async (bookingId, orderDetails) => {
    try {
        console.log("orderDetails", orderDetails);
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
            console.log('Before updating Booking:', booking);
            // Lưu lại thay đổi
            const updatedBooking = await booking.save();

            console.log('After updated Booking:', updatedBooking);
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
// const deleteOrder = async (id) => {
//     try {
//         let deletedOrder = await Order.findByIdAndDelete(id);
//         return {
//             EC: 0,
//             EM: "Xóa order thành công",
//             DT: deletedOrder
//         }
//     } catch (error) {
//         console.log(error);
//         return {
//             EC: 500,
//             EM: "Error from server",
//             DT: "",
//         }
//     }
// }
// const getOrderById = async (id) => {
//     try {
//         const orders = await Order.find({ _id: { $in: id } });
//         return {
//             EC: 0,
//             EM: "Lấy order thành công",
//             DT: orders
//         }
//     } catch (error) {
//         console.log(error);
//         return {
//             EC: 500,
//             EM: "Error from server",
//             DT: "",
//         }
//     }
// }

export default {
    createOrder,
    updateOrder,
    // deleteOrder,
    // getOrderById
}