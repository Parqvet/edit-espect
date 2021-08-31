const Fanzine = require('../models/fanzine');

class FanzineRepository {

    constructor() {

    }

    async getAll() {
        return await Fanzine.find();
    }

    async getById(id) {
        return await Fanzine.findById(id);
    }

    async save(fanzine) {
        return await Fanzine.create(fanzine);
    }

    async update(id, fanzine) {
        return await Fanzine.findByIdAndUpdate(id, fanzine, { new: true });
    }

    async remove(id) {
        return await Fanzine.findByIdAndRemove(id);
    }
}

module.exports = FanzineRepository;