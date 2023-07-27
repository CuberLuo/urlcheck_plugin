// 监听 chrome.runtime.onMessage 事件
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // 判断消息类型
  if (request.action === 'fetch_data') {
    // let url = 'http://121.36.196.242:9998/checkURL'
    let url = 'http://localhost:3000/checkURL'
    data = {
      url: request.url
    }
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
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
    // 返回true来确保异步消息的正确传递
    return true
  } else if (request.action === 'fetch_recommendation') {
    let url = 'http://localhost:3000/getRecommendation'
    data = {
      url: request.url,
      label: request.label
    }
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
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
    return true
  }
})
