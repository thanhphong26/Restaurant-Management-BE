import User from '../model/user/user.schema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { status } from "../utils/index.js";
import Staff from '../model/staff/staff.schema.js';
import sendEmail from './sendMailService.js';
import { authentication } from '../middleware/JWTAction.js';
const JWT_SECRET = 'pntpnt0123456789';

const registerUser = async (userData) => {
    try {
        const existingUser = await User.findOne({
            $or: [{ username: userData.username }, { email: userData.email }, { cid: userData.cid }]
        });
        //validate input data
        if (!userData.username || !userData.password || !userData.last_name || !userData.first_name || !userData.email || !userData.cid || !userData.address || !userData.phone_number) {
            return {
                EC: 1,
                EM: 'Vui lòng điền đầy đủ thông tin',
                DT: ''
            };
        }
        if (userData.password.length < 6) {
            return {
                EC: 1,
                EM: 'Mật khẩu phải có ít nhất 6 ký tự',
                DT: ''
            };
        }

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
        newUser.role = 'customer';
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
            EM: 'Lỗi hệ thống',
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

        const accessToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        const refreshToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        user.refreshToken.push(refreshToken);
        await user.save();
        const userObject = user.toObject();

        delete userObject.password;
        delete userObject.refreshToken;
        delete userObject.resetPasswordToken;
        delete userObject.resetPasswordExpire;
        delete userObject.__v;
        return {
            EC: 0,
            EM: 'Đăng nhập thành công',
            DT: { accessToken, refreshToken, user: userObject }
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
//refresh token when token expired return new access token , new refresh token and save new refresh token to user and delete old refresh token
const refreshToken = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return {
                EC: 1,
                EM: 'Không tìm thấy thông tin user',
                DT: ''
            };
        }
        if (!user.refreshToken.includes(refreshToken)) {
            return {
                EC: 1,
                EM: 'Xác thực không thành công',
                DT: ''
            };
        }
        const accessToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        const newRefreshToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        user.refreshToken = user.refreshToken.filter(token => token !== refreshToken);
        user.refreshToken.push(newRefreshToken);
        await user.save();
        return {
            EC: 0,
            EM: 'Cập nhật token thành công',
            DT: { accessToken, refreshToken: newRefreshToken }
        };
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return {
                EC: 1,
                EM: 'Xác thực không thành công. Vui lòng đăng nhập lại',
                DT: ''
            };
        }
        return {
            EC: 500,
            EM: 'Lỗi hệ thống',
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
            EM: 'Lỗi hệ thống',
            DT: ''
        };
    }
};

const updateUserProfile = async (userId, updateData) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { $set: { ...updateData } }, { new: true }).select('-password');

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
            EM: 'Lỗi hệ thống',
            DT: ''
        };
    }
};
const getAllUsers = async (query = {}, page = 1, limit = 10) => {
    try {
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 },
            select: '-password'
        };
        const filter = {};
        if (query.username) {
            filter.username = { $regex: query.username, $options: 'i' };
        }
        if (query.email) {
            filter.email = { $regex: query.email, $options: 'i' };
        }
        const users = await User.paginate(filter, options);
        return {
            EC: 0,
            EM: 'Lấy tất cả người dùng thành công',
            DT: users
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
const logoutUser = async (userId, refreshToken) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            return {
                EC: 1,
                EM: 'Người dùng không tồn tại',
                DT: ''
            };
        }

        user.refreshToken = user.refreshToken.filter(token => token !== refreshToken);
        await user.save();

        return {
            EC: 0,
            EM: 'Đăng xuất thành công',
            DT: ''
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
const registerStaff = async (staffData) => {
    try {
        let resgisterUserResponse = await registerUser({
            username: staffData.username,
            password: staffData.password,
            role: staffData.role,
            last_name: staffData.last_name,
            first_name: staffData.first_name,
            email: staffData.email,
            cid: staffData.cid,
            address: staffData.address,
            phone_number: staffData.phone_number,
            dob: staffData.dob
        });

        if (resgisterUserResponse.EC === 0) {
            let staff = await Staff.create({
                user_id: resgisterUserResponse.DT._id,
                position: staffData.position,
                salary: staffData.salary,
                type: staffData.type,
                point: 0,
                status: status.ACTIVE
            })

            if (!staff) {
                await User.findByIdAndDelete(resgisterUserResponse.DT._id);
                return {
                    EC: 1,
                    EM: "Tạo nhân viên thất bại",
                    DT: ""
                }
            } else {
                return {
                    EC: 0,
                    EM: "Tạo nhân viên thành công",
                    DT: staff
                }
            }
        } else {
            return resgisterUserResponse;
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi hệ thống :>>",
            DT: ""
        }
    }
}
//forgot password send email template contains link to reset password
const forgotPassword = async (email) => {
    try {
        console.log("Email: ", email);
        const user = await User.findOne({
            email
        });
        if (!user) {
            return {
                EC: 1,
                EM: 'Email không tồn tại',
                DT: ''
            };
        }
        const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30m' });

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 3600000;
        await user.save();

        // Tạo link reset password
        const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

        // Gửi email chứa link reset password
        await sendEmail({
            to: user.email,
            subject: 'Đặt lại mật khẩu',
            html: `
                    <p>Chào bạn,</p>
                    <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng click vào link bên dưới để thiết lập mật khẩu mới:</p>
                    <a href="${resetLink}">Đặt lại mật khẩu</a>
                    <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                    <p>Trân trọng,<br>
                    Đội ngũ hỗ trợ</p>
                `
        });
        return {
            EC: 0,
            EM: 'Gửi email thành công',
            DT: ''
        };
    }
    catch (error) {
        return {
            EC: 500,
            EM: 'Lỗi hệ thống',
            DT: ''
        };
    }
}
const resetPassword = async (resetToken, newPassword) => {
    try {
        const decoded = jwt.verify(resetToken, JWT_SECRET);
        //validate token is expired or not
        if (!decoded) {
            return {
                EC: 1,
                EM: 'Thời gian thực hiện đổi password đã hết. Vui lòng thực hiện lại',
                DT: ''
            };
        }
        const user = await User.findById(decoded.id,);
        if (!user) {
            return {
                EC: 1,
                EM: 'Đã xảy ra lỗi xác thực. Vui lòng thực hiện lại',
                DT: ''
            };
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return {
            EC: 0,
            EM: 'Đặt lại mật khẩu thành công',
            DT: ''
        };
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            return {
                EC: 1,
                EM: 'Thời gian thực hiện đổi password đã hết. Vui lòng thực hiện lại',
                DT: ''
            };
        }
        return {
            EC: 500,
            EM: 'Lỗi hệ thống',
            DT: ''
        };
    }
}
export default {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    registerStaff,
    refreshToken,
    forgotPassword,
    resetPassword,
    logoutUser
};
