// /categores

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create New Category
 *     description: Authorisation is required, restaurantId is encoded in token!
 *     tags:
 *       - Categories
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - name
 *           properties:
 *             name:
 *               type: string
 *           example: {
 *             "name": "someCategoryName",
 *           }
 *     responses:
 *       200:
 *         examples:
 *           application/json: 
 *       409:
 *         examples: 
 *           application/json: 
 */