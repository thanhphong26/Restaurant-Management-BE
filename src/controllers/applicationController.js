import applicationService from '../services/applicationService.js';

const getAllApplicationsByStatus = async (req, res) => {
    try{
        let page = req.query.page || 1;
        let limit = req.query.limit || 10;
        let search = req.query.search || '';
        let status = req.query.status || '';
        let response = await applicationService.getAllApplicationsByStatus(page, limit, search, status);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        });
    }
}

const getApplicationById = async (req, res) => {
    try {
        let applicationId = req.params.id;
        let response = await applicationService.getApplicationById(applicationId);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        });
    }
}

const createApplication = async (req, res) => {
    try {
        let application = req.body;
        if (application && application.recruitment_id && application.full_name 
            && application.email && application.phone_number && application.cid) {
            let response = await applicationService.createApplication(application);
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
            EM: "Error from server",
            DT: ""
        });
    }
}

const updateApplication = async (req, res) => {
    try {
        let applicationId = req.params.id;
        let application = req.body;
        if(application && application.status && applicationId) {
            let response = await applicationService.updateApplication(applicationId, application);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            
            })
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Missing information",
                DT: ""
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        });
    }
}

const deleteApplication = async (req, res) => {
    try {
        let applicationId = req.params.id;
        let response = await applicationService.deleteApplication(applicationId);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        });
    }
}

export default {
    getAllApplicationsByStatus,
    getApplicationById,
    createApplication,
    updateApplication,
    deleteApplication
}