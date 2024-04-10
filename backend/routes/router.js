import { Router } from 'express';

import * as userController from '../controllers/user.controller.js';
import * as bloodInventoryController from '../controllers/inventory.controller.js';
import * as bloodRequestController from '../controllers/request.controller.js';
import { AuthUser, AuthInventory, AuthRequest } from '../middleware/auth.js';

const router = Router();

// User routes
router.route('/register').post(userController.registerUser);
router.route('/login').post(userController.loginUser);

// Blood Inventory routes
router.route('/inventory/add').post(AuthInventory, bloodInventoryController.addToInventory);
router.route('/inventory').get(AuthInventory, bloodInventoryController.getAllInventoryData);
router.route('/inventory/:id').get(AuthInventory, bloodInventoryController.getDataById);
router.route('/expire').get(AuthInventory, bloodInventoryController.getExpireData);
router.route('/total').get(AuthInventory, bloodInventoryController.getBloodTotalData);
router.route('/total-r').get(AuthRequest, bloodInventoryController.getBloodTotalData);
router.route('/inventory/:id/update').put(AuthInventory, bloodInventoryController.updateInventoryData);
router.route('/inventory/:id/delete').delete(AuthInventory, bloodInventoryController.deleteBlood);

// Blood Request routes
router.route('/requests/add').post(AuthUser, bloodRequestController.addRequest);
router.route('/requests').get(AuthRequest, bloodRequestController.getRequestedData);
router.route('/requests/:id').get(AuthRequest, bloodRequestController.getRequestedDataById);
router.route('/count').get(AuthRequest, bloodRequestController.getRequestCountByStatus);
router.route('/requests/:id/update').put(AuthRequest, bloodRequestController.updateRequestedData);
router.route('/available').put(AuthRequest, bloodRequestController.checkStock);
router.route('/requests/:id/delete').delete(AuthRequest, bloodRequestController.deleteRequest);

export default router;
