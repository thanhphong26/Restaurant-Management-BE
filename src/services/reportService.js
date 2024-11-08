import Booking from "../model/booking/booking.schema.js";
import Food from "../model/food/food.schema.js";
import Ingredient from "../model/ingredients/ingredient.schema.js";
import UpdateIngredient from "../model/updateIngredient/updateIngredient.schema.js";

const getRevenue = async (year,quarter = null, month = null) => {
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31);
  
  // Điều kiện lọc cơ bản theo năm
  let matchConditions = { date: { $gte: startOfYear, $lte: endOfYear } };

  // Thêm điều kiện lọc theo quý nếu có
  if (quarter) {
    const startMonth = (quarter - 1) * 3;
    const endMonth = startMonth + 2;
    matchConditions.date.$gte = new Date(year, startMonth, 1);
    matchConditions.date.$lte = new Date(year, endMonth + 1, 0); // Ngày cuối của tháng kết thúc quý
  }

  // Thêm điều kiện lọc theo tháng nếu có
  if (month) {
    matchConditions.date.$gte = new Date(year, month - 1, 1);
    matchConditions.date.$lte = new Date(year, month, 0); // Ngày cuối của tháng
  }

  const revenueData = await Booking.aggregate([
    { $match: matchConditions },
    {
      $lookup: {
        from: "orders",
        localField: "order_detail",
        foreignField: "_id",
        as: "orderDetails"
      }
    },
    { $unwind: "$orderDetails" },
    {
      $lookup: {
        from: "foods",
        localField: "orderDetails.food_id",
        foreignField: "_id",
        as: "foodDetails"
      }
    },
    { $unwind: "$foodDetails" },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          quarter: { $ceil: { $divide: [{ $month: "$date" }, 3] } },
          month: { $month: "$date" }
        },
        totalRevenue: { $sum: { $multiply: ["$foodDetails.price", "$orderDetails.quantity"] } },
        soldItems: {
          $push: {
            food_id: "$foodDetails._id",
            name: "$foodDetails.name",
            image: "$foodDetails.image",
            price: "$foodDetails.price",
            quantitySold: "$orderDetails.quantity"
          }
        }
      }
    },
    {
      $group: {
        _id: month ? "$_id.month" : quarter ? "$_id.quarter" : "$_id.year",
        totalRevenue: { $sum: "$totalRevenue" },
        details: { $push: "$$ROOT" }
      }
    }
  ]);

  return revenueData;
};

//revenue ingredients by day, month, quarter, year
const getIngredientRevenueReport = async (year, quarter = null, month = null, sortBy = 'totalRevenue', order = 'desc', page = 1, limit = 10) => {
  const pipeline = [
      {
          $match: {
              type: "export",
              date: {
                  $gte: new Date(year, 0, 1),
                  $lte: new Date(year, 11, 31),
              }
          }
      },
      {
          $group: {
              _id: {
                  year: { $year: "$date" },
                  quarter: { $ceil: { $divide: [{ $month: "$date" }, 3] } },
                  month: { $month: "$date" }
              },
              totalCost: { $sum: { $multiply: ["$price", "$quantity"] } },
              usedItems: {
                  $push: {
                      ingredient_id: "$ingredient_id",
                      price: "$price",
                      quantitySold: "$quantity"
                  }
              }
          }
      },
      {
          $sort: {
              [sortBy]: order === 'desc' ? -1 : 1
          }
      },
      {
          $facet: {
              data: [
                  { $skip: (page - 1) * limit },
                  { $limit: limit }
              ],
              totalCount: [
                  { $count: "count" }
              ]
          }
      }
  ];

  if (quarter) {
      const startMonth = (quarter - 1) * 3;
      const endMonth = startMonth + 2;
      pipeline[0].$match.date.$gte = new Date(year, startMonth, 1);
      pipeline[0].$match.date.$lte = new Date(year, endMonth + 1, 0);
  }

  if (month) {
      pipeline[0].$match.date.$gte = new Date(year, month - 1, 1);
      pipeline[0].$match.date.$lte = new Date(year, month, 0);
  }

  const report = await UpdateIngredient.aggregate(pipeline);
  return {
      data: report[0].data,
      totalCount: report[0].totalCount[0].count
  };
};
export default { getRevenue, getIngredientRevenueReport };
