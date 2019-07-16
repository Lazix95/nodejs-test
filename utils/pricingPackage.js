exports.pricingPackage = (packagePlan, custom) => {
   switch (packagePlan) {
      case 1:
         return 20;
      case 2:
         return 50;
      case 3:
         return 200;
      case 4:
         return 500;
      case 5:
         return 1000;
      case 6:
         return custom;
      default:
         return 20
   }
};