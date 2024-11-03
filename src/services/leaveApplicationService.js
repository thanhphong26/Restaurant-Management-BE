import LeaveApplication from '../model/leaveApplications/leaveApplication.schema.js';
import TimeKeeping from '../model/timeKeeping/timeKeeping.schema.js';
import Shift from '../model/shift/shift.schema.js';
import Staff from '../model/staff/staff.schema.js';
const createLeaveApplication = async (leaveApplication) => {
    try{
        const allowFields = ['staff_id', 'start_date', 'end_date', 'reason'];
        const sanitizedData = {};
        Object.keys(leaveApplication).forEach(key => {
            if(allowFields.includes(key)){
                sanitizedData[key] = leaveApplication[key];
            }
        });
        if(!sanitizedData.staff_id || !sanitizedData.start_date || !sanitizedData.end_date || !sanitizedData.reason){
            return {
                EC: 1,
                EM: 'Thiếu thông tin bắt buộc',
                DT: ''
            };
        }
        if(new Date(sanitizedData.start_date) > new Date(sanitizedData.end_date) || new Date(sanitizedData.start_date) < new Date()){
            return {
                EC: 1,
                EM: 'Ngày ngghỉ và ngày làm việc lại không hợp lí',
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
        if(existingLeaveApplication){
            return {
                EC: 400,
                EM: 'Đã có đơn xin nghỉ trong khoản thời gian trên',
                DT: ''
            };
        }
        const newLeaveApplication = new LeaveApplication(sanitizedData);
        await newLeaveApplication.save();
        return {
            EC: 200,
            EM: 'Tạo đơn xin nghỉ thành công',
            DT: newLeaveApplication
        };
    }catch(error){
        console.log(error);
        return {
            EC: 500,
            EM: 'Error from server',
            DT: ''
        };
    }
};
const updateStatusLeaveApplication = async (leaveApplicationId, status) => {
    try{
        const leaveApplication = await LeaveApplication.findByIdAndUpdate(leaveApplicationId, { status }, { new: true });
        if(!leaveApplication){
            return {
                EC: 404,
                EM: 'Không tìm thấy đơn xin nghỉ',
                DT: ''
            };
        }
        return {
            EC: 200,
            EM: 'Cập nhật trạng thái đơn xin nghỉ thành công',
            DT: leaveApplication
        };
    }catch(error){
        console.log(error);
        return {
            EC: 500,
            EM: 'Error from server',
            DT: ''
        };
    }
};
// //check staff in shift is present or absent
// const checkStaffInShiftIsPresent = async (date) => {
//     try{
//         const today = new Date(date);
//         const currentTime = new Date(today.getTime() + (7 * 60 * 60 * 1000));    
//         const startOfDay = new Date(
//             currentTime.getFullYear(),
//             currentTime.getMonth(),
//             currentTime.getDate(),
//             0, 0, 0
//         );
//         const endOfDay = new Date(
//             currentTime.getFullYear(),
//             currentTime.getMonth(),
//             currentTime.getDate(),
//             23, 59, 59
//         );    
//         //lấy tất cả staff trong ngày hôm đó
//         const shifts = await Shift.find({
//             date: {
//                 $gte: startOfDay,
//                 $lt: endOfDay
//             }
//         }).populate('list_staff', 'name staff_id');
//         const timeKeepings = await TimeKeeping.find({
//             date: {
//                 $gte: startOfDay,
//                 $lt: endOfDay
//             }
//         });
//         const staffs = shifts.map(shift => shift.list_staff).flat();
//         console.log("staffs",staffs);
//         const staffDocs = await Staff.find({ _id: { $in: staffs } });
//         // Sau đó mới map để lấy staff_id
//         const staffsId = staffDocs.map(staff => staff.staff_id);
//         console.log("staffsId", staffsId);
//         const timeKeepingStaffsId = timeKeepings.map(timeKeeping => timeKeeping.staff_id);
//         const absentStaffs = staffsId.filter(staffId => !timeKeepingStaffsId.includes(staffId));
//         //update status for absent staff
//         await TimeKeeping.updateMany({
//             staff_id: { $in: absentStaffs },
//             date: {
//                 $gte: startOfDay,
//                 $lt: endOfDay
//             }
//         }, {
//             status: 'absent'
//         });
//         return {
//             EC: 200,
//             EM: 'Lấy danh sách nhân viên vắng mặt thành công',
//             DT: absentStaffs
//         };

//     }catch(error){
//         console.log(error);
//         return {
//             EC: 500,
//             EM: 'Error from server',
//             DT: ''
//         };
//     }
// }
//checkin
const checkIn=async (staffId)=>{
    try{
        const today = new Date();
        const currentTime = new Date(today.getTime() + (7 * 60 * 60 * 1000));    
        const startOfDay = new Date(
            currentTime.getFullYear(),
            currentTime.getMonth(),
            currentTime.getDate(),
            0, 0, 0
        );
        const endOfDay = new Date(
            currentTime.getFullYear(),
            currentTime.getMonth(),
            currentTime.getDate(),
            23, 59, 59
        );    
        const existingTimeKeeping = await TimeKeeping.findOne({
            staff_id: staffId,
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });
        if(existingTimeKeeping){
            return {
                EC: 400,
                EM: 'Nhân viên đã check in',
                DT: ''
            };
        }
        const newTimeKeeping = new TimeKeeping({
            staff_id: staffId,
            date: currentTime,
            check_in: currentTime,
            status: 'present'
        });
        //check late
        const checkInTime = currentTime.getHours() * 60 + currentTime.getMinutes();
        const startWorkTime = 8 * 60 + 30;
        if(checkInTime > startWorkTime){
            newTimeKeeping.status = 'late';
        }
        await newTimeKeeping.save();
        return {
            EC: 200,
            EM: 'Check in thành công',
            DT: newTimeKeeping
        };
    }catch(error){
        console.log(error);
        return {
            EC: 500,
            EM: 'Error from server',
            DT: ''
        };
    }
}
//checkout
const checkOut=async (staffId)=>{
    try{
        const today = new Date();
        console.log('Today', today.getTime());
        const currentTime = new Date(today.getTime() + (7 * 60 * 60 * 1000));    
        const startOfDay = new Date(
            currentTime.getFullYear(),
            currentTime.getMonth(),
            currentTime.getDate(),
            0, 0, 0
        );
        const endOfDay = new Date(
            currentTime.getFullYear(),
            currentTime.getMonth(),
            currentTime.getDate(),
            23, 59, 59
        );        
        const existingTimeKeeping = await TimeKeeping.findOne({
            staff_id: staffId,
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });
        if(!existingTimeKeeping){
            return {
                EC: 404,
                EM: 'Nhân viên chưa check in trong ngày hôm nay',
                DT: ''
            };
        }
        if(existingTimeKeeping.check_out){
            return {
                EC: 400,
                EM: 'Nhân viên đã check out',
                DT: ''
            };
        }
        existingTimeKeeping.check_out = currentTime;
        const checkInTime = new Date(existingTimeKeeping.check_in);
        const checkOutTime = new Date(existingTimeKeeping.check_out);
        const workingMinutes = Math.floor((checkOutTime - checkInTime) / (1000 * 60));
        existingTimeKeeping.working_time = workingMinutes;

        const earlyLeaveThreshold = new Date(today.getTime() + (7 * 60 * 60 * 1000));
        earlyLeaveThreshold.setHours(17, 30, 0, 0);
        console.log('Early leave', checkOutTime, earlyLeaveThreshold);

        // First check if leaving early
        if (checkOutTime < earlyLeaveThreshold) {
            if (existingTimeKeeping.status === 'late') {
                existingTimeKeeping.status = 'late_and_early_leave';
            } else {
                existingTimeKeeping.status = 'early_leave';
            }
        } 
       
        await existingTimeKeeping.save();

        return {
            EC: 200,
            EM: 'Check out thành công',
            DT: existingTimeKeeping
        };
    }catch(error){
        console.log(error);
        return {
            EC: 500,
            EM: 'Error from server',
            DT: ''
        };
    }
}
//get timekeeping in month
const getTimeKeepingInMonth = async (staffId, month, year) => {
    try{
        
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const timeKeepingList = await TimeKeeping.find({
            staff_id: staffId,
            date: {
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
            EC: 200,
            EM: 'Lấy danh sách chấm công thành công',
            DT: timeKeepingList, statistics
        };
    }catch(error){
        console.log(error);
        return {
            EC: 500,
            EM: 'Error from server',
            DT: ''
        };
    }
};
//get list leave application
const getListLeaveApplication = async (staffId, status, start_date, end_date) => {
    try{
        const filter = {
            staff_id: staffId
        };
        if(status){
            filter.status = status;
        }
        if(start_date && end_date){
            filter.start_date = { $gte: new Date(start_date), $lte: new Date(end_date) };
        }
        const leaveApplicationList = await LeaveApplication.find(filter).sort({ start_date: 1 });
        return {
            EC: 200,
            EM: 'Lấy danh sách đơn xin nghỉ thành công',
            DT: leaveApplicationList
        };
    }catch(error){
        console.log(error);
        return {
            EC: 500,
            EM: 'Error from server',
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
    getListLeaveApplication
    // checkStaffInShiftIsPresent
};