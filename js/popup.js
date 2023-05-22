$(document).ready(function () {
  const toggleSwitch = document.getElementById('toggle-switch')
  // 使用 Chrome 存储保存一个标志位，记录用户是否已经在之前打开过 Popup 页面
  chrome.storage.sync.get('hasOpenedPopupPage', function (data1) {
    if (!data1.hasOpenedPopupPage) {
      // 如果用户是第一次打开 Popup 页面
      toggleSwitch.checked = false // 将 toggleSwitch 的状态设置为 false
      chrome.storage.sync.set({ hasOpenedPopupPage: true }) // 标记用户已经打开过 Popup 页面
    } else {
      // 如果用户不是第一次打开 Popup 页面
      chrome.storage.sync.get('checkbox_checked', function (data2) {
        toggleSwitch.checked = data2.checkbox_checked
      })
    }
  })

  toggleSwitch.addEventListener('change', function () {
    const isChecked = toggleSwitch.checked
    chrome.storage.sync.set({ checkbox_checked: isChecked })
  })

  $('#help-button').click((e) => {
    alert('help...')
  })
})
