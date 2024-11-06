import tableService from "../services/tableService.js";

const createTable = async (req, res) => {
    try {
        let response = await tableService.createTable(req.body);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: "",
        })
    }
}
const updateTable = async (req, res) => {
    try {
        let response = await tableService.updateTable(req.query.tableId, { status: req.query.status });
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: "",
        })
    }
}
const getAllTable = async (req, res) => {
    try {
        let response = await tableService.getAllTable();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: "",
        })
    }
}
export default {
    createTable,
    updateTable,
    getAllTable
}