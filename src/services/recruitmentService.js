import Recruiment from "../model/recruiment/recruiment.schema.js";
import { status } from "../utils/index.js";
import mongoose from "mongoose";

const getAllRecruiment = async (page, limit, search) => {
    try {
        const pipeline = [
            {
                $match: {
                    status: status.ACTIVE,
                    ...(search && {
                        position: { $regex: search, $options: 'i' }
                    })
                }
            },
            {
                $project: {
                    _id: 0,
                    recruimentId: '$_id',
                    position: 1,
                    salary: 1,
                    start_date: 1,
                    address: 1,
                    describe: 1,
                    require: 1,
                    infomation: 1,
                    type: 1
                }
            },
            { $skip: (+page - 1) * +limit },
            { $limit: +limit }
        ];

        let recruiments = await Recruiment.aggregate(pipeline);
        let count = recruiments.length
        let totalPages = Math.ceil(count / limit);

        if (recruiments.length === 0) {
            return {
                EC: 1,
                EM: "Không có tuyển dụng nào",
                DT: []
            }
        }

        return {
            EC: 0,
            EM: "Lấy thông tin tuyển dụng thành công",
            DT: {recruiments, totalPages}
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
        const pipeline = [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(recruimentId), 
                    status: status.ACTIVE
                }
            },{
                $project: {
                    _id: 0,
                    position: 1,
                    salary: 1,
                    start_date: 1,
                    address: 1,
                    describe: 1,
                    require: 1,
                    infomation: 1,
                    type: 1
                }
            }
        ];

        let recruiment = await Recruiment.aggregate(pipeline);

        if (recruiment.length === 0) {
            return {
                EC: 1,
                EM: "Không có tuyển dụng nào",
                DT: []
            };
        }

        return {
            EC: 0,
            EM: "Lấy thông tin tuyển dụng thành công",
            DT: recruiment
        };

    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        };
    }
};

const createRecruiment = async (recruiment) => {
    try {
        let newRecruiment = await Recruiment.create({
            position: recruiment.position,
            salary: recruiment.salary,
            start_date: recruiment.start_date,
            address: recruiment.address,
            describe: recruiment.describe,
            require: recruiment.require,
            infomation: recruiment.infomation,
            type: recruiment.type,
            status: status.ACTIVE
        });
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
        let updatedRecruiment = await Recruiment.findByIdAndUpdate(recruimentId, {
            position: recruiment.position,
            salary: recruiment.salary,
            start_date: recruiment.start_date,
            address: recruiment.address,
            describe: recruiment.describe,
            require: recruiment.require,
            infomation: recruiment.infomation,
            type: recruiment.type,
            status: status.ACTIVE
        }, {new: true});
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