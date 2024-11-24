import promotionService from "../services/promotionService.js";

const getPromotionsValid = async (req, res) => {
    try {
        let page = req.query.page || 1;
        let limit = req.query.limit || 10;
        let search = req.query.search || '';
        let userId = req.user.id;
        let response = await promotionService.getPromotionsValid(page, limit, search, userId);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        });
    }
}

const getPromotionById = async (req, res) => {
    try {
        let promotionId = req.params.id;
        let response = await promotionService.getPromotionById(promotionId);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        });
    }
}

const createPromotion = async (req, res) => {
    try {
        let promotion = req.body;
        if (promotion && promotion.type
            && promotion.discount && promotion.startDate && promotion.endDate) {
            let response = await promotionService.createPromotion(promotion);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        });
    }
}

const updatePromotion = async (req, res) => {
    try {
        let promotionId = req.params.id;
        let promotion = req.body;
        console.log(promotion);
        if (promotion && promotion.description && promotion.discount && promotion.type
            && promotion.startDate && promotion.endDate) {
            let response = await promotionService.updatePromotion(promotionId, promotion);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Invalid data",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        });
    }
}

const deletePromotion = async (req, res) => {
    try {
        let promotionId = req.params.id;
        let response = await promotionService.deletePromotion(promotionId);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        });
    }
}

export default {
    getPromotionsValid,
    getPromotionById,
    createPromotion,
    updatePromotion,
    deletePromotion
}