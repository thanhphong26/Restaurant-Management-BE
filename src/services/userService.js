import User from '../model/user/user.schema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { status } from "../utils/index.js";

const JWT_SECRET = 'pntpnt0123456789'; 

const registerUser = async (userData) => {
    try {
        const existingUser = await User.findOne({
            $or: [{ username: userData.username }, { email: userData.email }, { cid: userData.cid }]
        });

        if (existingUser) {
            return {
                EC: 1,
                EM: 'Người dùng đã tồn tại',
                DT: ''
            };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const newUser = new User({
            ...userData,
            password: hashedPassword,
            status: status.ACTIVE
        });

        await newUser.save();

        return {
            EC: 0,
            EM: 'Đăng ký người dùng thành công',
            DT: newUser
        };

    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: 'Error from server',
            DT: ''
        };
    }
};

const loginUser = async (username, password) => {
    try {
        const user = await User.findOne({ username });
        
        if (!user) {
            return {
                EC: 1,
                EM: 'Sai tên đăng nhập hoặc mật khẩu',
                DT: ''
            };
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return {
                EC: 1,
                EM: 'Sai tên đăng nhập hoặc mật khẩu',
                DT: ''
            };
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        const userObject = user.toObject();
        
        delete userObject.password;
        delete userObject.__v;
        return {
            EC: 0,
            EM: 'Đăng nhập thành công',
            DT: { token, user: userObject }
        };

    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: 'Error from server',
            DT: ''
        };
    }
};

const getUserProfile = async (userId) => {
    try {
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return {
                EC: 1,
                EM: 'Người dùng không tồn tại',
                DT: ''
            };
        }
        const userObject = user.toObject();
        
        delete userObject.password;
        delete userObject.__v;
        return {
            EC: 0,
            EM: 'Lấy thông tin người dùng thành công',
            DT: userObject
        };

    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: 'Error from server',
            DT: ''
        };
    }
};

const updateUserProfile = async (userId, updateData) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
        
        if (!updatedUser) {
            return {
                EC: 1,
                EM: 'Người dùng không tồn tại',
                DT: ''
            };
        }

        return {
            EC: 0,
            EM: 'Cập nhật người dùng thành công',
            DT: updatedUser
        };

    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: 'Error from server',
            DT: ''
        };
    }
};

const addPointsToUser = async (userId, points) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { $inc: { point: points } }, { new: true }).select('-password');
        
        if (!updatedUser) {
            return {
                EC: 1,
                EM: 'Người dùng không tồn tại',
                DT: ''
            };
        }

        return {
            EC: 0,
            EM: 'Thêm điểm thành công',
            DT: updatedUser
        };

    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: 'Error from server',
            DT: ''
        };
    }
};

const getAllUsers = async () => {
    try {
        const users = await User.find().select('-password');
        return {
            EC: 0,
            EM: 'Lấy tất cả người dùng thành công',
            DT: users
        };

    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: 'Error from server',
            DT: ''
        };
    }
};

export default {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    addPointsToUser,
    getAllUsers
};
