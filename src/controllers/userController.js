import userService from "../services/userService.js";

const register = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                EC: 400,
                EM: "Không được để trống dữ liệu đăng ký",
                DT: ""
            });
        }
        const response = await userService.registerUser(req.body);
        return res.status(201).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi từ server",
            DT: ""
        });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                EC: 400,
                EM: "Sai tên đăng nhập hoặc mật khẩu",
                DT: ""
            });
        }
        const response = await userService.loginUser(username, password);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi từ server",
            DT: ""
        });
    }
};

const getProfile = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(400).json({
                EC: 400,
                EM: "Không được để trống mã người dùng",
                DT: ""
            });
        }
        const response = await userService.getUserProfile(req.user.id);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi từ server",
            DT: ""
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        if (!req.user?.id || !req.body) {
            return res.status(400).json({
                EC: 400,
                EM: "Không được để trống mã người dùng hoặc dữ liệu cập nhật",
                DT: ""
            });
        }
        const response = await userService.updateUserProfile(req.user.id, req.body);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi từ server",
            DT: ""
        });
    }
};

const addPoints = async (req, res) => {
    try {
        const { userId, points } = req.body;
        if (!userId || points === undefined) {
            return res.status(400).json({
                EC: 400,
                EM: "Không được để trống mã người dùng hoặc điểm",
                DT: ""
            });
        }
        const response = await userService.addPointsToUser(userId, points);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi từ server",
            DT: ""
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const response = await userService.getAllUsers();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi từ server",
            DT: ""
        });
    }
};

export default {
    register,
    login,
    getProfile,
    updateProfile,
    addPoints,
    getAllUsers
};