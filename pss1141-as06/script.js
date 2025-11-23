// 為了安全，請勿將此檔公開部署；公開時請改走後端代理。

const el = {
  apiKey: document.getElementById('apiKey'),
  userInput: document.getElementById('userInput'),
  genreBar: document.getElementById('genreBar'),
  length: document.getElementById('length'),
  lenVal: document.getElementById('lenVal'),
  generateBtn: document.getElementById('generateBtn'),
  clearBtn: document.getElementById('clearBtn'),
  output: document.getElementById('output'),
  status: document.getElementById('status'),
  copyBtn: document.getElementById('copyBtn'),
};

const GENRES = [
  { key: 'huluan', label: '唬爛文' },
  { key: 'poem', label: '現代詩' },
  { key: 'prose', label: '散文' },
  { key: 'lyrics', label: '歌詞' },
  { key: 'shortstory', label: '短篇故事' },
];

function pickRandomGenre() {
  const idx = Math.floor(Math.random() * GENRES.length);
  return GENRES[idx].key;
}

// 估算 tokens（含少量「推理」開銷）：給較寬鬆的上限避免中途截斷
function estimateMaxTokens(charLimit) {
  const base = Math.max(50, Number(charLimit) || 150);
  const approx = base * 2 + 128; // 文本約 2x，另加 128 給推理／緩衝
  return Math.max(256, Math.min(1024, Math.floor(approx)));
}

function genreInstruction(key) {
  switch (key) {
    case 'huluan':
      return '請生成一段「唬爛文」，語氣自信、夸飾，但避免明顯錯誤事實，保持幽默與語帶玄機的風格。';
    case 'poem':
      return '請以現代詩形式創作，分行，語言凝練，意象鮮明，情緒含蓄。';
    case 'prose':
      return '請寫成散文筆調，語句自然流暢，富觀察與感受，讓讀者有畫面感。';
    case 'lyrics':
      return '請寫成歌詞，分成短句或段落，有節奏與押韻感（不必強求），口語而有詩意。';
    case 'shortstory':
      return '請寫成短篇故事，給出角色、場景與小轉折，結尾留餘韻。';
    default:
      return '請以適當的文體創作。';
  }
}

function buildSystemPrompt(genreKey, charLimit) {
  const style = genreInstruction(genreKey);
  return [
    '你是一位中文文字創作助手，以繁體中文回應。',
    style,
    `限制在約 ${charLimit} 字以內，語句自然、避免重複與灌水。`,
    '請直接輸出作品文本本身，不要解釋步驟、不要自我評論。',
  ].join('\n');
}

function buildUserPrompt(rawInput, genreKey) {
  const lines = rawInput
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);
  const bullet = lines.length
    ? lines.map(s => `- ${s}`).join('\n')
    : '- （未提供特定關鍵字，請自行擬題）';

  const chosen = GENRES.find(g => g.key === genreKey)?.label ?? '隨機';
  return `生成類型：${chosen}\n素材／題旨：\n${bullet}`;
}

function setStatus(msg, cls = '') {
  el.status.className = `status ${cls}`.trim();
  el.status.textContent = msg || '';
}

async function callOpenAI({ apiKey, model, system, user, maxTokens }) {
  const url = 'https://api.openai.com/v1/responses';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };

  function extractTextFromResponse(data) {
    if (!data || typeof data !== 'object') return '';
    if (typeof data.output_text === 'string' && data.output_text.trim()) {
      return data.output_text.trim();
    }
    // Walk through output[].content[].text if present
    if (Array.isArray(data.output)) {
      const parts = [];
      for (const item of data.output) {
        const content = item?.content;
        if (Array.isArray(content)) {
          for (const c of content) {
            const t = c?.text;
            if (typeof t === 'string' && t.trim()) parts.push(t.trim());
          }
        }
      }
      if (parts.length) return parts.join('\n').trim();
    }
    // Chat-like fallback
    const msg = data.choices?.[0]?.message?.content;
    if (typeof msg === 'string' && msg.trim()) return msg.trim();
    return '';
  }

  let attempt = 0;
  let currentMax = maxTokens;
  while (attempt < 2) {
    const body = {
      model,
      input: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      max_output_tokens: currentMax,
      reasoning: { effort: 'low' },
      temperature: 1,
    };

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`API 錯誤 (${res.status}): ${text}`);
    }

    const data = await res.json();
    const outputText = extractTextFromResponse(data);

    const status = data.status;
    const reason = data.incomplete_details?.reason;

    if (status === 'incomplete' && reason === 'max_output_tokens' && attempt === 0) {
      // 自動放寬一次上限再重試
      currentMax = Math.min(2048, Math.max(currentMax * 2, 512));
      attempt += 1;
      continue;
    }

    if (!outputText) {
      if (status !== 'completed') {
        throw new Error('輸出被截斷或未完成，請提高字數上限或重試。');
      } else {
        throw new Error('回應未包含可顯示的文字內容。');
      }
    }

    return String(outputText).trim();
  }

  throw new Error('多次嘗試後仍達到輸出上限，請提高字數滑桿或重試。');
}

function handleLengthChange() {
  el.lenVal.textContent = el.length.value;
}

let currentGenre = 'random';

function setActiveGenre(genreKey) {
  currentGenre = genreKey;
  const buttons = el.genreBar.querySelectorAll('.genre-btn');
  buttons.forEach(btn => {
    const g = btn.getAttribute('data-genre');
    btn.classList.toggle('active', g === genreKey);
  });
}

function onGenreClick(e) {
  const btn = e.target.closest('.genre-btn');
  if (!btn) return;
  const g = btn.getAttribute('data-genre');
  if (!g) return;
  setActiveGenre(g);
  setStatus(g === 'random' ? '將於生成時隨機挑選類型' : `已選：${btn.textContent.trim()}`);
}

async function onGenerate() {
  const apiKey = (el.apiKey?.value || '').trim();
  if (!apiKey) {
    setStatus('尚未提供 API Key，請在上方輸入後再試。', 'warn');
    return;
  }

  const rawInput = el.userInput.value;
  const chosen = currentGenre === 'random' ? pickRandomGenre() : currentGenre;

  const charLimit = parseInt(el.length.value, 10) || 150;
  const maxTokens = estimateMaxTokens(charLimit);

  const system = buildSystemPrompt(chosen, charLimit);
  const user = buildUserPrompt(rawInput, chosen);

  el.output.textContent = '';
  setStatus('生成中…請稍候');
  el.generateBtn.disabled = true;

  try {
    const text = await callOpenAI({
      apiKey,
      model: 'gpt-5-nano',
      system,
      user,
      maxTokens,
    });
    el.output.textContent = text;
    setStatus('完成', 'ok');
  } catch (err) {
    console.error(err);
    setStatus(err.message || '發生錯誤', 'err');
  } finally {
    el.generateBtn.disabled = false;
  }
}

function onClear() {
  el.userInput.value = '';
  el.output.textContent = '';
  setStatus('已清除');
}

async function onCopy() {
  const text = el.output.textContent || '';
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    setStatus('已複製到剪貼簿', 'ok');
  } catch {
    setStatus('複製失敗，可能無權限', 'warn');
  }
}

// wire events
el.length.addEventListener('input', handleLengthChange);
el.genreBar.addEventListener('click', onGenreClick);
el.generateBtn.addEventListener('click', onGenerate);
el.clearBtn.addEventListener('click', onClear);
el.copyBtn.addEventListener('click', onCopy);

// initialize
handleLengthChange();
setActiveGenre('random');
setStatus('就緒');
