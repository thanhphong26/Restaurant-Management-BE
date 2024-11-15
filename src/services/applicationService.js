import Application from '../model/application/application.schema.js';

const getAllApplicationsByStatus = async (page, limit, search, status) => {
    try {
        let pipeline = [
            {
                $match: {
                    status: status,
                    ...(search && {
                        full_name: { $regex: search, $options: 'i' }
                    }),
                }
            },
            {
                $project: {
                    _id: 0,
                    applicationId: '$_id',
                    recruitment_id: 1,
                    full_name: 1,
                    email: 1,
                    phone_number: 1,
                    cid: 1,
                    address: 1,
                    dob: 1,
                    about: 1,
                    require: 1
                }
            },
            { $skip: (+page - 1) * +limit },
            { $limit: +limit }
        ];

        let applications = await Application.aggregate(pipeline);
        let count = applications.length;
        let totalPages = Math.ceil(count / limit);
        if (applications.length === 0) {
            return {
                EC: 404,
                EM: "Không tìm thấy đơn ứng tuyển",
                DT: "",
            }
        }
        return {
            EC: 0,
            EM: "Lấy danh sách đơn ứng tuyển thành công",
            DT: {applications, totalPages}
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

const getApplicationById = async (applicationId) => {
    try {
        let application = await Application.findById(applicationId);
        if (!application) {
            return {
                EC: 404,
                EM: "Không tìm thấy đơn ứng tuyển",
                DT: "",
            }
        }
        return {
            EC: 0,
            EM: "Lấy thông tin đơn ứng tuyển thành công",
            DT: application
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

const createApplication = async (application) => {
    try {
        let newApplication = await Application.create({
            recruitment_id: application.recruitment_id,
            full_name: application.full_name,
            email: application.email,
            phone_number: application.phone_number,
            cid: application.cid,
            address: application.address,
            dob: application.dob,
            about: application.about,
            require: application.require,
            status: 'Not viewed'
        })

        return {
            EC: 0,
            EM: "Tạo đơn ứng tuyển thành công",
            DT: newApplication
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Tạo đơn ứng tuyển thất bại",
            DT: "",
        }
    }
}

const updateApplication = async (applicationId, application) => {
    try {
        let updateApplication = await Application.findByIdAndUpdate(applicationId, {
            status: application.status
        }, { new: true })

        return {
            EC: 0,
            EM: "Cập nhật đơn ứng tuyển thành công",
            DT: updateApplication
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Cập nhật đơn ứng tuyển thất bại",
            DT: "",
        }
    }
}

const deleteApplication = async (applicationId) => {
    try {
        let application = await Application.findByIdAndDelete(applicationId);
        if (!application) {
            return {
                EC: 404,
                EM: "Không tìm thấy đơn ứng tuyển",
                DT: "",
            }
        }
        return {
            EC: 0,
            EM: "Xóa đơn ứng tuyển thành công",
            DT: application
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Xóa đơn ứng tuyển thất bại",
            DT: "",
        }
    }
}

export default {
    getAllApplicationsByStatus,
    getApplicationById,
    createApplication,
    updateApplication,
    deleteApplication
}