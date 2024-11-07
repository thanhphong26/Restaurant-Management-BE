import reportService from "../services/reportService.js";
import xlsx from 'xlsx';
import fs from 'fs';
import path from "path";
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const exportRevenueToExcel = async (req, res) => {
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
          const worksheetData = [];
          revenueData.forEach((entry) => {
            entry.details.forEach((detail) => {
              detail.soldItems.forEach((item) => {
                worksheetData.push({
                  Year: entry._id,
                  Quarter: detail._id.quarter || "",
                  Month: detail._id.month || "",
                  Food_Name: item.name,
                  Quantity_Sold: item.quantitySold,
                  Price: item.price,
                  Total_Revenue: item.quantitySold * item.price,
                });
              });
            });
          });
      
          // Tạo workbook và worksheet từ dữ liệu
          const workbook = xlsx.utils.book_new();
          const worksheet = xlsx.utils.json_to_sheet(worksheetData);
          xlsx.utils.book_append_sheet(workbook, worksheet, "RevenueData");
      
          // Tạo file Excel tạm thời
          const filePath = path.join(__dirname, `Revenue_Report_${year}_${quarter || ''}_${month || ''}.xlsx`);
          xlsx.writeFile(workbook, filePath);
      
          // Gửi file về client và xóa file sau khi gửi
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=Revenue_Report.xlsx');
            res.download(filePath, (err) => {
            if (err) {
                console.error("Error downloading file:", err);
                res.status(500).json({ error: "Error downloading the Excel file" });
            } else {
                fs.unlinkSync(filePath); // Xóa tệp sau khi tải xong nếu cần
            }
            })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: "",
        });
    }
}
const exportRevenueToPdf = async (req, res) => {
    try {
        const { year, quarter, month } = req.query;
        if (!year || isNaN(year)) {
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
        
        const doc = new PDFDocument();
        let filename = `Revenue_Report_${year}_${quarter || ''}_${month || ''}.pdf`;
        const filePath = path.join(__dirname, filename);

        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Thêm tiêu đề và các chi tiết vào file PDF
        doc.fontSize(18).text('Báo Cáo Doanh Thu', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Năm: ${year}`);
        if (quarter) doc.text(`Quý: ${quarter}`);
        if (month) doc.text(`Tháng: ${month}`);
        doc.moveDown();

        revenueData.forEach((entry) => {
            entry.details.forEach((detail) => {
                detail.soldItems.forEach((item) => {
                    doc.text(`Tên món: ${item.name}`);
                    doc.text(`Số lượng bán: ${item.quantitySold}`);
                    doc.text(`Giá: ${item.price}`);
                    doc.text(`Tổng doanh thu: ${item.quantitySold * item.price}`);
                    doc.moveDown();
                });
            });
        });

        // Kết thúc và đóng file PDF
        doc.end();

        writeStream.on('finish', () => {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            res.download(filePath, (err) => {
                if (err) {
                    console.error("Error downloading file:", err);
                    res.status(500).json({ error: "Error downloading the PDF file" });
                } else {
                    fs.unlinkSync(filePath); // Xóa tệp sau khi tải xong nếu cần
                }
            });
        });
        
        writeStream.on('error', (err) => {
            console.error("Error writing file:", err);
            res.status(500).json({ error: "Error creating the PDF file" });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: "",
        });
    }
};

export default {
    exportRevenueToExcel,
    exportRevenueToPdf,
};