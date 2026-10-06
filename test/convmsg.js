const assert = require('assert');

const Majiang = require('@kobalab/majiang-core');

const converter = require('../lib/');

const rule = Majiang.rule();

function init(param = {}, script = []) {

    const convmsg = converter.convmsg();

    const kaiju = {
        id:     param.id   ?? 2,
        rule:   param.rule ?? rule,
        title:  '',
        player: ['','','',''],
        qijia:  param.qijia ?? 1
    };
    convmsg({ kaiju: kaiju });

    const qipai = {
        zhuangfeng: param.zhuangfeng ?? 0,
        jushu:      param.jushu      ?? 0,
        changbang:  param.changbang  ?? 0,
        lizhibang:  param.lizhibang  ?? 0,
        defen:      param.defen      ?? [ 25000, 25000, 25000, 25000 ],
        baopai:     param.baopai     ?? 'z2',
        shoupai:    ['','','','']
    };
    if (param.shoupai) {
        let l = (kaiju.id + 4 - kaiju.qijia + 4 - qipai.jushu) % 4;
        qipai.shoupai[l] = param.shoupai;
    }
    convmsg({ qipai: qipai });

    for (let msg of script) convmsg(msg);

    return convmsg;
}

suite('convmsg()', ()=>{

    test('kaiju', ()=>{
        const convmsg = converter.convmsg();
        assert.deepEqual(
            convmsg({ kaiju: { id: 2, rule: rule, title: 'title',
                               player: ['A','B','C','D'], qijia: 1 } }),
            { type:'start_game', id: 2, names: ['A','B','C','D'] });
    });

    test('qipai', ()=>{
        const convmsg = converter.convmsg();
        convmsg({ kaiju: { id: 2, rule: rule, title: 'title',
                           player: ['A','B','C','D'], qijia: 1 } });
        assert.deepEqual(
            convmsg({ qipai: {
                        zhuangfeng: 0,
                        jushu:      1,
                        changbang:  1,
                        lizhibang:  2,
                        defen:      [ 25000, 25000, 25000, 25000 ],
                        baopai:     'z2',
                        shoupai:    ['m10p30s07z1234567','','',''] } }),
            { type:'start_kyoku', bakaze:'E', kyoku: 2,
                honba: 1, kyotaku: 2, oya: 2, dora_marker:'S',
                tehais:[['?','?','?','?','?','?','?','?','?','?','?','?','?'],
                        ['?','?','?','?','?','?','?','?','?','?','?','?','?'],
                        ['1m','5mr','3p','5pr','5sr','7s',
                                                 'E','S','W','N','P','F','C'],
                        ['?','?','?','?','?','?','?','?','?','?','?','?','?']] });
    });

    test('zimo (マスクあり)', ()=>{
        const convmsg = init();
        assert.deepEqual(convmsg({ zimo: { l: 2, p: '' } }),
                         { type:'tsumo', actor: 3, pai:'?' });
    });
    test('zimo (マスクなし)', ()=>{
        const convmsg = init();
        let msg = convmsg({ zimo: { l: 1, p: 'm2' } });
        delete msg.possible_actions;
        assert.deepEqual(msg, { type:'tsumo', actor: 2, pai:'2m' });
    });

    test('dapai (手出し)', ()=>{
        const convmsg = init();
        assert.deepEqual(convmsg({ dapai: { l: 1, p: 's0' } }),
                         { type:'dahai', actor: 2, pai:'5sr',
                           tsumogiri: false });
    });
    test('dapai (ツモ切り)', ()=>{
        const convmsg = init();
        assert.deepEqual(convmsg({ dapai: { l: 3, p: 's3_' } }),
                         { type:'dahai', actor: 0, pai:'3s',
                           tsumogiri: true, possible_actions:[] });
    });
    test('dapai (リーチ)', ()=>{
        const convmsg = init();
        assert.deepEqual(convmsg({ dapai: { l: 3, p: 's3*' } }),
                         { type:'dahai', actor: 0, pai:'3s',
                           tsumogiri: false, possible_actions:[] });
    });

    test('fulou (チー)', ()=>{
        const convmsg = init();
        convmsg({ dapai: { l: 2, p:'m4' } });
        assert.deepEqual(convmsg({ fulou: { l: 3, m: 'm4-06' } }),
                         { type:'chi', actor: 0, target: 3,
                           pai:'4m', consumed:['5mr','6m'] });
    });
    test('fulou (ポン)', ()=>{
        const convmsg = init();
        convmsg({ dapai: { l: 2, p:'p5' } });
        assert.deepEqual(convmsg({ fulou: { l: 0, m: 'p505=' } }),
                         { type:'pon', actor: 1, target: 3,
                           pai:'5p', consumed:['5p','5pr'] });
    });
    test('fulou (大明槓)', ()=>{
        const convmsg = init();
        convmsg({ dapai: { l: 3, p:'s0' } });
        assert.deepEqual(convmsg({ fulou: { l: 0, m: 's5550+' } }),
                         { type:'daiminkan', actor: 1, target: 2,
                           pai:'5sr', consumed:['5s','5s','5s'] });
    });

    test('gang (暗槓)', ()=>{
        const convmsg = init();
        assert.deepEqual(convmsg({ gang: { l: 2, m: 'z4444' } }),
                         { type:'ankan', actor: 3,
                           consumed:['N','N','N','N'] });
    });
    test('gang (加槓)', ()=>{
        const convmsg = init();
        convmsg({ dapai: { l: 2, p:'p5' } });
        convmsg({ fulou: { l: 0, m: 'p505=' } });
        assert.deepEqual(convmsg({ gang: { l: 0, m: 'p505=5' } }),
                         { type:'kakan', actor: 1,
                           pai:'5p', consumed:['5p','5pr','5p'],
                           possible_actions:[] });
    });
    test('gang (加槓、自分)', ()=>{
        const convmsg = init({shoupai:'m123p406s3789z1,s333-'});
        assert.deepEqual(convmsg({ gang: { l: 1, m: 's333-3' } }),
                         { type:'kakan', actor: 2,
                           pai:'3s', consumed:['3s','3s','3s'] });
    });

    test('gangzimo (マスクあり)', ()=>{
        const convmsg = init();
        assert.deepEqual(convmsg({ gangzimo: { l: 2, p: '' } }),
                         { type:'tsumo', actor: 3, pai:'?' });
    });
    test('gangzimo (マスクなし)', ()=>{
        const convmsg = init();
        let msg = convmsg({ gangzimo: { l: 1, p: 'm2' } });
        delete msg.possible_actions;
        assert.deepEqual(msg, { type:'tsumo', actor: 2, pai:'2m' });
    });

    test('kaigang', ()=>{
        const convmsg = init();
        assert.deepEqual(convmsg({ kaigang: { baopai: 'p7' } }),
                         { type:'dora', dora_marker:'7p' });
    });

    test('hule (ツモ和了)', ()=>{
        const convmsg = init();
        assert.deepEqual(
            convmsg({ hule: {
                        l: 3, shoupai:'m13567p123406z33m2', baojia: null,
                        fubaopai:['p8'], fu: 30, fanshu: 3, defen: 4000,
                        hupai: [ { name:'立直', fanshu: 1 },
                                 { name:'門前清自摸和', fanshu: 1 },
                                 { name: '赤ドラ', fanshu: 1 } ],
                        fenpei:[ -1100, -2100, -1100, 6300 ] } }),
            { type:'hora', actor: 0, target: 0, pai:'2m',
                    uradora_markers:['8p'],
                    hora_tehais:['1m','3m','5m','6m','7m','1p','2p','3p',
                                 '4p','5pr','6p','W','W','2m'],
                    yakus:[ ['立直', 1 ],
                            ['門前清自摸和', 1 ],
                            ['赤ドラ', 1 ] ],
                    fu: 30, fan: 3, hora_points: 4000,
                    deltas:[ 6300, -1100, -2100, -1100 ],
                    scores:[ 31300, 23900, 22900, 23900 ] });
    });
    test('hule (ロン和了、裏ドラなし)', ()=>{
        const convmsg = init();
        assert.deepEqual(
            convmsg({ hule: {
                        l: 3, shoupai:'m13567p123z33m2,z777+', baojia: 0,
                        fubaopai: null, fu: 30, fanshu: 1, defen: 1000,
                        hupai: [ { name:'翻牌', fanshu: 1 } ],
                        fenpei:[ -1300, 0, 0, 1300 ] } }),
            { type:'hora', actor: 0, target: 1, pai:'2m',
                    uradora_markers:[],
                    hora_tehais:['1m','3m','5m','6m','7m','1p','2p','3p',
                                 'W','W'],
                    yakus:[ ['翻牌', 1] ],
                    fu: 30, fan: 1, hora_points: 1000,
                    deltas:[ 1300, -1300, 0, 0 ],
                    scores:[ 26300, 23700, 25000, 25000 ] });
        });
    test('hule (役満)', ()=>{
        const convmsg = init();
        assert.deepEqual(
            convmsg({ hule: {
                        l: 2, shoupai:'m123p88z77z7,z555+,z666-', baojia: 0,
                        fubaopai: null, damanguan:'*', defen: 32000,
                        hupai: [ { name:'大三元', fanshu: '*' } ],
                        fenpei:[ -32000, 0, 32000, 0 ] } }),
            { type:'hora', actor: 3, target: 1, pai:'C',
                    uradora_markers:[],
                    hora_tehais:['1m','2m','3m','8p','8p','C','C'],
                    yakus:[ ['大三元', 13] ],
                    fu: 20, fan: 13, hora_points: 32000,
                    deltas:[ 0, -32000, 0, 32000 ],
                    scores:[ 25000, -7000, 25000, 57000 ] });
    });

    test('pingju', ()=>{
        const convmsg = init();
        assert.deepEqual(
            convmsg({ pingju: { name: '荒牌平局',
                        shoupai:['','',
                                 'm13567p123z33,z777=','m13567p123406z33'],
                        fenpei:[ -1500, -1500, 1500, 1500 ] } }),
            { type:'ryukyoku', reason:'荒牌平局',
                      tehais:[ ['1m','3m','5m','6m','7m','1p','2p','3p',
                                '4p','5pr','6p','W','W'],
                               ['?','?','?','?','?','?','?','?','?','?',
                                '?','?','?'],
                               ['?','?','?','?','?','?','?','?','?','?',
                                '?','?','?'],
                               ['1m','3m','5m','6m','7m','1p','2p','3p',
                                'W','W'] ],
                      tenpais:[ true, false, false, true ],
                      deltas:[ 1500, -1500, -1500, 1500 ],
                      scores:[ 26500, 23500, 23500, 26500 ] });
    });

    test('jieju', ()=>{
        const convmsg = init();
        assert.deepEqual(
            convmsg({ jieju: { defen:[ 10000, 20000, 30000, 40000 ] } }),
            { type:'end_game', scores:[ 10000, 20000, 30000, 40000 ] });
    });

    test('未知の通知', ()=>{
        const convmsg = converter.convmsg();
        assert.equal(convmsg({ type:'none' }), null);
    });

    test('引数なしの場合、卓情報を返す', ()=>{
        const convmsg = converter.convmsg();
        assert.notEqual(convmsg(), null);
    });

    suite('possible_actions()', ()=>{

        test('possible_hule (和了形なし)', ()=>{
            const convmsg = init({ shoupai:'m123p123s1234z123' });
            assert.deepEqual(
                convmsg({ zimo: { l: 1, p:'s5' } }).possible_actions
                                            .filter(r => r.type != 'dahai'),
                []);
        });
        test('possible_hule (役なし)', ()=>{
            const convmsg = init({ shoupai:'m123p123s1234,s999-' });
            assert.deepEqual(
                convmsg({ zimo: { l: 1, p:'s1' } }).possible_actions
                                            .filter(r => r.type != 'dahai'),
                []);
        });
        test('possible_hule (役なし、嶺上開花)', ()=>{
            const convmsg = init({ shoupai:'m123p123s1234,s999-' },
                                [{ zimo: { l: 1, p:'s9'} },
                                 { gang: { l: 1, m:'s999-9' } }]);
            assert.deepEqual(
                convmsg({ gangzimo: { l: 1, p:'s1' } }).possible_actions
                                            .filter(r => r.type != 'dahai'),
                [{ type:'hora', actor: 2, target: 2, pai:'1s' }]);
        });
        test('possible_hule (役なし、槍槓)', ()=>{
            const convmsg = init({ shoupai:'m123p123s2345,s999-' },
                                [{ dapai: { l: 2, p:'s1'} },
                                 { fulou: { l: 3, m:'s111-'} },
                                 { zimo: { l: 1, p: 's4' } },
                                 { dapai: { l: 1, p:'s5' } },
                                 { zimo: { l: 3, p:'' } }]);
            assert.deepEqual(
                convmsg({ gang: { l: 3, m:'s111-1' } }).possible_actions,
                [{ type:'hora', actor: 2, target: 0, pai:'1s' }]);
        });
        test('possible_hule (役なし、ハイテイ)', ()=>{
            const convmsg = init({ shoupai:'m123p123s1234,s999-' });
            while (convmsg().shan.paishu > 0) {
                convmsg({ zimo: { l: 0, p:'' } });
            }
            assert.deepEqual(
                convmsg({ dapai: { l : 0, p:'s4' } }).possible_actions,
                [{ type:'hora', actor: 2, target: 1, pai:'4s' }]);
        });
        test('possible_hule (役あり、ツモ)', ()=>{
            const convmsg = init({ shoupai:'m123p123s1234,s999-' });
            assert.deepEqual(
                convmsg({ zimo: { l: 1, p:'s4' } }).possible_actions
                                            .filter(r => r.type != 'dahai'),
                [{ type:'hora', actor: 2, target: 2, pai:'4s' }]);
        });
        test('possible_hule (役あり、ロン)', ()=>{
            const convmsg = init({ shoupai:'m123p123s1234,s999-' });
            assert.deepEqual(
                convmsg({ dapai: { l: 3, p:'s4' } }).possible_actions,
                [{ type:'hora', actor: 2, target: 0, pai:'4s' }]);
        });
        test('possible_hule (役あり、フリテン)', ()=>{
            const convmsg = init({ shoupai:'m123p123s1234,s999-' },
                                [{ zimo: { l: 1, p:'s1' } },
                                 { dapai: { l: 1, p:'s1_' } }]);
            assert.deepEqual(
                convmsg({ dapai: { l: 2, p:'s4' } }).possible_actions,
                []);
        });
        test('possible_hule (役あり、フリテン(見逃し))', ()=>{
            const convmsg = init({ shoupai:'m123p123s1234,s999-' },
                                [{ dapai: { l: 2, p:'s1' } }]);
            assert.deepEqual(
                convmsg({ dapai: { l: 3, p:'s4' } }).possible_actions,
                []);
        });
        test('possible_hule (役あり、フリテン(加槓見逃し))', ()=>{
            const convmsg = init({ shoupai:'m123p123s23999z12' },
                                [{ dapai: { l: 2, p:'s4' } },
                                 { fulou: { l: 3, m:'s444-' } },
                                 { zumo: { l: 1, p:'z1' } },
                                 { dapai: { l: 1, p:'z2' } },
                                 { gang: { l: 3, m:'s444-4'} }]);
            assert.deepEqual(
                convmsg({ dapai: { l: 2, p:'s1' } }).possible_actions,
                []);
        });
        test('possible_hule (役あり、フリテン(見逃し → 解消))', ()=>{
            const convmsg = init({ shoupai:'m123p123s1234,s999-' },
                                [{ dapai: { l: 2, p:'s1' } },
                                 { zimo: { l: 1, p:'z5' } },
                                 { dapai: { l: 1, p:'z5_'} }]);
            assert.deepEqual(
                convmsg({ dapai: { l: 3, p:'s4' } }).possible_actions,
                [{ type:'hora', actor: 2, target: 0, pai:'4s' }]);
        });
        test('possible_hule (役あり、フリテン(リーチ後見逃し))', ()=>{
            const convmsg = init({ shoupai:'m123p123s23999z12' },
                                [{ zimo: { l: 1, p:'z1' } },
                                 { dapai: { l: 1, p:'z2*' } },
                                 { dapai: { l: 2, p:'s4' } },
                                 { zimo: { l: 1, p:'z5' } },
                                 { dapai: { l: 1, p:'z5_' } }]);
            assert.deepEqual(
                convmsg({ dapai: { l: 3, p:'s1' } }).possible_actions,
                []);
        });

        test('possible_fulou (チー)', ()=>{
            const convmsg = init({ shoupai:'m123p123s23999z12' });
            assert.deepEqual(
                convmsg({ dapai: { l: 0, p:'s4' } }).possible_actions,
                [{ type:'chi', actor: 2, target: 1, pai:'4s',
                   consumed:['2s','3s'] }]);
        });
        test('possible_fulou (ポン)', ()=>{
            const convmsg = init({ shoupai:'m123p123s2399z123' });
            assert.deepEqual(
                convmsg({ dapai: { l: 3, p:'s9' } }).possible_actions,
                [{ type:'pon', actor: 2, target: 0, pai:'9s',
                   consumed:['9s','9s'] }]);
        });
        test('possible_fulou (大明槓)', ()=>{
            const convmsg = init({ shoupai:'m123p123s23999z12' });
            assert.deepEqual(
                convmsg({ dapai: { l: 2, p:'s9' } }).possible_actions,
                [{ type:'daiminkan', actor: 2, target: 3, pai:'9s',
                   consumed:['9s','9s','9s'] },
                 { type:'pon', actor: 2, target: 3, pai:'9s',
                   consumed:['9s','9s'] }]);

        });

        test('possible_gang (暗槓)', ()=>{
            const convmsg = init({ shoupai:'m123p123s23999z12' });
            assert.deepEqual(
                convmsg({ zimo: { l: 1, p:'s9' } }).possible_actions
                                            .filter(r => r.type != 'dahai'),
                [{ type:'ankan', actor: 2,
                   consumed:['9s','9s','9s','9s'] }]);
        });
        test('possible_gang (加槓)', ()=>{
            const convmsg = init({ shoupai:'m123s23z12,s999-,p1111' });
            assert.deepEqual(
                convmsg({ gangzimo: { l: 1, p:'s9' } }).possible_actions
                                            .filter(r => r.type != 'dahai'),
                [{ type:'kakan', actor: 2, pai:'9s',
                   consumed:['9s','9s','9s'] }]);
        });

        test('possible_lizhi', ()=>{
            const convmsg = init({ shoupai:'m123p123s1234999' });
            assert.deepEqual(
                convmsg({ zimo: { l: 1, p:'s5' } }).possible_actions
                                            .filter(r => r.type != 'dahai'),
                [{ type:'reach', actor: 2 }]);
        });
        test('possible_lizhi (リーチ宣言)', ()=>{
            const convmsg = init({ shoupai:'m123p123s123499z1' },
                                [{ zimo: { l: 1, p:'s5' } }]);
            assert.deepEqual(
                convmsg({ mjai: { type:'reach', actor: 2 } }).possible_actions,
                [{ type:'dahai', actor: 2, pai:'E', tsumogiri: false }]);
        });
        test('possible_lizhi (誤ったリーチ宣言)', ()=>{
            const convmsg = init({ shoupai:'m123p123s123489z1' },
                                [{ zimo: { l: 1, p:'s5' } }]);
            assert.deepEqual(
                convmsg({ mjai: { type:'reach', actor: 2 } }).possible_actions,
                []);
        });

        test('possible_pingju', ()=>{
            const convmsg = init({ shoupai:'m19p123s6789z4567' });
            assert.deepEqual(
                convmsg({ zimo: { l: 1, p:'s1' } }).possible_actions
                                            .filter(r => r.type != 'dahai'),
                [{ type: 'ryukyoku', actor: 2, reason: 'kyushukyuhai' }]);
        });

        test('possible_dapai (ツモ)', ()=>{
            const convmsg = init({ shoupai:'m123p122s1233999' });
            assert.deepEqual(
                convmsg({ zimo: { l: 1, p:'m1' } }).possible_actions,
                [{ type:'dahai', actor: 2, pai:'1m', tsumogiri: false },
                 { type:'dahai', actor: 2, pai:'2m', tsumogiri: false },
                 { type:'dahai', actor: 2, pai:'3m', tsumogiri: false },
                 { type:'dahai', actor: 2, pai:'1p', tsumogiri: false },
                 { type:'dahai', actor: 2, pai:'2p', tsumogiri: false },
                 { type:'dahai', actor: 2, pai:'1s', tsumogiri: false },
                 { type:'dahai', actor: 2, pai:'2s', tsumogiri: false },
                 { type:'dahai', actor: 2, pai:'3s', tsumogiri: false },
                 { type:'dahai', actor: 2, pai:'9s', tsumogiri: false },
                 { type:'dahai', actor: 2, pai:'1m', tsumogiri: true }]);
        });
        test('possible_dapai (チー喰い替え)', ()=>{
            const convmsg = init({ shoupai:'m123p122s1233999' },
                                [{ dapai: { l: 0, p:'m4' } }]);
            assert.deepEqual(
                convmsg({ fulou: { l: 1, m:'m234-'} }).possible_actions,
                [{ type:'dahai', actor: 2, pai:'1p', tsumogiri: false },
                 { type:'dahai', actor: 2, pai:'2p', tsumogiri: false },
                 { type:'dahai', actor: 2, pai:'1s', tsumogiri: false },
                 { type:'dahai', actor: 2, pai:'2s', tsumogiri: false },
                 { type:'dahai', actor: 2, pai:'3s', tsumogiri: false },
                 { type:'dahai', actor: 2, pai:'9s', tsumogiri: false }]);
        });
        test('possible_dapai (大明槓)', ()=>{
            const convmsg = init({ shoupai:'m123p122s1233999' },
                                [{ dapai: { l: 3, p:'s9' } }]);
            assert.equal(convmsg({ fulou: { l: 1, m:'s9999='} }).deepEqual,
                         null);
        });
    })
});
