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
export default {
    getRevenue,
};
