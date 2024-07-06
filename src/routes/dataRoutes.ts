import { Router } from "express";
import DataController from "../controllers/dataController";

export default (dataController: DataController): Router => {
  const router = Router();

  router.post("/collect", dataController.requestDataCollection);
  router.get("/status/:userId", dataController.getDataStatus);
  router.get("/all", dataController.getAllData);

  return router;
};
