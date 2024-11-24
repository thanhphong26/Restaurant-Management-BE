import mongoose from "mongoose";
import Ingredient from "../model/ingredients/ingredient.schema.js";
import UpdateIngredient from "../model/updateIngredient/updateIngredient.schema.js";
const createIngredient = async (ingredientData) => { 
    try {
        //validate input data
        const allowFields=['name','unit','description','type'];
        const inventory=0;
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
        if(!sanitizedData.name||!sanitizedData.unit||!sanitizedData.type){
            return {
                EC: 1,
                EM: 'Không được để trống thông tin nguyên liệu',
                DT: ''
            };
        }
        const newIngredient = new Ingredient({...sanitizedData, inventory});
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
        const ingredient = await Ingredient.findByIdAndDelete(ingredientId);
        
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
        sort: query.sort || { createdAt: -1 },
        select: query.select || '-__v' // Exclude version key
    };

    const filter = {};
    
    // Flexible text search across multiple fields
    if (query.searchTerm) {
        filter.$or = [
            { name: { $regex: query.searchTerm, $options: 'i' } },
            { type: { $regex: query.searchTerm, $options: 'i' } },
            { status: { $regex: query.searchTerm, $options: 'i' } }
        ];
    }

    // Specific field filters
    if (query.name) filter.name = { $regex: query.name, $options: 'i' };
    if (query.type) filter.type = query.type;
    if (query.status) filter.status = query.status;
    
    // Range filters for numeric fields
    if (query.minInventory) filter.inventory = { $gte: query.minInventory };
    if (query.maxInventory) filter.inventory = { 
        ...filter.inventory, 
        $lte: query.maxInventory 
    };

    try {
        const ingredients = await Ingredient.paginate(filter, options);
        return {
            EC: 0,
            EM: 'Lấy danh sách nguyên liệu thành công',
            DT: ingredients
        };
    } catch (error) {
        console.error('Ingredient fetch error:', error);
        return {
            EC: 1,
            EM: 'Lỗi khi lấy danh sách nguyên liệu',
            DT: null
        };
    }
}
const updateIngredientInventory = async (ingredientId, updateData) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const ingredient = await Ingredient.findById(ingredientId);
        if (!ingredient) {
            await session.abortTransaction();
            session.endSession();
            return { EC: 1, EM: 'Nguyên liệu không tồn tại', DT: '' };
        }

        let newInventory = ingredient.inventory;
        let transactionPrice = null;

        if (updateData.type === 'import') {
            newInventory += updateData.quantity;
            transactionPrice = updateData.price;
            
            // Validate import data
            if (!updateData.price || updateData.price < 0) {
                throw new Error('Giá nhập không hợp lệ');
            }
        } 
        else if (updateData.type === 'export') {
            // Kiểm tra số lượng xuất
            if (newInventory < updateData.quantity) {
                await session.abortTransaction();
                session.endSession();
                return { 
                    EC: 1, 
                    EM: 'Số lượng xuất vượt quá tồn kho', 
                    DT: '' 
                };
            }

            // Lấy danh sách các lô hàng nhập chưa hết
            const importBatches = await UpdateIngredient.find({
                ingredient_id: ingredientId,
                type: 'import',
                quantity: { $gt: 0 }
            }).sort({ date: 1 });

            let remainingQuantityToExport = updateData.quantity;
            let exportCostTotal = 0;
            let exportQuantityTotal = 0;

            for (let batch of importBatches) {
                if (remainingQuantityToExport <= 0) break;

                const quantityToUseFromBatch = Math.min(batch.quantity, remainingQuantityToExport);
                
                // Cập nhật số lượng của lô hàng
                batch.quantity -= quantityToUseFromBatch;
                await batch.save({ session });

                // Tính toán chi phí xuất
                exportCostTotal += quantityToUseFromBatch * batch.price;
                exportQuantityTotal += quantityToUseFromBatch;

                remainingQuantityToExport -= quantityToUseFromBatch;
            }

            // Kiểm tra đã xuất đủ số lượng chưa
            if (remainingQuantityToExport > 0) {
                await session.abortTransaction();
                session.endSession();
                return { 
                    EC: 1, 
                    EM: 'Không đủ số lượng nguyên liệu để xuất', 
                    DT: '' 
                };
            }

            // Tính giá xuất trung bình
            transactionPrice = exportCostTotal / exportQuantityTotal;
            newInventory -= updateData.quantity;
        }

        // Cập nhật số lượng tồn kho
        ingredient.inventory = newInventory;
        await ingredient.save({ session });

        // Tạo giao dịch
        const transaction = new UpdateIngredient({
            ...updateData,
            price: transactionPrice
        });
        await transaction.save({ session });

        await session.commitTransaction();
        session.endSession();

        return {
            EC: 0,
            EM: updateData.type === 'import' ? 'Nhập nguyên liệu thành công' : 'Xuất nguyên liệu thành công',
            DT: transaction
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Inventory Update Error:', error);
        return { 
            EC: 1, 
            EM: error.message || 'Lỗi khi cập nhật số lượng nguyên liệu', 
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
const checkExpiredIngredients=async(page=1, limit=10)=>{
    try{
        const skip = (page - 1) * limit;

        // Lấy dữ liệu từ cơ sở dữ liệu với phân trang
        const ingredients = await UpdateIngredient.find({
            expiration_date: { $lt: new Date() },
            quantity: { $gt: 0 },
            type: 'import'
        })
            .populate('ingredient_id', 'name') // Populate trường ingredient_id để lấy tên
            .skip(skip) // Bỏ qua số lượng bản ghi
            .limit(limit); // Giới hạn số lượng bản ghi

        // Đếm tổng số bản ghi thỏa điều kiện
        const total = await UpdateIngredient.countDocuments({
            expiration_date: { $lt: new Date() },
            type: 'import'
        });

        // Tạo kết quả trả về
        const result = ingredients.map(item => ({
            ingredientName: item.ingredient_id.name, // Tên nguyên liệu
            expirationDate: item.expiration_date, // Ngày hết hạn
            quantity: item.quantity, // Số lượng còn lại
            price: item.price, // Giá nhập/xuất
            supplier: item.supplier // Nhà cung cấp (nếu có)
        }));

        return {
            EC: 0,
            EM: 'Kiểm tra nguyên liệu hết hạn thành công',
            DT: {
                data: result,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                limit
            }
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 1,
            EM: 'Lỗi khi kiểm tra nguyên liệu hết hạn',
            DT: ''
        };
    }
};
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