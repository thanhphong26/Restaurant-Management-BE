import foodService from "../services/foodService.js";
const createFood = async (req, res) => {
    try {
        const response = await foodService.createFood(req.body);
        return res.status(201).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        });
    }
};
const deleteFood = async (req, res) => {
    try {
        const response = await foodService.deleteFood(req.params.foodId);
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
            DT: ""
        });
    }
};
const getAllFoods = async (req, res) => {
    try {
      const { page, limit, sortBy, sortOrder, type, status } = req.query;
      const response = await foodService.getAllFoods(page, limit, sortBy, sortOrder, type, status);
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
            EM: "Error from server",
            DT: ""
        });
    }
}
const updateFood=async(req,res)=>{
    try{
        const response=await foodService.updateFood(req.params.id,req.body);
        return res.status(200).json({
            EC:response.EC,
            EM:response.EM,
            DT:response.DT
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            EC:500,
            EM:"Error from server",
            DT:""
        });
    }
}
const getFoodStats=async(req,res)=>{
    try{
        const response=await foodService.getFoodStats();
        return res.status(200).json({
            EC:response.EC,
            EM:response.EM,
            DT:response.DT
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            EC:500,
            EM:"Error from server",
            DT:""
        });
    }
}
const searchFoods=async(req,res)=>{
    try{
        const response=await foodService.searchFoods(req.query.q);
        return res.status(200).json({
            EC:response.EC,
            EM:response.EM,
            DT:response.DT
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            EC:500,
            EM:"Error from server",
            DT:""
        });
    }
}
const getFoodsByType=async(req,res)=>{
    try{
        const response=await foodService.getFoodsByType(req.params.type);
        return res.status(200).json({
            EC:response.EC,
            EM:response.EM,
            DT:response.DT
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            EC:500,
            EM:"Error from server",
            DT:""
        });
    }
}
const updateFoodStatus=async(req,res)=>{
    try{
        const response=await foodService.updateFoodStatus(req.params.id,req.body.status);
        return res.status(200).json({
            EC:response.EC,
            EM:response.EM,
            DT:response.DT
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            EC:500,
            EM:"Error from server",
            DT:""
        });
    }
}
export default{
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