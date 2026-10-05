const assert = require('assert');

const { pai, mianzi, hai, tehai } = require('../lib/util');

suite('util', ()=>{

    suite('pai()', ()=>{

        test('“?” → “”', ()=> assert.equal(pai('?'), ''));

        test('1m → m1',  ()=> assert.equal(pai('1m'), 'm1'));
        test('2m → m2',  ()=> assert.equal(pai('2m'), 'm2'));
        test('3m → m3',  ()=> assert.equal(pai('3m'), 'm3'));
        test('4m → m4',  ()=> assert.equal(pai('4m'), 'm4'));
        test('5m → m5',  ()=> assert.equal(pai('5m'), 'm5'));
        test('6m → m6',  ()=> assert.equal(pai('6m'), 'm6'));
        test('7m → m7',  ()=> assert.equal(pai('7m'), 'm7'));
        test('8m → m8',  ()=> assert.equal(pai('8m'), 'm8'));
        test('9m → m9',  ()=> assert.equal(pai('9m'), 'm9'));
        test('5mr → m0', ()=> assert.equal(pai('5mr'), 'm0'));

        test('1p → p1',  ()=> assert.equal(pai('1p'), 'p1'));
        test('2p → p2',  ()=> assert.equal(pai('2p'), 'p2'));
        test('3p → p3',  ()=> assert.equal(pai('3p'), 'p3'));
        test('4p → p4',  ()=> assert.equal(pai('4p'), 'p4'));
        test('5p → p5',  ()=> assert.equal(pai('5p'), 'p5'));
        test('6p → p6',  ()=> assert.equal(pai('6p'), 'p6'));
        test('7p → p7',  ()=> assert.equal(pai('7p'), 'p7'));
        test('8p → p8',  ()=> assert.equal(pai('8p'), 'p8'));
        test('9p → p9',  ()=> assert.equal(pai('9p'), 'p9'));
        test('5pr → p0', ()=> assert.equal(pai('5pr'), 'p0'));

        test('1s → s1',  ()=> assert.equal(pai('1s'), 's1'));
        test('2s → s2',  ()=> assert.equal(pai('2s'), 's2'));
        test('3s → s3',  ()=> assert.equal(pai('3s'), 's3'));
        test('4s → s4',  ()=> assert.equal(pai('4s'), 's4'));
        test('5s → s5',  ()=> assert.equal(pai('5s'), 's5'));
        test('6s → s6',  ()=> assert.equal(pai('6s'), 's6'));
        test('7s → s7',  ()=> assert.equal(pai('7s'), 's7'));
        test('8s → s8',  ()=> assert.equal(pai('8s'), 's8'));
        test('9s → s9',  ()=> assert.equal(pai('9s'), 's9'));
        test('5sr → s0', ()=> assert.equal(pai('5sr'), 's0'));

        test('E → z1',   ()=> assert.equal(pai('E'), 'z1'));
        test('S → z2',   ()=> assert.equal(pai('S'), 'z2'));
        test('W → z3',   ()=> assert.equal(pai('W'), 'z3'));
        test('N → z4',   ()=> assert.equal(pai('N'), 'z4'));
        test('P → z5',   ()=> assert.equal(pai('P'), 'z5'));
        test('F → z6',   ()=> assert.equal(pai('F'), 'z6'));
        test('C → z7',   ()=> assert.equal(pai('C'), 'z7'));
    })

    suite('mianzi()', ()=>{

        test('チー', ()=>
            assert.equal(mianzi(0, 3, '1m','2m','3m'), 'm123-'));
        test('チー赤あり', ()=>
            assert.equal(mianzi(1, 0, '3p','5pr','4p'), 'p34-0'));
        test('赤でチー', ()=>
            assert.equal(mianzi(2, 1, '6s','7s','5sr'), 's0-67'));

        test('下家からポン', ()=>
            assert.equal(mianzi(0, 1, 'E', 'E', 'E'), 'z111+'));
        test('対面からポン赤あり', ()=>
            assert.equal(mianzi(0, 2, '5m', '5mr', '5m'), 'm505='));
        test('上家から赤でポン', ()=>
            assert.equal(mianzi(0, 3, '5p', '5p', '5pr'), 'p550-'));

        test('下家から大明槓', ()=>
            assert.equal(mianzi(0, 1, 'C', 'C', 'C'), 'z777+'));
        test('対面から大明槓赤あり', ()=>
            assert.equal(mianzi(0, 2, '5s', '5s', '5sr', '5s'), 's5505='));
        test('上家から赤で大明槓', ()=>
            assert.equal(mianzi(0, 3, '5m', '5m', '5m', '5mr'), 'm5550-'));

        test('暗槓', ()=>
            assert.equal(mianzi(0, 0, '2p', '2p', '2p', '2p'), 'p2222'));
        test('暗槓赤あり', ()=>
            assert.equal(mianzi(1, 1, '5p', '5p', '5p', '5pr'), 'p5550'));
        test('暗槓2枚赤あり', ()=>
            assert.equal(mianzi(2, 2, '5s', '5s', '5sr', '5sr'), 's5500'));
    });

    suite('hai()', ()=>{

        test('m0 → 5mr', ()=> assert.equal(hai(...'m0'), '5mr'));
        test('m1 → 1m',  ()=> assert.equal(hai(...'m1'), '1m'));
        test('m2 → 2m',  ()=> assert.equal(hai(...'m2'), '2m'));
        test('m3 → 3m',  ()=> assert.equal(hai(...'m3'), '3m'));
        test('m4 → 4m',  ()=> assert.equal(hai(...'m4'), '4m'));
        test('m5 → 5m',  ()=> assert.equal(hai(...'m5'), '5m'));
        test('m6 → 6m',  ()=> assert.equal(hai(...'m6'), '6m'));
        test('m7 → 7m',  ()=> assert.equal(hai(...'m7'), '7m'));
        test('m8 → 8m',  ()=> assert.equal(hai(...'m8'), '8m'));
        test('m9 → 9m',  ()=> assert.equal(hai(...'m9'), '9m'));

        test('p0 → 5pr', ()=> assert.equal(hai(...'p0'), '5pr'));
        test('p1 → 1p',  ()=> assert.equal(hai(...'p1'), '1p'));
        test('p2 → 2p',  ()=> assert.equal(hai(...'p2'), '2p'));
        test('p3 → 3p',  ()=> assert.equal(hai(...'p3'), '3p'));
        test('p4 → 4p',  ()=> assert.equal(hai(...'p4'), '4p'));
        test('p5 → 5p',  ()=> assert.equal(hai(...'p5'), '5p'));
        test('p6 → 6p',  ()=> assert.equal(hai(...'p6'), '6p'));
        test('p7 → 7p',  ()=> assert.equal(hai(...'p7'), '7p'));
        test('p8 → 8p',  ()=> assert.equal(hai(...'p8'), '8p'));
        test('p9 → 9p',  ()=> assert.equal(hai(...'p9'), '9p'));

        test('s0 → 5sr', ()=> assert.equal(hai(...'s0'), '5sr'));
        test('s1 → 1s',  ()=> assert.equal(hai(...'s1'), '1s'));
        test('s2 → 2s',  ()=> assert.equal(hai(...'s2'), '2s'));
        test('s3 → 3s',  ()=> assert.equal(hai(...'s3'), '3s'));
        test('s4 → 4s',  ()=> assert.equal(hai(...'s4'), '4s'));
        test('s5 → 5s',  ()=> assert.equal(hai(...'s5'), '5s'));
        test('s6 → 6s',  ()=> assert.equal(hai(...'s6'), '6s'));
        test('s7 → 7s',  ()=> assert.equal(hai(...'s7'), '7s'));
        test('s8 → 8s',  ()=> assert.equal(hai(...'s8'), '8s'));
        test('s9 → 9s',  ()=> assert.equal(hai(...'s9'), '9s'));

        test('z1 → E',  ()=> assert.equal(hai(...'z1'), 'E'));
        test('z2 → S',  ()=> assert.equal(hai(...'z2'), 'S'));
        test('z3 → W',  ()=> assert.equal(hai(...'z3'), 'W'));
        test('z4 → N',  ()=> assert.equal(hai(...'z4'), 'N'));
        test('z5 → P',  ()=> assert.equal(hai(...'z5'), 'P'));
        test('z6 → F',  ()=> assert.equal(hai(...'z6'), 'F'));
        test('z7 → C',  ()=> assert.equal(hai(...'z7'), 'C'));
    });

    suite('tehai()', ()=>{

        test('副露なし', ()=>
            assert.deepEqual(tehai('m123p406s789z1234'),
                                  ['1m','2m','3m','4p','5pr','6p',
                                   '7s','8s','9s','E','S','W','N']));
        test('副露あり', ()=>
            assert.deepEqual(tehai('m123p406s789z12,z333='),
                                  ['1m','2m','3m','4p','5pr','6p',
                                   '7s','8s','9s','E','S']));
    });
});
