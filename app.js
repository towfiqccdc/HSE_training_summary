// ============================================================
// CONFIG — your Supabase project
// ============================================================
const SUPABASE_URL = "https://ucgqbdfliqdkscjtwyxy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjZ3FiZGZsaXFka3NjanR3eXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNjUyNzAsImV4cCI6MjEwNTg0MTI3MH0.TjMO2b382KHG62Jv38LDh4MXk7WMJEqGyr5re01QbSg";

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DESIGNATIONS = ["Roustabout","Floorman","Derrickman","Assistant Driller","Welder","Electrician","Motorman"];
const DESIGNATION_ORDER = ["Assistant Driller","Floorman","Derrickman","Roustabout","Welder","Electrician","Motorman"];

// ============================================================
// LANGUAGE (English / 中文) — display only.
// The database is never touched: names, rigs, IDs, NIDs and dates
// are stored exactly as before. Only the labels on screen change.
// To fix or add a Chinese wording, edit the lists below:
//   ZH          — buttons, headings, messages
//   DES_ZH      — designations (Welder, Floorman, ...)
//   COURSE_ZH   — course names/IDs (lower-case keys)
// Anything without a Chinese entry simply stays in English.
// ============================================================
let LANG = "en";
try { LANG = localStorage.getItem("hse_lang") === "zh" ? "zh" : "en"; } catch(e){}

const ZH = {
  // ---- page chrome ----
  "CCDC HSE — Training Monitor": "CCDC HSE — 培训监控系统",
  "CCDC Training Monitor": "CCDC 培训监控",
  "Rig workforce & HSE records": "钻井队员工与 HSE 记录",
  "Training Matrix": "培训矩阵",
  "Employees": "员工",
  "Add Employee": "添加员工",
  "Add Training": "添加培训",
  "Courses": "课程",
  "Rigs": "钻机",
  "Dashboard": "仪表盘",
  "Overall Training Matrix": "整体培训矩阵",
  "Search and filter employees by name, rig and Assistant Driller.": "按姓名、钻机和副司钻搜索和筛选员工。",
  "Add New Employee": "添加新员工",
  "NID is optional. If an NID already exists, that employee is treated as a transfer instead of a duplicate.": "身份证号（NID）为选填项。若该 NID 已存在，则视为该员工调动，不会重复创建。",
  "Pick a rig and Assistant Driller, select employees, then log one training course for all of them.": "选择钻机和副司钻，勾选员工，然后为他们统一登记一门培训课程。",
  "← Back to Employees": "← 返回员工列表",
  "Employee Details": "员工详情",
  "Training courses available to assign. Course IDs are short codes used across training records.": "可分配的培训课程。课程编号是培训记录中使用的简短代码。",
  "Rigs available for employee assignment and transfer.": "可用于员工分配和调动的钻机。",
  "Connecting…": "连接中…",
  "● Connected": "● 已连接",
  "● Connection error": "● 连接错误",
  "Could not load data: {msg}": "无法加载数据：{msg}",

  // ---- common labels ----
  "Name": "姓名",
  "ID": "编号",
  "NID": "身份证号",
  "NID Number": "身份证号",
  "Designation": "职务",
  "Assistant Driller": "副司钻",
  "Current Rig": "当前钻机",
  "Joining Date": "入职日期",
  "Not Assigned": "未分配",
  "Not provided": "未提供",
  "Rig": "钻机",
  "Date": "日期",
  "Trainer": "培训师",
  "Training": "培训",
  "Course": "课程",
  "From Date": "起始日期",
  "To Date": "结束日期",
  "Present": "至今",
  "Unknown": "未知",
  "Cancel": "取消",

  // ---- filters ----
  "All rigs": "全部钻机",
  "All Assistant Drillers": "全部副司钻",
  "All designations": "全部职务",
  "No employees match the selected filters.": "没有符合所选筛选条件的员工。",
  "Assistant Driller: {name}": "副司钻：{name}",
  "Trained on: {dates}": "培训日期：{dates}",
  "Search by name…": "按姓名搜索…",
  "{n} employee(s) found.": "找到 {n} 名员工。",

  // ---- add employee ----
  "Single Employee": "单个添加",
  "Batch Upload": "批量上传",
  "NID Number (optional)": "身份证号（选填）",
  "Enter to check for an existing employee": "输入以检查是否已有该员工",
  "Name *": "姓名 *",
  "Designation *": "职务 *",
  "Current Rig *": "当前钻机 *",
  "No rigs yet — add one under Rigs": "暂无钻机——请先在“钻机”页面添加",
  "Name is required.": "请填写姓名。",
  "Add a rig first (under Rigs).": "请先添加钻机（在“钻机”页面）。",
  "Error adding employee: {msg}": "添加员工出错：{msg}",
  "Employee added, but transfer record failed: {msg}": "员工已添加，但调动记录创建失败：{msg}",
  "{name} added successfully.": "已成功添加 {name}。",
  "This NID already exists. This employee will be transferred to a new Rig / Assistant Driller instead of creating a duplicate.": "该 NID 已存在。该员工将被调动到新的钻机/副司钻，不会重复创建。",
  "Current Assistant Driller": "当前副司钻",
  "Designation: {d}": "职务：{d}",
  "Transfer to New Rig": "调动到新钻机",
  "New Rig *": "新钻机 *",
  "New Assistant Driller": "新副司钻",
  "Transfer Date *": "调动日期 *",
  "Transfer Employee": "调动员工",
  "Open Employee Details": "打开员工详情",
  "Transfer date is required.": "请填写调动日期。",
  "Selected Rig and Assistant Driller are the same as current assignment.": "所选钻机和副司钻与当前分配相同。",
  "{name} transferred to {rig}.": "{name} 已调动至 {rig}。",
  "Warning: couldn't close previous transfer record: {msg}": "警告：无法关闭上一条调动记录：{msg}",
  "Error creating transfer record: {msg}": "创建调动记录出错：{msg}",
  "Error updating employee: {msg}": "更新员工出错：{msg}",

  // ---- batch upload ----
  "Upload Employees from CSV / Excel": "从 CSV / Excel 上传员工",
  "Expected columns (any order, header names not case-sensitive):": "所需列（顺序不限，列名不区分大小写，请使用下列英文列名）：",
  "Employee ID is generated automatically — don't include it. Assistant Driller and Joining Date are both optional — leave either blank and fill it in later from Edit Info on the employee's page.": "员工编号由系统自动生成，请勿填写。副司钻和入职日期均为选填——可留空，之后在员工页面的“编辑信息”中补充。",
  "Each \"Current Rig\" value must already exist on the {rigsLink} — rows with an unrecognized rig are skipped and reported.": "每个“Current Rig”的值必须已存在于{rigsLink}——钻机无法识别的行将被跳过并列出。",
  "Rigs page": "“钻机”页面",
  "If any NID in the file matches another row or an existing employee, the whole file is rejected so you can fix it first.": "如果文件中有任何 NID 与其他行或现有员工重复，整个文件将被拒绝，请先修正后再上传。",
  "File (.csv or .xlsx)": "文件（.csv 或 .xlsx）",
  "Import File": "导入文件",
  "The file has no data rows.": "文件中没有数据行。",
  "{n} row(s) loaded from {file}.": "已从 {file} 加载 {n} 行。",
  "Couldn't read that file: {msg}": "无法读取该文件：{msg}",
  "Importing…": "正在导入…",
  "Row {n}: NID \"{nid}\" duplicates row {m} in this file.": "第 {n} 行：NID “{nid}” 与本文件第 {m} 行重复。",
  "Row {n}: NID \"{nid}\" already belongs to existing employee {name} (ID {id}).": "第 {n} 行：NID “{nid}” 已属于现有员工 {name}（编号 {id}）。",
  "Import cancelled — duplicate NID(s) found. Fix these and re-upload:": "导入已取消——发现重复的 NID。请修正后重新上传：",
  "Row {n}: missing Name.": "第 {n} 行：缺少姓名。",
  "Row {n}: missing Designation.": "第 {n} 行：缺少职务。",
  "Row {n}: missing Current Rig.": "第 {n} 行：缺少当前钻机。",
  "Row {n}: Current Rig \"{rig}\" doesn't exist yet — add it on the Rigs page first.": "第 {n} 行：当前钻机“{rig}”尚不存在——请先在“钻机”页面添加。",
  "Row {n}: Joining Date \"{v}\" couldn't be read.": "第 {n} 行：无法识别入职日期“{v}”。",
  "No rows could be imported.": "没有可导入的行。",
  "Import failed while inserting employees: {msg}": "插入员工时导入失败：{msg}",
  "Employees imported, but some transfer records failed: {msg}": "员工已导入，但部分调动记录创建失败：{msg}",
  "Imported {ok} of {total} row(s) — Employee IDs {a}–{b}.": "已导入 {total} 行中的 {ok} 行——员工编号 {a}–{b}。",
  "{n} row(s) skipped:": "已跳过 {n} 行：",
  "{n} employee(s) imported.": "已导入 {n} 名员工。",

  // ---- add training ----
  "No employees found. Add employees first.": "未找到员工，请先添加员工。",
  "Rig *": "钻机 *",
  "Assistant Driller *": "副司钻 *",
  "No employees found for the selected Rig / Assistant Driller.": "所选钻机/副司钻下没有员工。",
  "Employees — {label}": "员工 — {label}",
  "Select all": "全选",
  "Clear": "清除",
  "Training Course *": "培训课程 *",
  "Training Date *": "培训日期 *",
  "Trainer *": "培训师 *",
  "Trainer name": "培训师姓名",
  "Add Training to Selected Employees": "为所选员工添加培训",
  "Select at least one employee.": "请至少选择一名员工。",
  "Trainer name is required.": "请填写培训师姓名。",
  "Training date is required.": "请填写培训日期。",
  "Error adding training: {msg}": "添加培训出错：{msg}",
  "{n} employee(s) added to training: {course}.": "已为 {n} 名员工添加培训：{course}。",

  // ---- employee details / edit / report ----
  "Employee not found — it may have been deleted.": "未找到该员工——可能已被删除。",
  "Edit Info": "编辑信息",
  "Generate Report": "生成报告",
  "NID: {v}": "身份证号：{v}",
  "Assistant Driller:": "副司钻：",
  "Rig / AD Transfer History": "钻机/副司钻调动记录",
  "No rig transfer history.": "暂无钻机调动记录。",
  "Training History": "培训记录",
  "No training recorded.": "暂无培训记录。",
  "Rig at Training": "培训时所在钻机",
  "Delete Employee & All Associated Data": "删除员工及所有相关数据",
  "Delete {name} (ID {id})? This removes their training records and rig transfer history too. This can't be undone.": "删除 {name}（编号 {id}）？这也会删除其培训记录和钻机调动记录，且无法撤销。",
  "Error deleting training records: {msg}": "删除培训记录出错：{msg}",
  "Error deleting transfer history: {msg}": "删除调动记录出错：{msg}",
  "Error deleting employee: {msg}": "删除员工出错：{msg}",
  "{name} and all associated data deleted.": "已删除 {name} 及所有相关数据。",
  "Edit Employee Info": "编辑员工信息",
  "Employee ID is fixed and can't be changed. To move this employee to a new Rig or Assistant Driller, use the transfer flow under Add Employee (enter their NID there) instead — that keeps rig history accurate.": "员工编号固定，无法修改。如需将该员工调至新的钻机或副司钻，请使用“添加员工”中的调动流程（在那里输入其 NID）——这样可以保证钻机记录准确。",
  "Save Changes": "保存更改",
  "Another employee already has this NID.": "已有其他员工使用该 NID。",
  "Error saving changes: {msg}": "保存更改出错：{msg}",
  "{name}'s info updated.": "已更新 {name} 的信息。",
  "CNPC CHUANQING DRILLING ENGINEERING COMPANY LIMITED (CCDC)": "中国石油集团川庆钻探工程有限公司 (CCDC)",
  "HSE Department — Employee Training & Personnel Record": "HSE 部门——员工培训与人事记录",
  "Employee Training Summary Report": "员工培训汇总报告",
  "Employee ID": "员工编号",
  "Report Generated": "报告生成日期",
  "Training completed: <strong>{done} of {total}</strong> courses on record.": "已完成培训：<strong>{done} / {total}</strong> 门课程（有记录）。",
  "Rig / Assistant Driller Transfer History": "钻机/副司钻调动记录",
  "No rig transfer history on record.": "暂无钻机调动记录。",
  "HSE Supervisor": "HSE 主管",
  "Employee Signature": "员工签名",
  "Generated from the CCDC HSE Training Monitor on {date}.": "由 CCDC HSE 培训监控系统生成于 {date}。",

  // ---- courses / rigs ----
  "Course ID": "课程编号",
  "Course Name": "课程名称",
  "No courses yet.": "暂无课程。",
  "Add Course": "添加课程",
  "Course ID *": "课程编号 *",
  "Course Name *": "课程名称 *",
  "e.g. FIRE": "例如：FIRE",
  "e.g. Fire Safety": "例如：Fire Safety",
  "Course ID and name are both required.": "课程编号和名称均为必填项。",
  "A course with this ID already exists.": "已存在相同编号的课程。",
  "Error adding course: {msg}": "添加课程出错：{msg}",
  "Course \"{name}\" added.": "已添加课程“{name}”。",
  "Employees Assigned": "已分配员工数",
  "No rigs yet — add one below.": "暂无钻机——请在下方添加。",
  "Add Rig": "添加钻机",
  "Rig Name *": "钻机名称 *",
  "e.g. Titas-32": "例如：Titas-32",
  "Rig name is required.": "请填写钻机名称。",
  "This rig already exists.": "该钻机已存在。",
  "Error adding rig: {msg}": "添加钻机出错：{msg}",
  "Rig \"{name}\" added.": "已添加钻机“{name}”。",

  // ---- dashboard ----
  "Rigs in Use": "在用钻机",
  "Overall Compliance": "总体合规率",
  "Zero-Training Employees": "零培训员工",
  "Courses Tracked": "跟踪课程数",
  "Rig × Course Compliance Heatmap": "钻机 × 课程合规热力图",
  "% of each rig's crew who have completed each course. Darker green is better; hover a cell for the exact count.": "各钻机人员完成各门课程的百分比。绿色越深越好；将鼠标悬停在单元格上可查看具体人数。",
  "Compliance Rankings": "合规排名",
  "Course Completion — Worst First": "课程完成率——由低到高",
  "Rig Compliance — Worst First": "钻机合规率——由低到高",
  "Risk Flags": "风险提示",
  "Zero-Training Employees ({n})": "零培训员工（{n}）",
  "Every employee has at least one training record.": "每位员工至少有一条培训记录。",
  "{n} of these joined within the last 60 days — onboarding training may be overdue.": "其中 {n} 人在最近 60 天内入职——入职培训可能已逾期。",
  "Trainer Load": "培训师工作量",
  "No training sessions recorded yet.": "尚未记录任何培训课次。",
  "{name} has delivered {pct}% of all sessions — a single point of failure if they're unavailable.": "{name} 承担了全部培训课次的 {pct}%——一旦其无法授课就会成为单点故障。",
  "Training Activity Over Time": "培训活动趋势",
  "No training records yet.": "暂无培训记录。",
  "Not enough data yet for a heatmap.": "数据不足，暂无法生成热力图。",
  "{trained}/{total} employees ({pct}%)": "{trained}/{total} 名员工（{pct}%）",
  "{pct}% average compliance": "平均合规率 {pct}%",
};

