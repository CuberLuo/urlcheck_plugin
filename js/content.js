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

var currentUrl = ''
const websiteCheckRequest = () => {
  currentUrl = window.location.href
  console.log('当前网址 ' + currentUrl)
  const popup = document.querySelector('#popup_urlcheck')
  // 发送消息到 background.js 文件
  chrome.runtime.sendMessage(
    { action: 'fetch_data', url: currentUrl },
    function (response) {
      // console.log(response)
      // jsonObj = response.data
      if (response.success === true) {
        resultObj = response.data.data
        console.log(resultObj)
        setTimeout(() => {
          popup.innerHTML = ''
          console.log(
            `labelList:${resultObj.labelList}  probList:${resultObj.probList}`
          )
          // 通过解构赋值获取resultObj中的值
          const { labelList, probList, intentionLabels } = resultObj
          if (resultObj.safe === 1) {
            setSafePanel()
          } else {
            setUnsafePanel(labelList, probList, intentionLabels)
          }
        }, 2000)
      } else {
        setTimeout(() => {
          popup.innerHTML = ''
          setNetErrorPanel()
        }, 2000)
      }
    }
  )
}

const setSafePanel = () => {
  const popup = document.querySelector('#popup_urlcheck')
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
    removeOverlay()
    tip()
  }, 1000)
}

const setNetErrorPanel = () => {
  const popup = document.querySelector('#popup_urlcheck')
  setBorderOver('#e63f32')
  setPopupColor('#ffefeb')
  recoverScroll()
  const failImage = document.createElement('img')
  failImage.id = 'fail_img'
  failImage.src = chrome.runtime.getURL('img/checkImg/no.png')
  popup.appendChild(failImage)
  const paragraph0 = document.createElement('p')
  paragraph0.id = 'checked_paragraph0_urlcheck'
  paragraph0.appendChild(document.createTextNode('网络请求失败'))

  const checkedResultDiv = document.createElement('div')
  checkedResultDiv.id = 'result_div_urlcheck'
  checkedResultDiv.appendChild(failImage)
  checkedResultDiv.appendChild(paragraph0)
  popup.appendChild(checkedResultDiv)
  setTimeout(() => {
    removeOverlay()
  }, 1000)
}

let isIntervalPaused = false
const setUnsafePanel = (labelList, probList, intentionLabels) => {
  const popup = document.querySelector('#popup_urlcheck')
  setBorderOver('#e63f32')
  /* #ffffe0 亮黄色 */
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
  const tagLine = document.createElement('div')
  tagLine.id = 'tagLine_urlcheck'
  const unsafeLabels = {
    1: '购物消费',
    2: '婚恋交友',
    3: '假冒身份',
    4: '钓鱼网站',
    5: '冒充公检法',
    6: '平台诈骗',
    7: '招聘兼职',
    8: '杀猪盘',
    9: '博彩赌博',
    10: '信贷理财',
    11: '刷单诈骗',
    12: '中奖诈骗'
  }
  const unsafeLabelList = labelList.map((num) => unsafeLabels[num])
  tagLine.innerHTML = `
    <div class="tag_urlcheck">${unsafeLabelList[0]} ${probList[0]}</div>
    <div class="tag_urlcheck">${unsafeLabelList[1]} ${probList[1]}</div>
    <div class="tag_urlcheck">${unsafeLabelList[2]} ${probList[2]}</div>
    `

  popup.appendChild(tagLine)
  // 调整popup的样式
  popup.style.setProperty('height', '250px', 'important')
  popup.style.setProperty('width', '700px', 'important')
  popup.style.setProperty('top', '75%', 'important')

  const btn = document.createElement('button')
  btn.id = 'continue_urlcheck'
  // 设置按钮文本
  btn.innerText = '继续访问(不推荐)'
  popup.appendChild(btn)

  const paragraph_time = document.createElement('p')
  paragraph_time.id = 'paragraph_time_urlcheck'
  let remainingTime = 300
  const time_text = document.createTextNode(
    `${remainingTime}秒后返回上一页或关闭标签页`
  )
  paragraph_time.appendChild(time_text)
  popup.appendChild(paragraph_time)
  const intervalId = setInterval(() => {
    if (!isIntervalPaused) {
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
    }
  }, 1000)

  btn.addEventListener('click', function () {
    removeOverlay()
    recoverScroll()
    clearInterval(intervalId) //继续访问则不再倒计时
    tip()
  })

  const recommendLine = document.createElement('div')
  recommendLine.id = 'recommendLine_urlcheck'
  recommendLine.innerHTML = `
    <span id="queryLabel_urlcheck">您可能在寻找：</span>
  `
  for (let i = 0; i < intentionLabels.length; i++) {
    const button = document.createElement('button')
    button.className = 'intention_btn_urlcheck'
    button.innerHTML = intentionLabels[i]
    button.onclick = function () {
      isIntervalPaused = true //倒计时暂停
      addPanelMask()
      recommendWebsiteRequest(currentUrl, intentionLabels[i])
    }
    recommendLine.appendChild(button)
  }
  popup.appendChild(recommendLine)
}

