const form = document.getElementById('name-form');
const nameInput = document.getElementById('name-input');
const output = document.getElementById('output');
const logoName = document.getElementById('logo-name');
const cmdArea = document.getElementById('cmd-area');
const cmdList = document.getElementById('cmd-list');
const cmdLine = document.getElementById('cmd-line');
const promptSpan = document.getElementById('prompt-span');
const cmdText = document.getElementById('cmd-text');

let username = '';
let promptStr = '';

function scrollBottom() {
  setTimeout(() => {
    document.getElementById('terminal').scrollTop = document.getElementById('terminal').scrollHeight;
  }, 30);
}

form.onsubmit = function(e) {
  e.preventDefault();
  username = nameInput.value.trim() || 'USER';
  logoName.innerHTML = `${escapeHtml(username)}<br/>WebCmd`;
  form.style.display = "none";
  showWelcomeMsg(username);
};

function showWelcomeMsg(username) {
  output.innerHTML = `
    <span class="cmd-history-line">
      || Xin chào <span id="uname">${escapeHtml(username)}</span>. Chào mừng bạn đến với WebCmd! ||
    </span>
    <span class="cmd-history-line" id="live-time">
      -- Thời gian hiện tại: đang tải... --
    </span>
  `;
  promptStr = `WebCmd:~ ${username}$ `;
  promptSpan.textContent = promptStr;
  cmdArea.style.display = '';
  cmdList.innerHTML = '';
  cmdText.textContent = '';
  setTimeout(() => {
    focusToInput();
    startLiveTime();
    scrollBottom();
  }, 50);
}

function focusToInput() {
  cmdText.focus();
  // Đặt caret ở cuối
  let range = document.createRange();
  range.selectNodeContents(cmdText);
  range.collapse(false);
  let sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

// Xử lý khi nhấn Enter trong vùng nhập lệnh
cmdText.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleCmd();
  }
  // Không cho backspace/xóa prompt
  // Luôn focus trong #cmd-text, không để caret ra ngoài
});

cmdLine.addEventListener('click', function() {
  focusToInput();
});

function handleCmd() {
  const cmd = cmdText.textContent;
  const line = document.createElement('div');
  line.className = 'cmd-history-line';
  line.innerHTML = `<span class="prompt">${escapeHtml(promptStr)}</span>${escapeHtml(cmd)}`;
  cmdList.appendChild(line);
  cmdText.textContent = '';
  focusToInput();
  scrollBottom();
}

// Đảm bảo luôn focus đúng khi click nhiều chỗ
cmdArea.addEventListener('click', focusToInput);

// Đồng hồ thời gian sống
function startLiveTime() {
  const timeElem = document.getElementById('live-time');
  if (!timeElem) return;
  function tick() {
    const now = new Date();
    const timeStr =
      now.getHours().toString().padStart(2, '0') + ':' +
      now.getMinutes().toString().padStart(2, '0') + ':' +
      now.getSeconds().toString().padStart(2, '0');
    const dateStr =
      now.getDate().toString().padStart(2, '0') + '/' +
      (now.getMonth() + 1).toString().padStart(2, '0') + '/' +
      now.getFullYear();
    timeElem.textContent = `-- Thời gian hiện tại: ${timeStr} ngày ${dateStr} --`;
  }
  tick();
  window._liveTimeInterval && clearInterval(window._liveTimeInterval);
  window._liveTimeInterval = setInterval(tick, 1000);
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[m]));
}
