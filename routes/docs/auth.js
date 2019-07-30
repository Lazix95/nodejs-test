// auth/login
// ===========================================================

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     security:
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: password
 *           example: {
 *             "email": "someEmail",
 *             "password": "somePassword"
 *           }
 *     responses:
 *       200:
 *         examples:
 *           application/json: {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QxMEB0ZXN0LmNvbSIsInVzZXJJZCI6IjVkMzU2MmIzZGM0ZmJjMDAwNDM5ODA3MyIsInJlc3RhdXJhbnRJZCI6IjVkMzU2MmIzZGM0ZmJjMDAwNDM5ODA3MyIsImlhdCI6MTU2NDA0NzczOCwiZXhwIjoxNTY0MDUxMzM4fQ.N8v4n3UlZlOi0OgiwWnOacHyVfMl17C3dFK0QDi5Hd0",
  "expires": 3600,
  "staff": "",
  "userData": {
    "restaurant_id": "5d3562b3dc4fbc0004398073",
    "fullName": "awdawddd",
    "restaurantName": "test rest",
    "email": "test10@test.com"
  }
}
 *       409:
 *         examples: 
 *           application/json: {
  "message": "Validation failed",
  "data": [
    {
      "location": "body",
      "param": "email",
      "value": "someEmail",
      "msg": "Please enter a valid email."
    }
  ]
}
 */


 // auth/signUp
 // ============================================

 /**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Creates a new user
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *             - restaurantName
 *             - fullName
 *             - pricingPackage
 *           properties:
 *             email:
 *               type: email
 *             password:
 *               type: password
 *             restaurantName:
 *               type: string
 *             fullName:
 *               type: string
 *             pricingPackage:
 *               type: integer
 *           example: {
 *             "email": "someEmail",
 *             "password": "somePassword",
 *             "restaurantName": "someRestaurantName",
 *             "fullName": "someFullName",
 *             "pricingPackage": "NumberOfPricingPackage"
 *           }
 *     responses:
 *       200:
 *         description: Signup is directly connected to login, so any succesfully completed signup will be loggedIn
 *         examples:
 *           application/json: {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QxMEB0ZXN0LmNvbSIsInVzZXJJZCI6IjVkMzU2MmIzZGM0ZmJjMDAwNDM5ODA3MyIsInJlc3RhdXJhbnRJZCI6IjVkMzU2MmIzZGM0ZmJjMDAwNDM5ODA3MyIsImlhdCI6MTU2NDA0NzczOCwiZXhwIjoxNTY0MDUxMzM4fQ.N8v4n3UlZlOi0OgiwWnOacHyVfMl17C3dFK0QDi5Hd0",
  "expires": 3600,
  "staff": "",
  "userData": {
    "restaurant_id": "5d3562b3dc4fbc0004398073",
    "fullName": "awdawddd",
    "restaurantName": "test rest",
    "email": "test10@test.com"
  }
}
 *       409:
 *         examples: 
 *           application/json: {
  "message": "Validation failed",
  "data": [
    {
      "location": "body",
      "param": "email",
      "value": "test10@test.com",
      "msg": "E-Mail address already exists!"
    }
  ]
}
 */