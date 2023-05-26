// 监听 chrome.runtime.onMessage 事件
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // 判断消息类型以及其他必要的条件
  if (request.action === 'fetch_data') {
    let url = 'http://121.36.196.242:9998/checkURL'
    data = {
      url: request.url
    }
    console.log(data)
    // 使用 fetch() 函数完成 HTTP 请求
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (response.ok) {
          // 响应成功时执行的操作
          return response.json()
        } else {
          // 响应出错时执行的操作
          // throw new Error('网络请求出错')
          return { success: false, error: '网络请求出错' }
        }
      })
      .then((data) => {
        console.log('Success:', data)
        sendResponse({ success: true, data: data })
      })
      .catch((error) => {
        console.error('Error:', error)
        sendResponse({ success: false, error: error })
      })
    // 需要返回 true 来确保异步消息的正确传递
    return true
  }
})
