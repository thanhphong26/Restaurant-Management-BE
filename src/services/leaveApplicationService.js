import LeaveApplication from '../model/leaveApplications/leaveApplication.schema.js';
import TimeKeeping from '../model/timeKeeping/timeKeeping.schema.js';
const createLeaveApplication = async (leaveApplication) => {
    try{
        const existingLeaveApplication = await LeaveApplication.findOne({
            staff_id: leaveApplication.staff_id,
            $or: [
                {
                    start_date: { $lte: new Date(leaveApplication.end_date) },
                    end_date: { $gte: new Date(leaveApplication.start_date) }
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
        const newLeaveApplication = new LeaveApplication(leaveApplication);
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
const checkIn=async (staffId)=>{
    try{
        const today = new Date();
        const existingTimeKeeping = await TimeKeeping.findOne({
            staff_id: staffId,
            date: {
                $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
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
            date: today,
            check_in: today,
            status: 'present'
        });
        //check late
        const checkInTime = today.getHours() * 60 + today.getMinutes();
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
        const existingTimeKeeping = await TimeKeeping.findOne({
            staff_id: staffId,
            date: {
                $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
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
        existingTimeKeeping.check_out = today;
        const checkOutTime = new Date(existingTimeKeeping.check_out);
        const earlyLeaveThreshold = new Date(today.setHours(17, 30, 0));
        
        if (checkOutTime < earlyLeaveThreshold) {
            existingTimeKeeping.status = 'early_leave';
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
};