// Designations shown on screen (the database keeps the English value).
const DES_ZH = {
  "Assistant Driller": "副司钻",
  "Floorman": "钻工",
  "Derrickman": "井架工",
  "Roustabout": "场地工",
  "Welder": "焊工",
  "Electrician": "电工",
  "Motorman": "机械工",
  "Driller": "司钻",
  "Toolpusher": "钻井队长",
};

// Course names/IDs shown on screen. Keys are lower-case; unknown courses stay in English.
const COURSE_ZH = {
  "confine space": "密闭空间作业",
  "confined space": "密闭空间作业",
  "confined space entry": "密闭空间作业",
  "electrical safety": "电气安全",
  "fire": "消防",
  "fire safety": "消防安全",
  "fire fighting": "消防",
  "firefighting": "消防",
  "first aid": "急救",
  "forklift safety": "叉车安全",
  "forklift": "叉车安全",
  "h2s": "硫化氢",
  "h2s safety": "硫化氢安全",
  "heat stress": "热应激",
  "hira": "危害识别与风险评估",
  "loto": "上锁挂牌",
  "ptw": "作业许可",
  "permit to work": "作业许可",
  "working at height": "高处作业",
  "work at height": "高处作业",
  "lifting": "起重作业",
  "lifting operation": "起重作业",
  "defensive driving": "防御性驾驶",
  "ppe": "个人防护装备",
  "well control": "井控",
  "bosiet": "海上生存训练",
  "hse induction": "HSE 入职培训",
  "induction": "入职培训",
};

// tx = translate (plain text: toasts, confirm boxes, chart labels)
// txe = translate and HTML-escape (use inside innerHTML templates)
function tx(key, params){
  let s = key;
  if (LANG === "zh"){
    if (Object.prototype.hasOwnProperty.call(ZH, key)) s = ZH[key];
    else if (!tx._warned.has(key)){ tx._warned.add(key); console.warn("[i18n] no Chinese text for:", key); }
  }
  if (params) s = s.replace(/\{(\w+)\}/g, (m, k)=> (k in params ? params[k] : m));
  return s;
}
tx._warned = new Set();
function txe(key, params){ return esc(tx(key, params)); }

function tDes(d){
  const v = clean(d);
  return (LANG === "zh" && v && DES_ZH[v]) ? DES_ZH[v] : v;
}
function tCourse(s){
  const v = clean(s);
  if (LANG !== "zh" || !v) return v;
  return COURSE_ZH[v.toLowerCase().replace(/\s+/g, " ")] || v;
}

function setElText(el, text){
  const textNodes = [...el.childNodes].filter(n => n.nodeType === 3 && n.nodeValue.trim() !== "");
  if (textNodes.length) textNodes[textNodes.length - 1].nodeValue = text;
  else if (!el.children.length) el.textContent = text;
  else el.appendChild(document.createTextNode(text));
}

function renderConnStatus(){
  const el = document.getElementById("conn-status");
  if (!el) return;
  const c = state.conn || "connecting";
  el.textContent = c === "ok" ? tx("● Connected") : c === "err" ? tx("● Connection error") : tx("Connecting…");
  el.className = "conn-status" + (c === "ok" ? " ok" : c === "err" ? " err" : "");
}

function applyStaticTranslations(){
  document.documentElement.lang = LANG === "zh" ? "zh-CN" : "en";
  document.title = tx("CCDC HSE — Training Monitor");
  document.querySelectorAll("[data-i18n]").forEach(el => setElText(el, tx(el.dataset.i18n)));
  document.querySelectorAll(".lang-btn").forEach(b => b.classList.toggle("active", b.dataset.lang === LANG));
  renderConnStatus();
}

function setLang(lang){
  const next = lang === "zh" ? "zh" : "en";
  if (next === LANG) return;
  LANG = next;
  try { localStorage.setItem("hse_lang", LANG); } catch(e){}
  applyStaticTranslations();
  renderCurrentView();
}

// ============================================================
// STATE
// ============================================================
const state = {
  employees: [],
  courses: [],
  training: [],
  transfers: [],
  rigs: [],
  currentView: "matrix",
  previousView: "employees",
  detailsEmployeeId: null,
};

// ============================================================
// HELPERS
// ============================================================
function clean(v){ return (v === null || v === undefined) ? "" : String(v).trim(); }

const MONTHS_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function fmtDateObj(d){
  if (LANG === "zh") return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;
  return `${String(d.getDate()).padStart(2,"0")}-${MONTHS_EN[d.getMonth()]}-${d.getFullYear()}`;
}

function fmtMonthYear(y, m){
  return LANG === "zh" ? `${y}年${m}月` : `${MONTHS_EN[m-1]} ${y}`;
}

