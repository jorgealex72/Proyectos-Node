exports.getLibros = (req, res, next) => {
    res.status (200).json({status:200, mensaje: 'Se procesó correctamente'});
}

exports.getLibro = (req, res, next) => {
    res.status (200).json({status:200, mensaje: 'Se devuelve el libro por id'});
}


exports.crearLibro = (req, res, next) => {
    res.status (200).json({status:200, mensaje: 'Se ha creado el libro correctamente'});
}


exports.actualizarLibro = (req, res, next) => {
    res.status (200).json({status:200, mensaje: 'Se actualizó correctamente el libro'});
}

exports.eliminarLibro = (req, res, next) => {
    res.status (200).json({status:200, mensaje: 'Se eliminó correctamente el libro'});
}