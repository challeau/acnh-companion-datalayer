const router = require('express').Router();

router.get('/', (req, res, next) => {
  res.json({message: "Hello!"});
});

module.exports = router;