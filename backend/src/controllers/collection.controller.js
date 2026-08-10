const Service = require("../services/collection.service");
const ResponseHelper = require("../helpers/response.helper");
class CollectionController {
  async index(req,res,next) { try { return ResponseHelper.success(res, await Service.getAll(), "Collections retrieved successfully"); } catch(e) { next(e); } }
  async store(req,res,next) { try { return ResponseHelper.created(res, await Service.create(req.body), "Collection created successfully"); } catch(e) { next(e); } }
  async update(req,res,next) { try { return ResponseHelper.updated(res, await Service.update(req.params.id, req.body), "Collection updated successfully"); } catch(e) { next(e); } }
  async destroy(req,res,next) { try { await Service.remove(req.params.id); return ResponseHelper.deleted(res, "Collection deleted successfully"); } catch(e) { next(e); } }
}
module.exports = new CollectionController();
