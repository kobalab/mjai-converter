const assert = require('assert');

const converter = require('../lib/');

function init() {
    const convres = converter.convres();
    convres({ type: 'start_game', id: 1 }, {});
    return convres;
}

suite('convres()', ()=>{

    test('dapai (手出し)', ()=>{
        const convres = init();
        assert.deepEqual(convres({ type:'tsumo', actor: 1, pai: 'E'},
                                 { dapai: 'm1' }),
                         { type:'dahai', actor: 1, pai: '1m',
                           tsumogiri: false });
    });
    test('dapai (ツモ切り)', ()=>{
        const convres = init();
        assert.deepEqual(convres({ type:'tsumo', actor: 1, pai: 'C'},
                                 { dapai: 'z7_' }),
                         { type:'dahai', actor: 1, pai: 'C',
                           tsumogiri: true });
    });
    test('dapai (リーチ)', ()=>{
        const convres = init();
        assert.deepEqual(convres({ type:'tsumo', actor: 1, pai: 'E'},
                                 { dapai: 'z1_*' }),
                         { type:'reach', actor: 1 });
        assert.deepEqual(convres({ type:'reach', actor: 1 }, null),
                         { type:'dahai', actor: 1, pai: 'E',
                           tsumogiri: true });
    });

    test('fulou (チー)', ()=>{
        const convres = init();
        assert.deepEqual(convres({ type:'dahai', actor: 0, pai: '3s'},
                                 { fulou: 's3-40' }),
                         { type:'chi', actor: 1, target: 0,
                           pai: '3s', consumed:['4s','5sr'] });
    });
    test('fulou (ポン)', ()=>{
        const convres = init();
        assert.deepEqual(convres({ type:'dahai', actor: 2, pai: '5pr'},
                                 { fulou: 'p550+' }),
                         { type:'pon', actor: 1, target: 2,
                           pai: '5pr', consumed:['5p','5p'] });
    });
    test('fulou (大明槓)', ()=>{
        const convres = init();
        assert.deepEqual(convres({ type:'dahai', actor: 3, pai: '5m'},
                                 { fulou: 'm5505=' }),
                         { type:'daiminkan', actor: 1, target: 3,
                           pai: '5m', consumed:['5m','5m','5mr'] });
    });

    test('gang (暗槓)', ()=>{
        const convres = init();
        assert.deepEqual(convres({ type:'tsumo', actor: 1, pai: '9s'},
                                 { gang: 's9999' }),
                         { type:'ankan', actor: 1,
                           consumed:['9s','9s','9s','9s'] });
    });
    test('gang (加槓)', ()=>{
        const convres = init();
        assert.deepEqual(convres({ type:'tsumo', actor: 1, pai: 'F'},
                                 { gang: 'z666=6' }),
                         { type:'kakan', actor: 1, pai: 'F',
                           consumed:['F','F','F'] });
    });

    test('hule (ツモ和了)', ()=>{
        const convres = init();
        assert.deepEqual(convres({ type:'tsumo', actor: 1, pai: 'E'},
                                 { hule: '-' }),
                         { type:'hora', actor: 1, target: 1, pai: 'E' });
    });
    test('hule (ロン和了)', ()=>{
        const convres = init();
        assert.deepEqual(convres({ type:'dahai', actor: 0, pai: '5pr'},
                                 { hule: '-' }),
                         { type:'hora', actor: 1, target: 0, pai: '5pr' });
    });
    test('hule (槍槓)', ()=>{
        const convres = init();
        assert.deepEqual(convres({ type:'kakan', actor: 2, pai: '2p',
                                   consumed:['2p','2p','2p'] },
                                 { hule: '-' }),
                         { type:'hora', actor: 1, target: 2, pai: '2p' });
    });

    test('daopai (九種九牌)', ()=>{
        const convres = init();
        assert.deepEqual(convres({ type:'tsumo', actor: 1, pai: '9p' },
                                 { daopai: '-' }),
                         { type:'ryukyoku', actor: 1,
                           reason: 'kyushukyuhai' });
    });
    test('daopai (テンパイ宣言)', ()=>{
        const convres = init();
        assert.deepEqual(convres({ type:'dahai', actor: 0, pai: '9p',
                                   tsumogiri: false },
                                 { daopai: '-' }),
                         { type:'none' });
    });
});
