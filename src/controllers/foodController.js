import foodService from "../services/foodService.js";
const createFood = async (req, res) => {
    try {
        const response = await foodService.createFood(req.body);
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
const deleteFood = async (req, res) => {
    try {
        const response = await foodService.deleteFood(req.params.id);
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
const getAllFoods = async (req, res) => {
    try {
        let page = req.query.page || 1;
        let limit = req.query.limit || 10;
        const { sortBy, sortOrder, type, status, search } = req.query;
        const response = await foodService.getAllFoods(page, limit, sortBy, sortOrder, type, status, search);
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
const getFoodById = async (req, res) => {
    try {
        const response = await foodService.getFoodById(req.params.id);
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
const updateFood = async (req, res) => {
    try {
        const response = await foodService.updateFood(req.params.id, req.body);
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
const getFoodStats = async (req, res) => {
    try {
        const response = await foodService.getFoodStats();
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
const searchFoods = async (req, res) => {
    try {
        const response = await foodService.searchFoods(req.query.q);
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
const getFoodsByType = async (req, res) => {
    try {
        const response = await foodService.getFoodsByType(req.params.type);
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
const updateFoodStatus = async (req, res) => {
    try {
        const response = await foodService.updateFoodStatus(req.params.id, req.body.status);
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
    createFood,
    deleteFood,
    getAllFoods,
    getFoodById,
    updateFood,
    getFoodStats,
    searchFoods,
    getFoodsByType,
    updateFoodStatus
};