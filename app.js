// ============================================================
// CONFIG — your Supabase project
// ============================================================
const SUPABASE_URL = "https://ucgqbdfliqdkscjtwyxy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjZ3FiZGZsaXFka3NjanR3eXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNjUyNzAsImV4cCI6MjEwNTg0MTI3MH0.TjMO2b382KHG62Jv38LDh4MXk7WMJEqGyr5re01QbSg";

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DESIGNATIONS = ["Roustabout","Floorman","Derrickman","Assistant Driller","Welder","Electrician","Motorman"];
const DESIGNATION_ORDER = ["Assistant Driller","Floorman","Derrickman","Roustabout","Welder","Electrician","Motorman"];

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

function fmtDate(v){
  if (!v) return "";
  const d = new Date(v + (String(v).length === 10 ? "T00:00:00" : ""));
  if (isNaN(d)) return "";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${String(d.getDate()).padStart(2,"0")}-${months[d.getMonth()]}-${d.getFullYear()}`;
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
  const statusEl = document.getElementById("conn-status");
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

    statusEl.textContent = "● Connected";
    statusEl.className = "conn-status ok";
    return true;
  }catch(err){
    console.error(err);
    statusEl.textContent = "● Connection error";
    statusEl.className = "conn-status err";
    toast("Could not load data: " + (err.message || err), true);
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
    <select id="mx-rig"><option value="All">All rigs</option>${rigs.map(r=>`<option>${esc(r)}</option>`).join("")}</select>
    <select id="mx-ad"><option value="All">All Assistant Drillers</option>${ads.map(a=>`<option>${esc(a)}</option>`).join("")}</select>
    <select id="mx-des"><option value="All">All designations</option>${desigs.map(d=>`<option>${esc(d)}</option>`).join("")}</select>
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
      body.innerHTML = `<div class="alert alert-info">No employees match the selected filters.</div>`;
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
    const courseW = Math.min(140, Math.max(64, Math.max(...state.courses.map(c=>c.course_id.length), 3) * 8 + 28));
    const colgroup = `<colgroup><col style="width:${nameW}px">${state.courses.map(()=>`<col style="width:${courseW}px">`).join("")}</colgroup>`;
    const headerRow = `<thead><tr><th class="matrix-name-col">Name</th>${state.courses.map(c=>`<th title="${esc(c.course_name)}">${esc(c.course_id)}</th>`).join("")}</tr></thead>`;

    let html = "";
    Object.keys(groups).sort().forEach(adName=>{
      const groupEmployees = groups[adName];
      html += `<div class="group-heading">Assistant Driller: ${esc(adName)} <span class="group-count">(${groupEmployees.length})</span></div>`;
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
          html += `<td title="Trained on: ${esc(dates)}">${cellContent}</td>`;
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
    return `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][Number(mo)-1]} ${y}`;
  });

  // ---- KPI cards ----
  body.innerHTML = `
    <div class="kpi-row">
      <div class="kpi-card"><div class="kpi-value">${totalEmployees}</div><div class="kpi-label">Employees</div></div>
      <div class="kpi-card"><div class="kpi-value">${rigsInUse.length}</div><div class="kpi-label">Rigs in Use</div></div>
      <div class="kpi-card"><div class="kpi-value">${overallPct===null ? "—" : overallPct+"%"}</div><div class="kpi-label">Overall Compliance</div></div>
      <div class="kpi-card ${zeroTraining.length>0 ? "kpi-warn" : ""}"><div class="kpi-value">${zeroTraining.length}</div><div class="kpi-label">Zero-Training Employees</div></div>
      <div class="kpi-card"><div class="kpi-value">${totalCourses}</div><div class="kpi-label">Courses Tracked</div></div>
    </div>

    <div class="section-title">Rig × Course Compliance Heatmap</div>
    <p class="muted small">% of each rig's crew who have completed each course. Darker green is better; hover a cell for the exact count.</p>
    <div id="dash-heatmap"></div>

    <div class="section-title">Compliance Rankings</div>
    <div class="dash-grid-2">
      <div class="card"><div class="card-title">Course Completion — Worst First</div><div class="chart-wrap"><canvas id="chart-course-compliance"></canvas></div></div>
      <div class="card"><div class="card-title">Rig Compliance — Worst First</div><div class="chart-wrap"><canvas id="chart-rig-compliance"></canvas></div></div>
    </div>

    <div class="section-title">Risk Flags</div>
    <div class="dash-grid-2">
      <div class="card">
        <div class="card-title">Zero-Training Employees (${zeroTraining.length})</div>
        ${zeroTraining.length===0 ? `<div class="alert alert-success">Every employee has at least one training record.</div>` : `
          <div class="tbl-wrap" style="max-height:260px;overflow-y:auto"><table><tbody>
            ${zeroTraining.map(e=>`<tr><td><button class="tbl-link" data-open="${e.employee_id}">${esc(e.name)}</button></td><td class="muted small">${esc(e.designation)||"—"}</td><td class="muted small">${esc(e.current_rig)||"—"}</td></tr>`).join("")}
          </tbody></table></div>
        `}
        ${newHireUntrained.length>0 ? `<div class="alert alert-warn" style="margin-top:12px">${newHireUntrained.length} of these joined within the last 60 days — onboarding training may be overdue.</div>` : ""}
      </div>
      <div class="card">
        <div class="card-title">Trainer Load</div>
        ${trainerList.length===0 ? `<div class="alert alert-info">No training sessions recorded yet.</div>` : `
          ${topTrainerShare > 0.5 ? `<div class="alert alert-warn">${esc(trainerList[0].name)} has delivered ${Math.round(topTrainerShare*100)}% of all sessions — a single point of failure if they're unavailable.</div>` : ""}
          <div class="chart-wrap"><canvas id="chart-trainer-load"></canvas></div>
        `}
      </div>
    </div>

    <div class="section-title">Training Activity Over Time</div>
    ${months.length===0 ? `<div class="alert alert-info">No training records yet.</div>` : `<div class="card"><div class="chart-wrap"><canvas id="chart-activity"></canvas></div></div>`}
  `;

  body.querySelectorAll("[data-open]").forEach(btn=>{
    btn.addEventListener("click", ()=>openDetails(Number(btn.dataset.open)));
  });

  // ---- Heatmap table ----
  const heatmapEl = document.getElementById("dash-heatmap");
  if (rigsInUse.length===0 || totalCourses===0){
    heatmapEl.innerHTML = `<div class="alert alert-info">Not enough data yet for a heatmap.</div>`;
  } else {
    let html = `<div class="tbl-wrap"><table class="heatmap-table"><thead><tr><th>Rig</th>`;
    state.courses.forEach(c=> html += `<th title="${esc(c.course_name)}">${esc(c.course_id)}</th>`);
    html += `</tr></thead><tbody>`;
    rigsInUse.forEach(rig=>{
      const rigEmployees = state.employees.filter(e=>e.current_rig===rig);
      const total = rigEmployees.length;
      html += `<tr><td class="heatmap-rig-col">${esc(rig)}</td>`;
      state.courses.forEach(c=>{
        const trained = rigEmployees.filter(e=>state.training.some(t=>t.employee_id===e.employee_id && t.course_id===c.course_id)).length;
        const pct = total ? Math.round(trained/total*100) : 0;
        html += `<td style="background:${heatColor(pct)};color:${heatText(pct)}" title="${trained}/${total} employees (${pct}%)">${pct}%</td>`;
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
        labels: courseCompliance.map(c=>c.id),
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
        plugins: { legend: { display:false }, tooltip: { callbacks: { label: (ctx)=>`${ctx.parsed.x}% average compliance` } } },
        scales: { x: { min:0, max:100, ticks:{ callback:v=>v+"%" }, grid:{ color:border } }, y: { grid:{ display:false } } },
      }
    });
  }

  if (trainerList.length){
    makeChart("chart-trainer-load", {
      type: "bar",
      data: {
        labels: trainerList.map(t=>t.name),
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
    <input id="em-search" type="text" placeholder="Search by name…" style="min-width:220px">
    <select id="em-rig"><option value="All">All rigs</option>${rigs.map(r=>`<option>${esc(r)}</option>`).join("")}</select>
    <select id="em-ad"><option value="All">All Assistant Drillers</option>${ads.map(a=>`<option>${esc(a)}</option>`).join("")}</select>
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

    document.getElementById("employees-count").textContent = `${df.length} employee(s) found.`;

    const wrap = document.getElementById("employees-table");
    if (df.length === 0){
      wrap.innerHTML = `<div class="alert alert-info">No employees match the selected filters.</div>`;
      return;
    }

    let html = `<div class="tbl-wrap"><table><thead><tr>
      <th>ID</th><th>Name</th><th>NID</th><th>Designation</th><th>Assistant Driller</th><th>Current Rig</th><th>Joining Date</th>
    </tr></thead><tbody>`;
    df.forEach(e=>{
      html += `<tr>
        <td>${e.employee_id}</td>
        <td><button class="tbl-link" data-open="${e.employee_id}">${esc(e.name)}</button></td>
        <td>${esc(maskNid(e.nid_number)) || "—"}</td>
        <td>${esc(e.designation) || "—"}</td>
        <td>${esc(e.assistant_driller) || "Not Assigned"}</td>
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
      <button class="tab-btn ${state.addEmployeeTab==='single'?'active':''}" id="tab-single">Single Employee</button>
      <button class="tab-btn ${state.addEmployeeTab==='batch'?'active':''}" id="tab-batch">Batch Upload</button>
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
      <label>NID Number (optional)</label>
      <input id="ae-nid" type="text" placeholder="Enter to check for an existing employee">
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
          <div class="field"><label>Name *</label><input id="ae-name" type="text"></div>
          <div class="field"><label>Designation *</label><select id="ae-des">${DESIGNATIONS.map(d=>`<option>${esc(d)}</option>`).join("")}</select></div>
        </div>
        <div class="field-row">
          <div class="field"><label>Current Rig *</label><select id="ae-rig">${rigs.length ? rigs.map(r=>`<option>${esc(r)}</option>`).join("") : '<option value="">No rigs yet — add one under Rigs</option>'}</select></div>
          <div class="field"><label>Assistant Driller</label><select id="ae-ad">${ads.map(a=>`<option>${esc(a)}</option>`).join("")}</select></div>
        </div>
        <div class="field" style="max-width:220px"><label>Joining Date</label><input id="ae-join" type="date" value="${new Date().toISOString().slice(0,10)}"></div>
        <button class="btn btn-primary" id="ae-submit">Add Employee</button>
      </div>
    `;
    document.getElementById("ae-submit").addEventListener("click", async ()=>{
      const name = document.getElementById("ae-name").value.trim();
      const designation = document.getElementById("ae-des").value;
      const rig = document.getElementById("ae-rig").value;
      const adVal = document.getElementById("ae-ad").value;
      const joinDate = document.getElementById("ae-join").value;
      const nid = document.getElementById("ae-nid").value.trim();

      if (!name){ toast("Name is required.", true); return; }
      if (!rig){ toast("Add a rig first (under Rigs).", true); return; }

      const maxId = state.employees.reduce((m,e)=>Math.max(m,e.employee_id),1000);
      const newId = maxId + 1;

      const { error: e1 } = await sb.from("employees").insert([{
        employee_id: newId, name, designation, nid_number: nid || null,
        current_rig: rig, assistant_driller: adVal==="Not Assigned" ? null : adVal,
        joining_date: joinDate || null,
      }]);
      if (e1){ toast("Error adding employee: " + e1.message, true); return; }

      const { error: e2 } = await sb.from("rig_transfer_history").insert([{
        employee_id: newId, rig, from_date: joinDate || null, to_date: null,
      }]);
      if (e2){ toast("Employee added, but transfer record failed: " + e2.message, true); }
      else { toast(`${name} added successfully.`); }

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
      <div class="alert alert-info">This NID already exists. This employee will be transferred to a new Rig / Assistant Driller instead of creating a duplicate.</div>
      <div class="card">
        <div class="metric-row" style="grid-template-columns:repeat(3,1fr)">
          <div class="metric"><div class="metric-label">Name</div><div class="metric-value">${esc(existing.name)}</div></div>
          <div class="metric"><div class="metric-label">Current Rig</div><div class="metric-value">${esc(existing.current_rig) || "—"}</div></div>
          <div class="metric"><div class="metric-label">Current Assistant Driller</div><div class="metric-value">${esc(existing.assistant_driller) || "Not Assigned"}</div></div>
        </div>
        <p class="muted small">Designation: ${esc(existing.designation) || "—"}</p>
        <hr class="divider">
        <div class="card-title">Transfer to New Rig</div>
        <div class="field-row">
          <div class="field"><label>New Rig *</label><select id="tr-rig">${rigs.map(r=>`<option ${r===existing.current_rig?'selected':''}>${esc(r)}</option>`).join("")}</select></div>
          <div class="field"><label>New Assistant Driller</label><select id="tr-ad"></select></div>
        </div>
        <div class="field" style="max-width:220px"><label>Transfer Date *</label><input id="tr-date" type="date" value="${new Date().toISOString().slice(0,10)}"></div>
        <div style="display:flex;gap:10px">
          <button class="btn btn-primary" id="tr-submit">Transfer Employee</button>
          <button class="btn" id="tr-view">Open Employee Details</button>
        </div>
      </div>
    `;

    const adSelect = document.getElementById("tr-ad");
    const populateAd = ()=>{
      const newRig = document.getElementById("tr-rig").value;
      const rigAds = uniq(state.employees.filter(e=>e.current_rig===newRig && e.designation==="Assistant Driller").map(e=>e.name)).sort();
      adSelect.innerHTML = `<option>Not Assigned</option>${rigAds.map(a=>`<option ${a===existing.assistant_driller?'selected':''}>${esc(a)}</option>`).join("")}`;
    };
    document.getElementById("tr-rig").addEventListener("change", populateAd);
    populateAd();

    document.getElementById("tr-view").addEventListener("click", ()=>openDetails(existing.employee_id));

    document.getElementById("tr-submit").addEventListener("click", async ()=>{
      const newRig = document.getElementById("tr-rig").value;
      const adRaw = document.getElementById("tr-ad").value;
      const newAd = adRaw === "Not Assigned" ? null : adRaw;
      const transferDate = document.getElementById("tr-date").value;
      if (!transferDate){ toast("Transfer date is required.", true); return; }

      if (clean(existing.current_rig)===newRig && clean(existing.assistant_driller)===clean(newAd)){
        toast("Selected Rig and Assistant Driller are the same as current assignment.", true);
        return;
      }
      await transferEmployee(existing.employee_id, newRig, newAd, transferDate);
      toast(`${existing.name} transferred to ${newRig}.`);
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
    if (error) toast("Warning: couldn't close previous transfer record: " + error.message, true);
  }

  const { error: e1 } = await sb.from("rig_transfer_history").insert([{
    employee_id: employeeId, rig: newRig, from_date: transferDate, to_date: null,
  }]);
  if (e1) toast("Error creating transfer record: " + e1.message, true);

  const { error: e2 } = await sb.from("employees").update({
    current_rig: newRig, assistant_driller: newAd,
  }).eq("employee_id", employeeId);
  if (e2) toast("Error updating employee: " + e2.message, true);
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
      <div class="card-title">Upload Employees from CSV / Excel</div>
      <div class="alert alert-info">
        Expected columns (any order, header names not case-sensitive): <strong>Name, Designation, NID Number, Current Rig, Assistant Driller, Joining Date</strong>.
        Employee ID is generated automatically — don't include it. Assistant Driller and Joining Date are both optional — leave either blank and fill it in later from Edit Info on the employee's page.
        Each "Current Rig" value must already exist on the <button class="btn-link" style="display:inline" id="bu-goto-rigs">Rigs page</button> — rows with an unrecognized rig are skipped and reported.
        If any NID in the file matches another row or an existing employee, the whole file is rejected so you can fix it first.
      </div>
      <div class="field" style="max-width:360px">
        <label>File (.csv or .xlsx)</label>
        <input type="file" id="bu-file" accept=".csv,.xlsx,.xls">
      </div>
      <button class="btn btn-primary" id="bu-import" disabled>Import File</button>
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
        if (raw.length === 0){ toast("The file has no data rows.", true); return; }

        parsedRows = raw.map(row=>{
          const mapped = {};
          Object.keys(row).forEach(h=>{
            const key = BATCH_HEADER_MAP[h.trim().toLowerCase()];
            if (key) mapped[key] = typeof row[h] === "string" ? row[h].trim() : row[h];
          });
          return mapped;
        });
        toast(`${parsedRows.length} row(s) loaded from ${file.name}.`);
        importBtn.disabled = false;
      }catch(err){
        toast("Couldn't read that file: " + err.message, true);
      }
    };
    if (file.name.toLowerCase().endsWith(".csv")) reader.readAsText(file);
    else reader.readAsArrayBuffer(file);
  });

  importBtn.addEventListener("click", async ()=>{
    if (!parsedRows) return;
    importBtn.disabled = true;
    const resultEl = document.getElementById("bu-result");
    resultEl.innerHTML = `<div class="alert alert-info">Importing…</div>`;

    // Pass 1 — check for duplicate NIDs (within file and against existing employees)
    const nidSeen = new Map(); // nid -> first row index
    const nidConflicts = [];
    parsedRows.forEach((row, i)=>{
      const nid = clean(row.nid_number);
      if (!nid) return;
      if (nidSeen.has(nid)){
        nidConflicts.push(`Row ${i+1}: NID "${nid}" duplicates row ${nidSeen.get(nid)+1} in this file.`);
      } else {
        nidSeen.set(nid, i);
      }
      const existing = state.employees.find(e=>clean(e.nid_number)===nid);
      if (existing){
        nidConflicts.push(`Row ${i+1}: NID "${nid}" already belongs to existing employee ${existing.name} (ID ${existing.employee_id}).`);
      }
    });

    if (nidConflicts.length > 0){
      resultEl.innerHTML = `
        <div class="alert alert-error">Import cancelled — duplicate NID(s) found. Fix these and re-upload:</div>
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
      const joinDateRaw = clean(row.joining_date);
      const joinDate = joinDateRaw ? parseFlexibleDate(joinDateRaw) : null;

      if (!name){ skipped.push(`Row ${i+1}: missing Name.`); return; }
      if (!designation){ skipped.push(`Row ${i+1}: missing Designation.`); return; }
      if (!rigInput){ skipped.push(`Row ${i+1}: missing Current Rig.`); return; }
      if (!rigMatch){ skipped.push(`Row ${i+1}: Current Rig "${rigInput}" doesn't exist yet — add it on the Rigs page first.`); return; }
      if (joinDateRaw && !joinDate){ skipped.push(`Row ${i+1}: Joining Date "${row.joining_date}" couldn't be read.`); return; }

      const adRaw = clean(row.assistant_driller);
      const assistantDriller = (adRaw && adRaw.toLowerCase() !== "not assigned") ? adRaw : null;

      validRows.push({
        name, designation, nid_number: clean(row.nid_number) || null,
        current_rig: rigMatch.rig_name, assistant_driller: assistantDriller, joining_date: joinDate,
      });
    });

    if (validRows.length === 0){
      resultEl.innerHTML = `
        <div class="alert alert-error">No rows could be imported.</div>
        <div class="tbl-wrap"><table><tbody>${skipped.map(s=>`<tr><td>${esc(s)}</td></tr>`).join("")}</tbody></table></div>
      `;
      importBtn.disabled = false;
      return;
    }

    let nextId = state.employees.reduce((m,e)=>Math.max(m,e.employee_id),1000) + 1;
    const employeeRows = validRows.map(r=>({ employee_id: nextId++, ...r }));

    const { error: e1 } = await sb.from("employees").insert(employeeRows);
    if (e1){
      resultEl.innerHTML = `<div class="alert alert-error">Import failed while inserting employees: ${esc(e1.message)}</div>`;
      importBtn.disabled = false;
      return;
    }

    const transferRows = employeeRows.map(r=>({
      employee_id: r.employee_id, rig: r.current_rig, from_date: r.joining_date, to_date: null,
    }));
    const { error: e2 } = await sb.from("rig_transfer_history").insert(transferRows);
    if (e2) toast("Employees imported, but some transfer records failed: " + e2.message, true);

    resultEl.innerHTML = `
      <div class="alert alert-success">Imported ${employeeRows.length} of ${parsedRows.length} row(s) — Employee IDs ${employeeRows[0].employee_id}–${employeeRows[employeeRows.length-1].employee_id}.</div>
      ${skipped.length > 0 ? `
        <div class="alert alert-warn">${skipped.length} row(s) skipped:</div>
        <div class="tbl-wrap"><table><tbody>${skipped.map(s=>`<tr><td>${esc(s)}</td></tr>`).join("")}</tbody></table></div>
      ` : ""}
    `;
    toast(`${employeeRows.length} employee(s) imported.`);
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
    body.innerHTML = `<div class="alert alert-info">No employees found. Add employees first.</div>`;
    return;
  }

  body.innerHTML = `
    <div class="field-row">
      <div class="field"><label>Rig *</label><select id="at-rig">${rigs.map(r=>`<option>${esc(r)}</option>`).join("")}</select></div>
      <div class="field"><label>Assistant Driller *</label><select id="at-ad"></select></div>
    </div>
    <hr class="divider">
    <div id="at-employees"></div>
  `;

  const rigSelect = document.getElementById("at-rig");
  const adSelect = document.getElementById("at-ad");

  const populateAd = ()=>{
    const rig = rigSelect.value;
    const rigAds = uniq(state.employees.filter(e=>e.current_rig===rig).map(e=>e.assistant_driller)).sort();
    adSelect.innerHTML = `<option>All Assistant Drillers</option>${rigAds.map(a=>`<option>${esc(a)}</option>`).join("")}`;
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
      wrap.innerHTML = `<div class="alert alert-info">No employees found for the selected Rig / Assistant Driller.</div>`;
      return;
    }

    wrap.innerHTML = `
      <div class="card-title">Employees — ${esc(rig)}${ad && ad!=="All Assistant Drillers" ? " / " + esc(ad) : ""}</div>
      <div class="checklist-toolbar">
        <p class="muted small">${list.length} employee(s) found.</p>
        <div class="checklist-actions">
          <button type="button" class="btn-link" id="at-select-all">Select all</button>
          <button type="button" class="btn-link" id="at-select-none">Clear</button>
        </div>
      </div>
      <div class="check-list" id="at-checklist">
        ${list.map(e=>`
          <label class="check-item">
            <span class="check-item-left">
              <input type="checkbox" value="${e.employee_id}">
              ${esc(e.name)}
            </span>
            <span class="des-tag">${esc(e.designation)}</span>
          </label>
        `).join("")}
      </div>
      <hr class="divider">
      <div class="field-row-3">
        <div class="field"><label>Training Course *</label>
          <select id="at-course">${state.courses.map(c=>`<option value="${esc(c.course_id)}">${esc(c.course_name)}</option>`).join("")}</select>
        </div>
        <div class="field"><label>Training Date *</label><input id="at-date" type="date" value="${new Date().toISOString().slice(0,10)}"></div>
        <div class="field"><label>Trainer *</label><input id="at-trainer" type="text" placeholder="Trainer name"></div>
      </div>
      <button class="btn btn-primary" id="at-submit">Add Training to Selected Employees</button>
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

      if (checked.length === 0){ toast("Select at least one employee.", true); return; }
      if (!trainer){ toast("Trainer name is required.", true); return; }
      if (!trainingDate){ toast("Training date is required.", true); return; }

      const rows = checked.map(id=>{
        const emp = state.employees.find(e=>e.employee_id===id);
        return { employee_id: id, course_id: courseId, training_date: trainingDate, trainer, rig_at_training: emp.current_rig };
      });

      const { error } = await sb.from("training_records").insert(rows);
      if (error){ toast("Error adding training: " + error.message, true); return; }

      const courseName = state.courses.find(c=>c.course_id===courseId)?.course_name || courseId;
      toast(`${rows.length} employee(s) added to training: ${courseName}.`);
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
    document.getElementById("details-name").textContent = "Employee Details";
    body.innerHTML = `<div class="alert alert-info">Employee not found — it may have been deleted.</div>`;
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
      <button class="btn" id="edit-employee">Edit Info</button>
      <button class="btn btn-primary" id="gen-report">Generate Report</button>
    </div>

    <div class="metric-row">
      <div class="metric"><div class="metric-label">Name</div><div class="metric-value">${esc(emp.name)}</div></div>
      <div class="metric"><div class="metric-label">Designation</div><div class="metric-value">${esc(emp.designation) || "—"}</div></div>
      <div class="metric"><div class="metric-label">Current Rig</div><div class="metric-value">${esc(emp.current_rig) || "—"}</div></div>
      <div class="metric"><div class="metric-label">Joining Date</div><div class="metric-value">${fmtDate(emp.joining_date) || "—"}</div></div>
    </div>
    <p class="muted small">NID: ${nid ? esc(maskNid(nid)) : "Not provided"}</p>
    <p style="margin:0 0 18px"><strong>Assistant Driller:</strong> ${esc(emp.assistant_driller) || "Not Assigned"}</p>

    <div class="section-title">Rig / AD Transfer History</div>
    ${hist.length === 0 ? '<div class="alert alert-info">No rig transfer history.</div>' : `
      <div class="tbl-wrap"><table><thead><tr><th>Rig</th><th>From Date</th><th>To Date</th></tr></thead><tbody>
        ${hist.map(h=>`<tr><td>${esc(h.rig)}</td><td>${fmtDate(h.from_date)}</td><td>${h.to_date ? fmtDate(h.to_date) : "Present"}</td></tr>`).join("")}
      </tbody></table></div>
    `}

    <div class="section-title">Training History</div>
    ${training.length === 0 ? '<div class="alert alert-info">No training recorded.</div>' : `
      <div class="tbl-wrap"><table><thead><tr><th>Training</th><th>Date</th><th>Trainer</th><th>Rig at Training</th></tr></thead><tbody>
        ${training.map(t=>{
          const course = state.courses.find(c=>c.course_id===t.course_id);
          return `<tr><td>${esc(course ? course.course_name : t.course_id)}</td><td>${fmtDate(t.training_date)}</td><td>${esc(t.trainer)}</td><td>${esc(t.rig_at_training) || "—"}</td></tr>`;
        }).join("")}
      </tbody></table></div>
    `}

    <hr class="divider">
    <button class="btn btn-danger" id="del-employee">Delete Employee &amp; All Associated Data</button>
  `;

  document.getElementById("edit-employee").addEventListener("click", ()=>{
    state.detailsEditing = true;
    renderDetails();
  });

  document.getElementById("gen-report").addEventListener("click", ()=>generateReport(emp, hist, training));

  document.getElementById("del-employee").addEventListener("click", async ()=>{
    if (!confirm(`Delete ${emp.name} (ID ${emp.employee_id})? This removes their training records and rig transfer history too. This can't be undone.`)) return;

    const { error: e1 } = await sb.from("training_records").delete().eq("employee_id", emp.employee_id);
    if (e1){ toast("Error deleting training records: " + e1.message, true); return; }

    const { error: e2 } = await sb.from("rig_transfer_history").delete().eq("employee_id", emp.employee_id);
    if (e2){ toast("Error deleting transfer history: " + e2.message, true); return; }

    const { error: e3 } = await sb.from("employees").delete().eq("employee_id", emp.employee_id);
    if (e3){ toast("Error deleting employee: " + e3.message, true); return; }

    toast(`${emp.name} and all associated data deleted.`);
    await refresh();
    setView("employees");
  });
}

function renderDetailsEditForm(emp, body){
  body.innerHTML = `
    <div class="card" style="max-width:560px">
      <div class="card-title">Edit Employee Info</div>
      <div class="alert alert-info">Employee ID is fixed and can't be changed. To move this employee to a new Rig or Assistant Driller, use the transfer flow under Add Employee (enter their NID there) instead — that keeps rig history accurate.</div>
      <div class="field"><label>Name *</label><input id="ed-name" type="text" value="${esc(emp.name)}"></div>
      <div class="field-row">
        <div class="field"><label>NID Number</label><input id="ed-nid" type="text" value="${esc(emp.nid_number) || ""}" placeholder="Not provided"></div>
        <div class="field"><label>Designation *</label>
          <select id="ed-des">${DESIGNATIONS.map(d=>`<option ${d===emp.designation?'selected':''}>${esc(d)}</option>`).join("")}</select>
        </div>
      </div>
      <div class="field" style="max-width:220px"><label>Joining Date</label><input id="ed-join" type="date" value="${emp.joining_date || ""}"></div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-primary" id="ed-save">Save Changes</button>
        <button class="btn" id="ed-cancel">Cancel</button>
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

    if (!name){ toast("Name is required.", true); return; }
    if (nid && state.employees.some(e=>e.employee_id!==emp.employee_id && clean(e.nid_number)===nid)){
      toast("Another employee already has this NID.", true); return;
    }

    const { error } = await sb.from("employees").update({
      name, nid_number: nid || null, designation, joining_date: joining || null,
    }).eq("employee_id", emp.employee_id);

    if (error){ toast("Error saving changes: " + error.message, true); return; }

    toast(`${name}'s info updated.`);
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
  const generatedOn = `${String(today.getDate()).padStart(2,"0")}-${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][today.getMonth()]}-${today.getFullYear()}`;

  const html = `
    <div class="report-letterhead">
      <div class="report-org">CNPC CHUANQING DRILLING ENGINEERING COMPANY LIMITED (CCDC)</div>
      <div class="report-dept">HSE Department — Employee Training &amp; Personnel Record</div>
    </div>
    <h1 class="report-title">Employee Training Summary Report</h1>

    <table class="report-info">
      <tr><th>Employee ID</th><td>${emp.employee_id}</td><th>Name</th><td>${esc(emp.name)}</td></tr>
      <tr><th>Designation</th><td>${esc(emp.designation) || "—"}</td><th>NID Number</th><td>${esc(clean(emp.nid_number)) || "Not provided"}</td></tr>
      <tr><th>Current Rig</th><td>${esc(emp.current_rig) || "—"}</td><th>Assistant Driller</th><td>${esc(emp.assistant_driller) || "Not Assigned"}</td></tr>
      <tr><th>Joining Date</th><td>${fmtDate(emp.joining_date) || "—"}</td><th>Report Generated</th><td>${generatedOn}</td></tr>
    </table>

    <div class="report-summary">Training completed: <strong>${completedCourses.length} of ${totalCourses}</strong> courses on record.</div>

    <h2 class="report-section">Rig / Assistant Driller Transfer History</h2>
    ${hist.length === 0 ? `<p class="report-empty">No rig transfer history on record.</p>` : `
      <table class="report-table">
        <thead><tr><th>Rig</th><th>From Date</th><th>To Date</th></tr></thead>
        <tbody>${hist.map(h=>`<tr><td>${esc(h.rig)}</td><td>${fmtDate(h.from_date)}</td><td>${h.to_date ? fmtDate(h.to_date) : "Present"}</td></tr>`).join("")}</tbody>
      </table>
    `}

    <h2 class="report-section">Training History</h2>
    ${training.length === 0 ? `<p class="report-empty">No training recorded.</p>` : `
      <table class="report-table">
        <thead><tr><th>Course</th><th>Date</th><th>Trainer</th><th>Rig at Training</th></tr></thead>
        <tbody>${training.map(t=>{
          const course = state.courses.find(c=>c.course_id===t.course_id);
          return `<tr><td>${esc(course ? course.course_name : t.course_id)}</td><td>${fmtDate(t.training_date)}</td><td>${esc(t.trainer)}</td><td>${esc(t.rig_at_training) || "—"}</td></tr>`;
        }).join("")}</tbody>
      </table>
    `}

    <div class="report-signatures">
      <div class="sig-block"><div class="sig-line"></div><div class="sig-label">HSE Supervisor</div></div>
      <div class="sig-block"><div class="sig-line"></div><div class="sig-label">Employee Signature</div></div>
    </div>
    <div class="report-footer">Generated from the CCDC HSE Training Monitor on ${generatedOn}.</div>
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
    <div class="tbl-wrap"><table><thead><tr><th>Course ID</th><th>Course Name</th></tr></thead><tbody>
      ${state.courses.length === 0 ? '' : state.courses.map(c=>`<tr><td>${esc(c.course_id)}</td><td>${esc(c.course_name)}</td></tr>`).join("")}
    </tbody></table></div>
    ${state.courses.length === 0 ? '<div class="alert alert-info" style="margin-top:12px">No courses yet.</div>' : ''}

    <div class="card" style="margin-top:20px">
      <div class="card-title">Add Course</div>
      <div class="field-row">
        <div class="field"><label>Course ID *</label><input id="c-id" type="text" placeholder="e.g. FIRE"></div>
        <div class="field"><label>Course Name *</label><input id="c-name" type="text" placeholder="e.g. Fire Safety"></div>
      </div>
      <button class="btn btn-primary" id="c-submit">Add Course</button>
    </div>
  `;

  document.getElementById("c-submit").addEventListener("click", async ()=>{
    const id = document.getElementById("c-id").value.trim();
    const name = document.getElementById("c-name").value.trim();
    if (!id || !name){ toast("Course ID and name are both required.", true); return; }
    if (state.courses.some(c=>c.course_id.toLowerCase()===id.toLowerCase())){
      toast("A course with this ID already exists.", true); return;
    }
    const { error } = await sb.from("courses").insert([{ course_id: id, course_name: name }]);
    if (error){ toast("Error adding course: " + error.message, true); return; }
    toast(`Course "${name}" added.`);
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
    <div class="tbl-wrap"><table><thead><tr><th>Rig</th><th>Employees Assigned</th></tr></thead><tbody>
      ${state.rigs.length === 0 ? '' : state.rigs.map(r=>`<tr><td>${esc(r.rig_name)}</td><td>${counts[r.rig_name]||0}</td></tr>`).join("")}
    </tbody></table></div>
    ${state.rigs.length === 0 ? '<div class="alert alert-info" style="margin-top:12px">No rigs yet — add one below.</div>' : ''}

    <div class="card" style="margin-top:20px">
      <div class="card-title">Add Rig</div>
      <div class="field" style="max-width:280px"><label>Rig Name *</label><input id="r-name" type="text" placeholder="e.g. Titas-32"></div>
      <button class="btn btn-primary" id="r-submit">Add Rig</button>
    </div>
  `;

  document.getElementById("r-submit").addEventListener("click", async ()=>{
    const name = document.getElementById("r-name").value.trim();
    if (!name){ toast("Rig name is required.", true); return; }
    if (state.rigs.some(r=>r.rig_name.toLowerCase()===name.toLowerCase())){
      toast("This rig already exists.", true); return;
    }
    const { error } = await sb.from("rigs").insert([{ rig_name: name }]);
    if (error){ toast("Error adding rig: " + error.message, true); return; }
    toast(`Rig "${name}" added.`);
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

(async function init(){
  await loadAll();
  renderCurrentView();
})();
