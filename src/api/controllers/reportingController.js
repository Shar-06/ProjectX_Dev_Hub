const reportingService = require('../services/reportingService');

class reportingServiceController {

async most_popular_facility(req, res, next) {
        try {           
            
            const start_date = req.params.start_date;
            const end_date = req.params.end_date;
        
            const facility = await reportingService.most_popular_facility(start_date,end_date);

            if (facility) {
                res.json({
                    success: true,
                    
                    data: facility
                });
            }

        } catch (error) {
            next(error);
        }
    }

async usage_charts(req, res, next) {
        try {           
            
            
            const start_date = req.params.start_date;
            const end_date = req.params.end_date;

            const usageData = await reportingService.usage_charts(start_date,end_date);

            if (usageData) {
                res.json({
                    success: true,
                    
                    data: usageData
                });
            }

        } catch (error) {
            next(error);
        }
    }

async usage_charts_byfacility(req, res, next) {
        try {           
            
            const start_date = req.params.start_date;
            const end_date = req.params.end_date;
            const facility_id = req.params.facility_id;

            const usageDataFacility = await reportingService.usage_chart_byfacility(start_date,end_date,facility_id);

            if (usageDataFacility) {
                res.json({
                    success: true,
                    
                    data: usageDataFacility
                });
            }

        } catch (error) {
            next(error);
        }
    }

async issues_by_facility(req, res, next) {
        try {           
            
            const start_date = req.params.start_date;
            const end_date = req.params.end_date;

            const issuesData = await reportingService.issues_by_facility(start_date,end_date);

              if (issuesData) {
                res.json({
                success: true,
                data: issuesData
            });
        } else {
                res.json({
                success: false,
                data: [],
                message: "No data found"
            });
        }

        } catch (error) {
            next(error);
        }
    }

async recent_maintenance_reports(req, res, next) {
    try {
        const { start_date, end_date } = req.params;

        if (!start_date || !end_date) {
            return res.status(400).json({
                success: false,
                message: "Start date and end date are required."
            });
        }

        const issuesData = await reportingService.recent_maintenance_reports(start_date, end_date);

        if (issuesData && issuesData.length > 0) {
            return res.status(200).json({
                success: true,
                data: issuesData
            });
        } else {
            return res.status(200).json({
                success: true,
                data: [],
                message: "No maintenance issues found for the selected date range."
            });
        }

    } catch (error) {
        next(error);
    }
}


async recent_maintenance_reports_byFacility(req, res, next) {
    try {
        const { start_date, end_date, facility_name } = req.params;

        if (!start_date || !end_date || !facility_name) {
            return res.status(400).json({
                success: false,
                message: "Start date, end date, and facility ID are required."
            });
        }

        const issuesData = await reportingService.recent_maintenance_reports_byFacility(start_date, end_date, facility_name);

        if (issuesData && issuesData.length > 0) {
            return res.status(200).json({
                success: true,
                data: issuesData
            });
        } else {
            return res.status(200).json({
                success: true,
                data: [],
                message: "No maintenance issues found for the selected date range and facility."
            });
        }

    } catch (error) {
        next(error);
    }
}

}


module.exports = new reportingServiceController();