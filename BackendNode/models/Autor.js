//const mongoose = required ('mongoose') ;

const AutorSchema = new mongoose.Schema ({
    nombre: String,
    apellido: String,
    gradoAcademico: String,
    nombreCompleto: String
});

module.export = mongoose.model('Autor', AutorSchema);