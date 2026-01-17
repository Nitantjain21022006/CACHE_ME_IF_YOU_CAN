import * as responseService from '../services/response.service.js';

export const executeAction = async (req, res) => {
    const { alertId, action, target } = req.body;

    if (!alertId || !action || !target) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: alertId, action, target'
        });
    }

    const result = await responseService.executeResponse(alertId, action, target);

    if (result.success) {
        res.json(result);
    } else {
        res.status(500).json(result);
    }
};
