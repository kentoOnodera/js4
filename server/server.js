
//spotify-web-api-nodeというライブラリを使用
//https://github.com/thelinmichael/spotify-web-api-node
require("dotenv").config()
//require()で利用できるように
const express = require('express');

//corsとは違うオリジン同士でもリソースを共有すること
//https://zenn.dev/luvmini511/articles/d8b2322e95ff40
//https://qiita.com/chenglin/items/5e563e50d1c32dadf4c3
//https://javascript.keicode.com/newjs/what-is-cors.php
const cors = require('cors');

//歌詞の取得
const lyricsFinder = require('lyrics-finder');


//POST送信をしたあとに値を受け取る
// https://qiita.com/anoonoll/items/050ebb62143ada022a32
// const bodyParser = require('body-parser');

const SpotifyWebApi = require('spotify-web-api-node')

// express()を実行することでアプリケーションオブジェクトをapp変数に格納
const app = express();
app.use(cors())

//bodyParserはexpressのv4.16.0以降に標準搭載されていたのでこれでbodyParseは使わなくてよかった
///POST送信をしたあとに値を受け取る
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// 【express】リフレッシュを開いたときにリクエスト処理
app.post('/refresh' , (req, res) => {
  const refreshToken = req.body.refreshToken
  console.log("hi")
  const spotifyApi = new SpotifyWebApi({
    clientId: '',
    clientSecret: '',
    redirectUri: '',
    refreshToken
  })
  // 更新トークンを更新する関数
  // https://github.com/thelinmichael/spotify-web-api-node
  spotifyApi.refreshAccessToken().then(
    (data) => {
      //アクセストークンと期限切れをサーバーに返す
      //【express】サーバーにレスポンスを返すには res.jsonを使用
      // https://tech.chakapoko.com/nodejs/express/res-json.html
      res.json({
        accessToken: data.body.accessToken,
        expiresIn : data.body.expiresIn
      })
    }).catch((err) => {
      //【express】エラーが出た場合の処理
      //応答HTTPステータスコードをに設定しstatusCode、登録されたステータスメッセージをテキスト応答本文として送信
      // https://expressjs.com/ja/api.html
      console.log(err)
      console.log(refreshToken)
      res.sendStatus(400)
    })
})

//【express】ログインを開いたときにリクエスト処理
app.post('/login', (req, res) => {
  const code = req.body.code
  //spotify-web-api-nodeをしようしてどのクライアントでAPIを使用するか指定
  //Spotifyから取得したハードコードされた認証コードを使用
  //https://github.com/thelinmichael/spotify-web-api-node
  const spotifyApi = new SpotifyWebApi({
    clientId: '',
    clientSecret: '',
    redirectUri: ''
  })
  ////【spotify】アクセストークンと更新トークンを取得
  spotifyApi.authorizationCodeGrant(code).then((data) =>{
    //【express】レスポンスを返すには res.jsonを使用
    // https://tech.chakapoko.com/nodejs/express/res-json.html
    res.json({
      //【spotify】アクセストークン取得
      accessToken : data.body.access_token,
      //【spotify】更新トークン取得
      refreshToken : data.body.refresh_token,
      //【spotify】期限切れになる
      expiresIn : data.body.expires_in
    })
  }).catch(() =>{
    //【express】エラーが出た場合の処理
    //応答HTTPステータスコードをに設定しstatusCode、登録されたステータスメッセージをテキスト応答本文として送信
    // https://expressjs.com/ja/api.html
    res.sendStatus(400)
  })     
});

app.get("/lyrics", async (req, res) => {
  const lyrics =
    (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
  res.json({ lyrics })
})

//【express】ローカルホスト3001を指定してログインルートに移動
app.listen(3001)
