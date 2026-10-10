# mjai-converter

電脳麻将とMjaiのプロトコル変換

[電脳麻将プロトコル](https://github.com/kobalab/majiang-core/wiki/メッセージ) と [Mjaiプロトコル](https://gimite.net/pukiwiki/index.php?Mjai%20麻雀AI対戦サーバ) を相互に変換します。

## インストール
```bash
$ npm i @kobalab/mjai-converter
```
## 使用法
```javascript
const converter = require('@kobalab/mjai-converter');
```
## 提供機能

|　関数    | 機能
|:--------|:----------------------------
| convreq | 通知を Mjai → 電脳麻将 に変換
| convres | 応答を Mjai ← 電脳麻将 に変換
| convmsg | 通内を 電脳麻将 → Mjai に変換
| convrep | 応答を 電脳麻将 ← Mjai に変換

## ライセンス
[MIT](https://github.com/kobalab/mjai-converter/blob/master/LICENSE)

## 作者
[Satoshi Kobayashi](https://github.com/kobalab)
