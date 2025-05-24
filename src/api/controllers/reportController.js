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

            //use retrieved id to find brand 
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
        //retrieve name from request parameters
        const name = req.params.name;

        //use retrieved name to find reports using the service method
        const facility = await reportService.getReportByFacility(name);  // Fixed typo here

        // Check if the facility data exists
        if (facility) {
            res.json({
                success: true,
                data: facility
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Facility not found'
            });
        }
                
    } catch (error) {
        next(error);
    }
}


    async patchNewStatus(req, res, next) {
        try {
            
            //retrieve id from request parameters
           

            const {id, status, facilitystaff_id} = req.params;

            //use retrieved id to find user using the service method
            const report = await reportService.patchReportStatus(id,status,facilitystaff_id);

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
            
            const {facility_id,resident_id,description} = req.body;
            
            const report = await reportService.postNewReport(facility_id,resident_id,description);

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