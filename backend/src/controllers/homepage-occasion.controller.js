const HomepageOccasionService = require("../services/homepage-occasion.service");
const ResponseHelper = require("../helpers/response.helper");

class HomepageOccasionController {
  async index(req, res, next) { try { return ResponseHelper.success(res, await HomepageOccasionService.getAll(req.query), "Homepage occasions retrieved successfully"); } catch (error) { next(error); } }
  async show(req, res, next) { try { return ResponseHelper.success(res, await HomepageOccasionService.getById(req.params.id), "Homepage occasion retrieved successfully"); } catch (error) { next(error); } }
  async store(req, res, next) { try { return ResponseHelper.created(res, await HomepageOccasionService.create(req.body, req.file), "Homepage occasion created successfully"); } catch (error) { next(error); } }
  async update(req, res, next) { try { return ResponseHelper.success(res, await HomepageOccasionService.update(req.params.id, req.body, req.file), "Homepage occasion updated successfully"); } catch (error) { next(error); } }
  async destroy(req, res, next) { try { await HomepageOccasionService.delete(req.params.id); return ResponseHelper.success(res, null, "Homepage occasion deleted successfully"); } catch (error) { next(error); } }
}

module.exports = new HomepageOccasionController();
