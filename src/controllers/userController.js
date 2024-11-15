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
        if (response.EC === 0) {
            res.cookie('refreshToken', response.DT.refreshToken, {
                httpOnly: true,
                secure: true, // Set to true if using HTTPS
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
        }
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
const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        const userId = req.user?.id;
        const response = await userService.logoutUser(userId, refreshToken);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        });
    } catch (error) {
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi từ server",
            DT: ""
        });
    }
}

const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({
                EC: 400,
                EM: "Không được để trống refreshToken",
                DT: ""
            });
        }
        const response = await userService.refreshToken(refreshToken);
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
        const { page, limit, ...query } = req.query;
        const response = await userService.getAllUsers(query, page, limit);
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
const registerStaff = async (req, res) => {
    try {
        let staffData = req.body;
        if (staffData && staffData.username && staffData.password && staffData.last_name && staffData.first_name
            && staffData.role && staffData.cid && staffData.email && staffData.phone_number && staffData.address
            && staffData.position && staffData.salary && staffData.type) {
            let response = await userService.registerStaff(staffData);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            });
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Dữ liệu không hợp lệ",
                DT: ""
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi từ server",
            DT: ""
        });
    }
}
const forgotPassword = async (req, res) => {
    try {
        console.log(req.body);
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                EC: 400,
                EM: "Không được để trống email",
                DT: ""
            });
        }
        const response = await userService.forgotPassword(email);
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
const resetPassword = async (req, res) => {
    try {
        const { password, token } = req.body;
        if (!password || !token) {
            return res.status(400).json({
                EC: 400,
                EM: "Không được để trống email, mật khẩu hoặc token",
                DT: ""
            });
        }
        const response = await userService.resetPassword(token, password);
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
    getAllUsers,
    registerStaff,
    refreshToken,
    forgotPassword,
    resetPassword,
    logout
};