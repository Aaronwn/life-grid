document.addEventListener('DOMContentLoaded', () => {
  // 滚动回顶部按钮
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });


  // DOM元素引用
  const generateBtn = document.getElementById('generate-btn');
  const currentAgeInput = document.getElementById('currentAge');
  const lifeExpectancyInput = document.getElementById('lifeExpectancy');
  const yearsGrid = document.getElementById('years-grid');
  const monthsGrid = document.getElementById('months-grid');
  const timeRemaining = document.getElementById('time-remaining');
  const yearsProgress = document.getElementById('years-progress');
  const monthsProgress = document.getElementById('months-progress');
  const daysRemaining = document.getElementById('days-remaining');
  const weeksRemaining = document.getElementById('weeks-remaining');
  const monthsRemaining = document.getElementById('months-remaining');

  // 从本地存储加载之前的数据
  const loadSavedData = () => {
    const savedAge = localStorage.getItem('currentAge');
    const savedExpectancy = localStorage.getItem('lifeExpectancy');

    if (savedAge) {
      currentAgeInput.value = savedAge;
    }

    if (savedExpectancy) {
      lifeExpectancyInput.value = savedExpectancy;
    }

    // 如果有保存的数据，自动生成网格
    if (savedAge && savedExpectancy) {
      generateLifeGrids(parseFloat(savedAge), parseInt(savedExpectancy));
    }
  };

  // 保存数据到本地存储
  const saveData = (age, expectancy) => {
    localStorage.setItem('currentAge', age);
    localStorage.setItem('lifeExpectancy', expectancy);
  };

  // 计算当前月份
  const getCurrentMonth = age => {
    const ageFraction = age - Math.floor(age);
    return Math.floor(ageFraction * 12);
  };

  // 计算当前年剩余时间
  const calculateCurrentYearRemaining = age => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0;
    const daysInYear = isLeapYear ? 366 : 365;

    // 计算今年已经过去的天数
    const startOfYear = new Date(currentYear, 0, 1);
    const daysPassed = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));

    // 计算剩余的天数
    const remainingDays = daysInYear - daysPassed;

    // 计算剩余的完整周数
    const remainingWeeks = Math.floor(remainingDays / 7);

    // 计算剩余的完整月数（从下个月开始算）
    const remainingMonths = 12 - (now.getMonth() + 1);

    return {
      days: remainingDays,
      weeks: remainingWeeks,
      months: remainingMonths,
    };
  };

  // 使用动画方式显示数字
  const animateNumber = (element, target, duration = 1200) => {
    const start = 0;
    const startTime = performance.now();

    function updateNumber(currentTime) {
      const elapsedTime = currentTime - startTime;

      if (elapsedTime > duration) {
        element.textContent = target;
        return;
      }

      const progress = elapsedTime / duration;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // 缓动函数
      const current = Math.floor(start + (target - start) * easeProgress);

      element.textContent = current;
      requestAnimationFrame(updateNumber);
    }

    requestAnimationFrame(updateNumber);
  };

  // 显示结果并添加动画效果
  const showResults = () => {
    // 添加显示动画类
    document.querySelectorAll('.stat-item, .grid-panel, .brief-info').forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';

      setTimeout(() => {
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * 100);
    });

  };

  // 生成生命网格
  const generateLifeGrids = (age, expectancy) => {
    // 清空之前的网格
    yearsGrid.innerHTML = '';
    monthsGrid.innerHTML = '';

    const totalMonthsLived = Math.floor(age * 12);
    const totalMonths = Math.floor(expectancy * 12);
    const currentMonth = getCurrentMonth(age);
    const currentYear = Math.floor(age);

    // 设置剩余时间统计
    const remainingMonths = totalMonths - totalMonthsLived;
    const remainingYears = Math.floor(remainingMonths / 12);
    const remainingMonthsInYear = Math.floor(remainingMonths % 12);
    const remainingDays = Math.floor(remainingMonths * 30.44);

    timeRemaining.innerHTML = `您已度过 <strong>${currentYear}</strong> 年 <strong>${currentMonth}</strong> 个月,
      剩余约 <strong>${remainingYears}</strong> 年 <strong>${remainingMonthsInYear}</strong> 个月 (相当于 <strong>${remainingMonths}</strong> 个月或 <strong>${remainingDays}</strong> 天)`;

    // 计算和显示年进度百分比
    const yearsProgressPercentage = Math.round((age / expectancy) * 100);
    yearsProgress.textContent = `${yearsProgressPercentage}%`;

    // 计算和显示月进度百分比
    const monthsProgressPercentage = Math.round((totalMonthsLived / totalMonths) * 100);
    monthsProgress.textContent = `${monthsProgressPercentage}%`;

    // 计算当前年份剩余时间
    const yearRemaining = calculateCurrentYearRemaining(age);

    // 使用动画显示数字
    animateNumber(daysRemaining, yearRemaining.days);
    animateNumber(weeksRemaining, yearRemaining.weeks);
    animateNumber(monthsRemaining, yearRemaining.months);

    // 生成年视图网格
    generateYearsGrid(age, expectancy);

    // 生成月视图网格
    generateMonthsGrid(age, expectancy);

    // 显示结果
    showResults();
  };

  // 生成年视图网格
  const generateYearsGrid = (age, expectancy) => {
    const currentYear = Math.floor(age);

    for (let year = 0; year <= expectancy; year++) {
      const box = document.createElement('div');
      box.className = 'year-box';

      // 在一小段延迟后添加类，创建动画效果
      setTimeout(() => {
        // 判断这个格子的状态：过去、当前、未来
        if (year < currentYear) {
          box.classList.add('years-past');
        } else if (year === currentYear) {
          box.classList.add('current');
        } else {
          box.classList.add('future');
        }
      }, year * 10);

      // 添加工具提示
      box.title = `${year} 岁`;

      yearsGrid.appendChild(box);
    }
  };

  // 生成月视图网格
  const generateMonthsGrid = (age, expectancy) => {
    const totalMonthsLived = Math.floor(age * 12);
    const totalMonths = Math.floor(expectancy * 12);

    // 简化月视图网格，不再显示当前高亮，只区分过去和未来
    for (let month = 0; month < totalMonths; month++) {
      const box = document.createElement('div');
      box.className = 'month-box';

      // 在一小段延迟后添加类，创建动画效果
      setTimeout(() => {
        // 只区分过去和未来两种状态
        if (month < totalMonthsLived) {
          box.classList.add('months-past');
        } else {
          box.classList.add('future');
        }
      }, Math.min(month, 500) * 2); // 限制最大延迟为1000ms

      // 添加工具提示，显示年龄和月份
      const yearValue = Math.floor(month / 12);
      const monthValue = month % 12;
      box.title = `${yearValue} 岁 ${monthValue + 1} 月`;

      monthsGrid.appendChild(box);
    }
  };

  // 表单提交处理
  generateBtn.addEventListener('click', e => {
    e.preventDefault();

    const currentAge = parseFloat(currentAgeInput.value);
    const lifeExpectancy = parseInt(lifeExpectancyInput.value);

    // 验证输入
    if (
      isNaN(currentAge) ||
      isNaN(lifeExpectancy) ||
      currentAge < 0 ||
      lifeExpectancy <= 0 ||
      currentAge >= lifeExpectancy
    ) {
      alert('请输入有效的年龄和期望寿命（期望寿命必须大于当前年龄）');
      return;
    }

    // 保存数据
    saveData(currentAge, lifeExpectancy);

    // 生成网格
    generateLifeGrids(currentAge, lifeExpectancy);
  });

  // 添加输入框动画效果
  document.querySelectorAll('.input-field input').forEach(input => {
    input.addEventListener('focus', () => {
      input.style.borderColor = 'var(--primary-color)';
      input.style.boxShadow = '0 0 0 3px rgba(33, 150, 243, 0.1)';
    });

    input.addEventListener('blur', () => {
      input.style.borderColor = 'rgba(0,0,0,0.1)';
      input.style.boxShadow = 'none';
    });
  });

  // 页面加载时尝试恢复之前的数据
  loadSavedData();
});