const addPanelMask = () => {
  const popup = document.querySelector('#popup_urlcheck')
  popup.classList.add('mask_urlcheck')
  const loadingSvg = document.createElement('img')
  loadingSvg.id = 'loadingSvg_urlcheck'
  loadingSvg.src = chrome.runtime.getURL('img/loading.svg')
  popup.appendChild(loadingSvg)
}
const removePanelMask = () => {
  const popup = document.querySelector('#popup_urlcheck')
  popup.classList.remove('mask_urlcheck')
  const loadingSvg = document.querySelector('#loadingSvg_urlcheck')
  if (loadingSvg) {
    popup.removeChild(loadingSvg)
  }
}

const recommendWebsiteRequest = (url, label) => {
  chrome.runtime.sendMessage(
    { action: 'fetch_recommendation', url: url, label: label },
    function (response) {
      if (response.success === true) {
        resultObj = response.data.data
        const { recommendUrlList, recommendUrlNameList, urlImageList } =
          resultObj
        console.log(recommendUrlList)
        console.log(recommendUrlNameList)
        console.log(urlImageList)
        setTimeout(() => {
          removePanelMask()
          isIntervalPaused = false
          const recommendLine = document.getElementById(
            'recommendLine_urlcheck'
          )
          recommendLine.innerHTML = ''
          const tableElement = document.createElement('table')
          tableElement.classList.add('recommendTable')
          for (let i = 0; i < recommendUrlList.length; i++) {
            if (i % 2 === 0) {
              const trElement = document.createElement('tr')
              for (let j = 0; j < 2; j++) {
                const tdElement = document.createElement('td')
                const linkElement = document.createElement('a')
                linkElement.href = recommendUrlList[i + j]
                linkElement.textContent = `${i + j + 1}. ${
                  recommendUrlList[i + j]
                }`
                linkElement.classList.add(
                  'urllink_urlcheck',
                  'recommendurl_urlcheck'
                )
                // 将链接元素添加到单元格中
                tdElement.appendChild(linkElement)
                // 将单元格添加到行中
                trElement.appendChild(tdElement)
              }
              tableElement.appendChild(trElement)
            }
          }
          recommendLine.appendChild(tableElement)
          addArrow()
          addRecommendContent(
            recommendUrlList,
            recommendUrlNameList,
            urlImageList
          )
        }, 1500)
      } else {
        removePanelMask()
      }
    }
  )
}

const addRecommendContent = (
  recommendUrlList,
  recommendUrlNameList,
  urlImageList
) => {
  const overlay = document.querySelector('#overlay_urlcheck')
  for (let i = 0; i < 4; i++) {
    const recommendUnit = document.createElement('div')
    recommendUnit.classList.add('recommendUnit_urlcheck')
    recommendUnit.classList.add(`recommendUnit${i}_urlcheck`)
    // 推荐网址的快照
    const websiteImg = document.createElement('img')
    websiteImg.classList.add('recommendWebsiteImg_urlcheck')
    websiteImg.classList.add(`recommendWebsiteImg${i}_urlcheck`)
    websiteImg.src = urlImageList[i]
    websiteImg.addEventListener('click', () => {
      window.location.href = recommendUrlList[i]
    })
    const websiteNameBtn = document.createElement('button')
    websiteNameBtn.classList.add('websiteNameBtn_urlcheck')
    // 推荐网址的名称
    websiteNameBtn.textContent = recommendUrlNameList[i]
    websiteNameBtn.addEventListener('click', () => {
      window.location.href = recommendUrlList[i]
    })
    recommendUnit.appendChild(websiteImg)
    recommendUnit.appendChild(websiteNameBtn)
    overlay.appendChild(recommendUnit)
    const arrowCanvas = document.getElementById('arrowCanvas_urlcheck')
    let canvasOpacity=0
    setTimeout(() => {//0.1s后再将recommendUnit的不透明度设置为100%防止原有的css属性还未注入
      if(i==0){
        recommendUnit.style.transform = 'translate(-230%, -240%) scale(1)';
      }else if(i==1){
        recommendUnit.style.transform = 'translate(130%, -240%) scale(1)';
      }else if(i==2){
        recommendUnit.style.transform = 'translate(-230%, -35%) scale(1)';
      }else if(i==3){
        recommendUnit.style.transform = 'translate(130%, -35%) scale(1)';
      }
      recommendUnit.style.opacity='1'

      let timer = setInterval(() => {
        if (canvasOpacity >= 1) {
          clearInterval(timer);
        } else {
          canvasOpacity += 0.1; // 每次增加的透明度值
          arrowCanvas.style.opacity = canvasOpacity;
        }//总共3s从不透明度0到1
      }, 300); // 每隔300毫秒改变一次透明度
    }, 100);
  }
}

