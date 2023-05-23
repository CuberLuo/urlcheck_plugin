// 监听 chrome.runtime.onMessage 事件
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // 判断消息类型以及其他必要的条件
  if (request.action === 'fetch_data') {
    if (request.url !== 'https://www.baidu.com/') {
      request.url = ''
    }

    let url = `http://mryb.zjut.edu.cn/htk/baseInfo/getDingDingConfig?url=${request.url}`
    // 使用 fetch() 函数完成 HTTP 请求
    fetch(url, { method: 'GET' })
      .then((response) => {
        if (response.ok) {
          // 响应成功时执行的操作
          return response.text()
        } else {
          // 响应出错时执行的操作
          throw new Error('网络请求出错')
        }
      })
      .then((data) => {
        sendResponse({ success: true, data: data })
      })
      .catch((error) => {
        alert('未知错误!')
        sendResponse({ success: false, error: error })
      })
    // 需要返回 true 来确保异步消息的正确传递
    return true
  }
})

function setSafeBadge() {
  chrome.browserAction.setBadgeText({ text: '安全' })
  chrome.browserAction.setBadgeBackgroundColor({ color: [0, 255, 0, 255] })
}

function setUnsafeBadge() {
  chrome.browserAction.setBadgeText({ text: '危险' })
  chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] })
}
