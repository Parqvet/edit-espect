const express = require('express');
const fs = require('fs-extra');
const cloudinary = require('../loaders/cloudinary');

const Fanzine = require('../models/fanzine');

const { findAll,
        findById,
        save,
        update,
        remove
    } = require('../services/fanzineService');

const renderFanzines = async (req, res, next) => {
    try {
        const fanzines = await findAll();
        res.render('admin/fanzines', { fanzines });
    } catch (error) {
        next(error);
    }
};

const createFanzine = (req, res, next) => {
    try {
        res.render('upload');
    } catch (error) {
        next(error);
    }
};

const storeFanzine = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const imageCloud = await cloudinary.v2.uploader.upload(req.file.path);

        const fanzine = new Fanzine({
            title,
            description,
            imageURL: imageCloud.url,
            public_id: imageCloud.public_id,
            filename: req.file.filename,
            originalName: req.file.originalName,
            mimetype: req.file.mimetype,
            size: req.file.size
        })

        await save(fanzine);
        await fs.unlink(req.file.path);
        res.redirect('/');
    } catch (error) {
        next(error);
    }
}

const renderEditFanzine = async (req, res, next) => {
    try {
        const fanzine = await findById(req.params.id);
        res.render('admin/fanzine', { fanzine });
    } catch (error) {
        next(error);
    }
}

const updateFanzine = async (req, res, next) => {
    try {
        const { id } = req.params;
        let { title, description } = req.body;
        await update(id, title, description);
        res.redirect('/');
    } catch (error) {
        next(error);
    }
}

const renderLogin = (req, res) => {
    res.render('login');
}

module.exports = {
    renderFanzines,
    createFanzine,
    storeFanzine,
    renderEditFanzine,
    updateFanzine,
    renderLogin
}