const tabs = document.querySelectorAll('.tab');
const panels = {
  blogger: document.getElementById('tab-blogger'),
  topic: document.getElementById('tab-topic')
};

const bloggerGrid = document.getElementById('bloggerGrid');
const bloggerDetail = document.getElementById('bloggerDetail');
const hotTopics = document.getElementById('hotTopics');
const ideaInput = document.getElementById('idea');
const audienceSelect = document.getElementById('audience');
const topicAnalysis = document.getElementById('topicAnalysis');

async function getJSON(url) {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '请求失败');
  return data;
}

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '请求失败');
  return data;
}

function bindTabs() {
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      Object.values(panels).forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      panels[tab.dataset.tab].classList.add('active');
    });
  });
}

function renderBloggerCard(item) {
  const card = document.createElement('div');
  card.className = 'blogger-item';
  card.innerHTML = `
    <img src="${item.avatar}" alt="${item.name}" />
    <div class="blogger-name">${item.name}</div>
    <div class="muted">粉丝 ${item.followers.toLocaleString()}</div>
  `;
  card.addEventListener('click', async () => {
    bloggerDetail.textContent = '加载详情中...';
    try {
      const detail = await getJSON(`/api/bloggers/${item.id}`);
      bloggerDetail.innerHTML = `
        <h3>${detail.name}</h3>
        <p><strong>受欢迎原因：</strong>${detail.popularityReason}</p>
        <p><strong>个人特点</strong></p>
        <ul class="list">${detail.personalTraits.map((x) => `<li>${x}</li>`).join('')}</ul>
        <p><strong>内容特点</strong></p>
        <ul class="list">${detail.contentTraits.map((x) => `<li>${x}</li>`).join('')}</ul>
        <p><strong>最受欢迎5篇</strong></p>
        <ul class="list">${detail.hotPosts.map((x) => `<li>${x.title}（点赞 ${x.likes}）</li>`).join('')}</ul>
        <p><strong>最近发布5篇</strong></p>
        <ul class="list">${detail.latestPosts.map((x) => `<li>${x.publishedAt}｜${x.title}</li>`).join('')}</ul>
      `;
    } catch (error) {
      bloggerDetail.textContent = error.message;
    }
  });
  return card;
}

async function loadBloggers() {
  bloggerGrid.textContent = '加载中...';
  try {
    const data = await getJSON('/api/bloggers');
    bloggerGrid.innerHTML = '';
    data.list.forEach((item) => bloggerGrid.appendChild(renderBloggerCard(item)));
  } catch (error) {
    bloggerGrid.textContent = error.message;
  }
}

async function loadTopics() {
  hotTopics.textContent = '加载中...';
  try {
    const data = await getJSON('/api/topics');
    hotTopics.innerHTML = '';
    data.topics.forEach((topic) => {
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.textContent = `${topic.title}（热度 ${topic.heat}）`;
      hotTopics.appendChild(chip);
    });
  } catch (error) {
    hotTopics.textContent = error.message;
  }
}

function bindIdeaAnalysis() {
  document.getElementById('analyzeIdeaBtn').addEventListener('click', async () => {
    topicAnalysis.textContent = '分析中...';
    try {
      const data = await postJSON('/api/topic-analysis', {
        idea: ideaInput.value.trim(),
        audience: audienceSelect.value
      });

      topicAnalysis.textContent = [
        `诊断：${data.diagnosis}`,
        `受众偏好：${data.audiencePreference}`,
        '',
        '风险提示：',
        ...data.risks.map((x, i) => `${i + 1}. ${x}`),
        '',
        '推荐选题：',
        ...data.optimizedTopics.map((x, i) => `${i + 1}. ${x}`),
        '',
        '内容结构建议：',
        ...data.contentOutline.map((x, i) => `${i + 1}. ${x}`)
      ].join('\n');
    } catch (error) {
      topicAnalysis.textContent = error.message;
    }
  });
}

bindTabs();
loadBloggers();
loadTopics();
bindIdeaAnalysis();
