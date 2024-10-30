import recruitmentService from '../services/recruitmentService.js';

const getAllRecruitment = async (req, res) => {
    try {
        let page = req.query.page || 1;
        let limit = req.query.limit || 10;
        let search = req.query.search || "";
        let response = await recruitmentService.getAllRecruiment(page, limit, search);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi từ server",
            DT: ""
        });
    }
}

const getRecruitmentById = async (req, res) => {
    try {
        let recruimentId = req.params.id;
        let response = await recruitmentService.getRecruimentById(recruimentId);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi từ server",
            DT: ""
        });
    }
}

const createRecruitment = async (req, res) => {
    try {
        let recruiment = req.body;
        if(recruiment && recruiment.position && recruiment.salary 
            && recruiment.start_date && recruiment.address && recruiment.describe 
            && recruiment.require && recruiment.infomation && recruiment.type) {
            let response = await recruitmentService.createRecruiment(recruiment);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
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

const updateRecruitment = async (req, res) => {
    try {
        let recruimentId = req.params.id;
        let recruiment = req.body;
        if(recruiment && recruiment.position && recruiment.salary 
            && recruiment.start_date && recruiment.address && recruiment.describe 
            && recruiment.require && recruiment.infomation && recruiment.type) {
            let response = await recruitmentService.updateRecruiment(recruimentId, recruiment);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
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

const deleteRecruitment = async (req, res) => {
    try {
        let recruimentId = req.params.id;
        if (recruimentId) {
            let response = await recruitmentService.deleteRecruiment(recruimentId);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
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

export default {
    getAllRecruitment,
    getRecruitmentById,
    createRecruitment,
    updateRecruitment,
    deleteRecruitment
}