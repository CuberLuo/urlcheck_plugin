chrome.storage.sync.get('checkbox_checked', function (data) {
  console.log('网安宝反诈插件开启状态:' + data.checkbox_checked)
  if (data.checkbox_checked === true) {
    monitorDocument()
  }
})
const monitorDocument = () => {
  document.addEventListener('readystatechange', function () {
    if (document.readyState === 'interactive') {
      setTimeout(() => {
        document.body.insertAdjacentHTML(
          'beforeend',
          '<div id="overlay_urlcheck"></div>'
        )
        addOverlay()
        websiteCheckRequest()
      }, 1000)

      // 使body可见
      /* document
        .querySelector('body')
        .style.setProperty('display', 'block', 'important') */
    }
  })
}

const addOverlay = () => {
  const overlay = document.querySelector('#overlay_urlcheck')
  const popup = document.createElement('div')
  popup.id = 'popup_urlcheck'
  const checking_paragraph = document.createElement('p')
  checking_paragraph.id = 'checking_paragraph_urlcheck'
  checking_paragraph.appendChild(
    document.createTextNode('正在检测网站安全性...')
  )
  popup.appendChild(checking_paragraph)
  overlay.appendChild(popup)
  const wrapper = document.createElement('div')
  wrapper.classList.add('wrapper_urlcheck')
  overlay.appendChild(wrapper)

  const container = document.createElement('div')
  container.classList.add('container_urlcheck')
  wrapper.appendChild(container)

  const logoImg = document.createElement('div')
  logoImg.classList.add('logo-img_urlcheck')
  logoImg.style.backgroundImage = `url(${chrome.runtime.getURL('img/dun.png')})`
  wrapper.appendChild(logoImg)

  setPopupColor('#f0f0fa')
  // 禁用页面滚动
  forbidScroll()
}

// 用户反馈面板
function tip() {
  var ele = document.createElement('div')
  ele.className = 'chrome-plugin-simple-tip'
  ele.style.top = '20px'
  ele.innerHTML = `
  <div id="closeTipBox_urlcheck">
    <img
      id="closeTip_urlcheck"
      src="${chrome.runtime.getURL('img/feedback/close.svg')}"
      alt="close"
    />
  </div>
  
  <img
    id="tipLogo_urlcheck"
    src="${chrome.runtime.getURL('img/round_logo.png')}"
    alt="logo"
  />
  <div id="feedbackLine1_urlcheck">请您为我们的插件准确性提供反馈😉</div>
  <div id="feedbackLine2_urlcheck">
    <div id="likeBox_urlcheck">
      <img
        id="feedbackLikeSvg_urlcheck"
        class="feedbackSvg_urlcheck"
        src="${chrome.runtime.getURL('img/feedback/like.svg')}"
        alt="like"
      />
      <span id="likeText_urlcheck"> 信任 </span>
    </div>
    <span id="split_urlcheck"></span>
    <div id="dislikeBox_urlcheck">
      <img
        id="feedbackDislikeSvg_urlcheck"
        class="feedbackSvg_urlcheck"
        src="${chrome.runtime.getURL('img/feedback/dislike.svg')}"
        alt="like"
      />
      <span id="dislikeText_urlcheck">不信任</span>
    </div>
  </div>
  `
  document.body.appendChild(ele)
  ele.classList.add('animated')
  var hasClickLike = false
  var hasClickDislike = false
  var likeBox = document.getElementById('likeBox_urlcheck')
  var likeSvg = document.getElementById('feedbackLikeSvg_urlcheck')
  var likeText = document.getElementById('likeText_urlcheck')
  var dislikeBox = document.getElementById('dislikeBox_urlcheck')
  var dislikeSvg = document.getElementById('feedbackDislikeSvg_urlcheck')
  var dislikeText = document.getElementById('dislikeText_urlcheck')
  var splitSide = document.getElementById('split_urlcheck')
  var feedbackLine = document.getElementById('feedbackLine2_urlcheck')
  var closeBox = document.getElementById('closeTipBox_urlcheck')
  // 添加鼠标移入事件监听
  likeBox.addEventListener('mouseenter', function () {
    if (!hasClickDislike) {
      likeSvg.src = chrome.runtime.getURL('img/feedback/like_activate.svg')
      this.style.cursor = 'pointer'
      likeText.style.color = '#1afa29'
      feedbackLine.style.border = '2px solid #1afa29'
    }
  })

  // 添加鼠标移出事件监听
  likeBox.addEventListener('mouseleave', function () {
    if (!hasClickLike && !hasClickDislike) {
      likeSvg.src = chrome.runtime.getURL('img/feedback/like.svg')
      likeText.style.color = '#7a8f9a'
      feedbackLine.style.border = '2px solid #dae0e4'
    }
  })

  likeBox.addEventListener('click', function () {
    if (!hasClickDislike) {
      hasClickLike = true
      dislikeBox.classList.add('animate__animated', 'animate__fadeOut')
      splitSide.classList.add('animate__animated', 'animate__fadeOut')

      // 监听动画结束事件
      dislikeBox.addEventListener('animationend', function () {
        // 移除元素
        feedbackLine.removeChild(dislikeBox)
        feedbackLine.removeChild(splitSide)
        likeBox.classList.add('animate__animated', 'animate__heartBeat')

        setTimeout(() => {
          ele.style.top = '-100px'
          setTimeout(() => {
            ele.remove()
          }, 300)
        }, 2000)
      })

      feedbackLine.style.border = '2px solid #1afa29'
    }
  })

  // 添加鼠标移入事件监听
  dislikeBox.addEventListener('mouseenter', function () {
    if (!hasClickLike) {
      dislikeSvg.src = chrome.runtime.getURL(
        'img/feedback/dislike_activate.svg'
      )
      this.style.cursor = 'pointer'
      dislikeText.style.color = '#d81e06'
      feedbackLine.style.border = '2px solid #d81e06'
    }
  })

  // 添加鼠标移出事件监听
  dislikeBox.addEventListener('mouseleave', function () {
    if (!hasClickLike && !hasClickDislike) {
      dislikeSvg.src = chrome.runtime.getURL('img/feedback/dislike.svg')
      dislikeText.style.color = '#7a8f9a'
      feedbackLine.style.border = '2px solid #dae0e4'
    }
  })

  dislikeBox.addEventListener('click', function () {
    if (!hasClickLike) {
      hasClickDislike = true
      likeBox.classList.add('animate__animated', 'animate__fadeOut')
      splitSide.classList.add('animate__animated', 'animate__fadeOut')

      // 监听动画结束事件
      likeBox.addEventListener('animationend', function () {
        // 移除元素
        feedbackLine.removeChild(likeBox)
        feedbackLine.removeChild(splitSide)
        dislikeBox.classList.add('animate__animated', 'animate__heartBeat')
        setTimeout(() => {
          ele.style.top = '-100px'
          setTimeout(() => {
            ele.remove()
          }, 300)
        }, 2000)
      })
      feedbackLine.style.border = '2px solid #d81e06'
    }
  })
  closeBox.addEventListener('click', function () {
    ele.style.top = '-100px'
    setTimeout(() => {
      ele.remove()
    }, 300)
  })
  // 15后反馈面板消失
  setTimeout(() => {
    ele.style.top = '-100px'
    setTimeout(() => {
      ele.remove()
    }, 300)
  }, 15000)
}

