import { status } from "../utils/index.js";
import mongoose from "mongoose";
import Promotion from "../model/promotions/promotion.schema.js";

const getAllPromotions = async (page, limit, search) => {
    try {
        let pipeline = [
            {
                $match: {
                    status: status.ACTIVE,
                    ...(search && {
                        code: { $regex: search, $options: 'i' }
                    })
                }
            },
            {
                $project: {
                    _id: 0,
                    promotionId: '$_id',
                    code: 1,
                    description: 1,
                    discount: 1,
                    startDate: 1,
                    endDate: 1
                }
            },
            { $skip: (+page - 1) * +limit },
            { $limit: +limit }
        ];

        let promotions = await Promotion.aggregate(pipeline);
        return {
            EC: 0,
            EM: "Lấy danh sách khuyến mãi thành công",
            DT: promotions
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

// const getPromotionUnused = async (userId) => {
//     try{
        
//     }
// }

const createPromotion = async (promotion) => {
    try {
        let newPromotion = await Promotion.create({
            code: promotion.code,
            description: promotion.description,
            discount: promotion.discount,
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
    getAllPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion
}