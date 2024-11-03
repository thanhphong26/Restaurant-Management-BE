import mongoose from "mongoose";
import Ingredient from "../model/ingredients/ingredient.schema.js";
import UpdateIngredient from "../model/updateIngredient/updateIngredient.schema.js";
const createIngredient = async (ingredientData) => { 
    try {
        //validate input data
        const allowFields=['name','inventory','unit','description','type','status'];
        const sanitizedData={};
        Object.keys(ingredientData).forEach((field)=>{
            if(allowFields.includes(field)){
                sanitizedData[field]=ingredientData[field];
            }
        });
        if(Object.keys(sanitizedData).length===0){
            return {
                EC: 1,
                EM: 'Dữ liệu không hợp lệ',
                DT: ''
            };
        }
        if(!sanitizedData.name||!sanitizedData.inventory||!sanitizedData.unit||!sanitizedData.type||!sanitizedData.status){
            return {
                EC: 1,
                EM: 'Không được để trống thông tin nguyên liệu',
                DT: ''
            };
        }
        if(sanitizedData.inventory<0){
            return {
                EC: 1,
                EM: 'Tồn kho không hợp lệ',
                DT: ''
            };
        }
        if(!['active','inactive'].includes(sanitizedData.status)){
            return {
                EC: 1,
                EM: 'Trạng thái không hợp lệ',
                DT: ''
            };
        }
        const newIngredient = new Ingredient(sanitizedData);
        //validate exist ingredient
        const existingIngredient = await Ingredient.findOne({ name: sanitizedData.name });
        if (existingIngredient) {
            return {
                EC: 1,
                EM: 'Nguyên liệu đã tồn tại',
                DT: ''
            };
        }
        await newIngredient.save();
        return {
            EC: 0,
            EM: 'Tạo nguyên liệu thành công',
            DT: newIngredient
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 1,
            EM: 'Lỗi khi tạo nguyên liệu',
            DT: ''
        };
    }
}
const updateIngredient = async (ingredientId, ingredientData) => {
    try {
        const allowFields=['ingredient_id', 'quantity', 'date', 'supplier', 'expiration_date', 'price', 'type'];
        const sanitizedData={};
        Object.keys(ingredientData).forEach((field)=>{
            if(allowFields.includes(field)){
                sanitizedData[field]=ingredientData[field];
            }
        });
        if(Object.keys(sanitizedData).length===0){
            return {
                EC: 1,
                EM: 'Dữ liệu không hợp lệ',
                DT: ''
            };
        }
        if(sanitizedData.quantity<0){
            return {
                EC: 1,
                EM: 'Số lượng không hợp lệ',
                DT: ''
            };
        }
        if(sanitizedData.price<0){
            return {
                EC: 1,
                EM: 'Giá tiền không hợp lệ',
                DT: ''
            };
        }
        if(sanitizedData.expiration_date&&new Date(sanitizedData.expiration_date)<new Date()){
            return {
                EC: 1,
                EM: 'Ngày hết hạn không hợp lệ',
                DT: ''
            };
        }
        if(sanitizedData.type&&sanitizedData.type!=='import'&&sanitizedData.type!=='export'){
            return {
                EC: 1,
                EM: 'Loại cập nhật không hợp lệ',
                DT: ''
            };
        }
        const ingredient = await Ingredient.findById(ingredientId);
        if (!ingredient) {
            return {
                EC: 1,
                EM: 'Nguyên liệu không tồn tại',
                DT: ''
            };
        }
        const updatedIngredient = await Ingredient.findByIdAndUpdate(ingredientId, sanitizedData, { new: true });
        return {
            EC: 0,
            EM: 'Cập nhật nguyên liệu thành công',
            DT: updatedIngredient
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 1,
            EM: 'Lỗi khi cập nhật nguyên liệu',
            DT: ''
        };
    }
}
const deleteIngredient = async (ingredientId) => {
    try {
        const ingredient = await Ingredient.findByIdAndUpdate(ingredientId, { status: 'inactive' }, { new: true });
        if (!ingredient) {
            return {
                EC: 1,
                EM: 'Nguyên liệu không tồn tại',
                DT: ''
            };
        }
        await Ingredient.findByIdAndDelete(ingredientId);
        return {
            EC: 0,
            EM: 'Xóa nguyên liệu thành công',
            DT: ingredient
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 1,
            EM: 'Lỗi khi xóa nguyên liệu',
            DT: ''
        };
    }
}
const getIngredientById = async (ingredientId) => {
    try {
        const ingredient = await Ingredient.findById(ingredientId);
        if (!ingredient) {
            return {
                EC: 1,
                EM: 'Nguyên liệu không tồn tại',
                DT: ''
            };
        }
        return {
            EC: 0,
            EM: 'Lấy thông tin nguyên liệu thành công',
            DT: ingredient
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 1,
            EM: 'Lỗi khi lấy thông tin nguyên liệu',
            DT: ''
        };
    }
}
const getAllIngredients = async (query = {}, page = 1, limit = 10) => {
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 }
    };
    const filter = {};
    if (query.name) filter.name = { $regex: query.name, $options: 'i' };
    if (query.type) filter.type = query.type;
    if (query.status) filter.status = query.status;
    try {
        const ingredients = await Ingredient.paginate(filter, options);
        return {
            EC: 0,
            EM: 'Lấy danh sách nguyên liệu thành công',
            DT: ingredients
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 1,
            EM: 'Lỗi khi lấy danh sách nguyên liệu',
            DT: ''
        };
    }
}
const updateIngredientInventory = async (ingredientId, updateData) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        const ingredient = await Ingredient.findById(ingredientId);
        if (!ingredient) {
            return {
                EC: 1,
                EM: 'Nguyên liệu không tồn tại',
                DT: ''
            };
        }
        let newInventory = ingredient.inventory;
        if (updateData.type === 'import') {
            newInventory += updateData.quantity;
        } else if (updateData.type === 'export') {
            if (ingredient.inventory < updateData.quantity) {
                return {
                    EC: 1,
                    EM: 'Số lượng xuất vượt quá tồn kho',
                    DT: ''
                };
            }
            newInventory -= updateData.quantity;
        }
        ingredient.inventory = newInventory;
        await ingredient.save({ session });

        const update = new UpdateIngredient(updateData);
        await update.save({ session });
        await session.commitTransaction();
        session.endSession();
        return {
            EC: 0,
            EM: 'Cập nhật số lượng nguyên liệu thành công',
            DT: update
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 1,
            EM: 'Lỗi khi cập nhật số lượng nguyên liệu',
            DT: ''
        };
    }
}
const getUpdatedHistory = async (ingredientId, query = {}, page = 1, limit = 10) => {
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { date: -1 }
    };
    const filter = { ingredient_id: ingredientId };
    if (query.type) filter.type = query.type;
    if (query.startDate && query.endDate) {
        filter.date = {
            $gte: new Date(query.startDate),
            $lte: new Date(query.endDate)
        };
    }
    try {
        const history = await UpdateIngredient.paginate(filter, options);
        return {
            EC: 0,
            EM: 'Lấy lịch sử cập nhật thành công',
            DT: history
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 1,
            EM: 'Lỗi khi lấy lịch sử cập nhật',
            DT: ''
        };
    }
    
}
const getStatistics=async(startDate,endDate)=>{
    try{
        const statistics=await UpdateIngredient.aggregate([
            {
                $match:{
                    date:{
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $group:{
                    _id: "$type",
                    total: { $sum: "$quantity" }
                }
            }
        ]);
        return {
            EC: 0,
            EM: 'Lấy thống kê thành công',
            DT: statistics
        };
    }catch(error){
        console.log(error);
        return {
            EC: 1,
            EM: 'Lỗi khi lấy thống kê',
            DT: ''
        };
    }
}
const checkExpiredIngredients=async()=>{
    try{
        const ingredients=await Ingredient.find({
            expiration_date:{
                $lt: new Date()
            },
            status: 'active',
            type: 'import'
        });
        return {
            EC: 0,
            EM: 'Kiểm tra nguyên liệu hết hạn thành công',
            DT: ingredients
        };
    }catch(error){
        console.log(error);
        return {
            EC: 1,
            EM: 'Lỗi khi kiểm tra nguyên liệu hết hạn',
            DT: ''
        };
    }
}
export default {
    createIngredient,
    updateIngredient,
    deleteIngredient,
    getIngredientById,
    getAllIngredients,
    updateIngredientInventory,
    getUpdatedHistory,
    getStatistics,
    checkExpiredIngredients
};