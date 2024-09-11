<template>
  <div class="container">
    <div class="content">
      <h1>{{ lang === 'zh' ? 'SkyFetch' : 'SkyFetch' }}</h1>
      <div class="description">
        <p v-if="lang === 'zh'">SkyFetch 是一个简单易用的工具，<br>只需粘贴原始图片链接，即可快速获取 BlueSky 社交平台上图片的最高分辨率版本下载地址。</p>
        <p v-else>SkyFetch is a simple tool that allows you to quickly obtain the highest resolution download link for images from the BlueSky social platform by simply pasting the original image link.</p>
        <p v-if="lang === 'zh'">所有数据仅在您的浏览器本地处理，确保隐私安全。</p>
        <p v-else>All data is processed locally in your browser, ensuring privacy and security.</p>
      </div>
      <div class="card">
        <div class="input-group">
          <label>{{ lang === 'zh' ? '在新标签页打开的图片链接：' : 'Image link opened in a new tab:' }}<span v-if="invalidLink" class="error-message">{{ lang === 'zh' ? '无效链接' : 'Invalid link' }}</span></label>
          <input v-model="inputUrl" :placeholder="lang === 'zh' ? '粘贴BlueSky图片链接' : 'Paste BlueSky image link'" @input="checkLink" @keyup.enter="convertUrl" />
          <button @click="convertUrl">{{ lang === 'zh' ? '获取最高分辨率图像链接' : 'Get highest resolution image link' }}</button>
        </div>
        <div v-if="outputUrl" class="output-group">
          <label>
            {{ lang === 'zh' ? '最高分辨率图像链接：' : 'Highest resolution image link:' }}
            <span v-if="copySuccess" class="success-message">{{ lang === 'zh' ? '复制成功' : 'Copied' }}</span>
          </label>
          <input :value="outputUrl" readonly :class="{ 'copied': copySuccess }" />
          <button @click="copyUrl">{{ lang === 'zh' ? '复制' : 'Copy' }}</button>
        </div>
        <div class="reset-container">
          <button @click="clearAll" class="reset-btn" :title="lang === 'zh' ? '重置' : 'Reset'" :class="{ 'active': isResetActive }">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="reset-icon">
              <path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
            </svg>
          </button>
        </div>
      </div>
      <footer>
        <a href="https://github.com/CookSleep/SkyFetch" target="_blank">GitHub @CookSleep</a>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputUrl: '',
      outputUrl: '',
      invalidLink: false,
      isResetActive: false,
      copySuccess: false,
      lang: 'en'
    }
  },
  mounted() {
    this.initLanguage();
    this.addStructuredData();
    document.title = this.getTitle();
  },
  methods: {
    initLanguage() {
      const browserLang = navigator.language || navigator.userLanguage;
      this.lang = browserLang.startsWith('zh') ? 'zh' : 'en';
    },
    getTitle() {
      return this.lang === 'zh' 
        ? 'SkyFetch - 获取BlueSky高分辨率图片链接' 
        : 'SkyFetch - Get High-Resolution BlueSky Image Links';
    },
    convertUrl() {
      if (!this.inputUrl) return;
      
      try {
        const url = new URL(this.inputUrl);
        if (url.hostname !== 'cdn.bsky.app' || !url.pathname.includes('/img/feed_')) {
          throw new Error();
        }
        
        const parts = url.pathname.split('/');
        const did = parts.find(part => part.startsWith('did:'));
        const cid = parts[parts.length - 1].split('@')[0];
        
        if (!did || !cid) {
          throw new Error();
        }
        
        this.outputUrl = `https://bsky.social/xrpc/com.atproto.sync.getBlob?did=${did}&cid=${cid}`;
        this.invalidLink = false;
        
        this.copyUrl();
      } catch (error) {
        this.clearAll();
        this.invalidLink = true;
        console.error(error);
        setTimeout(() => {
          this.invalidLink = false;
        }, 3000);
      }
    },
    copyUrl() {
      navigator.clipboard.writeText(this.outputUrl);
      this.copySuccess = true;
      setTimeout(() => {
        this.copySuccess = false;
      }, 3000);
    },
    clearAll() {
      this.inputUrl = '';
      this.outputUrl = '';
      this.invalidLink = false;
      this.copySuccess = false;
      this.isResetActive = true;
      setTimeout(() => {
        this.isResetActive = false;
      }, 300);
    },
    checkLink() {
      this.invalidLink = false;
    },
    addStructuredData() {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "SkyFetch",
        "description": this.lang === 'zh' 
          ? "SkyFetch是一个简单易用的工具，只需粘贴原始图片链接，即可快速获取BlueSky社交平台上图片的最高分辨率版本下载地址。"
          : "SkyFetch is a simple tool to quickly obtain high-resolution download links for images from the BlueSky social platform by pasting the original image link.",
        "url": "https://cooksleep.github.io/SkyFetch/",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'HarmonyOS Sans SC';
  src: url('../assets/fonts/HarmonyOS_Sans_SC_Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

body {
  font-family: 'HarmonyOS Sans SC', sans-serif;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f4f8;
  padding: 20px;
}

.content {
  width: 100%;
  max-width: 500px;
}

h1 {
  text-align: center;
  color: #3498db;
  margin-bottom: 20px;
  font-size: 2.5em;
}

.description {
  text-align: center;
  color: #5d6d7e;
  margin-bottom: 20px;
  line-height: 1.6;
  font-size: 0.95em;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.description p {
  margin-bottom: 10px;
}

.card {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: height 0.3s ease;
}

.input-group, .output-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

label {
  margin-bottom: 8px;
  font-weight: bold;
  color: #2c3e50;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-message {
  color: red;
  margin-left: 10px;
}

.success-message {
  color: #2ecc71;
  font-size: 0.9em;
}

input {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #3498db;
  outline: none;
}

input.copied {
  background-color: rgba(46, 204, 113, 0.1);
  border-color: #2ecc71;
}

button {
  padding: 12px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
  margin-top: 10px;
}

button:hover {
  background-color: #2980b9;
}

.reset-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.reset-btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  outline: none;
}

.reset-icon {
  width: 100%;
  height: 100%;
  color: #95a5a6;
  transition: transform 0.3s, color 0.3s;
}

.reset-btn:hover {
  background-color: transparent;
}

@media (hover: hover) {
  .reset-btn:hover .reset-icon {
    color: #3498db;
  }
}

.reset-btn.active .reset-icon {
  transform: rotate(360deg);
  color: #3498db;
}

footer {
  margin-top: 20px;
  text-align: center;
}

footer a {
  color: #95a5a6;
  text-decoration: none;
  transition: color 0.3s;
}

footer a:hover {
  color: #3498db;
}

@media (max-width: 480px) {
  .card {
    padding: 20px;
  }
  
  .description {
    max-width: 100%;
  }
}

.language-switch {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.language-switch button {
  margin: 0 5px;
  padding: 5px 10px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.language-switch button.active {
  background-color: #3498db;
  color: white;
}
</style>