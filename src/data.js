const bloggerSeeds = [
  "AI增长实验室", "提示词研究员Mia", "老王AI副业", "AIGC产品猎人", "海盐的智能体日记",
  "小北聊AI效率", "AI绘图观察站", "内容自动化实践派", "阿宁AI创业笔记", "程序员转型AIGC",
  "Vera的AI品牌课", "一小时做爆款", "工作流搭建手册", "AI短视频进化论", "Prompt导演小周",
  "Marvin聊智能体", "数据叙事官", "AI教育新视角", "职场提效实验", "Leo增长复盘",
  "橙子AI写作局", "青木Agent方法", "阿哲产品策略", "小兔AIGC日报", "创作者AI加速器",
  "林间智能生活", "商业化拆解社", "AI运营周刊", "智能体案例库", "Rita跨境AI"
];

const contentAngles = ["实操教程", "案例拆解", "工具评测", "避坑清单", "商业化路径"];

function buildPosts(name) {
  const hotPosts = Array.from({ length: 5 }).map((_, i) => ({
    title: `${name}｜${contentAngles[i]}：从0到1拿结果的关键动作`,
    likes: 10000 - i * 1300,
    summary: `围绕${contentAngles[i]}给出可复制步骤，强调执行细节和可量化结果。`
  }));

  const latestPosts = Array.from({ length: 5 }).map((_, i) => ({
    title: `${name}｜最近更新 ${i + 1}：AI赛道趋势观察与行动建议`,
    publishedAt: `2026-03-${String(16 - i).padStart(2, "0")}`,
    summary: "结合平台热词与用户反馈，给出下一步内容迭代方向。"
  }));

  return { hotPosts, latestPosts };
}

function makeBlogger(id, name) {
  const avatarId = 10 + id;
  const personalTraits = [
    "表达结构清晰，先结论后步骤",
    "更新频率稳定，持续输出系列化内容",
    "强复盘导向，强调可验证的数据结果"
  ];

  const contentTraits = [
    "高频使用“问题-方案-结果”模板",
    "封面与标题聚焦高意图关键词",
    "评论区二次答疑，增强用户黏性"
  ];

  return {
    id: String(id),
    name,
    avatar: `https://i.pravatar.cc/120?img=${avatarId}`,
    followers: 30000 + id * 4200,
    personalTraits,
    contentTraits,
    popularityReason: "兼顾实操价值与情绪价值：内容可直接上手，同时叙事具备成长感，能激发用户转发与收藏。",
    ...buildPosts(name)
  };
}

const bloggers = bloggerSeeds.map((name, index) => makeBlogger(index + 1, name));

const dailyTopics = [
  { title: "AI智能体如何落地个人IP", heat: 98 },
  { title: "DeepResearch工作流模板", heat: 95 },
  { title: "AI短视频批量脚本生成", heat: 93 },
  { title: "小红书图文A/B标题优化", heat: 90 },
  { title: "提示词工程到商业化闭环", heat: 88 },
  { title: "AI工具组合与成本控制", heat: 86 }
];

module.exports = {
  bloggers,
  dailyTopics
};
