import TimeKeeping from "../model/timeKeeping/timeKeeping.schema.js"

const createTimeSheet = async (data) => {
    try {
        const newTimeSheet = await TimeKeeping.create(data)
        return {
            EC: 0,
            EM: 'Chấm công thành công',
            DT: newTimeSheet
        }
    } catch (err) {
        return {
            EC: 500,
            EM: 'Chấm công thất bại',
            DT: ''
        }
    }
}
const updateTimeSheet = async (data) => {
    try {
        const updatedTimeSheet = await TimeKeeping.findByIdAndUpdate(data._id, data, { new: true })
        return {
            EC: 0,
            EM: 'Cập nhật chấm công thành công',
            DT: updatedTimeSheet
        }
    } catch (err) {
        return {
            EC: 500,
            EM: 'Cập nhật chấm công thất bại',
            DT: ''
        }
    }
}
export default
    {
        createTimeSheet,
        updateTimeSheet
    }