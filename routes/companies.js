const express = require("express");
const ExpressError = require("../expressError")
const db = require("../db");
const { route } = require("../app");

let router = new express.Router();

route.get("/", async function (req, res, next){
    try{
        const res = await db.query(
            `SELECT code, name
            FROM companies
            ORDER BY name`
        );
        return res.json({"companies": res.rows});
    }

    catch (err) {
        return next(err);
    }
});

router.get("/:code", async function (req, res, next) {
    try{
        let code = req.params.code;

        const companyRes = await db.query(
            `SELECT code, name, description
             FROM companies
             WHERE code= $1`,
             [code]
        );

        if (companyRes.rows.length === 0) {
            throw new ExpressError(`There isn't a company with that ${code}`, 404)
        }
        return res.json({"company": company});
    }
    catch(err){
        return next(err)
    }
});

router.post("/", async function (req, res, next){
    try{
        const {name, description, code} = req.body;

        const res = await db.query(
            `INSERT INTO companies (code, name, description)
             VALUES ($1, $2, $3)
             RETURNING code, name, description`, [code, name, description]);

        return res.status(201),json({"company": res.rows[0]})
    }
    catch(err){
        return next(err);
    }
});

router.put("/:code", async function (req, res, next){
    try{
        const {name, description} = req.body;
        const code = req.params.code;

        const res = await db.query(
            `UPDATE companies
             SET name=$1, description=$2
             WHERE code =$3
             RETURNING code, name, description`, [code, name, description]);

        if (res.rows.length === 0) {
            throw new ExpressError(`No company with that ${code}`, 404)
        } else {
            return res.json({"company": res.rows[0]})
        }

    }
    catch(err){
        return next(err)
    }
})

router.delete("/:code", async function (req, res, next){
    try{
        let code = req.params.code;

        const res = await db.query(
            `DELETE FROM companies
             WHERE code=$1
             RETURNING code`, [code]);

        if (res.rows.length === 0) {
            throw new ExpressError(`No company with that ${code}`, 404)
        } else {
            return res.json({"status": "deleted"});
        }
    }

    catch (err){
        return next(err);
    }
})

module.exports = router;