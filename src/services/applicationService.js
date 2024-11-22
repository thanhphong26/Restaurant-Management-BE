import Application from '../model/application/application.schema.js';

const getAllApplicationsByStatus = async (page, limit, search, status) => {
    try {
        // Stage match để lọc theo status và điều kiện tìm kiếm
        const matchStage = {
            $match: {
                status: status,
                ...(search && {
                    full_name: { $regex: search, $options: 'i' }
                }),
            }
        };

        // Pipeline để lấy các đơn ứng tuyển theo trang và điều kiện tìm kiếm
        let pipeline = [
            matchStage,
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

        // Lấy các đơn ứng tuyển theo trang và điều kiện tìm kiếm
        let applications = await Application.aggregate(pipeline);

        // Truy vấn để đếm tổng số đơn ứng tuyển thỏa mãn điều kiện tìm kiếm mà không bị giới hạn bởi $skip và $limit
        const countPipeline = [
            matchStage,  // Điều kiện tìm kiếm giống như ở trên
            { $count: "total" }  // Đếm tổng số đơn ứng tuyển thỏa mãn điều kiện
        ];

        // Lấy tổng số ứng tuyển từ kết quả đếm
        const countResult = await Application.aggregate(countPipeline);
        const total = countResult.length > 0 ? countResult[0].total : 0;

        // Nếu không có đơn ứng tuyển nào thỏa mãn điều kiện
        if (applications.length === 0) {
            return {
                EC: 404,
                EM: "Không tìm thấy đơn ứng tuyển",
                DT: "",
            };
        }

        // Trả về dữ liệu đơn ứng tuyển và tổng số ứng tuyển
        return {
            EC: 0,
            EM: "Lấy danh sách đơn ứng tuyển thành công",
            DT: { applications, total }
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi từ server",
            DT: "",
        };
    }
};

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
        // Kiểm tra xem email đã tồn tại chưa
        const existingEmail = await Application.findOne({ email: application.email });
        if (existingEmail) {
            return {
                EC: 400,
                EM: "Email đã tồn tại",
                DT: ""
            };
        }

        // Kiểm tra xem CID đã tồn tại chưa
        const existingCid = await Application.findOne({ cid: application.cid });
        if (existingCid) {
            return {
                EC: 400,
                EM: "CID đã tồn tại",
                DT: ""
            };
        }

        // Tạo mới đơn ứng tuyển nếu không có lỗi
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
        });

        return {
            EC: 0,
            EM: "Tạo đơn ứng tuyển thành công",
            DT: newApplication
        };

    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Tạo đơn ứng tuyển thất bại",
            DT: "",
        };
    }
};

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