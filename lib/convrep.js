/*
 *  convmsg
 */
"use strict";

const { pai, mianzi } = require('./util');

function convrep() {

    let lizhi, peng = [];

    return function(res) {

        if (! res) return {};

        if (res.type == 'dahai') {
            let rep = { dapai: pai(res.pai) + (res.tsumogiri ? '_' : '')
                                            + (lizhi         ? '*' : '')};
            lizhi = false;
            return rep;
        }
        else if (res.type == 'reach') {
            lizhi = true;
            return { mjai: res };
        }
        else if (res.type == 'chi' || res.type == 'pon' ||
                 res.type ==  'daiminkan')
        {
            let m = mianzi(res.actor, res.target, ...res.consumed, res.pai);
            if (res.type == 'pon') peng.push(m);
            return { fulou: m };
        }
        else if (res.type == 'ankan') {
            return { gang: mianzi(res.actor, res.actor, ...res.consumed) }
        }
        else if (res.type == 'kakan') {
            let i = peng.map(m => m.slice(0,2).replace(/0/,'5'))
                        .indexOf(pai(res.pai).replace(/0/,'5'));
            return { gang: peng[i] + pai(res.pai)[1] };
        }
        else if (res.type == 'hora') {
            return { hule: '-' };
        }
        else if (res.type == 'ryukyoku') {
            return { daopai: '-' };
        }

        return {};
    }
}

module.exports = convrep;
