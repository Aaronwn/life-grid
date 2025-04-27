document.addEventListener('DOMContentLoaded', function () {
  // 创建日期时间显示元素
  const datetimeDisplay = document.createElement('div');
  datetimeDisplay.className = 'datetime-display';

  // 创建内部结构
  datetimeDisplay.innerHTML = `
    <div class="day-date" id="day-date"></div>
    <div class="time" id="time"></div>
    <div class="timezone" id="timezone"></div>
  `;

  // 添加到页面
  document.body.appendChild(datetimeDisplay);

  // 更新时间函数
  function updateDateTime() {
    const now = new Date();

    // 获取星期（中文）
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const dayName = days[now.getDay()];

    // 获取月份（中文）
    const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    const monthName = months[now.getMonth()];

    // 格式化日期
    const date = now.getDate();

    // 格式化时间
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // 获取时区信息
    const timezone = 'Asia/Beijing';
    const timezoneOffset = 8;
    const timezoneString = timezone + ' GMT+' + timezoneOffset;

    // 更新DOM
    document.getElementById('day-date').textContent = `${dayName} | ${monthName} ${date}`;
    document.getElementById('time').textContent = `${hours}:${minutes}:${seconds}`;
    document.getElementById('timezone').textContent = timezoneString;
  }

  // 立即更新一次
  updateDateTime();

  // 每秒更新一次
  setInterval(updateDateTime, 1000);
});
