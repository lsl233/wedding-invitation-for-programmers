<template>
  <div class="wedding-invitation" :class="{ 'invitation-bounce':canOpen }">
    <div class="invitation-container" :class="{ 'invitation-down':isOpening }">
      <div class="invitation-cover">
        <div class="cover-content" :class="{'invitation-up':isOpening}">
          <div class="content-inside">
            <div class="cover"></div>
            <p>我们结婚啦！</p>
            <p><b>{{ options.gentlemen }} & {{ options.ladies }}</b></p>
            <p>时间：{{ options.time }}</p>
            <p @click="openMapNavigation">地点：<b>{{ options.address }}</b></p>
            <div @click="openMapNavigation" :style="`opacity: ${Number(isOpening)}`">
              <div id="map"></div>
            </div>
            <div class="content-inside-bless">
              <input
                  placeholder="写下你的祝福"
                  @keyup.enter="sendBarrage"
                  @focus="isFocused = true"
                  @blur="isFocused = false, hasEntered = false"
                  v-model="wish"
                  ref="wishInput"
              >
              <p v-if="!wish && isFocused && hasEntered">请输入祝福哦</p>
              <div>
                <button @click="sendBarrage">发送祝福弹幕</button>
                <button @click="closeInvitation">关闭</button>
              </div>
            </div>
          </div>

        </div>
        <div class="cover-inside-left" :class="{'opening':isOpening}"></div>
        <div class="cover-inside-right" :class="{'opening':isOpening}"></div>
        <img class="cover-inside-seal" src="../images/seal.png" @click="openInvitation"
             :class="{'invitation-flight':isOpening}">
      </div>
    </div>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import options from '../../options.json'