function fmtDate(v){
  if (!v) return "";
  const d = new Date(v + (String(v).length === 10 ? "T00:00:00" : ""));
  if (isNaN(d)) return "";
  return fmtDateObj(d);
}

function maskNid(v){
  const nid = clean(v);
  if (!nid) return "";
  return "*".repeat(Math.max(0, nid.length - 4)) + nid.slice(-4);
}

function sortByDesignation(list){
  const order = {};
  DESIGNATION_ORDER.forEach((d,i)=>order[d]=i);
  return [...list].sort((a,b)=>{
    const oa = order[a.designation] ?? DESIGNATION_ORDER.length;
    const ob = order[b.designation] ?? DESIGNATION_ORDER.length;
    if (oa !== ob) return oa - ob;
    return String(a.name).localeCompare(String(b.name));
  });
}

function uniq(arr){ return [...new Set(arr)].filter(x => x !== null && x !== undefined && String(x).trim() !== ""); }

function esc(s){
  return String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

function toast(msg, isError=false){
  const stack = document.getElementById("toast-stack");
  const el = document.createElement("div");
  el.className = "toast" + (isError ? " error" : "");
  el.textContent = msg;
  stack.appendChild(el);
  setTimeout(()=>el.remove(), 3800);
}

function assistantDrillers(){
  return uniq(state.employees.filter(e=>e.designation==="Assistant Driller").map(e=>e.name)).sort();
}

function ridOf(rig){ return state.rigs.find(r=>r.rig_name===rig); }

// ============================================================
// DATA LOADING
// ============================================================
async function loadAll(){
  try{
    const [emp, crs, trn, trf, rgs] = await Promise.all([
      sb.from("employees").select("*").order("employee_id"),
      sb.from("courses").select("*").order("course_id"),
      sb.from("training_records").select("*"),
      sb.from("rig_transfer_history").select("*"),
      sb.from("rigs").select("*").order("rig_name"),
    ]);
    for (const r of [emp,crs,trn,trf,rgs]) if (r.error) throw r.error;

    state.employees = emp.data || [];
    state.courses = crs.data || [];
    state.training = trn.data || [];
    state.transfers = trf.data || [];
    state.rigs = rgs.data || [];

    state.conn = "ok";
    renderConnStatus();
    return true;
  }catch(err){
    console.error(err);
    state.conn = "err";
    renderConnStatus();
    toast(tx("Could not load data: {msg}", { msg: err.message || err }), true);
    return false;
  }
}

async function refresh(){
  await loadAll();
  renderCurrentView();
}

// ============================================================
// NAV / ROUTING
// ============================================================
function setView(view){
  if (view !== "details") state.previousView = view;
  state.currentView = view;
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(n=>n.classList.remove("active"));
  document.getElementById("view-" + view).classList.add("active");
  const navBtn = document.querySelector(`.nav-item[data-view="${view}"]`);
  if (navBtn) navBtn.classList.add("active");
  renderCurrentView();
}

function openDetails(employeeId){
  state.detailsEmployeeId = employeeId;
  state.detailsEditing = false;
  state.currentView = "details";
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(n=>n.classList.remove("active"));
  document.getElementById("view-details").classList.add("active");
  renderDetails();
}

function renderCurrentView(){
  switch(state.currentView){
    case "matrix": renderMatrix(); break;
    case "dashboard": renderDashboard(); break;
    case "employees": renderEmployees(); break;
    case "add-employee": renderAddEmployee(); break;
    case "add-training": renderAddTraining(); break;
    case "courses": renderCourses(); break;
    case "rigs": renderRigs(); break;
    case "details": renderDetails(); break;
  }
}

// ============================================================
// 1. TRAINING MATRIX
// ============================================================
function renderMatrix(){
  const rigs = uniq(state.employees.map(e=>e.current_rig)).sort();
  const ads = assistantDrillers();
  const desigs = uniq([...DESIGNATIONS, ...state.employees.map(e=>e.designation)]).sort();

  document.getElementById("matrix-filters").innerHTML = `
    <select id="mx-rig"><option value="All">${txe("All rigs")}</option>${rigs.map(r=>`<option>${esc(r)}</option>`).join("")}</select>
    <select id="mx-ad"><option value="All">${txe("All Assistant Drillers")}</option>${ads.map(a=>`<option>${esc(a)}</option>`).join("")}</select>
    <select id="mx-des"><option value="All">${txe("All designations")}</option>${desigs.map(d=>`<option value="${esc(d)}">${esc(tDes(d))}</option>`).join("")}</select>
  `;

  const draw = () => {
    const rigF = document.getElementById("mx-rig").value;
    const adF = document.getElementById("mx-ad").value;
    const desF = document.getElementById("mx-des").value;

    let df = state.employees.filter(e=>
      (rigF==="All" || String(e.current_rig)===rigF) &&
      (adF==="All" || String(e.assistant_driller)===adF) &&
      (desF==="All" || String(e.designation)===desF)
    );

    const body = document.getElementById("matrix-body");
    if (df.length === 0){
      body.innerHTML = `<div class="alert alert-info">${txe("No employees match the selected filters.")}</div>`;
      return;
    }

    const groups = {};
    df.forEach(e=>{
      const key = clean(e.assistant_driller) || "Not Assigned";
      (groups[key] = groups[key] || []).push(e);
    });

    // Fixed column widths shared across every group's table, so columns
    // line up from one table to the next even though each is separate.
    const nameW = Math.min(220, Math.max(120, Math.max(...df.map(e=>e.name.length), 4) * 7 + 40));
    const courseW = Math.min(108, Math.max(64, Math.max(...state.courses.map(c=>c.course_id.length), 3) * 6 + 18));
    const colgroup = `<colgroup><col style="width:${nameW}px">${state.courses.map(()=>`<col style="width:${courseW}px">`).join("")}</colgroup>`;
    const headerRow = `<thead><tr><th class="matrix-name-col">${txe("Name")}</th>${state.courses.map(c=>`<th title="${esc(tCourse(c.course_name))}">${esc(tCourse(c.course_id))}</th>`).join("")}</tr></thead>`;

    let html = "";
    Object.keys(groups).sort().forEach(adName=>{
      const groupEmployees = groups[adName];
      html += `<div class="group-heading">${txe("Assistant Driller: {name}", { name: adName === "Not Assigned" ? tx("Not Assigned") : adName })} <span class="group-count">(${groupEmployees.length})</span></div>`;
      html += `<div class="tbl-wrap"><table class="matrix-table">${colgroup}${headerRow}<tbody>`;
      groupEmployees.slice().sort((a,b)=>String(a.name).localeCompare(String(b.name))).forEach(e=>{
        html += `<tr><td class="matrix-name-col"><button class="tbl-link" data-open="${e.employee_id}">${esc(e.name)}</button></td>`;
        state.courses.forEach(c=>{
          const records = state.training.filter(t=>t.employee_id===e.employee_id && t.course_id===c.course_id);
          if (records.length === 0){ html += `<td></td>`; return; }
          const dates = records.map(r=>fmtDate(r.training_date)).sort().join(", ");
          const cellContent = records.length === 1
            ? '<span class="check-yes">✓</span>'
            : `<span class="check-yes check-multi">✓×${records.length}</span>`;
          html += `<td title="${txe("Trained on: {dates}", { dates })}">${cellContent}</td>`;
        });
        html += `</tr>`;
      });
      html += `</tbody></table></div>`;
    });
    body.innerHTML = html;
    body.querySelectorAll("[data-open]").forEach(btn=>{
      btn.addEventListener("click", ()=>openDetails(Number(btn.dataset.open)));
    });
  };

  ["mx-rig","mx-ad","mx-des"].forEach(id=>document.getElementById(id).addEventListener("change", draw));
  draw();
}

// ============================================================
// DASHBOARD
// ============================================================
function cssVar(name){ return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

function heatColor(pct){
  const hue = 4 + (pct/100) * 138; // 4=red -> 142=green
  return `hsl(${hue}, 68%, 90%)`;
}
function heatText(pct){
  const hue = 4 + (pct/100) * 138;
  return `hsl(${hue}, 55%, 28%)`;
}
function daysSince(dateStr){
  if (!dateStr) return null;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

function destroyChart(id){
  if (state.charts && state.charts[id]){ state.charts[id].destroy(); delete state.charts[id]; }
}
function makeChart(id, config){
  if (!state.charts) state.charts = {};
  destroyChart(id);
  const ctx = document.getElementById(id);
  if (!ctx) return;
  state.charts[id] = new Chart(ctx, config);
}

function renderDashboard(){
  const body = document.getElementById("dashboard-body");
  const totalEmployees = state.employees.length;
  const totalCourses = state.courses.length;
  const rigsInUse = uniq(state.employees.map(e=>e.current_rig)).sort();

  // ---- KPIs ----
  const completedPairs = new Set(state.training.map(t=>`${t.employee_id}|${t.course_id}`)).size;
  const overallPct = (totalEmployees && totalCourses) ? Math.round((completedPairs / (totalEmployees*totalCourses)) * 100) : null;
  const zeroTraining = state.employees.filter(e=>!state.training.some(t=>t.employee_id===e.employee_id));
  const newHireUntrained = zeroTraining.filter(e=> e.joining_date && daysSince(e.joining_date) !== null && daysSince(e.joining_date) <= 60);

  // ---- Trainer concentration ----
  const trainerCounts = {};
  state.training.forEach(t=>{ const name = clean(t.trainer) || "Unknown"; trainerCounts[name] = (trainerCounts[name]||0)+1; });
  const trainerList = Object.entries(trainerCounts).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count);
  const totalSessions = state.training.length;
  const topTrainerShare = (totalSessions && trainerList.length) ? trainerList[0].count/totalSessions : 0;
  const trainerLabel = n => n === "Unknown" ? tx("Unknown") : n;

  // ---- Course compliance ranking (worst first) ----
  const courseCompliance = state.courses.map(c=>{
    const trained = uniq(state.training.filter(t=>t.course_id===c.course_id).map(t=>t.employee_id)).length;
    return { id: c.course_id, name: c.course_name, pct: totalEmployees ? (trained/totalEmployees*100) : 0, trained };
  }).sort((a,b)=>a.pct-b.pct);

  // ---- Rig compliance ranking (worst first) ----
  const rigCompliance = rigsInUse.map(rig=>{
    const rigEmployees = state.employees.filter(e=>e.current_rig===rig);
    const total = rigEmployees.length;
    if (!total || !totalCourses) return { rig, pct: 0 };
    let sum = 0;
    state.courses.forEach(c=>{
      const trained = rigEmployees.filter(e=>state.training.some(t=>t.employee_id===e.employee_id && t.course_id===c.course_id)).length;
      sum += (trained/total*100);
    });
    return { rig, pct: sum/totalCourses };
  }).sort((a,b)=>a.pct-b.pct);

  // ---- Activity trend (trainings per month) ----
  const monthCounts = {};
  state.training.forEach(t=>{
    if (!t.training_date) return;
    const key = String(t.training_date).slice(0,7);
    monthCounts[key] = (monthCounts[key]||0)+1;
  });
  const months = Object.keys(monthCounts).sort().slice(-12);
  const monthLabels = months.map(m=>{
    const [y,mo] = m.split("-");
    return fmtMonthYear(Number(y), Number(mo));
  });

  // ---- KPI cards ----
  body.innerHTML = `
    <div class="kpi-row">
      <div class="kpi-card"><div class="kpi-value">${totalEmployees}</div><div class="kpi-label">${txe("Employees")}</div></div>
      <div class="kpi-card"><div class="kpi-value">${rigsInUse.length}</div><div class="kpi-label">${txe("Rigs in Use")}</div></div>
      <div class="kpi-card"><div class="kpi-value">${overallPct===null ? "—" : overallPct+"%"}</div><div class="kpi-label">${txe("Overall Compliance")}</div></div>
      <div class="kpi-card ${zeroTraining.length>0 ? "kpi-warn" : ""}"><div class="kpi-value">${zeroTraining.length}</div><div class="kpi-label">${txe("Zero-Training Employees")}</div></div>
      <div class="kpi-card"><div class="kpi-value">${totalCourses}</div><div class="kpi-label">${txe("Courses Tracked")}</div></div>
    </div>

    <div class="section-title">${txe("Rig × Course Compliance Heatmap")}</div>
    <p class="muted small">${txe("% of each rig's crew who have completed each course. Darker green is better; hover a cell for the exact count.")}</p>
    <div id="dash-heatmap"></div>

    <div class="section-title">${txe("Compliance Rankings")}</div>
    <div class="dash-grid-2">
      <div class="card"><div class="card-title">${txe("Course Completion — Worst First")}</div><div class="chart-wrap"><canvas id="chart-course-compliance"></canvas></div></div>
      <div class="card"><div class="card-title">${txe("Rig Compliance — Worst First")}</div><div class="chart-wrap"><canvas id="chart-rig-compliance"></canvas></div></div>
    </div>

    <div class="section-title">${txe("Risk Flags")}</div>
    <div class="dash-grid-2">
      <div class="card">
        <div class="card-title">${txe("Zero-Training Employees ({n})", { n: zeroTraining.length })}</div>
        ${zeroTraining.length===0 ? `<div class="alert alert-success">${txe("Every employee has at least one training record.")}</div>` : `
          <div class="tbl-wrap" style="max-height:260px;overflow-y:auto"><table><tbody>
            ${zeroTraining.map(e=>`<tr><td><button class="tbl-link" data-open="${e.employee_id}">${esc(e.name)}</button></td><td class="muted small">${esc(tDes(e.designation))||"—"}</td><td class="muted small">${esc(e.current_rig)||"—"}</td></tr>`).join("")}
          </tbody></table></div>
        `}
        ${newHireUntrained.length>0 ? `<div class="alert alert-warn" style="margin-top:12px">${txe("{n} of these joined within the last 60 days — onboarding training may be overdue.", { n: newHireUntrained.length })}</div>` : ""}
      </div>
      <div class="card">
        <div class="card-title">${txe("Trainer Load")}</div>
        ${trainerList.length===0 ? `<div class="alert alert-info">${txe("No training sessions recorded yet.")}</div>` : `
          ${topTrainerShare > 0.5 ? `<div class="alert alert-warn">${txe("{name} has delivered {pct}% of all sessions — a single point of failure if they're unavailable.", { name: trainerLabel(trainerList[0].name), pct: Math.round(topTrainerShare*100) })}</div>` : ""}
          <div class="chart-wrap"><canvas id="chart-trainer-load"></canvas></div>
        `}
      </div>
    </div>

    <div class="section-title">${txe("Training Activity Over Time")}</div>
    ${months.length===0 ? `<div class="alert alert-info">${txe("No training records yet.")}</div>` : `<div class="card"><div class="chart-wrap"><canvas id="chart-activity"></canvas></div></div>`}
  `;

  body.querySelectorAll("[data-open]").forEach(btn=>{
    btn.addEventListener("click", ()=>openDetails(Number(btn.dataset.open)));
  });

  // ---- Heatmap table ----
  const heatmapEl = document.getElementById("dash-heatmap");
  if (rigsInUse.length===0 || totalCourses===0){
    heatmapEl.innerHTML = `<div class="alert alert-info">${txe("Not enough data yet for a heatmap.")}</div>`;
  } else {
    let html = `<div class="tbl-wrap"><table class="heatmap-table"><thead><tr><th>${txe("Rig")}</th>`;
    state.courses.forEach(c=> html += `<th title="${esc(tCourse(c.course_name))}">${esc(tCourse(c.course_id))}</th>`);
    html += `</tr></thead><tbody>`;
    rigsInUse.forEach(rig=>{
      const rigEmployees = state.employees.filter(e=>e.current_rig===rig);
      const total = rigEmployees.length;
      html += `<tr><td class="heatmap-rig-col">${esc(rig)}</td>`;
      state.courses.forEach(c=>{
        const trained = rigEmployees.filter(e=>state.training.some(t=>t.employee_id===e.employee_id && t.course_id===c.course_id)).length;
        const pct = total ? Math.round(trained/total*100) : 0;
        html += `<td style="background:${heatColor(pct)};color:${heatText(pct)}" title="${txe("{trained}/{total} employees ({pct}%)", { trained, total, pct })}">${pct}%</td>`;
      });
      html += `</tr>`;
    });
    html += `</tbody></table></div>`;
    heatmapEl.innerHTML = html;
  }

  // ---- Charts ----
  const red = cssVar("--red"), orange = cssVar("--orange"), green = cssVar("--green"), navy = cssVar("--navy"), border = cssVar("--border");
  const barColor = (pct)=> pct < 40 ? red : pct < 75 ? orange : green;

  if (courseCompliance.length){
    makeChart("chart-course-compliance", {
      type: "bar",
      data: {
        labels: courseCompliance.map(c=>tCourse(c.id)),
        datasets: [{ data: courseCompliance.map(c=>Math.round(c.pct)), backgroundColor: courseCompliance.map(c=>barColor(c.pct)) }],
      },
      options: {
        indexAxis: "y", responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display:false }, tooltip: { callbacks: { label: (ctx)=>`${ctx.parsed.x}% (${courseCompliance[ctx.dataIndex].trained}/${totalEmployees})` } } },
        scales: { x: { min:0, max:100, ticks:{ callback:v=>v+"%" }, grid:{ color:border } }, y: { grid:{ display:false } } },
      }
    });
  }

  if (rigCompliance.length){
    makeChart("chart-rig-compliance", {
      type: "bar",
      data: {
        labels: rigCompliance.map(r=>r.rig),
        datasets: [{ data: rigCompliance.map(r=>Math.round(r.pct)), backgroundColor: rigCompliance.map(r=>barColor(r.pct)) }],
      },
      options: {
        indexAxis: "y", responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display:false }, tooltip: { callbacks: { label: (ctx)=>tx("{pct}% average compliance", { pct: ctx.parsed.x }) } } },
        scales: { x: { min:0, max:100, ticks:{ callback:v=>v+"%" }, grid:{ color:border } }, y: { grid:{ display:false } } },
      }
    });
  }

  if (trainerList.length){
    makeChart("chart-trainer-load", {
      type: "bar",
      data: {
        labels: trainerList.map(x=>trainerLabel(x.name)),
        datasets: [{ data: trainerList.map(t=>t.count), backgroundColor: navy }],
      },
      options: {
        indexAxis: "y", responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display:false } },
        scales: { x: { ticks:{ precision:0 }, grid:{ color:border } }, y: { grid:{ display:false } } },
      }
    });
  }

  if (months.length){
    makeChart("chart-activity", {
      type: "line",
      data: {
        labels: monthLabels,
        datasets: [{ data: months.map(m=>monthCounts[m]), borderColor: red, backgroundColor: red, tension:0.25, fill:false, pointRadius:3 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display:false } },
        scales: { y: { beginAtZero:true, ticks:{ precision:0 }, grid:{ color:border } }, x: { grid:{ display:false } } },
      }
    });
  }
}

