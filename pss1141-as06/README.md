# 文字生成小工具（前端靜態版）
前端展示網頁這邊請：<https://ntujourweb.oty.tw/pss1141-as06/>

以 OpenAI `gpt-5-nano` 模型生成中文文本。純前端（HTML + CSS + JS），不需 Node.js 或後端伺服器。

> 重要：即使改成「在頁面輸入金鑰」，仍屬前端直連，金鑰會暴露在瀏覽器端。公開部署請務必改用「後端代理」保護金鑰。

## 功能概覽
- 類型切換：唬爛文／現代詩／散文／歌詞／短篇故事，或「隨機」
- 字數上限：滑桿 50–300 字（同時調整模型輸出 token 上限）
- 多行素材：可輸入多行關鍵字／句子作為生成素材
- 文字輸出：只顯示模型產生的文本（不再輸出原始 JSON）
- 體驗細節：複製結果、載入狀態、錯誤提示、基礎自適應樣式

## 架構與運作
- 前端單頁（`index.html`）+ 樣式（`styles.css`）+ 腳本（`script.js`）
- 由前端直接呼叫 OpenAI Responses API：`POST https://api.openai.com/v1/responses`
- 模型：`gpt-5-nano`
- 請求內容（重點）：
  - `input`: 以繁體中文提供 system 與 user 提示（含所選類型的寫作風格）
  - `max_output_tokens`: 依滑桿計算的安全上限，包含推理與文本緩衝
  - `reasoning: { effort: 'low' }`: 降低推理額外 token 消耗
- 文字抽取：優先使用 `output_text`，再回退 `output[].content[].text`，最後回退 `choices[0].message.content`
- 截斷處理：若回應為 `status: incomplete` 且 `reason: max_output_tokens`，會自動放寬一次上限並重試

## 安裝與執行
- 直接以瀏覽器開啟 `index.html`，或使用 VS Code 的 Live Server 擴充套件。
- Windows（PowerShell）以簡單 HTTP 伺服器啟動（可選）：
  ```powershell
  # 切換到 as06 資料夾後
  python -m http.server 5500; Start-Process "http://localhost:5500/index.html"
  ```

## 使用與設定
1. 開啟 `index.html`。
2. 在頁面上方的「OpenAI API Key」輸入框貼入你的金鑰（格式 `sk-...`）。
3. 輸入關鍵字／句子，選擇類型（或保留「隨機」），調整字數上限，按「生成」。

## 自訂與參數
- 類型提示詞：在 `script.js` 的 `genreInstruction` 中調整各體裁風格文字。
- 字數上限 → token 估算：
  - 估算函式 `estimateMaxTokens` 會給出較寬鬆的上限（至少 256，最多 1024），避免中途截斷。
  - 若仍遇截斷，會自動放寬一次至最高 2048 再重試。
- 成本與速度：提高 token 上限會增加成本與延遲，請視需求調整。

## 安全與部署建議（強烈建議）
前端直連 OpenAI 會暴露金鑰（即使最小化也能被查看）。公開部署請改用代理：
- 將金鑰放在後端（如 Cloudflare Workers / Vercel Edge / 任意簡易後端）。
- 前端改呼叫你的代理端點，代理再代表你呼叫 OpenAI。

以下為最小 Cloudflare Worker 範例（僅示意，請依實際需求加上額外驗證與速率限制）：
```js
export default {
  async fetch(req, env) {
    if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
    const apiKey = env.OPENAI_API_KEY; // 在 Workers 環境變數設定
    const body = await req.text();
    const res = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body,
    });
    return new Response(res.body, { status: res.status, headers: { 'Content-Type': 'application/json' } });
  }
};
```
前端只要把原本的 `https://api.openai.com/v1/responses` 換成你的 Worker 網址即可。

## 檔案結構
- `index.html`：主頁面（含 README 入口與 API Key 輸入欄）
- `styles.css`：樣式
- `script.js`：互動與 API 呼叫
- `README.md`：本說明文件

## 疑難排解
- 看不到結果、狀態顯示「未完成／被截斷」：
  - 提高字數滑桿（可增加 `max_output_tokens`）。
  - 稍後重試，或簡化關鍵字／題旨。
- 瀏覽器報 CORS 錯誤：
  - 部分網路環境對直連 API 有限制，請改用代理。
- 成本或延遲偏高：
  - 調低字數滑桿（會降低 token 上限）。
  - 將 `estimateMaxTokens` 的策略調小。