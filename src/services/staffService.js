import Staff from "../model/staff/staff.schema.js";
import { status } from "../utils/index.js";

const getAllStaff = async () => {
    try {
        const pipeline = [{
            $match: {
                status: status.ACTIVE
            }
        },{
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
        },{
            $unwind: '$user'
        },{
            $project: {
                _id: 0,
                staffId: '$_id',
                position: 1,
                salary: 1,
                type: 1,
                point: 1,
                status: 1,
                username: '$user.username',
                role: '$user.role',
                fullName: { $concat: ['$user.first_name', ' ', '$user.last_name'] },
                email: '$user.email',
                cid: '$user.cid',
                address: '$user.address',
                phone_number: '$user.phone_number',
                avatar: '$user.avatar'
            }
        }];
    
        let staffs = await Staff.aggregate(pipeline);
        return {
            EC: 0,
            EM: "Lấy thông tin nhân viên thành công",
            DT: staffs  
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

const getStaffByPosition = async (position) => {
    try {
        const pipeline = [{
            $match: {
                status: status.ACTIVE,
                position: position
            }
        },{
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
        },{
            $unwind: '$user'
        },{
            $project: {
                _id: 0,
                staffId: '$_id',
                position: 1,
                salary: 1,
                type: 1,
                point: 1,
                status: 1,
                username: '$user.username',
                role: '$user.role',
                fullName: { $concat: ['$user.first_name', ' ', '$user.last_name'] },
                email: '$user.email',
                cid: '$user.cid',
                address: '$user.address',
                phone_number: '$user.phone_number',
                avatar: '$user.avatar'
            }
        }];
    
        let staffs = await Staff.aggregate(pipeline);
        return {
            EC: 0,
            EM: "Lấy thông tin nhân viên thành công",
            DT: staffs  
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

const getStaffByType = async (type) => {
    try {
        const pipeline = [{
            $match: {
                status: status.ACTIVE,
                type: type
            }
        },{
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
        },{
            $unwind: '$user'
        },{
            $project: {
                _id: 0,
                staffId: '$_id',
                position: 1,
                salary: 1,
                type: 1,
                point: 1,
                status: 1,
                username: '$user.username',
                role: '$user.role',
                fullName: { $concat: ['$user.first_name', ' ', '$user.last_name'] },
                email: '$user.email',
                cid: '$user.cid',
                address: '$user.address',
                phone_number: '$user.phone_number',
                avatar: '$user.avatar'
            }
        }];
    
        let staffs = await Staff.aggregate(pipeline);
        return {
            EC: 0,
            EM: "Lấy thông tin nhân viên thành công",
            DT: staffs  
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

const getStaffById = async (staffId) => {
    try {
        const pipeline = [{
            $match: {
                _id: staffId,
                status: status.ACTIVE
            }
        },{
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
        },{
            $unwind: '$user'
        },{
            $project: {
                _id: 0,
                staffId: '$_id',
                position: 1,
                salary: 1,
                type: 1,
                point: 1,
                status: 1,
                username: '$user.username',
                role: '$user.role',
                fullName: { $concat: ['$user.first_name', ' ', '$user.last_name'] },
                email: '$user.email',
                cid: '$user.cid',
                address: '$user.address',
                phone_number: '$user.phone_number',
                avatar: '$user.avatar'
            }
        }];
    
        let staffs = await Staff.aggregate(pipeline);
        return {
            EC: 0,
            EM: "Lấy thông tin nhân viên thành công",
            DT: staffs  
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

const createStaff = async (staff) => {
    try {
        let newStaff = await Staff.create(staff);
        return {
            EC: 0,
            EM: "Tạo nhân viên thành công",
            DT: newStaff
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

const updateStaff = async (staffId, staff) => {
    try {
        let updatedStaff = await Staff.findByIdAndUpdate(staffId, staff, {new: true});
        return {
            EC: 0,
            EM: "Cập nhật nhân viên thành công",
            DT: updatedStaff
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

const deleteStaff = async (staffId) => {
    try{
        let deletedStaff = await Staff.findByIdAndUpdate(
            staffId, {status: status.INACTIVE}, {new: true}
        );
        return {
            EC: 0,
            EM: "Xóa nhân viên thành công",
            DT: deletedStaff
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
    getAllStaff,
    getStaffByPosition,
    getStaffByType,
    getStaffById,
    createStaff,
    updateStaff,
};