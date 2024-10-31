import leaveApplicationService from "../services/leaveApplicationService.js";
const createLeaveApplication = async (req, res) => {
    try {
        const response = await leaveApplicationService.createLeaveApplication(req.body);
        return res.status(201).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        });
    }
};
const updateStatusLeaveApplication = async (req, res) => {
    try {
        const response = await leaveApplicationService.updateStatusLeaveApplication(req.params.id, req.body.status);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        });
    }
};
const checkIn=async (req,res)=>{
    try{
        const response=await leaveApplicationService.checkIn(req.body.staff_id);
        return res.status(200).json({
            EC:response.EC,
            EM:response.EM,
            DT:response.DT
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            EC:500,
            EM:"Error from server",
            DT:""
        });
    }
}
const checkOut=async (req,res)=>{
    try{
        const response=await leaveApplicationService.checkOut(req.body.staff_id);
        return res.status(200).json({
            EC:response.EC,
            EM:response.EM,
            DT:response.DT
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            EC:500,
            EM:"Error from server",
            DT:""
        });
    }
}
const getTimeKeepingInMonth=async (req,res)=>{
    try{
        const response=await leaveApplicationService.getTimeKeepingInMonth(req.params.staff_id,req.params.month, req.params.year);
        return res.status(200).json({
            EC:response.EC,
            EM:response.EM,
            DT:response.DT
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            EC:500,
            EM:"Error from server",
            DT:""
        });
    }
}
const getListLeaveApplication=async (req,res)=>{
    try{
        const response=await leaveApplicationService.getListLeaveApplication(req.params.staff_id,req.params.status,req.params.start_date,req.params.end_date);
        return res.status(200).json({
            EC:response.EC,
            EM:response.EM,
            DT:response.DT
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            EC:500,
            EM:"Error from server",
            DT:""
        });
    }
}
export default {
    createLeaveApplication,
    updateStatusLeaveApplication,
    checkIn,
    checkOut,
    getTimeKeepingInMonth,
    getListLeaveApplication
};