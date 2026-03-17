const audienceMap = {
  新手: ["低门槛", "可复制", "避坑"],
  创作者: ["爆款概率", "更新效率", "转化路径"],
  创业者: ["商业闭环", "ROI", "可持续增长"],
  职场人: ["提效", "可迁移", "低试错成本"],
  默认: ["共鸣", "行动步骤", "结果反馈"]
};

function analyzeTopicIdea(idea, targetAudience = "默认") {
  const needs = audienceMap[targetAudience] || audienceMap.默认;
  const seed = idea?.trim() || "AI内容增长";

  const risks = [
    "选题表述过泛，难以形成点击动机",
    "缺少真实案例支撑，可信度不足",
    "行动步骤不够具体，读者难以照做"
  ];

  const optimizedTopics = [
    `${seed}：7天从0到1的执行路线图（含模板）`,
    `我用${seed}做账号增长复盘：3个关键拐点`,
    `${targetAudience}怎么用${seed}拿到首批精准粉丝`,
    `${seed}避坑清单：90%人会忽略的5个细节`,
    `${seed}实战案例：从灵感到转化的一次完整闭环`
  ];

  const contentOutline = [
    "开篇3句：痛点共鸣 + 结果预告 + 身份建立",
    `主体1：围绕${needs[0]}给出最小可执行动作`,
    `主体2：用真实案例证明${needs[1]}收益`,
    `主体3：拆解${needs[2]}策略与常见误区`,
    "结尾：行动清单 + 评论区互动问题"
  ];

  return {
    diagnosis: `当前灵感“${seed}”具有潜力，建议收窄场景并加入可量化结果，提升点击与收藏。`,
    audiencePreference: `${targetAudience}更关注：${needs.join("、")}。`,
    risks,
    optimizedTopics,
    contentOutline
  };
}

module.exports = {
  analyzeTopicIdea
};