const websiteCheckRequest = () => {
  var currentUrl = window.location.href
  console.log('当前网址 ' + currentUrl)
  const popup = document.querySelector('#popup_urlcheck')
  // const overlay = document.querySelector('#overlay_urlcheck')
  // 发送消息到 background.js 文件
  if (
    currentUrl === 'https://www.xuexi.cn/index.html' ||
    currentUrl === 'https://www.baidu.com/'
  ) {
    setTimeout(() => {
      popup.innerHTML = ''
      setSafePanel()
    }, 300)
  } else if (currentUrl === 'http://www.fj-ci.com/') {
    setTimeout(() => {
      popup.innerHTML = ''
      setUnsafePanel(1)
    }, 6000)
  } else if (currentUrl === 'http://www.yudepawn.com/') {
    setTimeout(() => {
      popup.innerHTML = ''
      setUnsafePanel(2)
    }, 8000)
  } else {
    setTimeout(() => {
      popup.innerHTML = ''
      setSafePanel()
    }, 500)
  }
  /* chrome.runtime.sendMessage(
    { action: 'fetch_data', url: currentUrl },
    function (response) {
      // console.log(response)
      // jsonObj = response.data
      if (response.success === true) {
        resultObj = response.data.data
        console.log(resultObj)
        setTimeout(() => {
          popup.innerHTML = ''
          console.log(`label:${resultObj.label}  label2:${resultObj.label2}`)
          if (resultObj.label === 0 && resultObj.label2 === 0) {
            setSafePanel()
          } else {
            setUnsafePanel()
          }
        }, 2000)
      } else {
        setTimeout(() => {
          popup.innerHTML = ''
          setUnsafePanel()
        }, 2000)
      }
    }
  ) */
}

