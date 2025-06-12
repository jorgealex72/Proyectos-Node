const Autor = require('../models/Autor') ;

exports.crearAutor= async(req, res, next) => {
   
    try {
        const autorData = await Autor.create(req.body)
        res.status (200).json({
        status:200,
        data: autorData,
    });
    }catch(err){
        res.status(400).json({status:400, mensaje: err})

    }
    
}