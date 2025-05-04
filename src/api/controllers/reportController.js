const reportService = require('../services/reportService');

class reportController {
    async getAllReports(req, res, next) {
        try {           
            //fetch the list of users by calling the userService method (getAllUsers)
            const reports = await reportService.getAllReports();

            //validation using if statement
            if (reports) {
                res.json({
                    success: true,
                    data: reports
                });
            }

        } catch (error) {
            next(error);
        }
    }

    async getReportByID(req, res, next) {
        try {
            
            //retrieve id from request parameters
            const id = req.params.id;

            //use retrieved id to find brand using the service method
            const report = await reportService.getReportByID(id);

            res.json({
                success: true,
                data: report
            });
                
        } catch (error) {
            next(error);
        }
    }

    async getReportByFacility(req, res, next) {
        try {
            
            //retrieve id from request parameters
            const name = req.params.name;

            //use retrieved id to find user using the service method
            const facility = await reportServiceService.getReportByFacility(name);

            res.json({
                success: true,
                data: facility
            });
                
        } catch (error) {
            next(error);
        }
    }

    async patchNewStatus(req, res, next) {
        try {
            
            //retrieve id from request parameters
            const id = req.params.id;
            const status = req.params.status;

            //use retrieved id to find user using the service method
            const report = await reportService.patchReportStatus(id,status);

            res.json({
                success: true,
                data: report
            });
                
        } catch (error) {
            next(error);
        }
    }

    
    async postNewReport(req, res, next) {
        try {
            
            const {id,status,feedback,facility_id,resident_id,equipment,description,problem_group} = req.body;

            //use retrieved id to find user using the service method
            const report = await reportService.postNewReport(id,status,feedback,facility_id,resident_id,equipment,description,problem_group);

            res.json({
                success: true,
                data: report
            });
                
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new reportController();