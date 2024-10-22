import Recruiment from "../model/recruiment/recruiment.schema";
import { status } from "../utils/index.js";

const getAllRecruiment = async () => {
    try {
        let recruiments = await Recruiment.findAll();
        return {
            EC: 0,
            EM: "Lấy thông tin tuyển dụng thành công",
            DT: recruiments
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

const getRecruimentById = async (recruimentId) => {
    try {
        let recruiment = await Recruiment.findById(recruimentId);
        return {
            EC: 0,
            EM: "Lấy thông tin tuyển dụng thành công",
            DT: recruiment
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

const createRecruiment = async (recruiment) => {
    try {
        let newRecruiment = await Recruiment.create(recruiment);
        return {
            EC: 0,
            EM: "Tạo tuyển dụng thành công",
            DT: newRecruiment
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: ""
        }
    }
}

const updateRecruiment = async (recruimentId, recruiment) => {
    try {
        let updatedRecruiment = await Recruiment.findByIdAndUpdate(recruimentId, recruiment, {new: true});
        return {
            EC: 0,
            EM: "Cập nhật tuyển dụng thành công",
            DT: updatedRecruiment
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: ""
        }
    }
}

const deleteRecruiment = async (recruimentId) => {
    try{
        let deletedRecruiment = await Recruiment.findByIdAndUpdate(
            recruimentId, {status: status.INACTIVE}, {new: true}
        );
        return {
            EC: 0,
            EM: "Xóa tuyển dụng thành công",
            DT: deletedRecruiment
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: ""
        }
    }
}

export default {
    getAllRecruiment,
    getRecruimentById,
    createRecruiment,
    updateRecruiment,
    deleteRecruiment,
}