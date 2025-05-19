const MaintenanceReportService = require('../services/maintenanceReportService');

class MaintenanceReportController {
    async getStatus(req, res, next) {
        try {
            const status = await MaintenanceReportService.getStatus();
            res.json({
                success: true,
                data: status
            });
        } catch (error) {
            next(error);
        }
    }
    async getIssuesByFacility(req, res, next) {
        try {
            const issuesByFacility = await MaintenanceReportService.issues_by_facility();
            res.json({
                success: true,
                data: issuesByFacility
            });
        } catch (error) {
            next(error);
        }
    }

    async getRecentMaintenance(req, res, next) {
        try {
            const recentMaintenance = await MaintenanceReportService.getRecentMaintenance();
            res.json({
                success: true,
                data: recentMaintenance
            });
        } catch (error) {
            next(error);
        }
    }

    async getStaffLeaderBoard(req, res, next) {
        try {
            const staffLeaderBoard = await MaintenanceReportService.getStaffLeaderBoard();
            res.json({
                success: true,
                data: staffLeaderBoard
            });
        } catch (error) {
            next(error);
        }
    }

    async getAverageResolutionTime(req, res, next) {
        try {
            const averageResolutionTime = await MaintenanceReportService.getAverageResolutionTime();
            res.json({
                success: true,
                data: averageResolutionTime
            });
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new MaintenanceReportController();