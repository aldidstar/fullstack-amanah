var express = require("express");
var router = express.Router();
const path = require("path");
const { query } = require("express");
const qrcode = require("qrcode");
var moment = require("moment");

module.exports = function (db) {
  router.get("/", function (req, res) {
    
    let sql = `select * from item order by name `;
    db.query(sql, (err, result) => {
      if (err) throw err
      res.render("index", {
        nama: result.rows,
      });
      });
    });


    router.get("/add", (req, res, next) => {
      res.render("add"); 
    });


    router.get("/barcode/:id", function (req, res) {
    
      let sql = `select * from item where query=${req.params.id} `;
      
      db.query(sql, (err, result) => {
        if (err) throw err
      
        res.render("barcode", {
          nama: result.rows[0],
        });
        });
      });


  router.post("/add", (req, res) => {
    db.query(
      `INSERT INTO item (start, branch, month, year, name) VALUES ('${req.body.start}', 
      '${req.body.branch}', '${req.body.month}', '${req.body.year}', '${req.body.name}') returning *`,
      (err, data) => {
        if (err) throw err
        let query = `${data.rows[0].query}`;
        let name = data.rows[0].name;
        let branch = data.rows[0].branch;
   
        let month = data.rows[0].month;
        
        let year = `20` + data.rows[0].year;
        let start = data.rows[0].start;
      
        qrcode.toDataURL(start + ` area ` + branch + ` pembelian bulan ` + month + ` tahun ` + year + ` ke ` + query , (err, src) => {
          if (err) res.send("Something went wrong!");
          db.query( `update item set barcode = '${src}' where query = ${data.rows[0].query}`,
          (err, insertactivity) => {
            if (err) throw err;
            res.render("scan", {
              qr_code: src
            });
          });
          } )  
      }
    );
  });

  

  

  return router;
};