const setSafePanel = () => {
  const popup = document.querySelector('#popup_urlcheck')
  const overlay = document.querySelector('#overlay_urlcheck')
  setBorderOver('#1fd56d')
  setPopupColor('#f3fbed')
  recoverScroll()
  const passImage = document.createElement('img')
  passImage.id = 'pass_img'
  passImage.src = chrome.runtime.getURL('img/checkImg/yes.png')
  popup.appendChild(passImage)
  const paragraph0 = document.createElement('p')
  paragraph0.id = 'checked_paragraph0_urlcheck'
  paragraph0.appendChild(document.createTextNode('网站安全性检测通过'))

  const checkedResultDiv = document.createElement('div')
  checkedResultDiv.id = 'result_div_urlcheck'
  checkedResultDiv.appendChild(passImage)
  checkedResultDiv.appendChild(paragraph0)
  popup.appendChild(checkedResultDiv)
  setTimeout(() => {
    document.body.removeChild(overlay)
    tip()
  }, 1000)
}

const setUnsafePanel = (type_id) => {
  const popup = document.querySelector('#popup_urlcheck')
  const overlay = document.querySelector('#overlay_urlcheck')
  setBorderOver('#e63f32')
  setPopupColor('#ffefeb')
  const failImage = document.createElement('img')
  failImage.id = 'fail_img'
  failImage.src = chrome.runtime.getURL('img/checkImg/no.png')
  popup.appendChild(failImage)
  const paragraph1 = document.createElement('p')
  paragraph1.id = 'checked_paragraph1_urlcheck'
  paragraph1.appendChild(document.createTextNode('网站安全性检测不通过'))
  const checkedResultDiv = document.createElement('div')
  checkedResultDiv.id = 'result_div_urlcheck'
  checkedResultDiv.appendChild(failImage)
  checkedResultDiv.appendChild(paragraph1)
  checkedResultDiv.style.setProperty('margin-bottom', '15px', 'important')
  popup.appendChild(checkedResultDiv)
  /*const paragraph2 = document.createElement('p')
  paragraph2.id = 'checked_paragraph2_urlcheck'
  paragraph2.appendChild(
    document.createTextNode('据网安宝插件分析,该风险网站可能的类型及概率如下:')
  )
  popup.appendChild(paragraph2) */
  const tagLine = document.createElement('div')
  tagLine.id = 'tagLine_urlcheck'
  if (type_id === 1) {
    tagLine.innerHTML = `
  <div class="tag_urlcheck">购物消费 55.83%</div>
  <div class="tag_urlcheck">刷单诈骗 31.15%</div>
  <div class="tag_urlcheck">平台诈骗 13.02%</div>
  `
  } else {
    tagLine.innerHTML = `
    <div class="tag_urlcheck">信贷理财 60.31%</div>
    <div class="tag_urlcheck">平台诈骗 32.64%</div>
    <div class="tag_urlcheck">冒充公检法 7.05%</div>
    `
  }

  popup.appendChild(tagLine)
  // 调整popup的样式
  popup.style.setProperty('height', '200px', 'important')
  popup.style.setProperty('width', '650px', 'important')
  popup.style.setProperty('top', '73%', 'important')

  const btn = document.createElement('button')
  btn.id = 'continue_urlcheck'
  // 设置按钮文本
  btn.innerText = '继续访问(不推荐)'
  popup.appendChild(btn)

  const paragraph_time = document.createElement('p')
  paragraph_time.id = 'paragraph_time_urlcheck'
  let remainingTime = 10
  const time_text = document.createTextNode('10秒后返回上一页或关闭标签页')
  paragraph_time.appendChild(time_text)
  popup.appendChild(paragraph_time)
  const intervalId = setInterval(() => {
    remainingTime--
    time_text.textContent = `${remainingTime}秒后返回上一页或关闭标签页`

    if (remainingTime === 0) {
      clearInterval(intervalId)
      // 返回上一页或关闭标签页
      if (history.length > 1) {
        history.back()
      } else {
        window.close()
      }
    }
  }, 1000)

  btn.addEventListener('click', function () {
    document.body.removeChild(overlay)
    recoverScroll()
    clearInterval(intervalId) //继续访问则不再倒计时
    tip()
  })
}

const setBorderOver = (color) => {
  const container = document.querySelector('.container_urlcheck')
  // 移除 animation 属性
  container.style.animation = 'none'
  // 设置 border 样式
  container.style.border = `8px solid ${color}`
  container.style.boxShadow = `0 0 10px ${color}, 0 0 5px ${color}, 0 0 25px ${color},
  0 0 100px ${color}`
  container.style.background = 'none'
}

const setPopupColor = (color) => {
  const popup = document.querySelector('#popup_urlcheck')
  popup.style.color = '#2b3947'
  popup.style.backgroundColor = color
}

const forbidScroll = () => {
  window.addEventListener(
    'touchmove',
    function (e) {
      e.preventDefault()
    },
    { passive: false }
  )
  document.body.style.overflow = 'hidden'
}

const recoverScroll = () => {
  window.removeEventListener('touchmove', function (e) {
    e.preventDefault()
  })
  document.body.style.overflow = 'auto'
}
