import { status } from "../utils/index.js";
import mongoose from "mongoose";
import Promotion from "../model/promotions/promotion.schema.js";
import User from "../model/user/user.schema.js";
const getPromotionsValid = async (page, limit, search, userId) => {
    try {
        let savedVouchers = [];
        if (userId) {
            const user = await User.findById(userId).select("save_voucher");
            if (!user) {
                return {
                    EC: 404,
                    EM: "User not found",
                    DT: ""
                };
            }
            savedVouchers = user.save_voucher || [];
        }

        // Stage match để lọc theo các điều kiện tìm kiếm
        const matchStage = {
            $match: {
                status: status.ACTIVE,
                quantity: { $gt: 0 },
                startDate: { $lte: new Date() },
                endDate: { $gte: new Date() },
                ...(search && {
                    code: { $regex: search, $options: 'i' }
                }),
                ...(userId && { code: { $nin: savedVouchers } }) // Exclude saved vouchers if userId is provided
            }
        };

        // Pipeline để lấy các khuyến mãi theo trang và điều kiện tìm kiếm
        let pipeline = [
            matchStage,
            {
                $project: {
                    _id: 0,
                    promotionId: '$_id',
                    code: 1,
                    description: 1,
                    quantity: 1,
                    discount: 1,
                    condition: 1,
                    type: 1,
                    startDate: 1,
                    endDate: 1
                }
            },
            { $skip: (+page - 1) * +limit },
            { $limit: +limit }
        ];

        // Lấy các khuyến mãi thỏa mãn điều kiện tìm kiếm và phân trang
        let promotions = await Promotion.aggregate(pipeline);

        // Truy vấn để đếm tổng số khuyến mãi thỏa mãn điều kiện tìm kiếm mà không phân trang
        const countPipeline = [
            matchStage,  // Điều kiện tìm kiếm giống như ở trên
            { $count: "total" }  // Đếm tổng số khuyến mãi thỏa mãn điều kiện
        ];

        // Lấy tổng số khuyến mãi từ kết quả đếm
        const countResult = await Promotion.aggregate(countPipeline);
        const total = countResult.length > 0 ? countResult[0].total : 0;

        // Trả về dữ liệu khuyến mãi và tổng số khuyến mãi
        return {
            EC: 0,
            EM: "Lấy danh sách khuyến mãi thành công",
            DT: { promotions, total }
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi từ server",
            DT: "",
        };
    }
};

const getPromotionById = async (promotionId) => {
    try {
        let promotion = await Promotion.findById(promotionId);
        if (!promotion) {
            return {
                EC: 404,
                EM: "Không tìm thấy khuyến mãi",
                DT: ""
            }
        }

        return {
            EC: 0,
            EM: "Lấy thông tin khuyến mãi thành công",
            DT: promotion
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lấy thông tin khuyến mãi thất bại",
            DT: "",
        }
    }
}

const createPromotion = async (promotion) => {
    try {
        const existingPromotion = await Promotion.findOne({ code: promotion.code });

        if (existingPromotion) {
            return {
                EC: 400,
                EM: "Mã khuyến mãi đã tồn tại",
                DT: "",
            };
        }

        let newPromotion = await Promotion.create({
            code: promotion.code,
            description: promotion.description,
            quantity: promotion.quantity || 0,
            discount: promotion.discount,
            condition: promotion.condition || 0,
            type: promotion.type,
            startDate: promotion.startDate,
            endDate: promotion.endDate,
            status: status.ACTIVE
        })

        return {
            EC: 0,
            EM: "Tạo khuyến mãi thành công",
            DT: newPromotion
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Tạo khuyến mãi thất bại",
            DT: "",
        }
    }
} 

const updatePromotion = async (promotionId, promotion) => {
    try {
        let updatePromotion = await Promotion.findByIdAndUpdate(promotionId, {
            description: promotion.description,
            discount: promotion.discount,
            quantity: promotion.quantity || 0,
            condition: promotion.condition || 0,
            type: promotion.type,
            startDate: promotion.startDate,
            endDate: promotion.endDate
        }, { new: true })

        return {
            EC: 0,
            EM: "Cập nhật khuyến mãi thành công",
            DT: updatePromotion
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Cập nhật khuyến mãi thất bại",
            DT: "",
        }
    }
}

const deletePromotion = async (promotionId) => {
    try {
        let promotion = await Promotion.findByIdAndUpdate(promotionId, {
            status: status.INACTIVE
        }, { new: true })

        return {
            EC: 0,
            EM: "Xóa khuyến mãi thành công",
            DT: promotion
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Xóa khuyến mãi thất bại",
            DT: "",
        }
    }
}

export default {
    getPromotionsValid,
    getPromotionById,
    createPromotion,
    updatePromotion,
    deletePromotion
}