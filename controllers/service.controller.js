const Service = require("../models/service.models");
const Merchant = require(".././usermanagement/models/merchant.model");
const CustomError = require("../utils/ErrorHandler");
exports.createServices = async (req, res, next) => {
  try {
    const { service_name, service_code } = req.body;
    const service = await Service.findOne({
      where: { service_name: service_name, service_code: service_code },
    });
    if (service) {
      throw new CustomError("Already Exists", 409);
    } else {
      await Service.create({
        service_name,
        service_code,
      });
      return res.status(201).json({ message: "Service created successfully" });
    }
  } catch (error) {
    next(error);
  }
};
exports.getServices = async (req, res, next) => {
  try {
    const services = await Service.findAll();
    if (services) {
      return res.status(200).json(services);
    } else {
      throw new CustomError("not found", 404);
    }
  } catch (error) {
    next(error);
  }
};
