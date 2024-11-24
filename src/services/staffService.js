import Staff from "../model/staff/staff.schema.js";
import TimeKeeping from "../model/timeKeeping/timeKeeping.schema.js";
import { status } from "../utils/index.js";
import { ObjectId } from "mongodb";


const getAllStaff = async (page, limit, search, filterType, filterValue) => {
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
                    }),
                    ...((filterType === "position" || filterType === "type") && filterValue && {
                        [filterType]: filterValue
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

        // Truy vấn để đếm tổng số nhân viên thỏa mãn điều kiện
        const countPipeline = [
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
                    }),
                    ...((filterType === "position" || filterType === "type") && filterValue && {
                        [filterType]: filterValue
                    })
                }
            },
            { $count: "total" }
        ];
        const staffs = await Staff.aggregate(pipeline);
        const countResult = await Staff.aggregate(countPipeline);
        const total = countResult.length > 0 ? countResult[0].total : 0;

        // Trả về kết quả
        return {
            EC: 0,
            EM: "Lấy thông tin nhân viên thành công",
            DT: {
                staffs,
                total
            }
        };

    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi từ server",
            DT: ""
        };
    }
};

const getStaffById = async (staffId) => {
    try {
        const pipeline = [{
            $match: {
                _id: new ObjectId(staffId),
                status: status.ACTIVE
            }
        }, {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user'
            }
        }, {
            $unwind: '$user'
        }, {
            $project: {
                _id: '$_id',
                user_id: 1,
                position: 1,
                salary: 1,
                type: 1,
                point: 1,
                status: 1,
                username: '$user.username',
                role: '$user.role',
                fist_name: '$user.first_name',
                last_name: '$user.last_name',
                email: '$user.email',
                cid: '$user.cid',
                address: '$user.address',
                phone_number: '$user.phone_number',
                avatar: '$user.avatar'
            }
        }];

        let staffs = await Staff.aggregate(pipeline);

        if (staffs.length === 0) {
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
            EM: "Lỗi hệ thống",
            DT: "",
        }
    }
}

const getStaffByUserId = async (userId) => {
    try {
        const pipeline = [{
            $match: {
                user_id: new ObjectId(userId),
                status: status.ACTIVE
            }
        }, {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user'
            }
        }, {
            $unwind: '$user'
        }, {
            $project: {
                _id: '$_id',
                user_id: 1,
                position: 1,
                salary: 1,
                type: 1,
                point: 1,
                status: 1,
                username: '$user.username',
                role: '$user.role',
                fist_name: '$user.first_name',
                last_name: '$user.last_name',
                email: '$user.email',
                cid: '$user.cid',
                address: '$user.address',
                phone_number: '$user.phone_number',
                avatar: '$user.avatar'
            }
        }];

        let staffs = await Staff.aggregate(pipeline);

        if (staffs.length === 0) {
            return {
                EC: 0,
                EM: "Không tìm thấy thông tin nhân viên",
                DT: []
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
            EM: "Lỗi hệ thống",
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
            EM: "Lỗi hệ thống",
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
        }, { new: true });
        return {
            EC: 0,
            EM: "Cập nhật nhân viên thành công",
            DT: updatedStaff
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        }
    }
}

const deleteStaff = async (staffId) => {
    try {
        let deletedStaff = await Staff.findByIdAndUpdate(
            staffId, { status: status.INACTIVE }, { new: true }
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
            EM: "Lỗi hệ thống",
            DT: ""
        }
    }
}

const getTimeKeepingInMonthByStaffId = async (staffId1, month1, year1) => {
    try {
        const staffId = new ObjectId(staffId1);
        const month = parseInt(month1, 10);
        const year = parseInt(year1, 10);

        const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 17));
        const endOfMonth = new Date(Date.UTC(year, month, 1, 17));

        const timekeepings = await TimeKeeping.aggregate([
            {
                $match: {
                    staff_id: staffId,
                    check_in: { $gte: startOfMonth, $lt: endOfMonth }
                }
            },
            {
                $lookup: {
                    from: 'staffs',
                    localField: 'staff_id',
                    foreignField: '_id',
                    as: 'staff'
                }
            },
            {
                $unwind: '$staff'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'staff.user_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    _id: 0,
                    staffId: '$staff_id',
                    check_in: 1,
                    check_out: 1,
                    status_check_in: 1,
                    status_check_out: 1,
                    fullName: { $concat: ['$user.first_name', ' ', '$user.last_name'] },
                    avatar: '$user.avatar'
                }
            }
        ]);

        if (timekeepings.length === 0) {
            return {
                EC: 0,
                EM: "Không có dữ liệu chấm công cho tháng này",
                DT: ""
            };
        }

        // Tính số ngày đi làm và số ngày đi làm trễ
        const totalWorkDays = timekeepings.length;
        const lateDays = timekeepings.filter(record => record.status_check_in === 'late').length;
        const earlyDays = timekeepings.filter(record => record.status_check_out === 'early').length;

        return {
            EC: 0,
            EM: "Lấy thông tin chấm công thành công",
            DT: {
                totalWorkDays,
                lateDays,
                earlyDays,
                fullName: timekeepings[0].fullName,
                avatar: timekeepings[0].avatar,
                details: timekeepings.map(record => ({
                    check_in: record.check_in,
                    check_out: record.check_out,
                    status_check_in: record.status_check_in,
                    status_check_out: record.status_check_out,
                    staffId: record.staffId
                }))
            }
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        };
    }
};

export default {
    getAllStaff,
    getStaffById,
    getStaffByUserId,
    getTimeKeepingInMonthByStaffId,
    createStaff,
    updateStaff,
    deleteStaff
};