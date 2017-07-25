<template>
    <div class="background" v-finger:pinch="pinch" @touchstart="touchstart" @touchmove="touchmove" v-finger:press-move="pressMove">
        <img ref="avatar" draggable="false" :style="imgStyle" class="avatar"  >
        <div v-if="loading" class="spinner">
          <div class="double-bounce1"></div>
          <div class="double-bounce2"></div>
        </div>
        <div v-else ref="mask" class="mask">
        </div>
    </div>
</template>

<script>
export default {
    props: ['url'],
    data() {
        return {
            loading: true,
            imgStyle: {
                left: 0,
                top: 0,
                width: '100%'
            },
            imgPosition: {
                left: 0,
                top: 0
            },
            limit: {
                maxLeft: 0,
                minLeft: 0,
                maxTop: 0,
                minTop: 0
            },
            drag: {
                x: NaN,
                y: NaN
            },
            scale: 100,
            imageData: null
        }
    },
    methods: {
        pinch(evt) {
            this.scale = this.scale * (1 + (evt.scale-1)/20);
            this.imgStyle.width = this.scale + '%';
            evt.preventDefault();
        },
        pressMove(evt) {
            this.imgPosition.left += evt.deltaX;
            this.imgPosition.top  += evt.deltaY;
            this.imgStyle.left = this.imgPosition.left + 'px';
            this.imgStyle.top = this.imgPosition.top + 'px';
            evt.preventDefault();
        },
        touchstart(event) {
            // const {clientX, clientY} = event.touches.item(0);
            // this.drag.x = clientX;
            // this.drag.y = clientY;
            event.preventDefault();
        },
        touchmove(event) {
            const {clientX, clientY} = event.touches.item(0);
            if (!isNaN(this.drag.x)) {
                const { x, y } = this.drag;
                this.imgPosition.left += clientX - x;
                this.imgPosition.top  += clientY - y;
                this.imgStyle.left = this.imgPosition.left + 'px';
                this.imgStyle.top = this.imgPosition.top + 'px';
                this.drag.x = clientX;
                this.drag.y = clientY;
            }
            event.preventDefault();
        },
        crop(cb) {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            const $avatar = this.$refs.avatar;
            const $mask = this.$refs.mask;

            // 图片向右移动的距离, $avatar.offsetLeft 初始为 0
            const dx = $mask.offsetLeft - $avatar.offsetLeft;
            // 图片向上移动的距离, $avatar.offsetTop 初始为 0
            const dy = $mask.offsetTop - $avatar.offsetTop;
            /**
             *   ................
             *   .     dx
             *   . dy ..........
             *   .    .        .
             *   .    .        .
             *   .    .        .
             *   .    ..........
             *   ................
             * 
             */

            const maskBounding = $mask.getBoundingClientRect();
            const avatarBounding = $avatar.getBoundingClientRect();

            const maskCrd = {
                y1: maskBounding.top,
                y2: maskBounding.top + $mask.clientHeight,
                x1: maskBounding.left,
                x2: maskBounding.left + $mask.clientWidth
            }
            const avatarCrd = {
                y1: avatarBounding.top,
                y2: avatarBounding.top + $avatar.clientHeight,
                x1: avatarBounding.left,
                x2: avatarBounding.left + $avatar.clientWidth
            }
            // 图片实际被裁剪部分
            let sx = maskBounding.left >= avatarBounding.left ? dx : 0;
            let sy = maskBounding.top >= avatarBounding.top ? dy : 0;
            let swidth = Math.min(avatarCrd.x2, maskCrd.x2) - Math.max(avatarCrd.x1, maskCrd.x1);
            let sheight = Math.min(avatarCrd.y2, maskCrd.y2) - Math.max(avatarCrd.y1, maskCrd.y1);
            let x = Math.max(0, avatarCrd.x1 - maskCrd.x1);
            let y = Math.max(0, avatarCrd.y1 - maskCrd.y1);

            // 由于实际裁剪的时候是按当前图片的尺寸作为原图片尺寸
            // 所以创建一个临时图片作为当前图片
            var tmpCanvas = document.createElement('canvas');
            var tmpContext = tmpCanvas.getContext('2d');
            tmpCanvas.width = $avatar.width;
            tmpCanvas.height = $avatar.height;
            tmpContext.drawImage($avatar, 0, 0, $avatar.naturalWidth, $avatar.naturalHeight, 0, 0, $avatar.width, $avatar.height);
            var tmpImg = document.createElement('img');
            tmpImg.onload = () => {
                canvas.width = $mask.clientWidth;
                canvas.height = $mask.clientHeight;
                context.drawImage(tmpImg, sx, sy, swidth, sheight, x, y, swidth, sheight);
                cb(canvas);
            }
            tmpImg.src = tmpCanvas.toDataURL();
        }
    },
    mounted() {
        // 由于 ios 图片的方向可能跟显示的不同, 所以根据图片的显示重新画一次
        const $avatar = this.$refs.avatar;
        const img = new Image();
        img.src = this.url;
        img.onload = () => {
            var tmpCanvas = document.createElement('canvas');
            var tmpContext = tmpCanvas.getContext('2d');
            tmpCanvas.width = img.naturalWidth;
            tmpCanvas.height = img.naturalHeight;
            tmpContext.drawImage(img, 0, 0, tmpCanvas.width, tmpCanvas.height, 0, 0, tmpCanvas.width, tmpCanvas.height);
            $avatar.onload = () => {
                this.loading = false;
            }
            $avatar.src = tmpCanvas.toDataURL();
        }
    },
    destroyed() {
        if (this.url) {
            URL.revokeObjectURL(this.url);
        }
    }
}
</script>

<style lang="stylus" scoped>
@import "../assets/funcs.styl"
.avatar
    position absolute

.background {
    position absolute
    top 0
    width 100%
    height 100%
    overflow hidden
}
.mask {
  position: absolute;
  top 50%
  left 50%
  width $width(400)
  height $height(400)
  margin-top $height(-200)
  margin-left $width(-200)
  box-shadow: 0 0 0 9999px rgba(0, 0, 255, 0.2);
}

.spinner {
  position: absolute;
  top 50%
  left 50%
  width $width(400)
  height $height(400)
  margin-top $height(-200)
  margin-left $width(-200)
}

.double-bounce1, .double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #333;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  
  -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
  animation: sk-bounce 2.0s infinite ease-in-out;
}

.double-bounce2 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

@-webkit-keyframes sk-bounce {
  0%, 100% { -webkit-transform: scale(0.0) }
  50% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bounce {
  0%, 100% { 
    transform: scale(0.0);
    -webkit-transform: scale(0.0);
  } 50% { 
    transform: scale(1.0);
    -webkit-transform: scale(1.0);
  }
}
</style>
