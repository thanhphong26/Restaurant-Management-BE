import Table from "../model/table/table.schema.js";

const createTable = async (table) => {
    try {
        // console.log(table);
        let newTable = await Table.create(table);
        return {
            EC: 0,
            EM: "Tạo bàn thành công",
            DT: newTable
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}
const updateTable = async (id, table) => {
    try {
        let updatedTable = await Table.findByIdAndUpdate(id, { $set: table }, { new: true });
        return {
            EC: 0,
            EM: "Cập nhật bàn thành công",
            DT: updatedTable
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}
const deleteTable = async (id) => {
    try {
        let deletedTable = await Table.findByIdAndDelete(id);
        return {
            EC: 0,
            EM: "Xóa bàn thành công",
            DT: deletedTable
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}
const getAllTable = async () => {
    try {
        const tables = await Table.find();
        return {
            EC: 0,
            EM: "Lấy danh sách bàn thành công",
            DT: tables
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}
const getOneTable = async (id) => {
    try {
        const table = await Table.findById(id);
        return {
            EC: 0,
            EM: "Lấy thông tin bàn thành công",
            DT: table
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}
export default {
    createTable,
    updateTable,
    deleteTable,
    getAllTable,
    getOneTable,
}