import promotionService from "../services/promotionService.js";

const getAllPromotions = async (req, res) => {
    try {
        let page = req.query.page || 1;
        let limit = req.query.limit || 10;
        let search = req.query.search || '';
        let response = await promotionService.getAllPromotions(page, limit, search);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        });
    }
}

const createPromotion = async (req, res) => {
    try {
        let promotion = req.body;
        if (promotion && promotion.code && promotion.description && promotion.discount && promotion.startDate && promotion.endDate) {
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
            EM: "Error from server",
            DT: ""
        });
    }
}

const updatePromotion = async (req, res) => {
    try {
        let promotionId = req.params.id;
        let promotion = req.body;
        console.log(promotion);
        if (promotion && promotion.description && promotion.discount && promotion.startDate && promotion.endDate) {
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
            EM: "Error from server",
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
            EM: "Error from server",
            DT: ""
        });
    }
}

export default {
    getAllPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion
}