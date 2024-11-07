import Booking from "../model/booking/booking.schema.js";
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
    // Nhóm lại theo cấp độ tùy vào yêu cầu (năm, quý, tháng)
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
  export default {
    getRevenue
  };