import Shift from '../model/shift/shift.schema.js';
import Staff from "../model/staff/staff.schema.js";
import mongoose from 'mongoose';

const getAllShifts = async (page, limit, search, startDate, endDate) => {
    try {
        if (startDate && endDate) {
            if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
                return {
                    EC: 400,
                    EM: "Ngày không hợp lệ",
                    DT: ""
                };
            }
        }

        const pipeline = [
            {
                $lookup: {
                    from: 'staffs', 
                    localField: 'list_staff', 
                    foreignField: '_id', 
                    as: 'staffDetails'
                }
            },
            { $unwind: '$staffDetails' },
            {
                $lookup: {
                    from: 'users', 
                    localField: 'staffDetails.user_id', 
                    foreignField: '_id', 
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' },
            {
                $addFields: {
                    fullName: { $concat: ['$userDetails.first_name', ' ', '$userDetails.last_name'] }
                }
            },
            {
                $match: {
                    ...(startDate && endDate && { 
                        date: { 
                            $gte: new Date(startDate), 
                            $lte: new Date(endDate) 
                        }
                    }),
                    ...(search && {
                        fullName: { $regex: search, $options: 'i' }
                    })
                }
            },
            {
                $project: {
                    _id: 0,
                    staffId: '$staffDetails._id',
                    fullName: 1,
                    email: '$userDetails.email',
                    phone_number: '$userDetails.phone_number',
                    avatar: '$userDetails.avatar',
                    date: 1, 
                    shift_number: 1 
                }
            },
            { $skip: (+page - 1) * +limit },
            { $limit: +limit }
        ];

        let shifts = await Shift.aggregate(pipeline);
        let count = shifts.length;
        const totalPages = Math.ceil(count / limit);

        if (shifts.length === 0) {
            return {
                EC: 1,
                EM: "Không có ca làm việc nào",
                DT: []
            };
        }

        return {
            EC: 0,
            EM: "Lấy thông tin ca làm việc thành công",
            DT: {shifts, totalPages}
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


const getShiftsByStaffId = async (staffId) => {
    try {
        const pipeline = [
            {
                $match: { 
                    list_staff: new mongoose.Types.ObjectId(staffId) 
                }
            },
            {
                $lookup: {
                    from: 'staffs',
                    localField: 'list_staff',
                    foreignField: '_id',
                    as: 'staffDetails'
                }
            },
            {
                $unwind: '$staffDetails'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'staffDetails.user_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'
            },
            {
                $project: {
                    _id: 0,
                    staffId: '$staffDetails._id',
                    fullName: { $concat: ['$userDetails.first_name', ' ', '$userDetails.last_name'] },
                    email: '$userDetails.email',
                    phone_number: '$userDetails.phone_number',
                    avatar: '$userDetails.avatar',
                    date: 1,
                    shift_number: 1
                }
            }
        ];

        let shifts = await Shift.aggregate(pipeline);
        shifts = shifts.filter(shift => shift.staffId.toString() === staffId);

        if (shifts.length === 0) {
            return {
                EC: 1,
                EM: "Không có ca làm việc nào",
                DT: []
            };
        }

        return {
            EC: 0,
            EM: "Lấy thông tin ca làm việc thành công",
            DT: shifts
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


const createShift = async (shift) => {
    try {
        const existingStaff = await Staff.find({ _id: { $in: shift.list_staff } });

        if (existingStaff.length !== shift.list_staff.length) {
            return {
                EC: 400,
                EM: "Danh sách nhân viên không hợp lệ",
                DT: ""
            };
        }

        const existingShift = await Shift.findOne({
            date: shift.date,
            shift_number: shift.shift_number
        });

        if (existingShift) {
            return {
                EC: 400,
                EM: "Ca làm việc này đã tồn tại trong ngày",
                DT: ""
            };
        }

        let newShift = await Shift.create({
            date: shift.date,
            shift_number: shift.shift_number,
            list_staff: shift.list_staff
        });
        return {
            EC: 0,
            EM: "Tạo ca làm việc thành công",
            DT: newShift
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

const updateShift = async (shiftId, shift) => {
    try {
        const existingStaff = await Staff.find({ _id: { $in: shift.list_staff } });

        if (existingStaff.length !== shift.list_staff.length) {
            return {
                EC: 400,
                EM: "Danh sách nhân viên không hợp lệ",
                DT: ""
            };
        }

        let updatedShift = await Shift.findByIdAndUpdate(shiftId, {
            date: shift.date,
            shift_number: shift.shift_number,
            list_staff: shift.list_staff
        }, {new: true});
        
        return {
            EC: 0,
            EM: "Cập nhật ca làm việc thành công",
            DT: updatedShift
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

const deleteShift = async (shiftId) => {
    try {
        await Shift.findByIdAndDelete(shiftId);
        return {
            EC: 0,
            EM: "Xóa ca làm việc thành công",
            DT: ""
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
    getAllShifts,
    getShiftsByStaffId,
    createShift,
    updateShift,
    deleteShift
}