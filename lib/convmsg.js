/*
 *  convmsg
 */
"use strict";

const Majiang = require('@kobalab/majiang-core');

const { hai, tehai } = require('./util');

function possible_actions(msg, board, param) {

    let id         = param.id,
        rule       = param.rule,
        zhuangfeng = board.zhuangfeng,
        menfeng    = board.menfeng(param.id),
        shoupai    = board.shoupai[menfeng],
        neng_rong  = param.neng_rong,
        paishu     = board.shan.paishu,
        n_gang     = param.n_gang,
        defen      = board.defen[param.id],
        diyizimo   = param.diyizimo;

    function possible_pingju() {

        if (! msg.zimo) return [];

        if (Majiang.Game.allow_pingju(rule, shoupai, diyizimo)) {
            return [ { type: 'ryukyoku', actor: id, reason: 'kyushukyuhai' } ];
        }
        return [];
    }
    function possible_hule() {

        let p, hupai = shoupai.lizhi || paishu == 0;

        if      (msg.zimo)     {                                           }
        else if (msg.dapai)    { p = msg.dapai.p                           }
        else if (msg.gang)     { p = msg.gang.m[0] + msg.gang.m.slice(-1);
                                 hupai = true                              }
        else if (msg.gangzimo) { hupai = true                              }
        else                   { return []                                 }

        if (p) p += ['','+','=','-'][(4 + board.lunban - menfeng) % 4];

        if (Majiang.Game.allow_hule(rule, shoupai, p, zhuangfeng, menfeng,
                                    hupai, neng_rong))
        {
            return [ { type:'hora', actor: id,
                       target: board.player_id[board.lunban],
                       pai: hai(...(p || shoupai._zimo)) } ];
        }
        return [];
    }
    function possible_gang() {

        if (! (msg.zimo || msg.gangzimo)) return [];

        let rv = [];
        for (let m of Majiang.Game
                        .get_gang_mianzi(rule, shoupai, null, paishu, n_gang))
        {
            if (m.match(/\d{4}/)) {
                rv.push({ type:'ankan', actor: id,
                          consumed: m.match(/\d(?![\+\=\-])/g)
                                        .map(n => hai(m[0], n)) });
            }
            else {
                rv.push({ type:'kakan', actor: id,
                          pai: hai(m[0], m.slice(-1)),
                          consumed: m.match(/(?<![\+\=\-])\d/g)
                                        .map(n => hai(m[0], n)) });
            }
        }
        return rv;
    }
    function possible_fulou() {

        if (! msg.dapai) return [];

        let rv = [],
            p = msg.dapai.p
                        + ['','+','=','-'][(4 + board.lunban - menfeng) % 4];

        for (let m of Majiang.Game
                        .get_gang_mianzi(rule, shoupai, p, paishu, n_gang))
        {
            rv.push({ type:'daiminkan', actor: id,
                      target: board.player_id[board.lunban], pai: hai(...p),
                      consumed: m.match(/\d(?![\+\=\-])/g)
                                    .map(n => hai(m[0], n)) });
        }
        for (let m of Majiang.Game
                        .get_peng_mianzi(rule, shoupai, p, paishu))
        {
            rv.push({ type:'pon', actor: id,
                      target: board.player_id[board.lunban], pai: hai(...p),
                      consumed: m.match(/\d(?![\+\=\-])/g)
                                    .map(n => hai(m[0], n)) });
        }
        for (let m of Majiang.Game
                        .get_chi_mianzi(rule, shoupai, p, paishu))
        {
            rv.push({ type:'chi', actor: id,
                      target: board.player_id[board.lunban], pai: hai(...p),
                      consumed: m.match(/\d(?![\+\=\-])/g)
                                    .map(n => hai(m[0], n)) });
        }
        return rv;
    }
    function possible_lizhi() {

        if (msg.zimo || msg.gangzimo) {
            if (Majiang.Game.allow_lizhi(rule, shoupai, null, paishu, defen)) {
                return [ { type:'reach', actor: id } ];
            }
        }
        else if (msg.mjai) {
            let rv = [];
            for (let p of Majiang.Game.allow_lizhi(
                                    rule, shoupai, null, paishu, defen) || [])
            {
                rv.push({ type:'dahai', actor: id, pai: hai(...p),
                          tsumogiri: p[2] == '_' });
            }
            return rv;
        }
        return [];
    }
    function possible_dapai() {

        if (! (msg.zimo || msg.gangzimo || msg.fulou)) return [];

        let rv = [];
        for (let p of Majiang.Game.get_dapai(rule, shoupai)) {
            rv.push({ type:'dahai', actor: id, pai: hai(...p),
                      tsumogiri: p[2] == '_' });
        }
        return rv;
    }

    return [].concat(possible_pingju())
             .concat(possible_hule())
             .concat(possible_gang())
             .concat(possible_fulou())
             .concat(possible_lizhi())
             .concat(possible_dapai());
}