// ============================================================
// 2. EMPLOYEES
// ============================================================
function renderEmployees(){
  const rigs = uniq(state.employees.map(e=>e.current_rig)).sort();
  const ads = assistantDrillers();

  document.getElementById("employees-filters").innerHTML = `
    <input id="em-search" type="text" placeholder="${txe("Search by name…")}" style="min-width:220px">
    <select id="em-rig"><option value="All">${txe("All rigs")}</option>${rigs.map(r=>`<option>${esc(r)}</option>`).join("")}</select>
    <select id="em-ad"><option value="All">${txe("All Assistant Drillers")}</option>${ads.map(a=>`<option>${esc(a)}</option>`).join("")}</select>
  `;

  const draw = ()=>{
    const q = document.getElementById("em-search").value.trim().toLowerCase();
    const rigF = document.getElementById("em-rig").value;
    const adF = document.getElementById("em-ad").value;

    let df = state.employees.filter(e=>
      (!q || String(e.name).toLowerCase().includes(q)) &&
      (rigF==="All" || String(e.current_rig)===rigF) &&
      (adF==="All" || String(e.assistant_driller)===adF)
    );

    document.getElementById("employees-count").textContent = tx("{n} employee(s) found.", { n: df.length });

    const wrap = document.getElementById("employees-table");
    if (df.length === 0){
      wrap.innerHTML = `<div class="alert alert-info">${txe("No employees match the selected filters.")}</div>`;
      return;
    }

    let html = `<div class="tbl-wrap"><table><thead><tr>
      <th>${txe("ID")}</th><th>${txe("Name")}</th><th>${txe("NID")}</th><th>${txe("Designation")}</th><th>${txe("Assistant Driller")}</th><th>${txe("Current Rig")}</th><th>${txe("Joining Date")}</th>
    </tr></thead><tbody>`;
    df.forEach(e=>{
      html += `<tr>
        <td>${e.employee_id}</td>
        <td><button class="tbl-link" data-open="${e.employee_id}">${esc(e.name)}</button></td>
        <td>${esc(maskNid(e.nid_number)) || "—"}</td>
        <td>${esc(tDes(e.designation)) || "—"}</td>
        <td>${esc(e.assistant_driller) || txe("Not Assigned")}</td>
        <td>${esc(e.current_rig) || "—"}</td>
        <td>${fmtDate(e.joining_date)}</td>
      </tr>`;
    });
    html += `</tbody></table></div>`;
    wrap.innerHTML = html;
    wrap.querySelectorAll("[data-open]").forEach(btn=>{
      btn.addEventListener("click", ()=>openDetails(Number(btn.dataset.open)));
    });
  };

  document.getElementById("em-search").addEventListener("input", draw);
  document.getElementById("em-rig").addEventListener("change", draw);
  document.getElementById("em-ad").addEventListener("change", draw);
  draw();
}

