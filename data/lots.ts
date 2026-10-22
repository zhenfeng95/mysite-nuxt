export type LotTone = 'heal' | 'funny' | 'work' | 'chaos'

export interface LotEntry {
  id: string
  rank: string
  title: string
  verse: string
  tip: string
  tone: LotTone
}

export const lots: LotEntry[] = [
  {
    id: '1',
    rank: '上上签',
    title: '宜喝水',
    verse: '今日诸事平平，唯口渴最为紧急。',
    tip: '先把杯子续满。续完就算完成今天最重要的 KPI。',
    tone: 'heal',
  },
  {
    id: '2',
    rank: '上签',
    title: '宜早睡',
    verse: '屏幕再亮，也亮不过明天的太阳。',
    tip: '再刷三条就睡。说三条就三条，不要谈判。',
    tone: 'heal',
  },
  {
    id: '3',
    rank: '中签',
    title: '宜摸鱼',
    verse: '效率这东西，有时是假装出来的。',
    tip: '把进度条拖慢一点，把呼吸放慢一点。',
    tone: 'work',
  },
  {
    id: '4',
    rank: '上签',
    title: '忌看老板',
    verse: '目光相交，焦虑倍增。',
    tip: '今日宜低头做事，忌主动对视。必要时开启「认真思考」表情。',
    tone: 'work',
  },
  {
    id: '5',
    rank: '中上签',
    title: '宜发呆',
    verse: '空白不是浪费，是系统在后台更新。',
    tip: '允许自己空两分钟。世界不会因此塌掉。',
    tone: 'heal',
  },
  {
    id: '6',
    rank: '下签',
    title: '忌开会',
    verse: '会开得越长，结论越短。',
    tip: '能异步就异步。实在躲不掉，带好水和耐心。',
    tone: 'work',
  },
  {
    id: '7',
    rank: '上上签',
    title: '宜夸奖自己',
    verse: '你已经比昨天的自己多撑过了一天。',
    tip: '心里默念：我很好，我在努力，我可以慢慢来。',
    tone: 'heal',
  },
  {
    id: '8',
    rank: '中签',
    title: '宜吃顿好的',
    verse: '情绪稳定的尽头，往往是碳水化合物。',
    tip: '不是放纵，是补给。点一份你真正想吃的。',
    tone: 'funny',
  },
  {
    id: '9',
    rank: '上签',
    title: '忌回消息太快',
    verse: '秒回不是美德，边界才是。',
    tip: '看见了也可以先放一放。你的时间同样值钱。',
    tone: 'work',
  },
  {
    id: '10',
    rank: '中上签',
    title: '宜散步',
    verse: '腿动起来，脑子才会松一点。',
    tip: '下楼走一圈。不用很远，绕个小区也行。',
    tone: 'heal',
  },
  {
    id: '11',
    rank: '上签',
    title: '宜关掉通知',
    verse: '红点不是任务，是焦虑的投喂口。',
    tip: '静音半小时。世界会排队等你。',
    tone: 'chaos',
  },
  {
    id: '12',
    rank: '中签',
    title: '忌比较',
    verse: '别人的高光，不等于你的失败。',
    tip: '退出那个让你内耗的会话。你的赛道你说了算。',
    tone: 'heal',
  },
  {
    id: '13',
    rank: '上上签',
    title: '今日有小确幸',
    verse: '未必是大事，可能是绿灯全开。',
    tip: '留意今天碰巧顺利的小事，记下来。',
    tone: 'funny',
  },
  {
    id: '14',
    rank: '下签',
    title: '忌硬撑',
    verse: '扛得住不代表该一直扛。',
    tip: '能求助就求助。说「我需要帮忙」也是一种能力。',
    tone: 'heal',
  },
  {
    id: '15',
    rank: '中上签',
    title: '宜整理桌面',
    verse: '物理空间清一点，心里也会松一点。',
    tip: '只清一个角。清完就可以停。',
    tone: 'funny',
  },
  {
    id: '16',
    rank: '上签',
    title: '宜拖延五分钟',
    verse: '不是摆烂，是给焦虑一点缓冲带。',
    tip: '先做最容易的一步，剩下的以后再说。',
    tone: 'chaos',
  },
  {
    id: '17',
    rank: '中签',
    title: '忌深夜决策',
    verse: '凌晨的勇气，常常是睡不够的副作用。',
    tip: '重要决定留到白天。今晚只负责休息。',
    tone: 'work',
  },
  {
    id: '18',
    rank: '上上签',
    title: '宜原谅自己',
    verse: '没做成的那件事，不定义你整个人。',
    tip: '对自己说一句：下次再试也没关系。',
    tone: 'heal',
  },
  {
    id: '19',
    rank: '中上签',
    title: '宜听点好听的',
    verse: '耳朵被安抚了，肩膀才会放下来。',
    tip: '开一首喜欢的歌，或去白噪音页待一分钟。',
    tone: 'funny',
  },
  {
    id: '20',
    rank: '上签',
    title: '忌证明自己',
    verse: '不是所有质疑都值得回应。',
    tip: '把力气留给真正在意你的人。',
    tone: 'work',
  },
  {
    id: '21',
    rank: '中签',
    title: '今日宜摆烂半小时',
    verse: '适度摆烂，是可持续奋斗的前提。',
    tip: '设个闹钟。摆完再回来做人。',
    tone: 'chaos',
  },
  {
    id: '22',
    rank: '上签',
    title: '宜说谢谢',
    verse: '一句谢谢，能把关系往前推一点。',
    tip: '今天对帮过你的人认真道谢一次。',
    tone: 'heal',
  },
  {
    id: '23',
    rank: '下签',
    title: '忌刷短视频超时',
    verse: '算法比你更懂如何留住你。',
    tip: '看完这条就起来。对，就是现在。',
    tone: 'chaos',
  },
  {
    id: '24',
    rank: '中上签',
    title: '宜写下来',
    verse: '乱成一团的念头，写出来就会排队。',
    tip: '只写三行：担心什么、能做什么、暂时放下什么。',
    tone: 'heal',
  },
]

export function pickLot(excludeId?: string) {
  const pool = excludeId ? lots.filter(item => item.id !== excludeId) : lots
  const list = pool.length ? pool : lots
  return list[Math.floor(Math.random() * list.length)]!
}

export function rankClass(rank: string) {
  if (rank.includes('上上')) {
    return 'text-moss'
  }
  if (rank.includes('下')) {
    return 'text-stone-500'
  }
  return 'text-ink'
}
