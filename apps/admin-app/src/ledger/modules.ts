import type { LedgerField, LedgerKind, LedgerModule, LedgerRecord } from './types'

const datePattern = /^\d{4}-\d{2}-\d{2}$/
const phonePattern = /^[\d-]{8,16}$/

interface FieldDraft {
  key: string
  label: string
  kind: LedgerKind
  required?: boolean
  options?: readonly string[]
  placeholder?: string
  table?: boolean
  tableWidth?: number
  span?: 8 | 12 | 24
  status?: boolean
  min?: number
  max?: number
  initial?: string | number
  pattern?: RegExp
  patternMessage?: string
  unit?: string
  filter?: boolean
  filterPlaceholder?: string
}

function field(draft: FieldDraft): LedgerField {
  let initial: string | number = ''
  if (draft.initial !== undefined) initial = draft.initial
  else if (draft.kind === 'number') initial = 0
  else if (draft.kind === 'park') initial = 'park-binjiang'
  else if (draft.kind === 'enterprise') initial = 'ent-xinglan'
  else if (draft.kind === 'select') initial = draft.options?.[0] ?? ''

  return {
    required: false,
    table: false,
    span: draft.kind === 'textarea' ? 24 : 12,
    ...draft,
    initial,
  }
}

function dateField(key: string, label: string, table = false): LedgerField {
  return field({
    key,
    label,
    kind: 'text',
    required: true,
    table,
    tableWidth: 120,
    placeholder: 'YYYY-MM-DD',
    pattern: datePattern,
    patternMessage: '日期格式为 YYYY-MM-DD',
    initial: '2026-10-03',
  })
}

function tally(rows: LedgerRecord[], key: string, value: string) {
  return rows.filter((item) => item[key] === value).length
}

const formHint = '保存后写入本机浏览器。退出登录不会清除，顶栏「恢复样例数据」会回到初始样例。'