export default {
  props: ['canOpen'],
  data() {
    return {
      options,
      isOpening: false,
      wish: '',
      isFocused: false,
      hasEntered: false
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    // 打开邀请函
    openInvitation() {
      this.isOpening = true
    },
    closeInvitation() {
      this.isOpening = false
      setTimeout(() => {
        this.$emit('onClose')
      }, 660)
    },
    // 发送弹幕
    sendBarrage() {
      this.$nextTick(() => {
        this.hasEntered = true
        if (!this.wish) {
          return
        }
        this.isOpening = false
        this.$refs.wishInput.blur()
        setTimeout(() => {
          this.$emit('sendBarrage', this.wish)
        }, 660)
      })
    },
    async initMap() {
      const TMap = await this.loadMapScript()
      /* eslint-disable */
      // eslint-disable-next-line
      const center = new TMap.LatLng(30.587948, 103.909978)
      // eslint-disable-next-line

      const map = new TMap.Map(document.getElementById('map'), {
        center: center,
        zoom: 17.2,
        showControl: false,
        mapStyleId: 'style3'
      })

      map.on('click', this.openMapNavigation)

      const markerLayer = new TMap.MultiMarker({
        map: map,  //指定地图容器
        //样式定义
        styles: {
          //创建一个styleId为"myStyle"的样式（styles的子属性名即为styleId）
          "myStyle": new TMap.MarkerStyle({
            "width": 25,  // 点标记样式宽度（像素）
            "height": 35, // 点标记样式高度（像素）
          })
        },
        //点标记数据数组
        geometries: [{
          "id": "1",   //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
          "styleId": 'myStyle',  //指定样式id
          "position": center,  //点标记坐标位置
          "properties": {//自定义属性
            "title": "marker1"
          }
        }]
      })
    },
    loadMapScript() {
      /* eslint-disable */
      return new Promise((resolve, reject) => {
        window.initMap = () => {
          resolve(window.TMap)
        }
        var script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://map.qq.com/api/gljs?v=1.exp&key=CWRBZ-SYV6X-2RO4A-ZVNR3-D5SLZ-F4BV3&callback=initMap';
        document.body.appendChild(script)
      })
    },
    openMapNavigation() {
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
.wedding-invitation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 30px 20px;
  padding-top: 60px;
  z-index: 4;
  transform: scale(0.05);
  -webkit-transform: scale(0.05);
  opacity: 0;
  transition: transform 0.8s cubic-bezier(.26, 1.84, .39, .61), opacity 0.5s linear;
  -webkit-transition: -webkit-transform 0.8s cubic-bezier(.26, 1.84, .39, .61), opacity 0.5s linear;
  background-size: 100%;
  overflow: hidden;

  &.invitation-bounce {
    opacity: 1;
    transform: scale(1);
    -webkit-transform: scale(1);
  }

  .invitation-container {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s cubic-bezier(0.4, 0, 1, 1);
    -webkit-transition: -webkit-transform 0.6s cubic-bezier(0.4, 0, 1, 1);

    &.invitation-down {
      transform: translateY(20px);
      -webkit-transform: translateY(20px);
    }

    .invitation-cover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #D65047;
      border-radius: 10px;
      perspective: 500px;
      box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.15);

      .cover-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 10px 20px;
        transition: transform 0.6s cubic-bezier(0.4, 0, 1, 1);
        -webkit-transition: -webkit-transform 0.6s cubic-bezier(0.4, 0, 1, 1);

        &.invitation-up {
          transform: translateY(-60px);
          -webkit-transform: translateY(-60px);
        }

        .content-inside {
          height: 100%;
          padding: 20px;
          color: #a9895d;
          background-color: #FFF1DE;
          text-align: center;
          overflow: auto;

          .cover {
            background-image: url("/image/image-1.jpg");
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center center;
            height: 160px;
            width: 100%;
          }

          .content-inside-photo {
            width: 100%;
            margin-bottom: 10px;
            padding: 5px;
            border: 1px solid #f7debb;
          }

          p {
            margin-top: 0;
            margin-bottom: 5px;
          }

          .content-inside-bless {
            input {
              width: 100%;
              height: 35px;
              margin-bottom: 10px;
              outline: none;
              border: none;
              border-bottom: 1px solid #f7debb;
              color: #a9895d;
              background: transparent;

              &::-webkit-input-placeholder {
                color: #E8D1B1;
                font-size: 12px;
              }

              &::-moz-placeholder {
                color: #E8D1B1;
                font-size: 12px;
              }

              &:-ms-input-placeholder {
                color: #E8D1B1;
                font-size: 12px;
              }

              &:-moz-placeholder {
                color: #E8D1B1;
                font-size: 12px;
              }
            }

            > div {
              display: flex;

              button {
                width: 100%;
                height: 35px;
                color: #a9895d;
                background: #f7debb;
                border: none;
                outline: none;

                &:disabled {
                  opacity: 0.8;
                }

                &:first-child {
                  margin-right: 10px;
                  flex: 1;
                }

                &:last-child {
                  width: 60px;
                  border: 1px solid #f7debb;
                  background: transparent;
                }
              }
            }
          }
        }
      }

      .cover-inside-left {
        position: absolute;
        left: 0;
        top: 0;
        width: 70%;
        height: 100%;
        border-radius: 10px;
        background-color: #D65047;
        box-shadow: 5px 0 10px rgba(0, 0, 0, 0.2);
        z-index: 6;
        transition: transform 0.5s;
        -webkit-transition: -webkit-transform 0.5s;
        transform-origin: 0 50%;
        -webkit-transform-origin: 0 50%;

        &.opening {
          transform: rotate3d(0, 1, 0, -140deg);
          -webkit-transform: rotate3d(0, 1, 0, -140deg);
        }
      }

      .cover-inside-right {
        position: absolute;
        right: 0;
        top: 0;
        width: 40%;
        height: 100%;
        border-radius: 10px;
        background-color: #D65047;
        box-shadow: -5px 0 10px rgba(0, 0, 0, 0.2);
        z-index: 5;
        transition: transform 0.5s;
        -webkit-transition: -webkit-transform 0.5s;
        transform-origin: 100% 50%;
        -webkit-transform-origin: 100% 50%;

        &.opening {
          transform: rotate3d(0, 1, 0, 140deg);
          -webkit-transform: rotate3d(0, 1, 0, 140deg);
        }
      }

      .cover-inside-seal {
        position: absolute;
        left: 70%;
        bottom: 100px;
        width: 80px;
        height: 80px;
        margin-left: -40px;
        z-index: 7;
        transform-origin: 50% 50%;
        -webkit-transform-origin: 50% 50%;
        transition: all 0.8s cubic-bezier(0.4, 0, 1, 1);
        -webkit-transition: all 0.8s cubic-bezier(0.4, 0, 1, 1);

        &.invitation-flight {
          opacity: 0;
        }
      }
    }
  }
}
</style>
