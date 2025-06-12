const Autor = require('../models/Autor') ;

exports.crearAutor= async(req, res, next) => {
   
    const autorData = await Autor.create(req.body)
    res.status (200).json({
        status:200,
        data: autorData,
    });

}