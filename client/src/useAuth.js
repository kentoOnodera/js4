//認証を使用するカスタムフックコーンポーネント

import React, { useEffect, useState } from 'react'
//HTTPS通信を簡単に行う
//https://ty-engineer.com/javascript/axios/
//https://qiita.com/ksh-fthr/items/2daaaf3a15c4c11956e9
import axios from 'axios'

export default function useAuth(code){
  //アクセストークン、更新トークン、ログに記録
  const[accessToken,setAccessToken] = useState()
  const[refreshToken,setRefreshToken] = useState()
  const[expiresIn,setExpiresIn] = useState()

  useEffect(()=>{
    //axiosをつかってhttp://localhostにアクセスすると
    //ローカルホスト3001を指定してログインルートに移動初回レンダリングのみ移動
    //非同期処理??https://qiita.com/ryosuketter/items/dd467f827c1b93a74d76
    axios.post("http://localhost:3001/login",{
      code,
    }).then(res =>{
      console.log(res.data)
      //それぞれのでーたをuseStateにセット
      setAccessToken(res.data.accessToken)
      setRefreshToken(res.data.refreshToken)
      setExpiresIn(res.data.expiresIn)
      //URLを操作して?以降を削除
      // https://qiita.com/PianoScoreJP/items/fa66f357419fece0e531
      window.history.pushState({}, null, "/")
    }).catch(() => {
      window.location = '/'
    })
  },[code])


  useEffect(() => {
    if(!refreshToken || !expiresIn) return
    //一定時間後に一度だけ特定の処理をおこなう
    const interval = setInterval(()=>{
      axios.post("http://localhost:3001/refresh",{
        refreshToken,
      }).then(res =>{
        console.log(res.data)
        //それぞれのでーたをuseStateにセット
        setAccessToken(res.data.accessToken)
        setExpiresIn(res.data.expiresIn)
        //URLを操作して?以降を削除
        // https://qiita.com/PianoScoreJP/items/fa66f357419fece0e531
        window.history.pushState({}, null, "/")
      }).catch(() => {
        window.location = '/'
      })
      //削除の1分前
    }, (expiresIn -60) * 1000)
    return () => clearInterval(interval)
    //期限切れる直前に更新トークンが変更という useEffectを作動
  },[refreshToken,expiresIn])
  //spotifyの様々なデータを取得するのに必要
  return accessToken
}
