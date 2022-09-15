const express = require("express");
const ExpressError = require("../expressError")
const db = require("../db");

let router = new express.Router();

router.get("/", async function (req, res, next) {
    try{
        const results = await db.query(
            `SELECT id, comp_code
             FROM invoices
             ORDER BY id`
        );

        return res.json({"invoices": results.rows});
    }
    catch (err){
        return next (err)
    }
})

router.get("/:id", async function (req, res, next){
    try {
        let id = req.params.id;

        const results = await db.query(
            `SELECT i.id
                    i.comp_code,
                    i.amount,
                    i.paid,
                    i.add_date,
                    i.paid_date,
                    c.name,
                    c.description
            FROM invoices AS i
                INNER JOIN companies AS c on (i.comp_code = c.code)
            WHERE id = $1`,  [id]);

        if (results.rows.length === 0) {
            throw new ExpressError(`No invoice with that ${id}`, 404);
        }

        let data = res.rows[0];
        let invoice = {
            id: data.id,
            company: {
                code: data.comp_code,
                name: data.name,
                description: data.description,
            },
            amount: data.amount,
            paid: data.paid,
            add_date: data.add_date,
            paid_date: data.paid_date,
        };

        return res.json({"invoice": invoice});
    }
    catch(err){
        return next (err)
    }
})

router.post("/", async function (req, res, next) {
    try{
     let { comp_code, amount } = req.body;

     const results = await db.query(
        `INSERT INTO invoices (comp_code, amount)
         VALUES ($1, $2)
         RETURNING id, comp_code, amount, paid, add_date, paid_date`, [comp_code, amount]);

    return res.json({"invoice": results.rows[0]});

    }
    catch (err){
        return next (err)
    }
});

router.put("/:id", async function (req, res, next) {
    try{
     let {amount, paid} = req.body;
     
     const currentRes = await db.query(
        `SELECT paid
         FROM invoices
         WHERE id = $1`, [id]);

    if (currentRes.rows.length === 0) {
        throw new ExpressError(`No invoice with that ${id}`, 404);
    }

    const results = await db.query (
        `UPDATE invoices
         SET amount=$1, paid=$2, paid_date=$3
         WHERE id=$4
         RETURNING id, comp_code, amount, paid, add_date, paid_date`,
         [amount, paid, paidDate, id]);

    return res.json({"invocie": results.rows[0]});
    }
    catch(err) {
        return next(err)
    }
})

router.delete("/:id", async function (req, res, next){
    try{
        let id = req.params.id;

        const results = await db.query(
            `DELETE FROM invoices
             WHERE id = $1
             RETURNING id`, [id]);

        if(results.rows.length === 0) {
            throw new ExpressError (`No invoice with that ${id}`, 404);
        }

        return res.json({"status": "invoice deleted"});
    }
    catch(err){
        return next(err)
    }
})

module.exports = router;