export const ledgerModules: LedgerModule[] = [
  {
    key: 'workbench',
    path: '/workbench',
    bucket: 'tasks',
    idPrefix: 'task',
    group: '工作台',
    eyebrow: '工作台',
    title: '工作台',
    listHint: '待办、预警与会商记在同一张清单里。本地样例可查、可改，结果只保存在本机浏览器。',
    detailTitle: '事项详情',
    detailHint: '来源、时限和办理说明。',
    createTitle: '新建事项',
    editTitle: '编辑事项',
    formHint,
    createLabel: '新建事项',
    emptyTitle: '还没有事项。先记一条今天要盯的监管要点。',
    searchPlaceholder: '搜索标题、承办人或来源',
    searchKeys: ['title', 'owner', 'source', 'summary'],
    nameKey: 'title',
    links: [
      { label: '监管总览大屏', to: '/overview', screen: true },
      { label: '告警中心', to: '/alerts', screen: true },
      { label: '企业名录', to: '/enterprise/directory' },
      { label: '风险画像', to: '/enterprise/risk' },
      { label: '用地', to: '/space/land' },
      { label: '闲置', to: '/space/idle' },
      { label: '投诉举报', to: '/complaint' },
      { label: '数据报送', to: '/submission' },
    ],
    fields: [
      field({ key: 'title', label: '标题', kind: 'text', required: true, table: true, tableWidth: 240, placeholder: '例如 复核危化品暂存台账' }),
      field({ key: 'parkId', label: '园区', kind: 'park', required: true, table: true, tableWidth: 120, filter: true, filterPlaceholder: '全部园区' }),
      field({ key: 'kind', label: '类型', kind: 'select', required: true, table: true, tableWidth: 90, status: true, filter: true, options: ['待办', '预警', '会商'] }),
      field({ key: 'priority', label: '缓急', kind: 'select', required: true, table: true, tableWidth: 90, status: true, options: ['紧急', '普通', '知悉'] }),
      field({ key: 'status', label: '状态', kind: 'select', required: true, table: true, tableWidth: 100, status: true, filter: true, options: ['未办', '办理中', '已办结'] }),
      field({ key: 'owner', label: '承办人', kind: 'text', required: true, table: true, tableWidth: 100 }),
      dateField('dueAt', '办结时限', true),
      field({ key: 'source', label: '来源', kind: 'text', required: true, placeholder: '例如 风险画像' }),
      field({ key: 'summary', label: '办理说明', kind: 'textarea', required: true, placeholder: '写清要核对的事实和下一动作' }),
    ],
    stats(rows) {
      return [
        { label: '事项', value: rows.length, hint: '含已办结' },
        { label: '未办', value: tally(rows, 'status', '未办'), hint: '尚未动手' },
        { label: '预警', value: tally(rows, 'kind', '预警'), hint: '需要盯住' },
        { label: '已办结', value: tally(rows, 'status', '已办结'), hint: '留档备查' },
      ]
    },
  },
  {
    key: 'enterprise-risk',
    path: '/enterprise/risk',
    bucket: 'risks',
    idPrefix: 'risk',
    group: '企业监管',
    eyebrow: '企业监管',
    title: '风险画像',
    listHint: '按企业记录经营、安全、信用和环保信号。本地样例可查、可改。',
    detailTitle: '画像详情',
    detailHint: '等级、信号和处置说明。可跳到对应企业档案。',
    createTitle: '新建画像',
    editTitle: '编辑画像',
    formHint,
    createLabel: '新建画像',
    emptyTitle: '还没有风险画像。可以从在园企业里记一条信号。',
    searchPlaceholder: '搜索信号、承办人或说明',
    searchKeys: ['enterpriseId', 'signal', 'owner', 'note', 'dimension'],
    nameKey: 'enterpriseId',
    links: [{ label: '企业风险大屏', to: '/enterprise-risk', screen: true }],
    fields: [
      field({ key: 'enterpriseId', label: '企业', kind: 'enterprise', required: true, table: true, tableWidth: 200 }),
      field({ key: 'parkId', label: '园区', kind: 'park', required: true, table: true, tableWidth: 120, filter: true, filterPlaceholder: '全部园区' }),
      field({ key: 'level', label: '风险等级', kind: 'select', required: true, table: true, tableWidth: 100, status: true, filter: true, options: ['高风险', '中风险', '低风险', '关注'] }),
      field({ key: 'dimension', label: '维度', kind: 'select', required: true, table: true, tableWidth: 90, filter: true, options: ['经营', '安全', '信用', '环保'] }),
      field({ key: 'signal', label: '异常信号', kind: 'text', required: true, table: true, tableWidth: 220 }),
      field({ key: 'score', label: '风险分', kind: 'number', required: true, min: 0, max: 100, unit: '分', span: 8, initial: 40 }),
      field({ key: 'status', label: '处置状态', kind: 'select', required: true, table: true, tableWidth: 100, status: true, filter: true, options: ['待核查', '处置中', '已闭环'] }),
      field({ key: 'owner', label: '承办人', kind: 'text', required: true, span: 8 }),
      dateField('updatedAt', '更新日期', true),
      field({ key: 'note', label: '处置说明', kind: 'textarea', required: true }),
    ],
    stats(rows) {
      return [
        { label: '画像', value: rows.length, hint: '一企可有多条' },
        { label: '高风险', value: tally(rows, 'level', '高风险'), hint: '优先核查' },
        { label: '处置中', value: tally(rows, 'status', '处置中'), hint: '尚未闭环' },
        { label: '已闭环', value: tally(rows, 'status', '已闭环'), hint: '留档' },
      ]
    },
  },
  {
    key: 'space-land',
    path: '/space/land',
    bucket: 'lands',
    idPrefix: 'land',
    group: '空间监管',
    eyebrow: '空间监管',
    title: '用地',
    listHint: '地块的规划用途、实际利用和供应进度。本地样例可查、可改。',
    detailTitle: '地块详情',
    detailHint: '用途对照和供应说明。',
    createTitle: '新建地块',
    editTitle: '编辑地块',
    formHint,
    createLabel: '新建地块',
    emptyTitle: '还没有地块。可以补一条供应或预留用地。',
    searchPlaceholder: '搜索地块名称、编号或使用权人',
    searchKeys: ['name', 'code', 'holder', 'note'],
    nameKey: 'name',
    links: [{ label: '空间态势大屏', to: '/space', screen: true }],
    fields: [
      field({ key: 'name', label: '地块名称', kind: 'text', required: true, table: true, tableWidth: 200 }),
      field({ key: 'parkId', label: '园区', kind: 'park', required: true, table: true, tableWidth: 120, filter: true, filterPlaceholder: '全部园区' }),
      field({ key: 'code', label: '地块编号', kind: 'text', required: true, table: true, tableWidth: 120, placeholder: '例如 YQ-E-12' }),
      field({ key: 'planUse', label: '规划用途', kind: 'select', required: true, table: true, tableWidth: 100, options: ['工业', '科研', '商服', '绿地'] }),
      field({ key: 'actualUse', label: '实际利用', kind: 'select', required: true, table: true, tableWidth: 100, options: ['工业', '科研', '商服', '未利用', '临时'] }),
      field({ key: 'areaMu', label: '面积', kind: 'number', required: true, min: 0, max: 9999, unit: '亩', span: 8, initial: 10 }),
      field({ key: 'supplyStatus', label: '供应进度', kind: 'select', required: true, table: true, tableWidth: 110, status: true, filter: true, options: ['已供应', '待供应', '已收回'] }),
      field({ key: 'holder', label: '使用权人', kind: 'text', required: true, table: true, tableWidth: 180 }),
      dateField('suppliedAt', '供应或计划日期'),
      field({ key: 'note', label: '对照说明', kind: 'textarea', required: true }),
    ],
    stats(rows) {
      const area = rows.reduce((sum, item) => sum + Number(item.areaMu || 0), 0)
      return [
        { label: '地块', value: rows.length, hint: '含预留' },
        { label: '已供应', value: tally(rows, 'supplyStatus', '已供应'), hint: '已明确使用权' },
        { label: '待供应', value: tally(rows, 'supplyStatus', '待供应'), hint: '尚未出让' },
        { label: '面积合计', value: area.toLocaleString('zh-CN'), hint: '亩' },
      ]
    },
  },
  {
    key: 'assessment',
    path: '/assessment',
    bucket: 'assessments',
    idPrefix: 'assess',
    group: '园区考核',
    eyebrow: '园区考核',
    title: '园区考核',
    listHint: '运行、招商、安全和服务指标的填报与归档。本地样例可查、可改。',
    detailTitle: '指标详情',
    detailHint: '周期、进度和评分说明。未开始的指标得分记为 0。',
    createTitle: '新建指标',
    editTitle: '编辑指标',
    formHint,
    createLabel: '新建指标',
    emptyTitle: '还没有考核指标。可以先建一条本季要填的项目。',
    searchPlaceholder: '搜索指标名称、承办人或说明',
    searchKeys: ['name', 'owner', 'note', 'cycle'],
    nameKey: 'name',
    links: [{ label: '考核看板', to: '/assessment', screen: true }],
    fields: [
      field({ key: 'name', label: '指标名称', kind: 'text', required: true, table: true, tableWidth: 200 }),
      field({ key: 'parkId', label: '园区', kind: 'park', required: true, table: true, tableWidth: 120, filter: true, filterPlaceholder: '全部园区' }),
      field({ key: 'category', label: '类别', kind: 'select', required: true, table: true, tableWidth: 90, filter: true, options: ['运行', '招商', '安全', '服务'] }),
      field({ key: 'cycle', label: '考核周期', kind: 'select', required: true, table: true, tableWidth: 150, options: ['2026 年三季度', '2026 年上半年', '2025 年度'] }),
      field({ key: 'progress', label: '进度', kind: 'select', required: true, table: true, tableWidth: 100, status: true, filter: true, options: ['未开始', '填报中', '已评分', '已归档'] }),
      field({ key: 'score', label: '得分', kind: 'number', required: true, min: 0, max: 100, unit: '分', span: 8, initial: 0 }),
      field({ key: 'owner', label: '承办人', kind: 'text', required: true, table: true, tableWidth: 100 }),
      dateField('deadline', '截止日期', true),
      field({ key: 'note', label: '评分说明', kind: 'textarea', required: true }),
    ],
    stats(rows) {
      return [
        { label: '指标', value: rows.length, hint: '含历史周期' },
        { label: '填报中', value: tally(rows, 'progress', '填报中'), hint: '材料未齐' },
        { label: '已评分', value: tally(rows, 'progress', '已评分'), hint: '待归档' },
        { label: '已归档', value: tally(rows, 'progress', '已归档'), hint: '不再改分' },
      ]
    },
  },
  {
    key: 'policy',
    path: '/policy',
    bucket: 'policies',
    idPrefix: 'policy',
    group: '政策管理',
    eyebrow: '政策管理',
    title: '政策管理',
    listHint: '扶持、监管、安全和人才条文，以及适用对象、发布状态。本地样例可查、可改。',
    detailTitle: '政策详情',
    detailHint: '文号、适用范围和摘要。',
    createTitle: '新建政策',
    editTitle: '编辑政策',
    formHint,
    createLabel: '新建政策',
    emptyTitle: '还没有政策。可以先录入一条草案或已发布条文。',
    searchPlaceholder: '搜索标题、文号或摘要',
    searchKeys: ['title', 'docNo', 'summary'],
    nameKey: 'title',
    fields: [
      field({ key: 'title', label: '标题', kind: 'text', required: true, table: true, tableWidth: 260 }),
      field({ key: 'docNo', label: '文号', kind: 'text', required: true, table: true, tableWidth: 170, placeholder: '例如 滨园管〔2026〕20 号' }),
      field({ key: 'parkId', label: '牵头园区', kind: 'park', required: true, table: true, tableWidth: 120, filter: true, filterPlaceholder: '全部园区' }),
      field({ key: 'category', label: '类别', kind: 'select', required: true, table: true, tableWidth: 90, filter: true, options: ['扶持', '监管', '安全', '人才'] }),
      field({ key: 'audience', label: '适用对象', kind: 'select', required: true, table: true, tableWidth: 120, options: ['在园企业', '拟入驻企业', '园区机构'] }),
      field({ key: 'coverage', label: '覆盖范围', kind: 'select', required: true, options: ['本园', '三园'] }),
      field({ key: 'status', label: '发布状态', kind: 'select', required: true, table: true, tableWidth: 100, status: true, filter: true, options: ['草案', '已发布', '已废止'] }),
      dateField('issuedAt', '发文或起草日期', true),
      field({ key: 'summary', label: '摘要', kind: 'textarea', required: true }),
    ],
    stats(rows) {
      return [
        { label: '政策', value: rows.length, hint: '含废止档案' },
        { label: '已发布', value: tally(rows, 'status', '已发布'), hint: '现行' },
        { label: '草案', value: tally(rows, 'status', '草案'), hint: '未上会' },
        { label: '已废止', value: tally(rows, 'status', '已废止'), hint: '只留档' },
      ]
    },
  },
  {
    key: 'complaint',
    path: '/complaint',
    bucket: 'complaints',
    idPrefix: 'case',
    group: '投诉举报',
    eyebrow: '投诉举报',
    title: '投诉举报',
    listHint: '受理、分派和办结都记在本地队列。电话和姓名是虚构的。',
    detailTitle: '投诉详情',
    detailHint: '渠道、承办和办结时限。',
    createTitle: '新建投诉',
    editTitle: '编辑投诉',
    formHint,
    createLabel: '新建投诉',
    emptyTitle: '受理队列是空的。可以登记一条来电或网络投诉。',
    searchPlaceholder: '搜索标题、投诉人或承办人',
    searchKeys: ['title', 'complainant', 'assignee', 'content'],
    nameKey: 'title',
    links: [{ label: '投诉热力', to: '/complaint-heat', screen: true }],
    fields: [
      field({ key: 'title', label: '标题', kind: 'text', required: true, table: true, tableWidth: 220 }),
      field({ key: 'parkId', label: '园区', kind: 'park', required: true, table: true, tableWidth: 120, filter: true, filterPlaceholder: '全部园区' }),
      field({ key: 'channel', label: '渠道', kind: 'select', required: true, table: true, tableWidth: 90, options: ['来电', '来信', '网络', '现场'] }),
      field({ key: 'category', label: '类型', kind: 'select', required: true, table: true, tableWidth: 90, filter: true, options: ['环境', '物业', '安全', '劳务', '其他'] }),
      field({ key: 'status', label: '状态', kind: 'select', required: true, table: true, tableWidth: 100, status: true, filter: true, options: ['待受理', '办理中', '已办结', '已退回'] }),
      field({ key: 'assignee', label: '承办人', kind: 'text', required: true, table: true, tableWidth: 100 }),
      field({ key: 'complainant', label: '投诉人', kind: 'text', required: true, placeholder: '虚构姓名' }),
      field({
        key: 'phone',
        label: '联系电话',
        kind: 'text',
        required: true,
        placeholder: '8 到 16 位数字或连字符',
        pattern: phonePattern,
        patternMessage: '请填写 8 到 16 位数字或连字符',
      }),
      dateField('receivedAt', '受理日期', true),
      dateField('deadline', '办结时限'),
      field({ key: 'content', label: '事由', kind: 'textarea', required: true }),
    ],
    stats(rows) {
      return [
        { label: '受理件', value: rows.length, hint: '含退回' },
        { label: '待受理', value: tally(rows, 'status', '待受理'), hint: '尚未分派' },
        { label: '办理中', value: tally(rows, 'status', '办理中'), hint: '未办结' },
        { label: '已办结', value: tally(rows, 'status', '已办结'), hint: '已回复' },
      ]
    },
  },
  {
    key: 'submission',
    path: '/submission',
    bucket: 'submissions',
    idPrefix: 'submit',
    group: '数据报送',
    eyebrow: '数据报送',
    title: '数据报送',
    listHint: '定期报送任务、填报进度和回执号。本地样例可查、可改。未出回执可留空。',
    detailTitle: '报送详情',
    detailHint: '去向、时限和回执。',
    createTitle: '新建报送',
    editTitle: '编辑报送',
    formHint,
    createLabel: '新建报送',
    emptyTitle: '还没有报送任务。可以先建一条本月要报的表。',
    searchPlaceholder: '搜索标题、回执号或说明',
    searchKeys: ['title', 'receiptNo', 'owner', 'note', 'target'],
    nameKey: 'title',
    fields: [
      field({ key: 'title', label: '任务名称', kind: 'text', required: true, table: true, tableWidth: 200 }),
      field({ key: 'parkId', label: '园区', kind: 'park', required: true, table: true, tableWidth: 120, filter: true, filterPlaceholder: '全部园区' }),
      field({ key: 'period', label: '周期', kind: 'select', required: true, table: true, tableWidth: 140, options: ['2026 年 8 月', '2026 年 9 月', '2026 年三季度'] }),
      field({ key: 'target', label: '报送去向', kind: 'select', required: true, table: true, tableWidth: 140, options: ['经济发展局', '规划建设局', '应急管理局', '管委会办公室'] }),
      field({ key: 'status', label: '进度', kind: 'select', required: true, table: true, tableWidth: 100, status: true, filter: true, options: ['待填报', '填报中', '已报送', '已退回'] }),
      field({ key: 'owner', label: '填报人', kind: 'text', required: true, table: true, tableWidth: 100 }),
      dateField('dueAt', '截止日期', true),
      field({ key: 'receiptNo', label: '回执号', kind: 'text', table: true, tableWidth: 160, placeholder: '未出回执可留空' }),
      field({ key: 'note', label: '填报说明', kind: 'textarea', required: true }),
    ],
    stats(rows) {
      return [
        { label: '任务', value: rows.length, hint: '含已报送' },
        { label: '待填报', value: tally(rows, 'status', '待填报'), hint: '尚未动手' },
        { label: '填报中', value: tally(rows, 'status', '填报中'), hint: '未出回执' },
        { label: '已报送', value: tally(rows, 'status', '已报送'), hint: '有回执' },
      ]
    },
  },
  {
    key: 'analytics',
    path: '/analytics',
    bucket: 'reports',
    idPrefix: 'report',
    group: '统计分析',
    eyebrow: '统计分析',
    title: '统计分析',
    listHint: '这里只维护报表条目和文字摘要。图形和地图在态势大屏，本页不画图表。',
    detailTitle: '报表详情',
    detailHint: '主题、口径和文字摘要。图形在态势大屏。',
    createTitle: '新建报表',
    editTitle: '编辑报表',
    formHint,
    createLabel: '新建报表',
    emptyTitle: '还没有报表条目。可以先建一条文字摘要，不必等图表。',
    searchPlaceholder: '搜索标题、摘要或口径',
    searchKeys: ['title', 'summary', 'basis', 'owner'],
    nameKey: 'title',
    fields: [
      field({ key: 'title', label: '报表名称', kind: 'text', required: true, table: true, tableWidth: 220 }),
      field({ key: 'parkId', label: '园区', kind: 'park', required: true, table: true, tableWidth: 120, filter: true, filterPlaceholder: '全部园区' }),
      field({ key: 'theme', label: '主题', kind: 'select', required: true, table: true, tableWidth: 90, filter: true, options: ['企业', '空间', '风险', '投诉', '考核'] }),
      field({ key: 'cycle', label: '周期', kind: 'select', required: true, table: true, tableWidth: 90, options: ['月报', '季报', '年报'] }),
      field({ key: 'status', label: '状态', kind: 'select', required: true, table: true, tableWidth: 100, status: true, filter: true, options: ['编制中', '可导出', '已归档'] }),
      field({ key: 'owner', label: '编制人', kind: 'text', required: true, table: true, tableWidth: 100 }),
      dateField('updatedAt', '更新日期', true),
      field({ key: 'summary', label: '文字摘要', kind: 'textarea', required: true, placeholder: '用一段话说明本期结论，不插入图表' }),
      field({ key: 'basis', label: '统计口径', kind: 'textarea', required: true }),
    ],
    stats(rows) {
      return [
        { label: '报表', value: rows.length, hint: '条目而非图形' },
        { label: '编制中', value: tally(rows, 'status', '编制中'), hint: '摘要未定' },
        { label: '可导出', value: tally(rows, 'status', '可导出'), hint: '仍是文字' },
        { label: '已归档', value: tally(rows, 'status', '已归档'), hint: '历史周期' },
      ]
    },
  },
  {
    key: 'settings',
    path: '/settings',
    bucket: 'settings',
    idPrefix: 'setting',
    group: '系统设置',
    eyebrow: '系统设置',
    title: '系统设置',
    listHint: '组织、角色和字典参数的本地说明。不做真实权限拦截，登录会话仍单独保存在入口。',
    detailTitle: '参数详情',
    detailHint: '编码、适用范围和当前取值。',
    createTitle: '新建参数',
    editTitle: '编辑参数',
    formHint,
    createLabel: '新建参数',
    emptyTitle: '还没有参数。可以补一条组织、角色或字典。',
    searchPlaceholder: '搜索名称、编码或取值',
    searchKeys: ['name', 'code', 'value', 'note', 'owner'],
    nameKey: 'name',
    fields: [
      field({ key: 'name', label: '名称', kind: 'text', required: true, table: true, tableWidth: 200 }),
      field({ key: 'category', label: '类别', kind: 'select', required: true, table: true, tableWidth: 120, status: true, filter: true, options: ['组织架构', '角色权限', '字典参数'] }),
      field({ key: 'code', label: '编码', kind: 'text', required: true, table: true, tableWidth: 150, placeholder: '例如 DICT-RISK' }),
      field({ key: 'scope', label: '范围', kind: 'select', required: true, table: true, tableWidth: 120, filter: true, options: ['平台', '滨江云栖', '临港智造', '光谷生命'] }),
      field({ key: 'status', label: '状态', kind: 'select', required: true, table: true, tableWidth: 90, status: true, filter: true, options: ['启用', '停用'] }),
      field({ key: 'value', label: '取值', kind: 'text', required: true, table: true, tableWidth: 180 }),
      field({ key: 'owner', label: '维护人', kind: 'text', required: true }),
      field({ key: 'note', label: '说明', kind: 'textarea', required: true }),
    ],
    stats(rows) {
      return [
        { label: '参数', value: rows.length, hint: '含停用' },
        { label: '组织架构', value: tally(rows, 'category', '组织架构'), hint: '科室' },
        { label: '角色权限', value: tally(rows, 'category', '角色权限'), hint: '演示说明' },
        { label: '字典参数', value: tally(rows, 'category', '字典参数'), hint: '下拉对照' },
      ]
    },
  },
]

export function ledgerByKey(key: string) {
  return ledgerModules.find((item) => item.key === key)
}
