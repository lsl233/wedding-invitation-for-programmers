<template>
  <div class="wedding">
    <Editor @openMapNavigation="openMapNavigation" />
  </div>
</template>

<script>
  import wx from 'weixin-js-sdk'
  import Editor from './components/Editor.vue'
  import http from './utils/http'

  export default {
    props: [],
    components: {
      Editor
    },
    name: 'Wedding',
    created() {
      this.initWX()
    },
    methods: {
      async initWX() {
        const data = await http.get('/wx/signature')
        wx.config({
          // debug: true, // 是否开启调试模式
          appId: data.appid, //appid:需与公众号一致
          timestamp: data.timestamp, // 时间戳
          nonceStr: data.noncestr, // 随机字符串
          signature: data.signature, // 签名
          jsApiList: [
              'onMenuShareAppMessage',
              'updateAppMessageShareData',
              'updateTimelineShareData',
              'openLocation'
          ] // 需要使用的JS接口列表
        })

        wx.ready(() => {
          wx.onMenuShareAppMessage({
            title: 'lishilei&ldd',
            desc: 'lishilei&ldd邀请你参加',
            link: window.location.href,
            imgUrl: 'https://lddd.fun/image/image-1.jpg',
          }, res => {
            console.log(res)
          });
          // wx.updateTimelineShareData({
          //   title: 'lishilei&ldd', // 分享标题
          //   link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          //   // imgUrl: 'https://www.zzes1314.cn/images/qrcode.png', // 分享图标
          // }, (res) => {
          //   alert(222)
          // })
        })
      },
      openMapNavigation() {
        /* eslint-disable */
        debugger
        wx.openLocation({
          latitude: 30.587948,
          longitude: 103.909978,
          name: '星宸航都国际酒店',
          address: '四川省成都市双流区航林路888号',
          scale: 15
        })
      }
    }
  }

</script>

<style lang="less">
@import './assets/base.less';
html,
body{
  height: 100%;
}
.wedding{
  position: relative;
  max-width: 568px!important;
  height: 100%;
  min-height: 100%;
  margin: 0 auto;
  background: #2B2B48;
  perspective: 500px;
}
</style>
