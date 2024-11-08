import reportService from "../services/reportService.js";
const getRevenue = async (req, res) => {
    try{
        const {year, quarter, month} = req.query;
        if(!year || isNaN(year)){
            return res.status(400).json({
                EC: 400,
                EM: "Năm lọc không hợp lệ",
                DT: "",
            });
        }
        const revenueData = await reportService.getRevenue(
            parseInt(year),
            quarter ? parseInt(quarter) : null,
            month ? parseInt(month) : null
          );
        return res.status(200).json({
            EC: 200,
            EM: "Lấy dữ liệu doanh thu thành công",
            DT: revenueData,
        });        

    }catch(error){
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: "",
        });
    }
}
const getRevenueIngredients = async (req, res) => {
    try {
        const { year, quarter, month, sortBy = 'totalRevenue', order = 'desc', page = 1, limit = 10 } = req.query;
        const report = await reportService.getIngredientRevenueReport(year, quarter, month, sortBy, order, page, limit);
        res.status(200).json(report);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error generating revenue report' });
    }
}
export default {
    getRevenue, getRevenueIngredients
};