function convmsg() {

    const board = new Majiang.Board(),
          param = {};

    return function(msg) {

        if (! msg) return board;

        if (msg.kaiju) {
            board.kaiju(msg.kaiju);
            let { id, rule, player } = msg.kaiju;
            param.id   = id;
            param.rule = rule;
            return {
                type:  'start_game',
                id:    id,
                names: player.concat()
            };
        }
        else if (msg.qipai) {
            board.qipai(msg.qipai);
            param.neng_rong = true;
            param.n_gang    = 0;
            param.diyizimo  = true;
            let { zhuangfeng, jushu, changbang, lizhibang,
                                            baopai, shoupai } = msg.qipai;
            let req = {
                type:        'start_kyoku',
                bakaze:      ['E','S','W','N'][zhuangfeng],
                kyoku:       jushu + 1,
                honba:       changbang,
                kyotaku:     lizhibang,
                oya:         (board.qijia + jushu) % 4,
                dora_marker: hai(...baopai),
                tehais:      []
            };
            for (let l = 0; l < 4; l++) {
                let id = board.player_id[l];
                req.tehais[id] = shoupai[l] ? tehai(shoupai[l])
                                            : Array(13).fill('?')
            }
            return req;
        }
        else if (msg.zimo) {
            board.zimo(msg.zimo);
            let { l, p } = msg.zimo;
            let req = {
                type:  'tsumo',
                actor: board.player_id[l],
                pai:   p ? hai(...p) : '?'
            };
            if (req.actor == param.id) {
                req.possible_actions = possible_actions(msg, board, param);
                param.diyizimo = false;
            }
            return req;
        }
        else if (msg.dapai) {
            board.dapai(msg.dapai);
            let { l, p } = msg.dapai;
            let req = {
                type:      'dahai',
                actor:     board.player_id[l],
                pai:       hai(...p),
                tsumogiri: p[2] == '_'
            };
            if (req.actor != param.id) {
                req.possible_actions = possible_actions(msg, board, param);
                let shoupai = board.shoupai[board.menfeng(param.id)]
                                                        .clone().zimo(p);
                if (Majiang.Util.xiangting(shoupai) == -1)
                                                param.neng_rong = false;
            }
            else {
                if (! board.shoupai[l].lizhi) param.neng_rong = true;
                if (Majiang.Util.xiangting(board.shoupai[l]) == 0
                    && Majiang.Util.tingpai(board.shoupai[l])
                                        .find(p => board.he[l].find(p)))
                {
                    param.neng_rong = false;
                }
            }
            return req;
        }
        else if (msg.fulou) {
            board.fulou(msg.fulou);
            param.diyizimo = false;
            let { l, m } = msg.fulou;
            let s = m[0];
            let d = { '+': 1, '=': 2, '-': 3 }[m.match(/[\+\=\-]/)];
            let req = {
                type:     (  m.match(/\d{4}/)                   ? 'daiminkan'
                           : m.replace(/0/,'5').match(/(\d)\1/) ? 'pon'
                           :                                      'chi' ),
                actor:    board.player_id[l],
                target:   board.player_id[(l + d) % 4],
                pai:      hai(s, m.match(/\d(?=[\+\=\-])/)),
                consumed: m.match(/\d(?![\+\=\-])/g).map(n => hai(s, n))
            };
            if (req.actor == param.id && req.type != 'daiminkan')
                    req.possible_actions = possible_actions(msg, board, param);
            return req;
        }
        else if (msg.gang) {
            board.gang(msg.gang);
            param.diyizimo = false;
            let { l, m } = msg.gang;
            let s = m[0];
            let req;
            if (m.match(/\d{4}/)) {
                req = {
                    type:   'ankan',
                    actor:  board.player_id[l],
                    consumed: m.match(/\d(?![\+\=\-])/g).map(n => hai(s, n))
                };
            }
            else {
                let d = { '+': 1, '=': 2, '-': 3 }[m.match(/[\+\=\-]/)];
                req = {
                    type:   'kakan',
                    actor:  board.player_id[l],
                    pai:      hai(s, m.match(/(?<=[\+\=\-])\d/)),
                    consumed: m.match(/(?<![\+\=\-])\d/g).map(n => hai(s, n))
                };
                if (req.actor != param.id) {
                    req.possible_actions = possible_actions(msg, board, param);
                    let shoupai = board.shoupai[board.menfeng(param.id)]
                                            .clone().zimo(m[0] + m.slice(-1));
                    if (Majiang.Util.xiangting(shoupai) == -1)
                                                    param.neng_rong = false;
                }
            }
            return req;
        }
        else if (msg.gangzimo) {
            board.zimo(msg.gangzimo);
            param.n_gang++;
            let { l, p } = msg.gangzimo;
            let req = {
                type:  'tsumo',
                actor: board.player_id[l],
                pai:   p ? hai(...p) : '?'
            };
            if (req.actor == param.id)
                    req.possible_actions = possible_actions(msg, board, param);
            return req;
        }
        else if (msg.kaigang) {
            board.kaigang(msg.kaigang);
            let { baopai } = msg.kaigang;
            return {
                type:  'dora',
                dora_marker: hai(...baopai)
            };
        }
        else if (msg.hule) {
            board.hule(msg.hule);
            let { l, shoupai, baojia, fubaopai, fu, fanshu,
                    damanguan, defen, hupai, fenpei } = msg.hule;
            let hora_tehais = tehai(shoupai);
            let hulepai = hora_tehais.pop();
            if (baojia == null) hora_tehais.push(hulepai);
            let req = {
                type:   'hora',
                actor:  board.player_id[l],
                target: board.player_id[baojia == null ? l : baojia],
                pai:    hulepai,
                uradora_markers: (fubaopai || []).map(p => hai(...p)),
                hora_tehais: hora_tehais,
                yakus:  hupai.map(h => [ h.name,
                                         `${h.fanshu}`[0] == '*'
                                            ? 13 : h.fanshu ]),
                fu:     damanguan ? 20 : fu,
                fan:    damanguan ? 13 : fanshu,
                hora_points: defen,
                deltas: [],
                scores: []
            };
            for (let l = 0; l < 4; l++) {
                let id = board.player_id[l];
                req.deltas[id] = fenpei[l];
                req.scores[id] = board.defen[id] + fenpei[l];
            }
            return req;
        }
        else if (msg.pingju) {
            board.pingju(msg.pingju);
            let { name, shoupai, fenpei } = msg.pingju;
            let req = {
                type:   'ryukyoku',
                reason: name,
                tehais: [],
                tenpais: [],
                deltas: [],
                scores: []
            };
            for (let l = 0; l < 4; l++) {
                let id = board.player_id[l];
                let n_fulou = board.shoupai[l]._fulou.length;
                req.tehais[id] = shoupai[l] ? tehai(shoupai[l])
                                            : Array(13 - n_fulou * 3).fill('?');
                req.tenpais[id] = name == '荒牌平局' && shoupai[l] != '';
                req.deltas[id] = fenpei[l];
                req.scores[id] = board.defen[id] + fenpei[l];
            }
            return req;
        }
        else if (msg.jieju) {
            let { defen } = msg.jieju;
            return {
                type:   'end_game',
                scores: defen
            };
        }
        else if (msg.mjai) {
            let req = msg.mjai;
            req.possible_actions = possible_actions(msg, board, param);
            return req;
        }
    }
}

module.exports = convmsg;
