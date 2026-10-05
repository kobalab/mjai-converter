/*
 *  util
 */
"use strict";

const Majiang = require('@kobalab/majiang-core');

function pai(p) {
    if (p == '?') return '';
    if (p.length == 1) return 'z' + { E:1, S:2, W:3, N:4, P:5, F:6, C:7 }[p];
    let n = + p[0], s = p[1];
    return s + (p[2] == 'r' ? 0 : n);
}

function mianzi(l, t, ...p) {
    let d = ['','+','=','-'][(4 + t - l) % 4];
    return Majiang.Shoupai.valid_mianzi(
                p.map(p => pai(p)).join('').replace(/(?<=\d)[mpsz]/g,'') + d);
}

function hai(s, n) {
    return s == 'z'? ['','E','S','W','N','P','F','C'][+n]
                   : (+n||5) + s + (+n ? '' : 'r');
}

function tehai(paistr) {
    paistr = paistr.replace(/,.*$/,'');
    let bingpai = [];
    for (let suitstr of paistr.match(/[mpsz]\d+/g)) {
        let s = suitstr[0];
        for (let n of suitstr.match(/\d/g)) {
            bingpai.push(hai(s, n));
        }
    }
    return bingpai;
}

const HUPAI = {
    reach:              '立直',
    double_reach:       'ダブル立直',
    ippatsu:            '一発',
    haiteiraoyue:       '海底摸月',
    hoteiraoyui:        '河底撈魚',
    rinshankaiho:       '嶺上開花',
    chankan:            '槍槓',
    menzenchin_tsumoho: '門前清自摸和',
    bakaze:             '場風',
    jikaze:             '自風',
    sangenpai:          '翻牌',
    pinfu:              '平和',
    tanyaochu:          '断幺九',
    ipeko:              '一盃口',
    sanshokudojun:      '三色同順',
    ikkitsukan:         '一気通貫',
    honchantaiyao:      '混全帯幺九',
    chitoitsu:          '七対子',
    toitoiho:           '対々和',
    sananko:            '三暗刻',
    sankantsu:          '三槓子',
    sanshokudoko:       '三色同刻',
    honroto:            '混老頭',
    shosangen:          '小三元',
    honiso:             '混一色',
    junchantaiyao:      '純全帯幺九',
    ryanpeko:           '二盃口',
    chiniso:            '清一色',

    tenho:              '天和',
    chiho:              '地和',
    kokushimuso:        '国士無双',
    suanko:             '四暗刻',
    daisangen:          '大三元',
    shosushi:           '小四喜',
    daisushi:           '大四喜',
    tsuiso:             '字一色',
    ryuiso:             '緑一色',
    chinroto:           '清老頭',
    sukantsu:           '四槓子',
    churenpoton:        '九蓮宝燈',

    dora:               'ドラ',
    akadora:            '赤ドラ',
    uradora:            '裏ドラ'
};

const PINGJU = {
    fanpai:         '荒牌平局',
    nagashimangan:  '流し満貫',
    kyushukyuhai:   '九種九牌',
    sufonrenta:     '四風連打',
    suchareach:     '四家立直',
    sanchaho:       '三家和',
    sukaikan:       '四開槓'
};

module.exports = {
    pai:    pai,
    mianzi: mianzi,
    hai:    hai,
    tehai:  tehai,
    HUPAI:  HUPAI,
    PINGJU: PINGJU
};
