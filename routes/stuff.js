const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require('../middleware/multer-config');

const stuffCtrl = require('../controllers/stuff');



router.post('/',auth, multer ,stuffCtrl.creatingThing);
  
router.get('/:id',auth, stuffCtrl.getThing);
  
router.put('/:id',auth, multer,stuffCtrl.modifyThing);
  
router.delete('/:id',auth, stuffCtrl.deleteThing);
  
router.get('/',auth, stuffCtrl.getThings)
  
module.exports = router;