// ============================================================
// 3. ADD EMPLOYEE (+ transfer-by-NID flow)
// ============================================================
function renderAddEmployee(){
  const outer = document.getElementById("add-employee-body");
  if (!state.addEmployeeTab) state.addEmployeeTab = "single";

  outer.innerHTML = `
    <div class="tab-row">
      <button class="tab-btn ${state.addEmployeeTab==='single'?'active':''}" id="tab-single">${txe("Single Employee")}</button>
      <button class="tab-btn ${state.addEmployeeTab==='batch'?'active':''}" id="tab-batch">${txe("Batch Upload")}</button>
    </div>
    <div id="add-employee-panel"></div>
  `;
  document.getElementById("tab-single").addEventListener("click", ()=>{ state.addEmployeeTab="single"; renderAddEmployee(); });
  document.getElementById("tab-batch").addEventListener("click", ()=>{ state.addEmployeeTab="batch"; renderAddEmployee(); });

  if (state.addEmployeeTab === "batch") renderBatchUpload();
  else renderAddEmployeeSingle();
}

function renderAddEmployeeSingle(){
  const body = document.getElementById("add-employee-panel");
  body.innerHTML = `
    <div class="field" style="max-width:320px">
      <label>${txe("NID Number (optional)")}</label>
      <input id="ae-nid" type="text" placeholder="${txe("Enter to check for an existing employee")}">
    </div>
    <div id="ae-result"></div>
  `;
  const result = document.getElementById("ae-result");

  const drawNew = () => {
    const rigs = state.rigs.map(r=>r.rig_name).sort();
    const ads = ["Not Assigned", ...assistantDrillers()];
    result.innerHTML = `
      <div class="card">
        <div class="field-row">
          <div class="field"><label>${txe("Name *")}</label><input id="ae-name" type="text"></div>
          <div class="field"><label>${txe("Designation *")}</label><select id="ae-des">${DESIGNATIONS.map(d=>`<option value="${esc(d)}">${esc(tDes(d))}</option>`).join("")}</select></div>
        </div>
        <div class="field-row">
          <div class="field"><label>${txe("Current Rig *")}</label><select id="ae-rig">${rigs.length ? rigs.map(r=>`<option>${esc(r)}</option>`).join("") : `<option value="">${txe("No rigs yet — add one under Rigs")}</option>`}</select></div>
          <div class="field"><label>${txe("Assistant Driller")}</label><select id="ae-ad">${ads.map(a=>`<option value="${esc(a)}">${a==="Not Assigned" ? txe("Not Assigned") : esc(a)}</option>`).join("")}</select></div>
        </div>
        <div class="field" style="max-width:220px"><label>${txe("Joining Date")}</label><input id="ae-join" type="date" value="${new Date().toISOString().slice(0,10)}"></div>
        <button class="btn btn-primary" id="ae-submit">${txe("Add Employee")}</button>
      </div>
    `;
    document.getElementById("ae-submit").addEventListener("click", async ()=>{
      const name = document.getElementById("ae-name").value.trim();
      const designation = document.getElementById("ae-des").value;
      const rig = document.getElementById("ae-rig").value;
      const adVal = document.getElementById("ae-ad").value;
      const joinDate = document.getElementById("ae-join").value;
      const nid = document.getElementById("ae-nid").value.trim();

      if (!name){ toast(tx("Name is required."), true); return; }
      if (!rig){ toast(tx("Add a rig first (under Rigs)."), true); return; }

      const maxId = state.employees.reduce((m,e)=>Math.max(m,e.employee_id),1000);
      const newId = maxId + 1;

      const { error: e1 } = await sb.from("employees").insert([{
        employee_id: newId, name, designation, nid_number: nid || null,
        current_rig: rig, assistant_driller: adVal==="Not Assigned" ? null : adVal,
        joining_date: joinDate || null,
      }]);
      if (e1){ toast(tx("Error adding employee: {msg}", { msg: e1.message }), true); return; }

      const { error: e2 } = await sb.from("rig_transfer_history").insert([{
        employee_id: newId, rig, from_date: joinDate || null, to_date: null,
      }]);
      if (e2){ toast(tx("Employee added, but transfer record failed: {msg}", { msg: e2.message }), true); }
      else { toast(tx("{name} added successfully.", { name })); }

      await refresh();
      setView("add-employee");
    });
  };

  document.getElementById("ae-nid").addEventListener("input", ()=>{
    const nid = document.getElementById("ae-nid").value.trim();
    if (!nid){ drawNew(); return; }
    const existing = state.employees.find(e => clean(e.nid_number) === nid);
    if (!existing){ drawNew(); return; }

    const rigs = state.rigs.map(r=>r.rig_name).sort();
    result.innerHTML = `
      <div class="alert alert-info">${txe("This NID already exists. This employee will be transferred to a new Rig / Assistant Driller instead of creating a duplicate.")}</div>
      <div class="card">
        <div class="metric-row" style="grid-template-columns:repeat(3,1fr)">
          <div class="metric"><div class="metric-label">${txe("Name")}</div><div class="metric-value">${esc(existing.name)}</div></div>
          <div class="metric"><div class="metric-label">${txe("Current Rig")}</div><div class="metric-value">${esc(existing.current_rig) || "—"}</div></div>
          <div class="metric"><div class="metric-label">${txe("Current Assistant Driller")}</div><div class="metric-value">${esc(existing.assistant_driller) || txe("Not Assigned")}</div></div>
        </div>
        <p class="muted small">${txe("Designation: {d}", { d: tDes(existing.designation) || "—" })}</p>
        <hr class="divider">
        <div class="card-title">${txe("Transfer to New Rig")}</div>
        <div class="field-row">
          <div class="field"><label>${txe("New Rig *")}</label><select id="tr-rig">${rigs.map(r=>`<option ${r===existing.current_rig?'selected':''}>${esc(r)}</option>`).join("")}</select></div>
          <div class="field"><label>${txe("New Assistant Driller")}</label><select id="tr-ad"></select></div>
        </div>
        <div class="field" style="max-width:220px"><label>${txe("Transfer Date *")}</label><input id="tr-date" type="date" value="${new Date().toISOString().slice(0,10)}"></div>
        <div style="display:flex;gap:10px">
          <button class="btn btn-primary" id="tr-submit">${txe("Transfer Employee")}</button>
          <button class="btn" id="tr-view">${txe("Open Employee Details")}</button>
        </div>
      </div>
    `;

    const adSelect = document.getElementById("tr-ad");
    const populateAd = ()=>{
      const newRig = document.getElementById("tr-rig").value;
      const rigAds = uniq(state.employees.filter(e=>e.current_rig===newRig && e.designation==="Assistant Driller").map(e=>e.name)).sort();
      adSelect.innerHTML = `<option value="Not Assigned">${txe("Not Assigned")}</option>${rigAds.map(a=>`<option ${a===existing.assistant_driller?'selected':''}>${esc(a)}</option>`).join("")}`;
    };
    document.getElementById("tr-rig").addEventListener("change", populateAd);
    populateAd();

    document.getElementById("tr-view").addEventListener("click", ()=>openDetails(existing.employee_id));

    document.getElementById("tr-submit").addEventListener("click", async ()=>{
      const newRig = document.getElementById("tr-rig").value;
      const adRaw = document.getElementById("tr-ad").value;
      const newAd = adRaw === "Not Assigned" ? null : adRaw;
      const transferDate = document.getElementById("tr-date").value;
      if (!transferDate){ toast(tx("Transfer date is required."), true); return; }

      if (clean(existing.current_rig)===newRig && clean(existing.assistant_driller)===clean(newAd)){
        toast(tx("Selected Rig and Assistant Driller are the same as current assignment."), true);
        return;
      }
      await transferEmployee(existing.employee_id, newRig, newAd, transferDate);
      toast(tx("{name} transferred to {rig}.", { name: existing.name, rig: newRig }));
      await refresh();
      setView("add-employee");
    });
  });

  drawNew();
}

