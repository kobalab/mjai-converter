/*
 *  convreq
 */
"use strict";

const { hai } = require('./util');

function convres() {

    let id, last;

    return function(req, rep) {

        if (req.type == 'start_game') id = req.id;

        let res = { type: 'none' };

        if (! rep && last) {
            res  = last;
            last = null;
        }
        else if (rep && rep.dapai) {
            let p = rep.dapai;
            res = { type: 'dahai', actor: id,
                    pai: hai(...p), tsumogiri: p[2] == '_' };
            if (p.slice(-1) == '*') {
                last = res;
                res  = { type: 'reach', actor: id };
            }
        }
        else if (rep && rep.fulou) {
            res = { type: '', actor: id, target: req.actor,
                    pai: req.pai, consumed: []};
            let m = rep.fulou;
            let s = m[0];
            res.type = m.match(/\d{4}/)                   ? 'daiminkan'
                     : m.replace(/0/,'5').match(/(\d)\1/) ? 'pon'
                     :                                      'chi';
            res.consumed
                    = m.match(/\d(?![\+\=\-])/g).map(n => hai(s, n));
        }
        else if (rep && rep.gang) {
            let m = rep.gang;
            let s = m[0];
            if (m.match(/\d{4}/)) {
                res = { type: 'ankan', actor: id, consumed: [] };
                res.consumed = m.match(/\d/g).map(n => hai(s, n));
            }
            else {
                res = { type: 'kakan', actor: id, pai: '', consumed: [] };
                res.pai = hai(s, m.slice(-1));
                res.consumed
                        = m.match(/(?<![\+\=\-])\d/g).map(n => hai(s, n));
            }
        }
        else if (rep && rep.hule) {
            res = { type: 'hora', actor: id,
                    target: req.actor, pai: req.pai };
        }
        else if (rep && rep.daopai) {
            if (req.type == 'tsumo') {
                res = { type: 'ryukyoku', actor: id, reason: 'kyushukyuhai' };
            }
        }

        return res;
    }
}

module.exports = convres;
