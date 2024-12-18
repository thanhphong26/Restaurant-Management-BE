import ingredientService from "../services/ingredientService.js";
const createIngredient = async (req, res) => {
    try {
        const response = await ingredientService.createIngredient(req.body);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        });
    }
};
const updateIngredient = async (req, res) => {
    try {
        const response = await ingredientService.updateIngredient(req.params.id, req.body);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        });
    }
};
const getIngredientById = async (req, res) => {
    try {
        const response = await ingredientService.getIngredientById(req.params.id);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        });
    }
}
const deleteIngredient = async (req, res) => {
    try {
        const response = await ingredientService.deleteIngredient(req.params.id);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        });
    }
}
const getAllIngredients = async (req, res) => {
    try {
        const { page, limit, ...query } = req.query;
        const response = await ingredientService.getAllIngredients(query, page, limit);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        });
    }
}
const updateIngredientInventory = async (req, res) => {
    try {
        const response = await ingredientService.updateIngredientInventory(req.params.id, req.body);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        });
    }
}
const getUpdatedHistory = async (req, res) => {
    try {
        const { ingredientId, page, limit, ...query } = req.query;
        console.log(ingredientId, page, limit, query);
        const response = await ingredientService.getUpdatedHistory(ingredientId, query, page, limit);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        });
    }
}
const getStatistics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const response = await ingredientService.getStatistics(startDate, endDate);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        });
    }
}
const checkExpiredIngredients = async (req, res) => {
    try {
        const { page, limit}=req.query;
        const response = await ingredientService.checkExpiredIngredients(page, limit);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        });
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
    createIngredient,
    updateIngredient,
    getIngredientById,
    deleteIngredient,
    getAllIngredients,
    updateIngredientInventory,
    getUpdatedHistory,
    getStatistics,
    checkExpiredIngredients
};