async function transferEmployee(employeeId, newRig, newAd, transferDate){
  const openRecord = state.transfers
    .filter(t=>t.employee_id===employeeId && !t.to_date)
    .sort((a,b)=>String(b.from_date).localeCompare(String(a.from_date)))[0];

  if (openRecord){
    const { error } = await sb.from("rig_transfer_history").update({ to_date: transferDate }).eq("id", openRecord.id);
    if (error) toast(tx("Warning: couldn't close previous transfer record: {msg}", { msg: error.message }), true);
  }

  const { error: e1 } = await sb.from("rig_transfer_history").insert([{
    employee_id: employeeId, rig: newRig, from_date: transferDate, to_date: null,
  }]);
  if (e1) toast(tx("Error creating transfer record: {msg}", { msg: e1.message }), true);

  const { error: e2 } = await sb.from("employees").update({
    current_rig: newRig, assistant_driller: newAd,
  }).eq("employee_id", employeeId);
  if (e2) toast(tx("Error updating employee: {msg}", { msg: e2.message }), true);
}

// ------------------------------------------------------------
// Batch employee upload (CSV / Excel)
// ------------------------------------------------------------
const BATCH_HEADER_MAP = {
  "name": "name",
  "designation": "designation",
  "nid number": "nid_number",
  "nid": "nid_number",
  "current rig": "current_rig",
  "rig": "current_rig",
  "assistant driller": "assistant_driller",
  "joining date": "joining_date",
};