const addArrow = () => {
  const overlay = document.querySelector('#overlay_urlcheck')
  const arrowCanvas = document.createElement('canvas')
  arrowCanvas.id = 'arrowCanvas_urlcheck'
  arrowCanvas.width = window.innerWidth
  arrowCanvas.height = window.innerHeight
  const context = arrowCanvas.getContext('2d')
  context.strokeStyle = '#fedd00'
  context.lineWidth = 3
  /* 第一个折线箭头 */
  let startPointX = 530
  let startPointY = 692
  let middlePointX = startPointX
  let middlePointY = 220
  let endPointX = 320
  let endPointY = middlePointY
  // 垂直方向的线
  context.moveTo(startPointX, startPointY)
  context.lineTo(middlePointX, middlePointY)
  // 水平方向的线
  context.lineTo(endPointX, endPointY)
  context.stroke()
  // 绘制箭头
  context.save() // 保存当前状态
  context.translate(endPointX, endPointY)
  context.beginPath()
  context.moveTo(20, -10)
  context.lineTo(0, 0)
  context.lineTo(20, 10)
  context.stroke()

  /* 第二个折线箭头 */
  startPointX = 910
  startPointY = 692
  middlePointX = startPointX
  middlePointY = 220
  endPointX = 1200
  endPointY = middlePointY
  context.restore() // 恢复到原点
  // 垂直方向的线
  context.moveTo(startPointX, startPointY)
  context.lineTo(middlePointX, middlePointY)
  // 水平方向的线
  context.lineTo(endPointX, endPointY)
  context.stroke()
  // 绘制箭头
  context.save() // 保存当前状态
  context.translate(endPointX, endPointY)
  context.beginPath()
  context.moveTo(-20, -10)
  context.lineTo(0, 0)
  context.lineTo(-20, 10)
  context.stroke()

  /* 第三个折线箭头 */
  startPointX = 530
  startPointY = 715
  let middlePoint1X = startPointX
  let middlePoint1Y = 780
  let middlePoint2X = 180
  let middlePoint2Y = middlePoint1Y
  endPointX = middlePoint2X
  endPointY = 730
  context.restore() // 恢复到原点
  // 垂直方向的线
  context.moveTo(startPointX, startPointY)
  context.lineTo(middlePoint1X, middlePoint1Y)
  // 水平方向的线
  context.lineTo(middlePoint2X, middlePoint2Y)
  // 垂直方向的线
  context.lineTo(endPointX, endPointY)
  context.stroke()
  // 绘制箭头
  context.save() // 保存当前状态
  context.translate(endPointX, endPointY)
  context.beginPath()
  context.moveTo(-10, 20)
  context.lineTo(0, 0)
  context.lineTo(10, 20)
  context.stroke()

  /* 第四个折线箭头 */
  startPointX = 880
  startPointY = 715
  middlePoint1X = startPointX
  middlePoint1Y = 780
  middlePoint2X = 1260
  middlePoint2Y = middlePoint1Y
  endPointX = middlePoint2X
  endPointY = 730
  context.restore() // 恢复到原点
  // 垂直方向的线
  context.moveTo(startPointX, startPointY)
  context.lineTo(middlePoint1X, middlePoint1Y)
  // 水平方向的线
  context.lineTo(middlePoint2X, middlePoint2Y)
  // 垂直方向的线
  context.lineTo(endPointX, endPointY)
  context.stroke()
  // 绘制箭头
  context.save() // 保存当前状态
  context.translate(endPointX, endPointY)
  context.beginPath()
  context.moveTo(-10, 20)
  context.lineTo(0, 0)
  context.lineTo(10, 20)
  context.stroke()
  overlay.appendChild(arrowCanvas)
}
//移除遮罩
const removeOverlay = () => {
  const overlay = document.querySelector('#overlay_urlcheck')
  document.body.removeChild(overlay)
}

// 设置加载环的颜色
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

// 设置面板的颜色
const setPopupColor = (color) => {
  const popup = document.querySelector('#popup_urlcheck')
  popup.style.color = '#2b3947'
  popup.style.backgroundColor = color
}

// 禁止页面滚动
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

// 恢复页面滚动
const recoverScroll = () => {
  window.removeEventListener('touchmove', function (e) {
    e.preventDefault()
  })
  document.body.style.overflow = 'auto'
}
