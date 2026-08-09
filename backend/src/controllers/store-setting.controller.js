const { StoreSetting } = require("../../models");
const ResponseHelper = require("../helpers/response.helper");

class StoreSettingController {
  async show(req, res, next) {
    try {
      const [setting] = await StoreSetting.findOrCreate({
        where: { id: 1 },
        defaults: { id: 1 },
      });
      return ResponseHelper.success(res, setting);
    } catch (error) {
      next(error);
    }
  }
  async update(req, res, next) {
    try {
      const [setting] = await StoreSetting.findOrCreate({
        where: { id: 1 },
        defaults: { id: 1 },
      });
      await setting.update(req.body);
      return ResponseHelper.updated(
        res,
        setting,
        "Store settings updated successfully",
      );
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new StoreSettingController();
