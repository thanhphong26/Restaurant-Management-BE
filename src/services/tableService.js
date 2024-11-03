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
export default {
    createTable,
    updateTable,
    deleteTable
}