import LeaveApplication from '../model/leaveApplications/leaveApplication.schema.js';
import TimeKeeping from '../model/timeKeeping/timeKeeping.schema.js';
import Shift from '../model/shift/shift.schema.js';
import Staff from '../model/staff/staff.schema.js';
import { DateTime } from 'luxon';
import { shiftNumber, status, zone } from '../utils/constraints.js';
const createLeaveApplication = async (leaveApplication) => {
    try {
        const allowFields = ['staff_id', 'start_date', 'end_date', 'reason'];
        const sanitizedData = {};
        Object.keys(leaveApplication).forEach(key => {
            if (allowFields.includes(key)) {
                sanitizedData[key] = leaveApplication[key];
            }
        });
        if (!sanitizedData.staff_id || !sanitizedData.start_date || !sanitizedData.end_date || !sanitizedData.reason) {
            return {
                EC: 1,
                EM: 'Thiếu thông tin bắt buộc',
                DT: ''
            };
        }
        if (new Date(sanitizedData.start_date) > new Date(sanitizedData.end_date) || new Date(sanitizedData.start_date) < new Date()) {
            return {
                EC: 1,
                EM: 'Ngày nghỉ và ngày làm việc lại không hợp lí',
                DT: ''
            };
        }

        const existingLeaveApplication = await LeaveApplication.findOne({
            staff_id: sanitizedData.staff_id,
            $or: [
                {
                    start_date: { $lte: new Date(sanitizedData.end_date) },
                    end_date: { $gte: new Date(sanitizedData.start_date) }
                }
            ],
            status: { $ne: 'rejected' }
        });
        if (existingLeaveApplication) {
            return {
                EC: 400,
                EM: 'Đã có đơn xin nghỉ trong khoản thời gian trên',
                DT: ''
            };
        }
        const newLeaveApplication = new LeaveApplication(sanitizedData);
        await newLeaveApplication.save();
        return {
            EC: 0,
            EM: 'Tạo đơn xin nghỉ thành công',
            DT: newLeaveApplication
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: 'Lỗi hệ thống',
            DT: ''
        };
    }
};
const updateStatusLeaveApplication = async (leaveApplicationId, status) => {
    try {
        const leaveApplication = await LeaveApplication.findByIdAndUpdate(leaveApplicationId, { status }, { new: true });
        if (!leaveApplication) {
            return {
                EC: 404,
                EM: 'Không tìm thấy đơn xin nghỉ',
                DT: ''
            };
        }
        return {
            EC: 0,
            EM: 'Cập nhật trạng thái đơn xin nghỉ thành công',
            DT: leaveApplication
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: 'Lỗi hệ thống',
            DT: ''
        };
    }
};

