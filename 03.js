// 加载动画
window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        // 加载完成后自动播放背景音乐（静音状态）
        const audio = document.getElementById('backgroundMusic');
        if (audio) {
            audio.volume = 0.3; // 默认音量30%
            audio.play().catch(err => {
                console.log('需用户交互后才能播放音乐：', err);
            });
        }
    }, 1500);

    // 标题渐入动画
    const title = document.querySelector('.title');
    if (title) {
        title.style.opacity = '0';
        title.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            title.style.transition = 'all 1s ease';
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }, 300);
    }

    // 初始化轮播
    initCarousel();
});

// 音乐控制按钮
const musicBtn = document.getElementById('musicBtn');
const audio = document.getElementById('backgroundMusic');

if (musicBtn && audio) {
   
    musicBtn.addEventListener('click', function() {
        isMuted = !isMuted;
        audio.muted = isMuted;

        if (isMuted) {
            musicBtn.innerHTML = '<i class="fa fa-volume-off" aria-hidden="true"></i> 开启音乐';
        } else {
            musicBtn.innerHTML = '<i class="fa fa-volume-up" aria-hidden="true"></i> 关闭音乐';
            // 确保音乐播放
            audio.play().catch(err => {
                alert('浏览器限制：需先点击页面任意位置才能播放音乐');
                isMuted = true;
                audio.muted = isMuted;
                musicBtn.innerHTML = '<i class="fa fa-volume-off" aria-hidden="true"></i> 开启音乐';
            });
        }
    });
}

// 剧情进度条（根据当前页面更新）
const updateProgressBar = () => {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;

    // 获取当前页面路径
    const path = window.location.pathname;
    let progress = 0;

    if (path.includes('climax1.html')) {
        progress = 33.33;
    } else if (path.includes('climax2.html')) {
        progress = 66.66;
    } else if (path.includes('climax3.html')) {
        progress = 100;
    } else if (path.includes('index.html')) {
        // 主页默认进度0，hover卡片时更新
        const climaxCards = document.querySelectorAll('.climax-card');
        climaxCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const climax = this.getAttribute('data-climax');
                progressBar.style.width = `${(climax - 1) * 33.33}%`;
            });
            card.addEventListener('mouseleave', function() {
                progressBar.style.width = '0%';
            });
        });
    }

    progressBar.style.width = `${progress}%`;
};

// 页面加载时更新进度条
updateProgressBar();

// 天气切换逻辑
const switchBtn = document.getElementById('switchWeather');
const rainBg = document.querySelector('.rain-bg');
const sunnyBg = document.querySelector('.sunny-bg');
const weatherIcon = document.querySelector('.weather-icon i');
const weatherStatus = document.querySelector('.weather-status');
const weatherDesc = document.querySelector('.weather-desc');

let isRainy = true;

if (switchBtn) {
    switchBtn.addEventListener('click', function() {
        if (isRainy) {
            rainBg.classList.remove('active');
            sunnyBg.classList.add('active');
            weatherIcon.className = 'fa fa-sun-o';
            weatherIcon.style.color = '#feb47b';
            weatherStatus.textContent = '晴天模式';
            weatherDesc.textContent = '「天气真的变晴了！」—— 帆高';
            switchBtn.innerHTML = '<i class="fa fa-cloud-rain" aria-hidden="true"></i> 恢复雨天';
            
            weatherStatus.classList.add('blink');
            setTimeout(() => {
                weatherStatus.classList.remove('blink');
            }, 2000);
        } else {
            sunnyBg.classList.remove('active');
            rainBg.classList.add('active');
            weatherIcon.className = 'fa fa-cloud-rain';
            weatherIcon.style.color = '#a7c0ff';
            weatherStatus.textContent = '雨天模式';
            weatherDesc.textContent = '「天气，是神明的心情」—— 阳菜';
            switchBtn.innerHTML = '<i class="fa fa-sun-o" aria-hidden="true"></i> 触发晴女之力';
        }
        isRainy = !isRainy;
    });
}

// 滚动动画（简介和剧情模块）
const movieIntro = document.querySelector('.movie-intro');
const climaxSection = document.querySelector('.climax-section');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(30px)';
            entry.target.style.transition = 'all 1s ease';
            
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 300);
            
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

if (movieIntro) observer.observe(movieIntro);
if (climaxSection) observer.observe(climaxSection);

// 海报点击放大
const moviePoster = document.getElementById('moviePoster');
let isEnlarged = false;
if (moviePoster) {
    moviePoster.addEventListener('click', function() {
        if (isEnlarged) {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.7)';
        } else {
            this.style.transform = 'scale(1.2)';
            this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.9)';
            this.style.zIndex = '10';
        }
        isEnlarged = !isEnlarged;
    });

    // 海报右键隐藏剧情
    moviePoster.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        alert('隐藏剧情：阳菜为了让东京放晴，选择成为天气的一部分...');
    });
}

// 子网页图片轮播逻辑
const initCarousel = () => {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;

    const carouselImgs = document.querySelector('.carousel-imgs');
    const imgItems = document.querySelectorAll('.carousel-img');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const indicators = document.querySelectorAll('.carousel-indicator');
    let currentIndex = 0;
    const imgCount = imgItems.length;

    // 更新轮播状态
    const updateCarousel = (index) => {
        carouselImgs.style.transform = `translateX(-${index * 100}%)`;
        indicators.forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        currentIndex = index;
    };

    // 下一张
    nextBtn.addEventListener('click', () => {
        const nextIndex = (currentIndex + 1) % imgCount;
        updateCarousel(nextIndex);
    });

    // 上一张
    prevBtn.addEventListener('click', () => {
        const prevIndex = (currentIndex - 1 + imgCount) % imgCount;
        updateCarousel(prevIndex);
    });

    // 指示器点击
    indicators.forEach((indicator, i) => {
        indicator.addEventListener('click', () => {
            updateCarousel(i);
        });
    });

    // 自动轮播（3秒切换一次）
    setInterval(() => {
        const nextIndex = (currentIndex + 1) % imgCount;
        updateCarousel(nextIndex);
    }, 3000);
};
// 新海诚子网页加载动画
window.addEventListener('load', function() {
    if (document.querySelector('.shinkai-intro')) {
        const loader = document.getElementById('loader');
        setTimeout(() => {
            loader.classList.add('hidden');
            // 音乐加载逻辑（延续主页状态）
            const audio = document.getElementById('backgroundMusic');
            if (audio) {
                audio.volume = 0.3;
                audio.play().catch(err => {
                    console.log('需用户交互后播放音乐：', err);
                });
            }
        }, 1500);
    }
});