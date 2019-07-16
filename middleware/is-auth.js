const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
   const authHeader = req.get('Authorization');
   if (!authHeader) {
       const error = new Error('Not Authenticated');
      error.statusCode = 401;
      throw error
   }
   const token = req.get('Authorization'). split(' ')[1];
   let decodetToken;
   try{
      decodetToken = jwt.verify(token, 'SuperSecretCode');
   } catch (err) {
      err.statusCode = 500;
      throw err
   }
   if (!decodetToken) {
      const error = new Error('Not authenticated.');
      error.statusCode = 401;
      throw error
   }
   console.log(decodetToken);
   req.userId = decodetToken.userId;
   next();
};