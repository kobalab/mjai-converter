const assert = require('assert');

const converter = require('../lib/');

const Majiang = require('@kobalab/majiang-core');

const { tehai } = require('../lib/util');

const rule = Majiang.rule();

function init(param = {}) {

    const convreq = converter.convreq(param.rule ?? Majiang.rule());

    let id = param.id ?? 1;
    convreq({ type: 'hello', protocol: 'mjsonp', protocol_version: 1 });
    convreq({ type: 'start_game', id: id });

    let req = { type:   'start_kyoku',
                bakaze: param.bakaze ?? 'E', kyoku:   param.kyaku   ?? 1,
                hanba:  param.honba  ??  0,  kyotaku: param.kyotaku ?? 0,
                oya:    param.oya ??  2, dora_marker: param.dora_marker ?? 'S',
                tehais: [ Array(13).fill('?'), Array(13).fill('?'),
                          Array(13).fill('?'), Array(13).fill('?') ]};
    req.tehais[id] = tehai(param.tehai ?? 'm123p406s789z1234');
    convreq(req);

    return convreq;
}

suite('convreq()', ()=>{

    test('type: "hello"', ()=>{
        const convreq = converter.convreq(rule);
        assert.equal(convreq({ type:'hello' }), null);
    });

    test('type: "start_game" (names: あり)', ()=>{
        const convreq = converter.convreq(rule);
        let msg = convreq({ type:'start_game', id:1, names:['A','B','C','D']});
        assert.ok(msg.kaiju);
        assert.equal(msg.kaiju.id, 1);
        assert.deepEqual(msg.kaiju.rule, rule);
        assert.ok(msg.kaiju.title);
        assert.deepEqual(msg.kaiju.player, ['A','B','C','D']);
    });
    test('type: "start_game" (names: なし)', ()=>{
        const convreq = converter.convreq(rule);
        let msg = convreq({ type:'start_game', id:1 });
        assert.deepEqual(msg.kaiju.player, ['上家','私','下家','対面']);
    });

    test('type: "start_kyoku" (東一局)', ()=>{
        const convreq = converter.convreq(rule);
        convreq({ type:'start_game', id:1 });
        let msg = convreq(
                { type:'start_kyoku', bakaze:'E', kyoku:1, honba: 1,
                  kyotaku: 2, oya: 2, dora_marker:'E',
                  tehais:[
                    ['?','?','?','?','?','?','?','?','?','?','?','?','?'],
                    ['1m','5mr','4p','5pr','5sr','9s',
                                            'E','S','W','N','P','F','C'],
                    ['?','?','?','?','?','?','?','?','?','?','?','?','?'],
                    ['?','?','?','?','?','?','?','?','?','?','?','?','?'],
                ] });
        assert.deepEqual(msg, { qipai: {
                    zhuangfeng: 0, jushu: 0, changbang: 1, lizhibang: 2,
                    defen:[ 25000, 25000, 25000, 25000 ], baopai:'z1',
                    shoupai:['','','','m10p40s09z1234567'] } });
    });
    test('type: "start_kyoku" (南二局)', ()=>{
        const convreq = converter.convreq(rule);
        convreq({ type:'start_game', id:1 });
        convreq({ type:'start_kyoku', bakaze:'E', kyoku:1, honba: 1,
                  kyotaku: 2, oya: 2, dora_marker:'E',
                  tehais:[[],[],[],[]] })
        let msg = convreq(
                { type:'start_kyoku', bakaze:'S', kyoku:2, honba: 1,
                  kyotaku: 2, oya: 3, dora_marker:'E',
                  tehais:[
                    ['?','?','?','?','?','?','?','?','?','?','?','?','?'],
                    ['1m','5mr','4p','5pr','5sr','9s',
                                                 'E','S','W','N','P','F','C'],
                    ['?','?','?','?','?','?','?','?','?','?','?','?','?'],
                    ['?','?','?','?','?','?','?','?','?','?','?','?','?'],
                  ] });
        assert.deepEqual(msg, { qipai: {
                    zhuangfeng: 1, jushu: 1, changbang: 1, lizhibang: 2,
                    defen:[ 25000, 25000, 25000, 25000 ], baopai:'z1',
                    shoupai:['','','m10p40s09z1234567',''] } });
    });
    test('type: "start_kyoku" (西三局)', ()=>{
        const convreq = converter.convreq(rule);
        convreq({ type:'start_game', id:1 });
        convreq({ type:'start_kyoku', bakaze:'E', kyoku:1, honba: 1,
                  kyotaku: 2, oya: 2, dora_marker:'E',
                  tehais:[[],[],[],[]] })
        let msg = convreq(
                { type:'start_kyoku', bakaze:'W', kyoku:3, honba: 1,
                  kyotaku: 2, oya: 0, dora_marker:'E',
                  tehais:[
                    ['?','?','?','?','?','?','?','?','?','?','?','?','?'],
                    ['1m','5mr','4p','5pr','5sr','9s',
                                                 'E','S','W','N','P','F','C'],
                    ['?','?','?','?','?','?','?','?','?','?','?','?','?'],
                    ['?','?','?','?','?','?','?','?','?','?','?','?','?'],
                  ] });
        assert.deepEqual(msg, { qipai: {
                    zhuangfeng: 2, jushu: 2, changbang: 1, lizhibang: 2,
                    defen:[ 25000, 25000, 25000, 25000 ], baopai:'z1',
                    shoupai:['','m10p40s09z1234567','',''] } });
    });
    test('type: "start_kyoku" (北四局)', ()=>{
        const convreq = converter.convreq(rule);
        convreq({ type:'start_game', id:1 });
        convreq({ type:'start_kyoku', bakaze:'E', kyoku:1, honba: 1,
                  kyotaku: 2, oya: 2, dora_marker:'E',
                  tehais:[[],[],[],[]] })
        let msg = convreq(
                { type:'start_kyoku', bakaze:'N', kyoku:4, honba: 1,
                  kyotaku: 2, oya: 1, dora_marker:'E',
                  tehais:[
                    ['?','?','?','?','?','?','?','?','?','?','?','?','?'],
                    ['1m','5mr','4p','5pr','5sr','9s',
                                                 'E','S','W','N','P','F','C'],
                    ['?','?','?','?','?','?','?','?','?','?','?','?','?'],
                    ['?','?','?','?','?','?','?','?','?','?','?','?','?'],
                  ] });
        assert.deepEqual(msg, { qipai: {
                    zhuangfeng: 3, jushu: 3, changbang: 1, lizhibang: 2,
                    defen:[ 25000, 25000, 25000, 25000 ], baopai:'z1',
                    shoupai:['m10p40s09z1234567','','',''] } });
    });
    test('type: "start_kyoku" (scores: あり)', ()=>{
        const convreq = converter.convreq(rule);
        convreq({ type:'start_game', id:1 });
        let msg = convreq(
                { type:'start_kyoku', bakaze:'E', kyoku:1, honba: 1,
                  kyotaku: 2, oya: 2, dora_marker:'E',
                  tehais:[
                    ['?','?','?','?','?','?','?','?','?','?','?','?','?'],
                    ['1m','5mr','4p','5pr','5sr','9s',
                                                 'E','S','W','N','P','F','C'],
                    ['?','?','?','?','?','?','?','?','?','?','?','?','?'],
                    ['?','?','?','?','?','?','?','?','?','?','?','?','?']],
                  scores:[ 20000, 24000, 26000, 30000 ] });
        assert.deepEqual(msg, { qipai: {
                    zhuangfeng: 0, jushu: 0, changbang: 1, lizhibang: 2,
                    defen:[ 26000, 30000, 20000, 24000 ], baopai:'z1',
                    shoupai:['','','','m10p40s09z1234567'] } });
    });
    test('type: "start_kyoku" (配給原点を 27,000 に指定)', ()=>{
        const convreq = converter.convreq(Majiang.rule({'配給原点':27000}));
        convreq({ type:'start_game', id:1 });
        let msg = convreq(
                { type:'start_kyoku', bakaze:'E', kyoku:1, honba: 1,
                  kyotaku: 2, oya: 2, dora_marker:'E',
                  tehais:[
                    ['?','?','?','?','?','?','?','?','?','?','?','?','?'],
                    ['1m','5mr','4p','5pr','5sr','9s',
                                                 'E','S','W','N','P','F','C'],
                    ['?','?','?','?','?','?','?','?','?','?','?','?','?'],
                    ['?','?','?','?','?','?','?','?','?','?','?','?','?'],
                  ] });
        assert.deepEqual(msg, { qipai: {
                    zhuangfeng: 0, jushu: 0, changbang: 1, lizhibang: 2,
                    defen:[ 27000, 27000, 27000, 27000 ], baopai:'z1',
                    shoupai:['','','','m10p40s09z1234567'] } });
    });

    test('type: "tsumo" (マスクあり)', ()=>{
        const convreq = init();
        assert.deepEqual(convreq({ type:'tsumo', actor: 0, pai:'?' }),
                                 { zimo: { l: 2, p:'' } });
    });
    test('type: "tsumo" (マスクなし)', ()=>{
        const convreq = init();
        assert.deepEqual(convreq({ type:'tsumo', actor: 1, pai:'1m' }),
                                 { zimo: { l: 3, p:'m1' } });
    });

    test('type: "dahai" (手出し)', ()=>{
        const convreq = init();
        assert.deepEqual(
            convreq({ type:'dahai', actor: 0, pai:'1p', tsumogiri: false }),
                    { dapai: { l: 2, p:'p1' } });
    });
    test('type: "dahai" (ツモ切り)', ()=>{
        const convreq = init();
        assert.deepEqual(
            convreq({ type:'dahai', actor: 1, pai:'1s', tsumogiri: true }),
                    { dapai: { l: 3, p:'s1_' } });
    });

    test('type: "chi"', ()=>{
        const convreq = init();
        convreq({ type:'dahai', actor: 3, pai:'5sr', tsumogiri: false });
        assert.deepEqual(
            convreq({ type:'chi', actor: 0, target: 3, pai:'5sr',
                      consumed:['6s','7s'] }),
                    { fulou: { l: 2, m:'s0-67' } });
    });
    test('type: "pon"', ()=>{
        const convreq = init();
        convreq({ type:'dahai', actor: 3, pai:'5s', tsumogiri: false });
        assert.deepEqual(
            convreq({ type:'pon', actor: 1, target: 3, pai:'5s',
                      consumed:['5s','5sr'] }),
                    { fulou: { l: 3, m:'s505=' } });
    });
    test('type: "daiminkan"', ()=>{
        const convreq = init();
        convreq({ type:'dahai', actor: 3, pai:'5s', tsumogiri: false });
        assert.deepEqual(
            convreq({ type:'daiminkan', actor: 2, target: 3, pai:'5s',
                      consumed:['5s','5s','5sr'] }),
                    { fulou: { l: 0, m:'s5505+' } });
    });

    test('type: "ankan"', ()=>{
        const convreq = init();
        convreq({ type:'tsumo', actor: 0, pai:'?' });
        assert.deepEqual(
            convreq({ type:'ankan', actor: 0, consumed:['N','N','N','N'] }),
                    { gang: { l: 2, m:'z4444' } });
    });
    test('type: "kakan"', ()=>{
        const convreq = init();
        convreq({ type:'pon', actor: 0, target: 3, pai:'5m',
                  consumed:['5m','5mr'] });
        convreq({ type:'tsumo', actor: 0, pai:'?' });
        assert.deepEqual(
            convreq({ type:'kakan', actor: 0, pai:'5m',
                      consumed:['5m','5m','5mr']}),
                    { gang: { l: 2, m:'m505-5' } });
    });

    test('type: "tsumo" (大明槓のカンヅモ)', ()=>{
        const convreq = init();
        convreq({ type:'daiminkan', actor: 2, target: 3, pai:'5s',
                  consumed:['5s','5s','5sr'] });
        assert.deepEqual(convreq({ type:'tsumo', actor: 2, pai:'?' }),
                        { gangzimo: { l: 0, p:'' } });
    });
    test('type: "tsumo" (暗槓のカンヅモ)', ()=>{
        const convreq = init();
        convreq({ type:'ankan', actor: 0, consumed:['N','N','N','N'] });
        assert.deepEqual(convreq({ type:'tsumo', actor: 0, pai:'7m' }),
                        { gangzimo: { l: 2, p:'m7' } });
    });
    test('type: "tsumo" (加槓のカンヅモ)', ()=>{
        const convreq = init();
        convreq({ type:'kakan', actor: 0, pai:'5m',
                  consumed:['5m','5m','5mr']});
        assert.deepEqual(convreq({ type:'tsumo', actor: 0, pai:'8m' }),
                        { gangzimo: { l: 2, p:'m8' } });
    });
    test('type: "tsumo" (カンヅモ → ツモ)', ()=>{
        const convreq = init();
        convreq({ type:'ankan', actor: 3, consumed:['N','N','N','N'] });
        convreq({ type:'tsumo', actor: 3, pai:'?' });
        assert.deepEqual(convreq({ type:'tsumo', actor: 3, pai:'7m' }),
                        { zimo: { l: 1, p:'m7' } });
    });

    test('type: "dora"', ()=>{
        const convreq = init();
        convreq({ type:'ankan', actor: 0, consumed:['N','N','N','N'] });
        assert.deepEqual(convreq({ type:'dora', dora_marker:'C' }),
                        { kaigang: { baopai: 'z7' } });
    });

    test('type: "reach" → "reach_accepted"', ()=>{
        const convreq = init();
        assert.equal(convreq({ type:'reach', actor: 1 }), null);
        assert.deepEqual(convreq({ type:'dahai', actor: 1, pai: 'W',
                                   tsumogiri: true }),
                        { dapai: { l: 3, p:'z3_*' } });
        assert.equal(convreq({ type:'reach_accepted', actor: 1,
                               deltas:[ 0, -1000, 0, 0 ],
                               scores:[ 25000, 24000, 25000, 25000 ] }),
                     null);
    });

    test('type: "hora" (ツモ和了)', ()=>{
        const convreq = init();
        convreq({ type:'tsumo', actor: 1, pai:'2m'});
        assert.deepEqual(
            convreq({ type:'hora', actor: 1, target: 1, pai:'2m',
                      uradora_markers:['8p'],
                      hora_tehais:['1m','3m','5m','6m','7m','1p','2p','3p',
                                   '4p','5pr','6p','W','W','2m'],
                      yakus:[ ['reach', 1],
                              ['menzenchin_tsumoho', 1],
                              ['akadora', 1] ],
                      fu: 30, fan: 3, hora_points: 4000,
                      deltas:[ -1100, 6300, -1100, -2100 ],
                      scores:[ 21900, 29300, 22900, 25900 ] }),
            { hule: { l: 3, shoupai:'m13567p123406z33m2', baojia: null,
                      fubaopai:['p8'], fu: 30, fanshu: 3, defen: 4000,
                      hupai: [ { name:'立直', fanshu: 1 },
                               { name:'門前清自摸和', fanshu: 1 },
                               { name: '赤ドラ', fanshu: 1 } ],
                      fenpei:[ -1100, -2100, -1100, 6300 ] } });
    });
    test('type: "hora" (ロン和了、裏ドラなし)', ()=>{
        const convreq = init();
        convreq({ type:'pon', actor: 1, target: 2,
                  pai:'C', consumed:['C','C']});
        convreq({ type:'dahai', actor: 2, pai:'2m'});
        assert.deepEqual(
            convreq({ type:'hora', actor: 1, target: 2, pai:'2m',
                      uradora_markers:[],
                      hora_tehais:['1m','3m','5m','6m','7m','1p','2p','3p',
                                   'W','W'],
                      yakus:[ ['sangenpai', 1] ],
                      fu: 30, fan: 1, hora_points: 1000,
                      deltas:[ 0, 1300, -1300, 0 ],
                      scores:[ 25000, 26300, 23700, 25000 ] }),
            { hule: { l: 3, shoupai:'m13567p123z33m2,z777+', baojia: 0,
                      fubaopai: null, fu: 30, fanshu: 1, defen: 1000,
                      hupai: [ { name:'翻牌', fanshu: 1 } ],
                      fenpei:[ -1300, 0, 0, 1300 ] } });
    });
    test('type: "hora" (不明な和了役名)', ()=>{
        const convreq = init();
        assert.deepEqual(
            convreq({ type:'hora', actor: 1, target: 2, pai:'2p',
                      uradora_markers:[],
                      hora_tehais:['2p','3p','3p','4p','4p','5p','5p','6p',
                                   '6p','7p','7p','8p','8p'],
                      yakus:[ ['daisharin', 13] ],
                      fu: 20, fan: 13, hora_points: 32000,
                      deltas:[ 0, 32000, -32000, 0 ],
                      scores:[ 25000, 57000, -7000, 25000 ] }),
            { hule: { l: 3, shoupai:'p2334455667788p2', baojia: 0,
                      fubaopai: null, fu: 20, fanshu: 13, defen: 32000,
                      hupai: [ { name:'daisharin', fanshu: 13 } ],
                      fenpei:[ -32000, 0, 0, 32000 ] } });
    });
    test('type: "hora" (詳細情報なし)', ()=>{
        const convreq = init();
        assert.equal(convreq({ type:'hora', actor: 1,
                               deltas:[ 0, 3900, -3900, 0 ] }),
                     null);
        assert.deepEqual(convreq().defen, [ 25000, 28900, 21100, 25000 ]);
    });

    test('type: "ryukyoku"', ()=>{
        const convreq = init();
        convreq({ type:'pon', actor: 0, target: 2,
                  pai:'C', consumed:['C','C']});
        assert.deepEqual(
            convreq({ type:'ryukyoku', reason:'fanpai',
                      tehais:[ ['1m','3m','5m','6m','7m','1p','2p','3p',
                                'W','W'],
                               ['1m','3m','5m','6m','7m','1p','2p','3p',
                                '4p','5pr','6p','W','W'],
                               ['?','?','?','?','?','?','?','?','?','?'],
                               ['?','?','?','?','?','?','?','?','?','?'] ],
                      tenpais:[ true, false, false, false ],
                      deltas:[ 3000, -1000, -1000, -1000 ],
                      scores:[ 28000, 24000, 24000, 24000 ] }),
            { pingju: { name: '荒牌平局',
                        shoupai:['','',
                                 'm13567p123z33,z777=','m13567p123406z33'],
                        fenpei:[ -1000, -1000, 3000, -1000 ] } });
    });
    test('type: "ryukyoku" (不明な流局理由)', ()=>{
        const convreq = init();
        assert.deepEqual(
            convreq({ type:'ryukyoku', reason:'ryukyoku',
                      tehais:[ ['?','?','?','?','?','?','?','?','?','?'],
                               ['?','?','?','?','?','?','?','?','?','?'],
                               ['?','?','?','?','?','?','?','?','?','?'],
                               ['?','?','?','?','?','?','?','?','?','?'] ],
                      tenpais:[ false, false, false, false ],
                      deltas:[ 0, 0, 0, 0 ],
                      scores:[ 25000, 25000, 25000, 25000 ] }),
            { pingju: { name: 'ryukyoku',
                        shoupai:['','','',''],
                        fenpei:[ 0, 0, 0, 0 ] } });
    });
    test('type: "ryukyoku" (詳細情報なし)', ()=>{
        const convreq = init();
        assert.equal(convreq({ type:'ryukyoku', reason:'fanpai',
                               deltas:[ 3000, -1000, -1000, -1000 ] }),
                     null);
        assert.deepEqual(convreq().defen, [ 28000, 24000, 24000, 24000 ]);
    });

    test('type: "end_kyoku"', ()=>{
        const convreq = init();
        assert.equal(convreq({ type:'end_kyoku' }), null);
    });

    test('type: "end_game" (scores: あり)', ()=>{
        const convreq = init();
        assert.equal(convreq({ type:'end_game',
                               scores:[ 20000, 25000, 25000, 30000 ] }),
                     null);
        assert.deepEqual(convreq().defen, [20000, 25000, 25000, 30000 ]);
        assert.deepEqual(convreq().rank, [ 4, 3, 2, 1 ]);
        assert.deepEqual(convreq().point, ['-30.0','-15.0','5.0','40.0']);
    });
    test('type: "end_game" (scores: なし、順位点四捨五入)', ()=>{
        const convreq = init({ rule: Majiang.rule(
                                        {'順位点':['30','15','-15','-30']}) });
        assert.equal(convreq({ type:'end_game' }), null);
        assert.deepEqual(convreq().defen, [25000, 25000, 25000, 25000 ]);
        assert.deepEqual(convreq().rank, [ 3, 4, 1, 2 ]);
        assert.deepEqual(convreq().point, ['-20','-35','45','10']);
    });
});
