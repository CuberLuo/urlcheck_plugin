chrome.storage.sync.get('checkbox_checked', function (data) {
  if (data.checkbox_checked === true) {
    monitorDocument()
  }
})
const monitorDocument = () => {
  document.addEventListener('readystatechange', function () {
    if (document.readyState === 'interactive') {
      document.body.insertAdjacentHTML(
        'beforeend',
        '<div id="overlay_urlcheck"></div>'
      )
      addOverlay()
      // body.style.visibility = 'visible'
    }
    // else if (document.readyState === 'loading') {
    //   body.style.visibility = 'hidden'
    // }
  })
}

const addOverlay = () => {
  // const overlay = document.createElement('div')
  // overlay.id = 'overlay_urlcheck'
  // document.body.appendChild(overlay)
  const overlay = document.querySelector('#overlay_urlcheck')
  const popup = document.createElement('div')
  popup.id = 'popup_urlcheck'
  const checking_paragraph = document.createElement('p')
  checking_paragraph.id = 'checking_paragraph_urlcheck'
  checking_paragraph.appendChild(
    document.createTextNode('正在检测网站安全性...')
  )
  // popup.appendChild(document.createTextNode('正在检测网站安全性...'))
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
  // logoImg.style.backgroundImage = `url('chrome-extension://${chrome.runtime.id}/img/dun.png')`
  const imgUrl = chrome.runtime.getURL('img/dun.png')
  logoImg.style.backgroundImage = `url(${imgUrl})`
  wrapper.appendChild(logoImg)

  setPopupColor('#f0f0fa')
  // 禁用页面滚动
  forbidScroll()
  websiteCheckRequest()
}

var tipCount = 0
// 简单的消息通知
function tip(info) {
  info = info || ''
  var ele = document.createElement('div')
  ele.className = 'chrome-plugin-simple-tip'
  ele.style.top = tipCount * 70 + 20 + 'px'
  ele.innerHTML = `<div>${info}</div>`
  document.body.appendChild(ele)
  ele.classList.add('animated')
  tipCount++
  setTimeout(() => {
    ele.style.top = '-100px'
    setTimeout(() => {
      ele.remove()
      tipCount--
    }, 300)
  }, 10000)
}

window.addEventListener(
  'message',
  function (e) {
    console.log('收到消息：', e.data)
    if (e.data && e.data.cmd == 'message') {
      tip(e.data.data)
    }
  },
  false
)

const websiteCheckRequest = () => {
  var currentUrl = window.location.href
  console.log('当前网址 ' + currentUrl)
  const popup = document.querySelector('#popup_urlcheck')
  const overlay = document.querySelector('#overlay_urlcheck')
  // 发送消息到 background.js 文件
  chrome.runtime.sendMessage(
    { action: 'fetch_data', url: currentUrl },
    function (response) {
      console.log(response.data)
      jsonObj = JSON.parse(response.data)
      setTimeout(() => {
        popup.innerHTML = ''
        if (jsonObj.success == true) {
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
            window.postMessage(
              { cmd: 'message', data: '点击网安宝反诈插件为我们提供反馈😉' },
              '*'
            )
          }, 1000)
        } else {
          setBorderOver('#e63f32')
          setPopupColor('#ffefeb')
          const failImage = document.createElement('img')
          failImage.id = 'fail_img'
          failImage.src = chrome.runtime.getURL('img/checkImg/no.png')
          popup.appendChild(failImage)
          const paragraph1 = document.createElement('p')
          paragraph1.id = 'checked_paragraph1_urlcheck'
          paragraph1.appendChild(
            document.createTextNode('网站安全性检测不通过')
          )
          const checkedResultDiv = document.createElement('div')
          checkedResultDiv.id = 'result_div_urlcheck'
          checkedResultDiv.appendChild(failImage)
          checkedResultDiv.appendChild(paragraph1)
          popup.appendChild(checkedResultDiv)
          const paragraph2 = document.createElement('p')
          paragraph2.id = 'checked_paragraph2_urlcheck'
          paragraph2.appendChild(
            document.createTextNode('该网站疑似为诈骗网站 置信度: 88.8%')
          )
          popup.appendChild(paragraph2)
          popup.style.height = '120px'
          const btn = document.createElement('button')
          btn.id = 'continue_urlcheck'
          // 设置按钮文本
          btn.innerText = '继续访问(不推荐)'
          popup.appendChild(btn)

          const paragraph_time = document.createElement('p')
          paragraph_time.id = 'paragraph_time_urlcheck'
          let remainingTime = 10
          const time_text =
            document.createTextNode('10秒后返回上一页或关闭标签页')
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
            clearInterval(intervalId) //继续访问则不再倒计时
            window.postMessage(
              { cmd: 'message', data: '点击网安宝反诈插件为我们提供反馈😉' },
              '*'
            )
          })
        }
      }, 2000)
    }
  )
}

const setBorderOver = (color) => {
  const container = document.querySelector('.container_urlcheck')
  // 移除 animation 属性
  container.style.animation = 'none'
  // 设置 border 样式
  container.style.border = `8px solid ${color}`
}

const setPopupColor = (color) => {
  const popup = document.querySelector('#popup_urlcheck')
  popup.style.color = '#2b3947'
  popup.style.backgroundColor = color
}

const setPopupBgImg = (img_path) => {
  const popup = document.querySelector('#popup_urlcheck')
  const imgUrl = chrome.runtime.getURL(img_path)
  popup.style.backgroundImage = `url(${imgUrl})`
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

// 获取当前选项卡ID
function getCurrentTabId(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (callback) callback(tabs.length ? tabs[0].id : null)
  })
}
