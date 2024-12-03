import Booking from "../model/booking/booking.schema.js";
import Food from "../model/food/food.schema.js";
import Ingredient from "../model/ingredients/ingredient.schema.js";
import UpdateIngredient from "../model/updateIngredient/updateIngredient.schema.js";

const getRevenue = async (year, quarter = null, month = null) => {
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31);
  
  let matchConditions = { date: { $gte: startOfYear, $lte: endOfYear } };

  if (quarter) {
    const startMonth = (quarter - 1) * 3;
    const endMonth = startMonth + 2;
    matchConditions.date.$gte = new Date(year, startMonth, 1);
    matchConditions.date.$lte = new Date(year, endMonth + 1, 0);
  }

  if (month) {
    matchConditions.date.$gte = new Date(year, month - 1, 1);
    matchConditions.date.$lte = new Date(year, month, 0);
  }

  const revenueData = await Booking.aggregate([
    { $match: matchConditions },
    { $unwind: "$order_detail" },
    {
      $lookup: {
        from: "foods",
        localField: "order_detail.food_id",
        foreignField: "_id",
        as: "foodDetails"
      }
    },
    { $unwind: "$foodDetails" },
    {
      $group: {
        _id: { month: { $month: "$date" } },
        totalRevenue: { $sum: { $multiply: ["$foodDetails.price", "$order_detail.quantity"] } },
        totalOrders: { $sum: 1 },
        soldItems: {
          $push: {
            food_id: "$foodDetails._id",
            name: "$foodDetails.name",
            image: "$foodDetails.image",
            price: "$foodDetails.price",
            quantitySold: "$order_detail.quantity"
          }
        }
      }
    },
    {
      $project: {
        _id: 1,
        totalRevenue: 1,
        totalOrders: 1,
        soldItems: 1
      }
    },
    {
      $sort: { "_id.month": 1 }
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
