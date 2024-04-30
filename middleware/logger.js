const loggerMiddleware = (req, res, next) => {
    console.log("LOGGER MIDDLEWARE");
  
    next();
  }
  
  export default loggerMiddleware;