function parseFlexibleDate(v){
  if (v === null || v === undefined || v === "") return null;
  // Excel serial date number (e.g. from .xlsx cells)
  if (typeof v === "number"){
    const d = new Date(Math.round((v - 25569) * 86400 * 1000));
    return isNaN(d) ? null : d.toISOString().slice(0,10);
  }
  const s = String(v).trim();
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return `${m[1]}-${m[2].padStart(2,"0")}-${m[3].padStart(2,"0")}`;
  m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2,"0")}-${m[1].padStart(2,"0")}`; // assume DD-MM-YYYY
  const d = new Date(s);
  return isNaN(d) ? null : d.toISOString().slice(0,10);
}

function renderBatchUpload(){
  const body = document.getElementById("add-employee-panel");
  body.innerHTML = `
    <div class="card">
      <div class="card-title">${txe("Upload Employees from CSV / Excel")}</div>
      <div class="alert alert-info">
        ${txe("Expected columns (any order, header names not case-sensitive):")} <strong>Name, Designation, NID Number, Current Rig, Assistant Driller, Joining Date</strong>.
        ${txe("Employee ID is generated automatically — don't include it. Assistant Driller and Joining Date are both optional — leave either blank and fill it in later from Edit Info on the employee's page.")}
        ${tx('Each "Current Rig" value must already exist on the {rigsLink} — rows with an unrecognized rig are skipped and reported.', { rigsLink: `<button class="btn-link" style="display:inline" id="bu-goto-rigs">${txe("Rigs page")}</button>` })}
        ${txe("If any NID in the file matches another row or an existing employee, the whole file is rejected so you can fix it first.")}
      </div>
      <div class="field" style="max-width:360px">
        <label>${txe("File (.csv or .xlsx)")}</label>
        <input type="file" id="bu-file" accept=".csv,.xlsx,.xls">
      </div>
      <button class="btn btn-primary" id="bu-import" disabled>${txe("Import File")}</button>
    </div>
    <div id="bu-result"></div>
  `;

  document.getElementById("bu-goto-rigs").addEventListener("click", ()=>setView("rigs"));

  const fileInput = document.getElementById("bu-file");
  const importBtn = document.getElementById("bu-import");
  let parsedRows = null;

  fileInput.addEventListener("change", ()=>{
    parsedRows = null;
    importBtn.disabled = true;
    document.getElementById("bu-result").innerHTML = "";
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e)=>{
      try{
        const isCsv = file.name.toLowerCase().endsWith(".csv");
        const wb = isCsv
          ? XLSX.read(e.target.result, { type: "string" })
          : XLSX.read(e.target.result, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        if (raw.length === 0){ toast(tx("The file has no data rows."), true); return; }

        parsedRows = raw.map(row=>{
          const mapped = {};
          Object.keys(row).forEach(h=>{
            const key = BATCH_HEADER_MAP[h.trim().toLowerCase()];
            if (key) mapped[key] = typeof row[h] === "string" ? row[h].trim() : row[h];
          });
          return mapped;
        });
        toast(tx("{n} row(s) loaded from {file}.", { n: parsedRows.length, file: file.name }));
        importBtn.disabled = false;
      }catch(err){
        toast(tx("Couldn't read that file: {msg}", { msg: err.message }), true);
      }
    };
    if (file.name.toLowerCase().endsWith(".csv")) reader.readAsText(file);
    else reader.readAsArrayBuffer(file);
  });

  importBtn.addEventListener("click", async ()=>{
    if (!parsedRows) return;
    importBtn.disabled = true;
    const resultEl = document.getElementById("bu-result");
    resultEl.innerHTML = `<div class="alert alert-info">${txe("Importing…")}</div>`;

    // Pass 1 — check for duplicate NIDs (within file and against existing employees)
    const nidSeen = new Map(); // nid -> first row index
    const nidConflicts = [];
    parsedRows.forEach((row, i)=>{
      const nid = clean(row.nid_number);
      if (!nid) return;
      if (nidSeen.has(nid)){
        nidConflicts.push(tx('Row {n}: NID "{nid}" duplicates row {m} in this file.', { n: i+1, nid, m: nidSeen.get(nid)+1 }));
      } else {
        nidSeen.set(nid, i);
      }
      const existing = state.employees.find(e=>clean(e.nid_number)===nid);
      if (existing){
        nidConflicts.push(tx('Row {n}: NID "{nid}" already belongs to existing employee {name} (ID {id}).', { n: i+1, nid, name: existing.name, id: existing.employee_id }));
      }
    });

    if (nidConflicts.length > 0){
      resultEl.innerHTML = `
        <div class="alert alert-error">${txe("Import cancelled — duplicate NID(s) found. Fix these and re-upload:")}</div>
        <div class="tbl-wrap"><table><tbody>${nidConflicts.map(c=>`<tr><td>${esc(c)}</td></tr>`).join("")}</tbody></table></div>
      `;
      importBtn.disabled = false;
      return;
    }

    // Pass 2 — validate each row individually
    const rigNames = new Set(state.rigs.map(r=>r.rig_name.toLowerCase()));
    const validRows = [];
    const skipped = [];

    parsedRows.forEach((row, i)=>{
      const name = clean(row.name);
      const designation = clean(row.designation);
      const rigInput = clean(row.current_rig);
      const rigMatch = state.rigs.find(r=>r.rig_name.toLowerCase()===rigInput.toLowerCase());
      // Keep the original type here (number or string) — parseFlexibleDate
      // needs to see a raw number when the cell was an Excel date serial.
      // Stringifying it first (e.g. via clean()) breaks that check and can
      // turn a serial like 46114.12 into the string "46114.12", which
      // JS's Date parser misreads as year 46114, month 12.
      const joinDateRaw = row.joining_date;
      const hasJoinDate = joinDateRaw !== null && joinDateRaw !== undefined && joinDateRaw !== "";
      const joinDate = hasJoinDate ? parseFlexibleDate(joinDateRaw) : null;

      if (!name){ skipped.push(tx("Row {n}: missing Name.", { n: i+1 })); return; }
      if (!designation){ skipped.push(tx("Row {n}: missing Designation.", { n: i+1 })); return; }
      if (!rigInput){ skipped.push(tx("Row {n}: missing Current Rig.", { n: i+1 })); return; }
      if (!rigMatch){ skipped.push(tx('Row {n}: Current Rig "{rig}" doesn\'t exist yet — add it on the Rigs page first.', { n: i+1, rig: rigInput })); return; }
      if (hasJoinDate && !joinDate){ skipped.push(tx('Row {n}: Joining Date "{v}" couldn\'t be read.', { n: i+1, v: row.joining_date })); return; }

      const adRaw = clean(row.assistant_driller);
      const assistantDriller = (adRaw && adRaw.toLowerCase() !== "not assigned") ? adRaw : null;

      validRows.push({
        name, designation, nid_number: clean(row.nid_number) || null,
        current_rig: rigMatch.rig_name, assistant_driller: assistantDriller, joining_date: joinDate,
      });
    });

    if (validRows.length === 0){
      resultEl.innerHTML = `
        <div class="alert alert-error">${txe("No rows could be imported.")}</div>
        <div class="tbl-wrap"><table><tbody>${skipped.map(s=>`<tr><td>${esc(s)}</td></tr>`).join("")}</tbody></table></div>
      `;
      importBtn.disabled = false;
      return;
    }

    let nextId = state.employees.reduce((m,e)=>Math.max(m,e.employee_id),1000) + 1;
    const employeeRows = validRows.map(r=>({ employee_id: nextId++, ...r }));

    const { error: e1 } = await sb.from("employees").insert(employeeRows);
    if (e1){
      resultEl.innerHTML = `<div class="alert alert-error">${txe("Import failed while inserting employees: {msg}", { msg: e1.message })}</div>`;
      importBtn.disabled = false;
      return;
    }

    const transferRows = employeeRows.map(r=>({
      employee_id: r.employee_id, rig: r.current_rig, from_date: r.joining_date, to_date: null,
    }));
    const { error: e2 } = await sb.from("rig_transfer_history").insert(transferRows);
    if (e2) toast(tx("Employees imported, but some transfer records failed: {msg}", { msg: e2.message }), true);

    resultEl.innerHTML = `
      <div class="alert alert-success">${txe("Imported {ok} of {total} row(s) — Employee IDs {a}–{b}.", { ok: employeeRows.length, total: parsedRows.length, a: employeeRows[0].employee_id, b: employeeRows[employeeRows.length-1].employee_id })}</div>
      ${skipped.length > 0 ? `
        <div class="alert alert-warn">${txe("{n} row(s) skipped:", { n: skipped.length })}</div>
        <div class="tbl-wrap"><table><tbody>${skipped.map(s=>`<tr><td>${esc(s)}</td></tr>`).join("")}</tbody></table></div>
      ` : ""}
    `;
    toast(tx("{n} employee(s) imported.", { n: employeeRows.length }));
    await refresh();
  });
}

// ============================================================
// 4. ADD TRAINING
// ============================================================
function renderAddTraining(){
  const body = document.getElementById("add-training-body");
  const rigs = uniq(state.employees.map(e=>e.current_rig)).sort();

  if (rigs.length === 0){
    body.innerHTML = `<div class="alert alert-info">${txe("No employees found. Add employees first.")}</div>`;
    return;
  }

  body.innerHTML = `
    <div class="field-row">
      <div class="field"><label>${txe("Rig *")}</label><select id="at-rig">${rigs.map(r=>`<option>${esc(r)}</option>`).join("")}</select></div>
      <div class="field"><label>${txe("Assistant Driller *")}</label><select id="at-ad"></select></div>
    </div>
    <hr class="divider">
    <div id="at-employees"></div>
  `;

  const rigSelect = document.getElementById("at-rig");
  const adSelect = document.getElementById("at-ad");

  const populateAd = ()=>{
    const rig = rigSelect.value;
    const rigAds = uniq(state.employees.filter(e=>e.current_rig===rig).map(e=>e.assistant_driller)).sort();
    adSelect.innerHTML = `<option value="All Assistant Drillers">${txe("All Assistant Drillers")}</option>${rigAds.map(a=>`<option>${esc(a)}</option>`).join("")}`;
    drawEmployees();
  };

  const drawEmployees = ()=>{
    const rig = rigSelect.value;
    const ad = adSelect.value;
    let list = state.employees.filter(e=>e.current_rig===rig);
    if (ad && ad !== "All Assistant Drillers") list = list.filter(e=>e.assistant_driller===ad);
    list = sortByDesignation(list);

    const wrap = document.getElementById("at-employees");
    if (list.length === 0){
      wrap.innerHTML = `<div class="alert alert-info">${txe("No employees found for the selected Rig / Assistant Driller.")}</div>`;
      return;
    }

    wrap.innerHTML = `
      <div class="card-title">${txe("Employees — {label}", { label: rig + (ad && ad!=="All Assistant Drillers" ? " / " + ad : "") })}</div>
      <div class="checklist-toolbar">
        <p class="muted small">${txe("{n} employee(s) found.", { n: list.length })}</p>
        <div class="checklist-actions">
          <button type="button" class="btn-link" id="at-select-all">${txe("Select all")}</button>
          <button type="button" class="btn-link" id="at-select-none">${txe("Clear")}</button>
        </div>
      </div>
      <div class="check-list" id="at-checklist">
        ${list.map(e=>`
          <label class="check-item">
            <span class="check-item-left">
              <input type="checkbox" value="${e.employee_id}">
              ${esc(e.name)}
            </span>
            <span class="des-tag">${esc(tDes(e.designation))}</span>
          </label>
        `).join("")}
      </div>
      <hr class="divider">
      <div class="field-row-3">
        <div class="field"><label>${txe("Training Course *")}</label>
          <select id="at-course">${state.courses.map(c=>`<option value="${esc(c.course_id)}">${esc(tCourse(c.course_name))}</option>`).join("")}</select>
        </div>
        <div class="field"><label>${txe("Training Date *")}</label><input id="at-date" type="date" value="${new Date().toISOString().slice(0,10)}"></div>
        <div class="field"><label>${txe("Trainer *")}</label><input id="at-trainer" type="text" placeholder="${txe("Trainer name")}"></div>
      </div>
      <button class="btn btn-primary" id="at-submit">${txe("Add Training to Selected Employees")}</button>
    `;

    document.getElementById("at-select-all").addEventListener("click", ()=>{
      document.querySelectorAll("#at-checklist input").forEach(cb=>cb.checked=true);
    });
    document.getElementById("at-select-none").addEventListener("click", ()=>{
      document.querySelectorAll("#at-checklist input").forEach(cb=>cb.checked=false);
    });

    document.getElementById("at-submit").addEventListener("click", async ()=>{
      const checked = [...document.querySelectorAll("#at-checklist input:checked")].map(c=>Number(c.value));
      const courseId = document.getElementById("at-course").value;
      const trainingDate = document.getElementById("at-date").value;
      const trainer = document.getElementById("at-trainer").value.trim();

      if (checked.length === 0){ toast(tx("Select at least one employee."), true); return; }
      if (!trainer){ toast(tx("Trainer name is required."), true); return; }
      if (!trainingDate){ toast(tx("Training date is required."), true); return; }

      const rows = checked.map(id=>{
        const emp = state.employees.find(e=>e.employee_id===id);
        return { employee_id: id, course_id: courseId, training_date: trainingDate, trainer, rig_at_training: emp.current_rig };
      });

      const { error } = await sb.from("training_records").insert(rows);
      if (error){ toast(tx("Error adding training: {msg}", { msg: error.message }), true); return; }

      const courseName = state.courses.find(c=>c.course_id===courseId)?.course_name || courseId;
      toast(tx("{n} employee(s) added to training: {course}.", { n: rows.length, course: tCourse(courseName) }));
      await refresh();
      setView("add-training");
    });
  };

  rigSelect.addEventListener("change", populateAd);
  adSelect.addEventListener("change", drawEmployees);
  populateAd();
}

// ============================================================
// 5. EMPLOYEE DETAILS
// ============================================================
function renderDetails(){
  const emp = state.employees.find(e=>e.employee_id===state.detailsEmployeeId);
  const body = document.getElementById("details-body");
  document.getElementById("back-to-employees").onclick = ()=>setView(state.previousView);

  if (!emp){
    document.getElementById("details-name").textContent = tx("Employee Details");
    body.innerHTML = `<div class="alert alert-info">${txe("Employee not found — it may have been deleted.")}</div>`;
    return;
  }
  document.getElementById("details-name").textContent = emp.name;

  if (state.detailsEditing) renderDetailsEditForm(emp, body);
  else renderDetailsView(emp, body);
}

function renderDetailsView(emp, body){
  const nid = clean(emp.nid_number);
  const hist = state.transfers.filter(t=>t.employee_id===emp.employee_id)
    .sort((a,b)=>String(a.from_date).localeCompare(String(b.from_date)));
  const training = state.training.filter(t=>t.employee_id===emp.employee_id)
    .sort((a,b)=>String(a.training_date).localeCompare(String(b.training_date)));

  body.innerHTML = `
    <div style="display:flex;justify-content:flex-end;gap:10px;margin-bottom:16px">
      <button class="btn" id="edit-employee">${txe("Edit Info")}</button>
      <button class="btn btn-primary" id="gen-report">${txe("Generate Report")}</button>
    </div>

    <div class="metric-row">
      <div class="metric"><div class="metric-label">${txe("Name")}</div><div class="metric-value">${esc(emp.name)}</div></div>
      <div class="metric"><div class="metric-label">${txe("Designation")}</div><div class="metric-value">${esc(tDes(emp.designation)) || "—"}</div></div>
      <div class="metric"><div class="metric-label">${txe("Current Rig")}</div><div class="metric-value">${esc(emp.current_rig) || "—"}</div></div>
      <div class="metric"><div class="metric-label">${txe("Joining Date")}</div><div class="metric-value">${fmtDate(emp.joining_date) || "—"}</div></div>
    </div>
    <p class="muted small">${txe("NID: {v}", { v: nid ? maskNid(nid) : tx("Not provided") })}</p>
    <p style="margin:0 0 18px"><strong>${txe("Assistant Driller:")}</strong> ${esc(emp.assistant_driller) || txe("Not Assigned")}</p>

    <div class="section-title">${txe("Rig / AD Transfer History")}</div>
    ${hist.length === 0 ? `<div class="alert alert-info">${txe("No rig transfer history.")}</div>` : `
      <div class="tbl-wrap"><table><thead><tr><th>${txe("Rig")}</th><th>${txe("From Date")}</th><th>${txe("To Date")}</th></tr></thead><tbody>
        ${hist.map(h=>`<tr><td>${esc(h.rig)}</td><td>${fmtDate(h.from_date)}</td><td>${h.to_date ? fmtDate(h.to_date) : txe("Present")}</td></tr>`).join("")}
      </tbody></table></div>
    `}

    <div class="section-title">${txe("Training History")}</div>
    ${training.length === 0 ? `<div class="alert alert-info">${txe("No training recorded.")}</div>` : `
      <div class="tbl-wrap"><table><thead><tr><th>${txe("Training")}</th><th>${txe("Date")}</th><th>${txe("Trainer")}</th><th>${txe("Rig at Training")}</th></tr></thead><tbody>
        ${training.map(t=>{
          const course = state.courses.find(c=>c.course_id===t.course_id);
          return `<tr><td>${esc(tCourse(course ? course.course_name : t.course_id))}</td><td>${fmtDate(t.training_date)}</td><td>${esc(t.trainer)}</td><td>${esc(t.rig_at_training) || "—"}</td></tr>`;
        }).join("")}
      </tbody></table></div>
    `}

    <hr class="divider">
    <button class="btn btn-danger" id="del-employee">${txe("Delete Employee & All Associated Data")}</button>
  `;

  document.getElementById("edit-employee").addEventListener("click", ()=>{
    state.detailsEditing = true;
    renderDetails();
  });

  document.getElementById("gen-report").addEventListener("click", ()=>generateReport(emp, hist, training));

  document.getElementById("del-employee").addEventListener("click", async ()=>{
    if (!confirm(tx("Delete {name} (ID {id})? This removes their training records and rig transfer history too. This can't be undone.", { name: emp.name, id: emp.employee_id }))) return;

    const { error: e1 } = await sb.from("training_records").delete().eq("employee_id", emp.employee_id);
    if (e1){ toast(tx("Error deleting training records: {msg}", { msg: e1.message }), true); return; }

    const { error: e2 } = await sb.from("rig_transfer_history").delete().eq("employee_id", emp.employee_id);
    if (e2){ toast(tx("Error deleting transfer history: {msg}", { msg: e2.message }), true); return; }

    const { error: e3 } = await sb.from("employees").delete().eq("employee_id", emp.employee_id);
    if (e3){ toast(tx("Error deleting employee: {msg}", { msg: e3.message }), true); return; }

    toast(tx("{name} and all associated data deleted.", { name: emp.name }));
    await refresh();
    setView("employees");
  });
}

function renderDetailsEditForm(emp, body){
  body.innerHTML = `
    <div class="card" style="max-width:560px">
      <div class="card-title">${txe("Edit Employee Info")}</div>
      <div class="alert alert-info">${txe("Employee ID is fixed and can't be changed. To move this employee to a new Rig or Assistant Driller, use the transfer flow under Add Employee (enter their NID there) instead — that keeps rig history accurate.")}</div>
      <div class="field"><label>${txe("Name *")}</label><input id="ed-name" type="text" value="${esc(emp.name)}"></div>
      <div class="field-row">
        <div class="field"><label>${txe("NID Number")}</label><input id="ed-nid" type="text" value="${esc(emp.nid_number) || ""}" placeholder="${txe("Not provided")}"></div>
        <div class="field"><label>${txe("Designation *")}</label>
          <select id="ed-des">${DESIGNATIONS.map(d=>`<option value="${esc(d)}" ${d===emp.designation?'selected':''}>${esc(tDes(d))}</option>`).join("")}</select>
        </div>
      </div>
      <div class="field" style="max-width:220px"><label>${txe("Joining Date")}</label><input id="ed-join" type="date" value="${emp.joining_date || ""}"></div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-primary" id="ed-save">${txe("Save Changes")}</button>
        <button class="btn" id="ed-cancel">${txe("Cancel")}</button>
      </div>
    </div>
  `;

  document.getElementById("ed-cancel").addEventListener("click", ()=>{
    state.detailsEditing = false;
    renderDetails();
  });

  document.getElementById("ed-save").addEventListener("click", async ()=>{
    const name = document.getElementById("ed-name").value.trim();
    const nid = document.getElementById("ed-nid").value.trim();
    const designation = document.getElementById("ed-des").value;
    const joining = document.getElementById("ed-join").value;

    if (!name){ toast(tx("Name is required."), true); return; }
    if (nid && state.employees.some(e=>e.employee_id!==emp.employee_id && clean(e.nid_number)===nid)){
      toast(tx("Another employee already has this NID."), true); return;
    }

    const { error } = await sb.from("employees").update({
      name, nid_number: nid || null, designation, joining_date: joining || null,
    }).eq("employee_id", emp.employee_id);

    if (error){ toast(tx("Error saving changes: {msg}", { msg: error.message }), true); return; }

    toast(tx("{name}'s info updated.", { name }));
    state.detailsEditing = false;
    await refresh();
    openDetails(emp.employee_id);
  });
}

// ------------------------------------------------------------
// Printable employee report
// ------------------------------------------------------------
function generateReport(emp, hist, training){
  const completedCourses = uniq(training.map(t=>t.course_id));
  const totalCourses = state.courses.length;
  const today = new Date();
  const generatedOn = fmtDateObj(today);

  const html = `
    <div class="report-letterhead">
      <div class="report-org">${txe("CNPC CHUANQING DRILLING ENGINEERING COMPANY LIMITED (CCDC)")}</div>
      <div class="report-dept">${txe("HSE Department — Employee Training & Personnel Record")}</div>
    </div>
    <h1 class="report-title">${txe("Employee Training Summary Report")}</h1>

    <table class="report-info">
      <tr><th>${txe("Employee ID")}</th><td>${emp.employee_id}</td><th>${txe("Name")}</th><td>${esc(emp.name)}</td></tr>
      <tr><th>${txe("Designation")}</th><td>${esc(tDes(emp.designation)) || "—"}</td><th>${txe("NID Number")}</th><td>${esc(clean(emp.nid_number)) || txe("Not provided")}</td></tr>
      <tr><th>${txe("Current Rig")}</th><td>${esc(emp.current_rig) || "—"}</td><th>${txe("Assistant Driller")}</th><td>${esc(emp.assistant_driller) || txe("Not Assigned")}</td></tr>
      <tr><th>${txe("Joining Date")}</th><td>${fmtDate(emp.joining_date) || "—"}</td><th>${txe("Report Generated")}</th><td>${generatedOn}</td></tr>
    </table>

    <div class="report-summary">${tx("Training completed: <strong>{done} of {total}</strong> courses on record.", { done: completedCourses.length, total: totalCourses })}</div>

    <h2 class="report-section">${txe("Rig / Assistant Driller Transfer History")}</h2>
    ${hist.length === 0 ? `<p class="report-empty">${txe("No rig transfer history on record.")}</p>` : `
      <table class="report-table">
        <thead><tr><th>${txe("Rig")}</th><th>${txe("From Date")}</th><th>${txe("To Date")}</th></tr></thead>
        <tbody>${hist.map(h=>`<tr><td>${esc(h.rig)}</td><td>${fmtDate(h.from_date)}</td><td>${h.to_date ? fmtDate(h.to_date) : txe("Present")}</td></tr>`).join("")}</tbody>
      </table>
    `}

    <h2 class="report-section">${txe("Training History")}</h2>
    ${training.length === 0 ? `<p class="report-empty">${txe("No training recorded.")}</p>` : `
      <table class="report-table">
        <thead><tr><th>${txe("Course")}</th><th>${txe("Date")}</th><th>${txe("Trainer")}</th><th>${txe("Rig at Training")}</th></tr></thead>
        <tbody>${training.map(t=>{
          const course = state.courses.find(c=>c.course_id===t.course_id);
          return `<tr><td>${esc(tCourse(course ? course.course_name : t.course_id))}</td><td>${fmtDate(t.training_date)}</td><td>${esc(t.trainer)}</td><td>${esc(t.rig_at_training) || "—"}</td></tr>`;
        }).join("")}</tbody>
      </table>
    `}

    <div class="report-signatures">
      <div class="sig-block"><div class="sig-line"></div><div class="sig-label">${txe("HSE Supervisor")}</div></div>
      <div class="sig-block"><div class="sig-line"></div><div class="sig-label">${txe("Employee Signature")}</div></div>
    </div>
    <div class="report-footer">${txe("Generated from the CCDC HSE Training Monitor on {date}.", { date: generatedOn })}</div>
  `;

  document.getElementById("print-report").innerHTML = html;
  window.print();
}

// ============================================================
// 6. COURSES
// ============================================================
function renderCourses(){
  const body = document.getElementById("courses-body");
  body.innerHTML = `
    <div class="tbl-wrap"><table><thead><tr><th>${txe("Course ID")}</th><th>${txe("Course Name")}</th></tr></thead><tbody>
      ${state.courses.length === 0 ? '' : state.courses.map(c=>`<tr><td>${esc(c.course_id)}</td><td>${esc(tCourse(c.course_name))}</td></tr>`).join("")}
    </tbody></table></div>
    ${state.courses.length === 0 ? `<div class="alert alert-info" style="margin-top:12px">${txe("No courses yet.")}</div>` : ''}

    <div class="card" style="margin-top:20px">
      <div class="card-title">${txe("Add Course")}</div>
      <div class="field-row">
        <div class="field"><label>${txe("Course ID *")}</label><input id="c-id" type="text" placeholder="${txe("e.g. FIRE")}"></div>
        <div class="field"><label>${txe("Course Name *")}</label><input id="c-name" type="text" placeholder="${txe("e.g. Fire Safety")}"></div>
      </div>
      <button class="btn btn-primary" id="c-submit">${txe("Add Course")}</button>
    </div>
  `;

  document.getElementById("c-submit").addEventListener("click", async ()=>{
    const id = document.getElementById("c-id").value.trim();
    const name = document.getElementById("c-name").value.trim();
    if (!id || !name){ toast(tx("Course ID and name are both required."), true); return; }
    if (state.courses.some(c=>c.course_id.toLowerCase()===id.toLowerCase())){
      toast(tx("A course with this ID already exists."), true); return;
    }
    const { error } = await sb.from("courses").insert([{ course_id: id, course_name: name }]);
    if (error){ toast(tx("Error adding course: {msg}", { msg: error.message }), true); return; }
    toast(tx('Course "{name}" added.', { name }));
    await refresh();
    setView("courses");
  });
}

// ============================================================
// 7. RIGS
// ============================================================
function renderRigs(){
  const body = document.getElementById("rigs-body");
  const counts = {};
  state.employees.forEach(e=>{ if (e.current_rig) counts[e.current_rig] = (counts[e.current_rig]||0)+1; });

  body.innerHTML = `
    <div class="tbl-wrap"><table><thead><tr><th>${txe("Rig")}</th><th>${txe("Employees Assigned")}</th></tr></thead><tbody>
      ${state.rigs.length === 0 ? '' : state.rigs.map(r=>`<tr><td>${esc(r.rig_name)}</td><td>${counts[r.rig_name]||0}</td></tr>`).join("")}
    </tbody></table></div>
    ${state.rigs.length === 0 ? `<div class="alert alert-info" style="margin-top:12px">${txe("No rigs yet — add one below.")}</div>` : ''}

    <div class="card" style="margin-top:20px">
      <div class="card-title">${txe("Add Rig")}</div>
      <div class="field" style="max-width:280px"><label>${txe("Rig Name *")}</label><input id="r-name" type="text" placeholder="${txe("e.g. Titas-32")}"></div>
      <button class="btn btn-primary" id="r-submit">${txe("Add Rig")}</button>
    </div>
  `;

  document.getElementById("r-submit").addEventListener("click", async ()=>{
    const name = document.getElementById("r-name").value.trim();
    if (!name){ toast(tx("Rig name is required."), true); return; }
    if (state.rigs.some(r=>r.rig_name.toLowerCase()===name.toLowerCase())){
      toast(tx("This rig already exists."), true); return;
    }
    const { error } = await sb.from("rigs").insert([{ rig_name: name }]);
    if (error){ toast(tx("Error adding rig: {msg}", { msg: error.message }), true); return; }
    toast(tx('Rig "{name}" added.', { name }));
    await refresh();
    setView("rigs");
  });
}

// ============================================================
// INIT
// ============================================================
document.querySelectorAll(".nav-item").forEach(btn=>{
  btn.addEventListener("click", ()=>setView(btn.dataset.view));
});

document.querySelectorAll(".lang-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>setLang(btn.dataset.lang));
});

(async function init(){
  applyStaticTranslations();
  await loadAll();
  renderCurrentView();
})();