const checkIn = async (staffId) => {
    try {
        const today = DateTime.now().setZone(zone);
        // console.log('Start today: ', today.startOf('day'), staffId);
        let shift = await Shift.findOne({
            date: today.startOf('day'),
            list_staff: staffId,
        })
        if (!shift) {
            return {
                EC: 1,
                EM: 'Bạn không có ca làm việc hôm nay',
                DT: ''
            };
        }
        let timeKeeping = await TimeKeeping.findOne({
            staff_id: staffId,
            shift_id: shift._id,
        });
        if (timeKeeping) {
            return {
                EC: 400,
                EM: 'Nhân viên đã check in',
                DT: ''
            };
        }
        else {
            const date = DateTime.fromJSDate(shift.date).setZone(zone)
            // lấy thời gian làm việc của ca ngày check in
            const start_shift = DateTime.local(date.get('year'), date.get('month'), date.get('day'), shiftNumber[shift.shift_number]).setZone(zone);
            // const today = DateTime.local(date.get('year'), date.get('month'), date.get('day'), 8, 6).setZone(zone);
            // Tính khoảng thời gian giữa thời gian hiện tại và time_shift
            const diff = today.diff(start_shift, ['hours', 'minutes', 'seconds']);
            let check_in = await TimeKeeping.create({
                staff_id: staffId,
                shift_id: shift._id,
                check_in: today,
                status_check_in: diff.minutes < 0 ? 'ontime' : 'late'
            })
            return {
                EC: 0,
                EM: 'Check in thành công',
                DT: check_in
            };
        }

    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: 'Lỗi hệ thống',
            DT: ''
        };
    }
}
//checkout
const checkOut = async (staffId) => {
    try {
        const today = DateTime.now().setZone(zone);
        let shift = await Shift.findOne({
            date: today.startOf('day'),
            list_staff: staffId
        })
        if (shift) {
            const date = DateTime.fromJSDate(shift.date).setZone(zone)
            const end_shift = DateTime.local(date.get('year'), date.get('month'), date.get('day'), shiftNumber[shift.shift_number + 1]).setZone(zone);
            // const day = DateTime.local(date.get('year'), date.get('month'), date.get('day'), 13, 50).setZone(zone);
            // Tính khoảng thời gian giữa thời gian hiện tại và time_shift
            const diff = today.diff(end_shift, ['hours', 'minutes', 'seconds']);
            let timeKeeping = await TimeKeeping.findOneAndUpdate({
                staff_id: staffId,
                check_out: null,
                shift_id: shift._id
            },
                {
                    $set: {
                        check_out: today,
                        status_check_out: diff.minutes < 0 ? 'early' : diff.hours < 1 ? 'ontime' : 'late'
                    }
                },
                { new: true });
            if (!timeKeeping) {
                return {
                    EC: 1,
                    EM: 'Nhân viên chưa check in hoặc đã check out',
                    DT: ''
                }
            } else {
                return {
                    EC: 0,
                    EM: 'Check out thành công',
                    DT: timeKeeping
                }
            }
        }
        else {
            return {
                EC: 1,
                EM: 'Bạn không có ca làm việc hôm nay',
                DT: ''
            }
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: 'Lỗi hệ thống',
            DT: ''
        };
    }
}
//get timekeeping in month
const getTimeKeepingInMonth = async (staffId, month, year) => {
    try {

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const timeKeepingList = await TimeKeeping.find({
            staff_id: staffId,
            check_in: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ date: 1 });

        // Tính toán thống kê
        const statistics = {
            totalDays: timeKeepingList.length,
            present: timeKeepingList.filter(a => a.status === 'present').length,
            late: timeKeepingList.filter(a => a.status === 'late').length,
            absent: timeKeepingList.filter(a => a.status === 'absent').length,
            earlyLeave: timeKeepingList.filter(a => a.status === 'early_leave').length
        };
        return {
            EC: 0,
            EM: 'Lấy danh sách chấm công thành công',
            DT: timeKeepingList, statistics
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: 'Lỗi hệ thống',
            DT: ''
        };
    }
};
//get list leave application
const getListLeaveApplication = async (staffId, status, start_date, end_date) => {
    try {
        const filter = {
            staff_id: staffId
        };
        if (status) {
            filter.status = status;
        }
        if (start_date && end_date) {
            filter.start_date = { $gte: new Date(start_date), $lte: new Date(end_date) };
        }
        const leaveApplicationList = await LeaveApplication.find(filter).sort({ start_date: 1 });
        return {
            EC: 0,
            EM: 'Lấy danh sách đơn xin nghỉ thành công',
            DT: leaveApplicationList
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: 'Lỗi hệ thống',
            DT: ''
        };
    }
};
const getListApplicationByDate = async (date, status, page = 1, limit = 10) => {
    try {
        let searchDate;
        
        // Xử lý và validate date input
        if (date) {
            // Kiểm tra format date có đúng không
            const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
            if (!dateRegex.test(date)) {
                return {
                    EC: 400,
                    EM: 'Định dạng ngày không hợp lệ. Vui lòng sử dụng định dạng dd/MM/yyyy',
                    DT: ''
                };
            }
            
            // Parse date với Luxon
            searchDate = DateTime.fromFormat(date, 'dd/MM/yyyy', { zone: 'Asia/Ho_Chi_Minh' });
            
            // Kiểm tra date có hợp lệ không
            if (!searchDate.isValid) {
                return {
                    EC: 400,
                    EM: 'Ngày không hợp lệ: ' + searchDate.invalidReason,
                    DT: ''
                };
            }
        } else {
            searchDate = DateTime.now().setZone('Asia/Ho_Chi_Minh');
        }

        const startOfDay = searchDate.startOf('day').toJSDate();

        const conditions = {
            start_date: {
                $gte: startOfDay
            }
        };

        if (status) {
            const validStatuses = ['pending', 'approved', 'rejected'];
            if (!validStatuses.includes(status)) {
                return {
                    EC: 400,
                    EM: 'Status không hợp lệ',
                    DT: ''
                };
            }
            conditions.status = status;
        }

        if (page < 1 || !Number.isInteger(Number(page))) {
            return {
                EC: 400,
                EM: 'Số trang không hợp lệ',
                DT: ''
            };
        }

        if (limit < 1 || !Number.isInteger(Number(limit))) {
            return {
                EC: 400,
                EM: 'Limit không hợp lệ',
                DT: ''
            };
        }

        const skip = (page - 1) * limit;

        const [leaveApplications, totalDocuments, statusCounts] = await Promise.all([
            LeaveApplication.find(conditions)
                .populate({
                    path: 'staff_id',
                    match: { user_id: { $exists: true } },
                    select: 'user_id position salary type point status',
                    populate: {
                        path: 'user_id',
                        select: 'username last_name first_name  address phone_number dob'
                    }
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            LeaveApplication.countDocuments(conditions),
            LeaveApplication.aggregate([
                { $match: conditions },
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);

        const formattedLeaveApplications = leaveApplications.map(app => {
            const staffData = app.staff_id;
            const userData = staffData.user_id;
            
            return {
                ...app.toObject(),
                staff_info: {
                    position: staffData.position,
                    type: staffData.type,
                    status: staffData.status,
                    user_info: {
                        username: userData.username,
                        full_name: `${userData.first_name} ${userData.last_name}`,
                        address: userData.address,
                        phone_number: userData.phone_number,
                        dob: userData.dob
                    }
                }
            };
        });

        // Tính toán thông tin phân trang
        const totalPages = Math.ceil(totalDocuments / limit);

        // Format kết quả trả về
        return {
            EC: 0,
            EM: 'Lấy danh sách đơn xin nghỉ thành công',
            DT: {
                data: formattedLeaveApplications,
                pagination: {
                    currentPage: Number(page),
                    totalPages,
                    totalDocuments,
                    limit: Number(limit)
                },
                statistics: {
                    total: totalDocuments,
                    byStatus: statusCounts.reduce((acc, curr) => {
                        acc[curr._id] = curr.count;
                        return acc;
                    }, {})
                },
                searchDate: searchDate.toFormat('dd/MM/yyyy')
            }
        };
    } catch (error) {
        console.error('Error in getListApplicationByDate:', error);
        return {
            EC: 500,
            EM: 'Lỗi hệ thống',
            DT: ''
        };
    }
};
export default {
    createLeaveApplication,
    updateStatusLeaveApplication,
    checkIn,
    checkOut,
    getTimeKeepingInMonth,
    getListLeaveApplication, 
    getListApplicationByDate
    // checkStaffInShiftIsPresent
};