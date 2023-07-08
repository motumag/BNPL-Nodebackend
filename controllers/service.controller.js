const Service = require("../models/service.models");
const Merchant = require(".././usermanagement/models/merchant.model");
exports.createServices = async (req, res, next) => {
  try {
    const { service_name, service_code } = req.body;
    const service = await Service.findOne({
      where: { service_name: service_name, service_code: service_code },
    });
    if (service) {
      return res.status(409).json({ message: "Sevice Already exists" });
    } else {
      await Service.create({
        service_name,
        service_code,
      });
      return res.status(201).json({ message: "Service created successfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.getServices = async (req, res) => {
  try {
    const services = await Service.findAll();
    if (services) {
      return res.status(200).json(services);
    } else {
      return res.status(404).json({ message: "Service not found" });
    }
  } catch (error) {}
};
