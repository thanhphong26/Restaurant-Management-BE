import Shift from '../models/shift/shift.schema.js';

const getAllShifts = async () => {
    try {
        let shifts = await Shift.find()
            .populate({
                path: 'list_staff',
                populate: {
                    path: 'user_id', 
                    select: 'first_name last_name', 
                }
            });
        
        return {
            EC: 0,
            EM: "Lấy thông tin ca làm việc thành công",
            DT: shifts
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

const getShiftsByStaffId = async (staffId) => {
    try {
        let shifts = await Shift.find({ list_staff: staffId })
            .populate({
                path: 'list_staff',
                populate: {
                    path: 'user_id',
                    select: 'first_name last_name',
                }
            });

        return {
            EC: 0,
            EM: "Lấy thông tin ca làm việc theo nhân viên thành công",
            DT: shifts
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

const getShiftsByDateRange = async (startDate, endDate) => {
    try {
        let shifts = await Shift.find({
            date: {
                $gte: new Date(startDate), 
                $lte: new Date(endDate),   
            }
        }).populate({
            path: 'list_staff',
            populate: {
                path: 'user_id',
                select: 'first_name last_name',
            }
        });

        return {
            EC: 0,
            EM: "Lấy thông tin ca làm việc trong khoảng thời gian thành công",
            DT: shifts
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

const createShift = async (shift) => {
    try {
        let newShift = await Shift.create(shift);
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
        let updatedShift = await Shift.findByIdAndUpdate(shiftId, shift, {new: true});
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

export {
    getAllShifts,
    getShiftsByStaffId,
    getShiftsByDateRange,
    createShift,
    updateShift,
}