import Food from '../model/food/food.schema.js';
const createFood = async (foodData) => {
    try {
      const newFood = new Food(foodData);
      //validate exist food
        const existingFood = await Food.findOne({ name: foodData.name });
        if (existingFood) {
            return {
                EC: 1,
                EM: 'Món ăn đã tồn tại',
                DT: ''
            };
        }
      await newFood.save();
      return {
          EC: 0,
          EM: 'Tạo món ăn thành công',
          DT: newFood
      };
  } catch (error) {
      console.log(error);
      return {
          EC: 1,
          EM: 'Lỗi khi tạo món ăn',
          DT: ''
      };
  }
}
const getAllFoods=async(page=1, limit = 10, sortBy = 'name', sortOrder = 'asc', type, status)=>{
    try{
        let query = {};
        if(type){
            query.type = type;
        }
        if(status){
            query.status = status;
        }
        const foods = await Food.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit);
        return {
            EC: 0,
            EM: 'Lấy danh sách món ăn thành công',
            DT: foods
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 1,
            EM: 'Lỗi khi lấy danh sách món ăn',
            DT: ''
        };
    }
}
const getFoodById = async (foodId) => {
  try {
    const food = await Food.findById(foodId);
    if (!food) {
      return {
        EC: 1,
        EM: "Không tìm thấy món ăn",
        DT: "",
      };
    }
    return {
      EC: 0,
      EM: "Lấy thông tin món ăn thành công",
      DT: food,
    };
  } catch (error) {
    console.log(error);
    return {
      EC: 1,
      EM: "Lỗi khi lấy thông tin món ăn",
      DT: "",
    };
  }
};
const updateFood = async (foodId, foodData) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(foodId, updateData, { new: true });
    if (!updatedFood) {
        return {
            EC: 1,
            EM: 'Không tìm thấy món ăn',
            DT: ''
        };
    }
    return {
        EC: 0,
        EM: 'Cập nhật món ăn thành công',
        DT: updatedFood
    };
  } catch (error) {
      console.log(error);
      return {
          EC: 1,
          EM: 'Lỗi khi cập nhật món ăn',
          DT: ''
      };
  }
};
const deleteFood = async (foodId) => {
  try {
    const deletedFood = await Food.findByIdAndUpdate(foodId, { status: 'inactive' }, { new: true });
    if (!deletedFood) {
        return {
            EC: 1,
            EM: 'Không tìm thấy món ăn',
            DT: ''
        };
    }
    return {
        EC: 0,
        EM: 'Xóa món ăn thành công',
        DT: deletedFood
    };
  } catch (error) {
      console.log(error);
      return {
          EC: 1,
          EM: 'Lỗi khi xóa món ăn',
          DT: ''
      };
  }
};
const getFoodStats=async()=>{
  try {
    const stats = await Food.aggregate([
        {
            $group: {
                _id: null,
                totalFoods: { $sum: 1 },
                averagePrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $project: {
                _id: 0,
                totalFoods: 1,
                averagePrice: { $round: ['$averagePrice', 2] },
                minPrice: 1,
                maxPrice: 1
            }
        }
    ]);
    return {
        EC: 0,
        EM: 'Lấy thống kê món ăn thành công',
        DT: stats[0]
    };
    } catch (error) {
        console.log(error);
        return {
            EC: 1,
            EM: 'Lỗi khi lấy thống kê món ăn',
            DT: ''
        };
    }
};
const getFoodsByType=async(type)=>{
  try {
    const foods = await Food.find({ type });
    return {
        EC: 0,
        EM: 'Lấy danh sách món ăn theo loại thành công',
        DT: foods
    };
} catch (error) {
    console.log(error);
    return {
        EC: 1,
        EM: 'Lỗi khi lấy danh sách món ăn theo loại',
        DT: ''
    };
}
};
const searchFoods=async(query)=>{
  try {
    const foods = await Food.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
        ]
    });
    return {
        EC: 0,
        EM: 'Tìm kiếm món ăn thành công',
        DT: foods
    };
  } catch (error) {
      console.log(error);
      return {
          EC: 1,
          EM: 'Lỗi khi tìm kiếm món ăn',
          DT: ''
      };
  }
};
const updateFoodStatus=async(foodId, status)=>{
  try {
    const updatedFood = await Food.findByIdAndUpdate(
        foodId,
        { status },
        { new: true }
    );
    if (!updatedFood) {
        return {
            EC: 1,
            EM: 'Không tìm thấy món ăn',
            DT: ''
        };
    }
    return {
        EC: 0,
        EM: 'Cập nhật trạng thái món ăn thành công',
        DT: updatedFood
    };
  } catch (error) {
      console.log(error);
      return {
          EC: 1,
          EM: 'Lỗi khi cập nhật trạng thái món ăn',
          DT: ''
      };
  }
};
export default {
    createFood,
    getAllFoods,
    getFoodById,
    updateFood,
    deleteFood,
    getFoodStats,
    getFoodsByType,
    searchFoods
};