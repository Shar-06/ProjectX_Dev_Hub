const usageTrendsService = require('../services/usagetrendsService');

class usageTrendsController {
    async getUsageComparison(req, res, next) {
        try {
            //const { startDate, endDate } = req.query;
            const startDate = req.params.startDate;
            const endDate = req.params.endDate;

            const usageComparison = await usageTrendsService.getUsageComparison(startDate, endDate);
            res.json({
                success: true,
                data: usageComparison
            });
        } catch (error) {
            next(error);
        }
    }
    async getTotalBookings(req, res, next) {
        try {
            const startDate = req.params.startDate;
            const endDate = req.params.endDate;

            const totalBookings = await usageTrendsService.getTotalBookings(startDate, endDate);
            res.json({
                success: true,
                data: totalBookings
            });
        } catch (error) {
            next(error);
        }
    }
    async getPopularFacility(req, res, next){
        try {
            const popularFacility = await usageTrendsService.getPopularFacility();
            res.json({
                success: true,
                data: popularFacility
            });
        } catch (error) {
            next(error);
        }
    }
    async getTotalHours(req, res, next) {
        try {
            const startDate = req.params.startDate;
            const endDate = req.params.endDate;

            const totalHours = await usageTrendsService.getTotalHours(startDate, endDate);
            res.json({
                success: true,
                data: totalHours
            });
        } catch (error) {
            next(error);
        }
    }
    async getUsageByFacility(req, res, next) {
        try {
            const startDate = req.params.startDate;
            const endDate = req.params.endDate;
            const facilityId = req.params.facilityId;

            const usageByFacility = await usageTrendsService.getUsageByFacility(startDate, endDate, facilityId);
            res.json({
                success: true,
                data: usageByFacility
            });
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new usageTrendsController();