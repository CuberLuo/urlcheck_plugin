$(document).ready(function () {
  const toggleSwitch = document.getElementById('toggle-switch')
  // 使用 Chrome 存储保存一个标志位，记录用户是否已经在之前打开过 Popup 页面
  chrome.storage.sync.get('hasOpenedPopupPage', function (data1) {
    if (!data1.hasOpenedPopupPage) {
      // 如果用户是第一次打开 Popup 页面
      toggleSwitch.checked = false // 将 toggleSwitch 的状态设置为 false
      chrome.storage.sync.set({ hasOpenedPopupPage: true }) // 标记用户已经打开过 Popup 页面
      chrome.storage.sync.set({ hasSetPassword: false }) // 保存标记判断用户是否设置密码
    } else {
      // 如果用户不是第一次打开 Popup 页面
      chrome.storage.sync.get('checkbox_checked', function (data2) {
        toggleSwitch.checked = data2.checkbox_checked
      })
    }
  })

  toggleSwitch.addEventListener('change', function () {
    const isChecked = toggleSwitch.checked
    console.log(isChecked)
    chrome.storage.sync.set({ checkbox_checked: isChecked })
    chrome.storage.sync.get('hasSetPassword', function (hasPassword) {
      if (!hasPassword.hasSetPassword) {
        // 弹出提示框，让用户输入信息
        var userInput = prompt('为防止他人关闭网安宝反诈插件,请设置关闭密码：')
        // 检查用户是否输入了内容
        if (userInput != null && userInput != '' && userInput.length > 3) {
          alert('设置成功！')
          chrome.storage.sync.set({ userPassword: userInput }) // 储存用户密码
          chrome.storage.sync.set({ hasSetPassword: true }) // 用户已经设置密码
        } else {
          alert('设置失败!请输入四位以上密码')
          toggleSwitch.checked = false
          chrome.storage.sync.set({ checkbox_checked: false })
        }
      }

      chrome.storage.sync.get('checkbox_checked', function (data3) {
        if (hasPassword.hasSetPassword && !data3.checkbox_checked) {
          var userInput = prompt('请输入关闭密码：')
          chrome.storage.sync.get('userPassword', function (data4) {
            if (userInput != data4.userPassword) {
              alert('关闭失败！请输入正确的密码')
              toggleSwitch.checked = true
              chrome.storage.sync.set({ checkbox_checked: true })
            } else {
              chrome.storage.sync.set({ hasSetPassword: false }) // 清空密码
              chrome.storage.sync.set({ userPassword: null })
            }
          })
        }
      })
    })
  })

  $('#help-button').click((e) => {
    alert(
      '为守护您的网络安全,您可以创建密码以开启网安宝反诈插件,网安宝将实时为您拦截风险网站!'
    )
  })
})
