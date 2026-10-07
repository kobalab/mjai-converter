const assert = require('assert');

const converter = require('../lib/');

suite('convrep()', ()=>{

    test('dahai (手出し)', ()=>{
        const convrep = converter.convrep();
        assert.deepEqual(
            convrep({ type:'dahai', actor: 0, pai:'1p', tsumogiri: false }),
            { dapai: 'p1' });
    });
    test('dahai (ツモ切り)', ()=>{
        const convrep = converter.convrep();
        assert.deepEqual(
            convrep({ type:'dahai', actor: 0, pai:'P', tsumogiri: true }),
            { dapai: 'z5_' });
    });

    test('reach → dahai', ()=>{
        const convrep = converter.convrep();
        assert.deepEqual(
            convrep({ type:'reach', actor: 0 }),
            { mjai: { type:'reach', actor: 0 } });
        assert.deepEqual(
            convrep({ type:'dahai', actor: 0, pai:'7s', tsumogiri: false }),
            { dapai: 's7*' });
    });

    test('chi', ()=>{
        const convrep = converter.convrep();
        assert.deepEqual(
            convrep({ type:'chi', actor: 0, target: 3,
                      pai:'4p', consumed:['5pr','6p'] }),
            { fulou: 'p4-06' });
    });
    test('pon', ()=>{
        const convrep = converter.convrep();
        assert.deepEqual(
            convrep({ type:'pon', actor: 0, target: 1,
                      pai:'5sr', consumed:['5s','5s'] }),
            { fulou: 's550+' });
    });
    test('daiminkan', ()=>{
        const convrep = converter.convrep();
        assert.deepEqual(
            convrep({ type:'daiminkan', actor: 0, target: 2,
                      pai:'5m', consumed:['5m','5m','5mr'] }),
            { fulou: 'm5505=' });
    });

    test('ankan', ()=>{
        const convrep = converter.convrep();
        assert.deepEqual(
            convrep({ type:'ankan', actor: 0, consumed:['N','N','N','N'] }),
            { gang: 'z4444' });
    });
    test('kakan', ()=>{
        const convrep = converter.convrep();
        convrep({ type:'pon', actor: 0, target: 1,
                  pai: '6m', consumed:['6m','6m'] });
        assert.deepEqual(
            convrep({ type:'kakan', actor: 0,
                      pai:'6m', consumed:['6m','6m','6m'] }),
            { gang: 'm666+6' });
    });

    test('hora', ()=>{
        const convrep = converter.convrep();
        assert.deepEqual(
            convrep({ type:'hora', actor: 0, target: 1, pai:'2m' }),
            { hule: '-' });
    });

    test('ryukyoku', ()=>{
        const convrep = converter.convrep();
        assert.deepEqual(
            convrep({ type:'ryukyoku', actor: 1, reason: 'kyushukyuhai' }),
            { daopai: '-' });
    });

    test('none', ()=>{
        const convrep = converter.convrep();
        assert.deepEqual(convrep({ type:'none' }), {});
    });
});
