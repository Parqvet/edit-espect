const { Router } = require('express');
const router = Router();

const { renderFanzines, 
        createFanzine, 
        storeFanzine,
        renderEditFanzine, 
        renderLogin,
        updateFanzine
    } = require('../controllers/admin');

router.get('/fanzines', renderFanzines);

router.get('/upload', createFanzine);
router.post('/upload', storeFanzine);

router.get('/edit/:id', renderEditFanzine);
router.put('/update/:id', updateFanzine);

router.get('/login', renderLogin);

module.exports = router;