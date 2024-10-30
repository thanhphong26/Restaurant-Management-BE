import Staff from "../model/staff/staff.schema.js";
import { status } from "../utils/index.js";

const getAllStaff = async (page, limit, search) => { 
    try {
        const pipeline = [
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { 
                $unwind: '$user' 
            },
            {
                $addFields: {
                    fullName: { $concat: ['$user.first_name', ' ', '$user.last_name'] }
                }
            },
            {
                $match: {
                    status: status.ACTIVE,
                    ...(search && {
                        fullName: { $regex: search, $options: 'i' }
                    })
                }
            },
            {
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
                    fullName: 1,
                    email: '$user.email',
                    cid: '$user.cid',
                    address: '$user.address',
                    phone_number: '$user.phone_number',
                    avatar: '$user.avatar'
                }
            },
            { $skip: (+page - 1) * +limit },
            { $limit: +limit }
        ];
    
        let staffs = await Staff.aggregate(pipeline);

        if(staffs.length === 0) {
            return {
                EC: 0,
                EM: "Không tìm thấy nhân viên",
                DT: ""
            }
        }

        return {
            EC: 0,
            EM: "Lấy thông tin nhân viên thành công",
            DT: staffs  
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


const getStaffByPosition = async (page, limit, search, position) => {
    try {
        const pipeline = [
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { 
                $unwind: '$user' 
            },
            {
                $addFields: {
                    fullName: { $concat: ['$user.first_name', ' ', '$user.last_name'] }
                }
            },
            {
                $match: {
                    status: status.ACTIVE,
                    position: position,
                    ...(search && {
                        fullName: { $regex: search, $options: 'i' }
                    })
                }
            },
            {
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
                    fullName: 1,
                    email: '$user.email',
                    cid: '$user.cid',
                    address: '$user.address',
                    phone_number: '$user.phone_number',
                    avatar: '$user.avatar'
                }
            },
            { $skip: (+page - 1) * +limit },
            { $limit: +limit }
        ];
    
        let staffs = await Staff.aggregate(pipeline);

        if(staffs.length === 0) {
            return {
                EC: 0,
                EM: "Không tìm thấy nhân viên",
                DT: ""
            }
        } 

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

const getStaffByType = async (page, limit, search, type) => {
    try {
        const pipeline = [
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { 
                $unwind: '$user' 
            },
            {
                $addFields: {
                    fullName: { $concat: ['$user.first_name', ' ', '$user.last_name'] }
                }
            },
            {
                $match: {
                    status: status.ACTIVE,
                    type: type,
                    ...(search && {
                        fullName: { $regex: search, $options: 'i' }
                    })
                }
            },
            {
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
                    fullName: 1,
                    email: '$user.email',
                    cid: '$user.cid',
                    address: '$user.address',
                    phone_number: '$user.phone_number',
                    avatar: '$user.avatar'
                }
            },
            { $skip: (+page - 1) * +limit },
            { $limit: +limit }
        ];
    
        let staffs = await Staff.aggregate(pipeline);

        if(staffs.length === 0) {
            return {
                EC: 0,
                EM: "Không tìm thấy nhân viên",
                DT: ""
            }
        } 

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

        if(staffs.length === 0) {
            return {
                EC: 0,
                EM: "Không tìm thấy nhân viên",
                DT: ""
            }
        } 

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
        let newStaff = await Staff.create({
            user_id: staff.user_id,
            position: staff.position,
            salary: staff.salary,
            type: staff.type,
            point: 0,
            status: status.ACTIVE
        });
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
        let updatedStaff = await Staff.findByIdAndUpdate(staffId, {
            position: staff.position,
            salary: staff.salary,
            type: staff.type,
            point: staff.point,
        }, {new: true});
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
    deleteStaff
};